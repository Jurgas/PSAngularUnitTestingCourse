import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';
import {TestBed} from '@angular/core/testing';
import {HeroService} from './hero.service';
import {MessageService} from './message.service';

describe('HeroService', () => {
  let mockMessageService;
  let httpTestingController: HttpTestingController;
  let service;

  beforeEach(() => {
    mockMessageService = jasmine.createSpyObj(['add']);

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        HeroService,
        {provide: MessageService, useValue: mockMessageService},
      ],
    });

    httpTestingController = TestBed.inject(HttpTestingController);
    service = TestBed.inject(HeroService);

  });

  describe('getHero', () => {
    it('should call GET with the correct URL', () => {
      service.getHero(4).subscribe();

      const req = httpTestingController.expectOne('api/heroes/4');

      req.flush({id: 4, name: 'SuperDude', strength: 100});
      expect(req.request.method).toEqual('GET');
      httpTestingController.verify();
    });
  });
});
