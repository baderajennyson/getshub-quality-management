import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ProvisionsService } from './provisions.service';

describe('ProvisionsService', () => {
  let service: ProvisionsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ProvisionsService]
    });
    service = TestBed.inject(ProvisionsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});