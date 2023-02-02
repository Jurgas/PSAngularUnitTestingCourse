import {Component, Directive, Input} from '@angular/core';
import {ComponentFixture, TestBed} from '@angular/core/testing';
import {By} from '@angular/platform-browser';
import {of} from 'rxjs';
import {Hero} from '../hero';
import {HeroService} from '../hero.service';
import {HeroComponent} from '../hero/hero.component';
import {HeroesComponent} from './heroes.component';

@Directive({
  selector: '[routerLink]',
  host: {'(click)': 'onClick()'},
})
export class RouterLinkDirectiveStub {
  @Input('routerLink') linkParams: any;
  navigatedTo: any = null;

  onClick() {
    this.navigatedTo = this.linkParams;
  }
}

describe('HeroesComponent', () => {

  describe('isolated', () => {
    let component: HeroesComponent;
    let HEROES;

    let mockHeroService;

    beforeEach(() => {
      HEROES = [
        {id: 1, name: 'SpiderDude', strength: 8},
        {id: 2, name: 'Wonderful Woman', strength: 24},
        {id: 3, name: 'SuperDude', strength: 55},
      ];

      mockHeroService = jasmine.createSpyObj(['getHeroes', 'addHeroes', 'deleteHero']);

      component = new HeroesComponent(mockHeroService);
    });

    it('should remove the indicated hero from the heroes list', () => {
      mockHeroService.deleteHero.and.returnValue(of(true));
      component.heroes = HEROES;

      component.delete(HEROES[2]);

      expect(component.heroes).not.toContain(HEROES[2]);
      expect(component.heroes).toContain(HEROES[1]);
      expect(component.heroes).toContain(HEROES[0]);
    });

    it('should call deleteHero', () => {
      const deleteHeroResult = jasmine.createSpyObj(['subscribe']);
      mockHeroService.deleteHero.and.returnValue(deleteHeroResult);
      component.heroes = HEROES;

      component.delete(HEROES[2]);

      expect(mockHeroService.deleteHero).toHaveBeenCalledOnceWith(HEROES[2]);
      expect(deleteHeroResult.subscribe).toHaveBeenCalled();
    });
  });


  describe('shallow', () => {
    let fixture: ComponentFixture<HeroesComponent>;
    let HEROES;
    let mockHeroService;

    @Component({
      selector: 'app-hero',
      template: '<div></div>',
    })
    class FakeHeroComponent {
      @Input() hero: Hero;
    }

    beforeEach(() => {
      HEROES = [
        {id: 1, name: 'SpiderDude', strength: 8},
        {id: 2, name: 'Wonderful Woman', strength: 24},
        {id: 3, name: 'SuperDude', strength: 55},
      ];
      mockHeroService = jasmine.createSpyObj(['getHeroes', 'addHeroes', 'deleteHero']);

      TestBed.configureTestingModule({
        declarations: [
          HeroesComponent,
          FakeHeroComponent,
        ],
        providers: [
          {provide: HeroService, useValue: mockHeroService},
        ],
        // schemas: [NO_ERRORS_SCHEMA],
      });
      fixture = TestBed.createComponent(HeroesComponent);
    });

    it('should set heroes correctly from the service', () => {
      mockHeroService.getHeroes.and.returnValue(of(HEROES));
      fixture.detectChanges();

      expect(fixture.componentInstance.heroes).toEqual(HEROES);
    });

    it('should create one li for each hero', () => {
      mockHeroService.getHeroes.and.returnValue(of(HEROES));
      fixture.detectChanges();

      expect(fixture.debugElement.queryAll(By.css('li')).length).toEqual(HEROES.length);
    });
  });


  describe('deep', () => {
    let fixture: ComponentFixture<HeroesComponent>;
    let HEROES;
    let mockHeroService;

    beforeEach(() => {
      HEROES = [
        {id: 1, name: 'SpiderDude', strength: 8},
        {id: 2, name: 'Wonderful Woman', strength: 24},
        {id: 3, name: 'SuperDude', strength: 55},
      ];
      mockHeroService = jasmine.createSpyObj(['getHeroes', 'addHero', 'deleteHero']);

      TestBed.configureTestingModule({
        declarations: [
          HeroesComponent,
          HeroComponent,
          RouterLinkDirectiveStub,
        ],
        providers: [
          {provide: HeroService, useValue: mockHeroService},
        ],
      });
      fixture = TestBed.createComponent(HeroesComponent);
    });

    it('should render each hero as a HeroComponent', () => {
      mockHeroService.getHeroes.and.returnValue(of(HEROES));

      fixture.detectChanges();

      const heroComponentDEs = fixture.debugElement.queryAll(By.directive(HeroComponent));
      expect(heroComponentDEs.length).toEqual(HEROES.length);
      for (let i = 0; i < heroComponentDEs.length; i++) {
        expect(heroComponentDEs[i].componentInstance.hero).toEqual(HEROES[i]);
      }
    });

    it('should call heroService.deleteHero when the Hero Component\'s delete button is clicked', () => {
      spyOn(fixture.componentInstance, 'delete');
      mockHeroService.getHeroes.and.returnValue(of(HEROES));

      fixture.detectChanges();

      const heroComponents = fixture.debugElement.queryAll(By.directive(HeroComponent));
      // heroComponents[0].query(By.css('button'))
      //   .triggerEventHandler('click', {stopPropagation: () => {}});
      // albo
      (heroComponents[0].componentInstance as HeroComponent).delete.emit();

      expect(fixture.componentInstance.delete).toHaveBeenCalledOnceWith(HEROES[0]);
    });

    it('should add a new hero to the hero list when the add button is clicked', () => {
      mockHeroService.getHeroes.and.returnValue(of(HEROES));
      fixture.detectChanges();
      const name = 'Mr. Ice';
      mockHeroService.addHero.and.returnValue(of({id: 5, name: name, strength: 4}));
      const inputElement = fixture.debugElement.query(By.css('input')).nativeElement;
      const addButton = fixture.debugElement.queryAll(By.css('button'))[0];

      inputElement.value = name;
      addButton.triggerEventHandler('click', null);
      fixture.detectChanges();

      const heroText = fixture.debugElement.query(By.css('ul')).nativeElement.textContent;
      expect(heroText).toContain(name);
    });

    it('should have the correct route for the first hero', () => {
      mockHeroService.getHeroes.and.returnValue(of(HEROES));
      fixture.detectChanges();
      const heroComponents = fixture.debugElement.queryAll(By.directive(HeroComponent));

      let routerLink = heroComponents[0]
        .query(By.directive(RouterLinkDirectiveStub))
        .injector.get(RouterLinkDirectiveStub);

      heroComponents[0].query(By.css('a')).triggerEventHandler('click', null);

      expect(routerLink.navigatedTo).toBe('/detail/1');
    });
  });
});
