import {Location} from '@angular/common';
import {ComponentFixture, fakeAsync, flush, TestBed, tick, waitForAsync} from '@angular/core/testing';
import {FormsModule} from '@angular/forms';
import {ActivatedRoute} from '@angular/router';
import {of} from 'rxjs';
import {HeroService} from '../hero.service';
import {HeroDetailComponent} from './hero-detail.component';

describe('HeroDetailComponent', () => {
  let fixture: ComponentFixture<HeroDetailComponent>;
  let mockActivatedRoute;
  let mockHeroService;
  let mockLocation;

  beforeEach(() => {
    mockActivatedRoute = {
      snapshot: {
        paramMap: {
          get: () => {
            return '3';
          },
        },
      },
    };
    mockHeroService = jasmine.createSpyObj(['getHero', 'updateHero']);
    mockLocation = jasmine.createSpyObj(['back']);

    TestBed.configureTestingModule({
      imports: [FormsModule],
      declarations: [HeroDetailComponent],
      providers: [
        {provide: ActivatedRoute, useValue: mockActivatedRoute},
        {provide: HeroService, useValue: mockHeroService},
        {provide: Location, useValue: mockLocation},
      ],
    });
    fixture = TestBed.createComponent(HeroDetailComponent);

    mockHeroService.getHero.and.returnValue(of({id: 3, name: 'SuperDude', strength: 5}));
  });

  it('should render hero name in a h2 tag', () => {
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('h2').textContent).toContain('SUPERDUDE');
  });

  it('should call updateHero when save is called "tick()"', fakeAsync(() => {
    mockHeroService.updateHero.and.returnValue(of({}));
    fixture.detectChanges();

    fixture.componentInstance.save();
    tick(250);

    expect(mockHeroService.updateHero).toHaveBeenCalled();
  }));

  it('should call updateHero when save is called "flush()"', fakeAsync(() => {
    mockHeroService.updateHero.and.returnValue(of({}));
    fixture.detectChanges();

    fixture.componentInstance.save();
    flush();

    expect(mockHeroService.updateHero).toHaveBeenCalled();
  }));

  it('should call updateHero when save is called "waitForAsync()"', waitForAsync(() => {
    mockHeroService.updateHero.and.returnValue(of({}));
    fixture.detectChanges();

    fixture.componentInstance.save();

    fixture.whenStable().then(() => {
      expect(mockHeroService.updateHero).toHaveBeenCalled();
    });
  }));
});
