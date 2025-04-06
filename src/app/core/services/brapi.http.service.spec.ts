import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { BrapiHttpService } from './';
import { environment } from '../../../environments/environment';

describe('BrapiHttpService', () => {
  let service: BrapiHttpService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [BrapiHttpService],
    });
    service = TestBed.inject(BrapiHttpService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify(); // Verifica se não há requisições pendentes
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should make a GET request to get quotes', () => {
    const mockResponse = { data: 'test data' };
    const quote = 'list';

    service.getQuotes(quote).subscribe((response) => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpTestingController.expectOne(`${environment.brapiApi}/quote/${quote}`);
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('should use "list" as default quote', () => {
      const mockResponse = { data: 'test data' };
      service.getQuotes().subscribe((response) => {
          expect(response).toEqual(mockResponse);
      });
      const req = httpTestingController.expectOne(`${environment.brapiApi}/quote/list`);
      req.flush(mockResponse);
  })
});