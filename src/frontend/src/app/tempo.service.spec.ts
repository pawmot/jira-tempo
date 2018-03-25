import { TestBed, inject } from '@angular/core/testing';

import { TempoService } from './tempo.service';

describe('TempoService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TempoService]
    });
  });

  it('should be created', inject([TempoService], (service: TempoService) => {
    expect(service).toBeTruthy();
  }));
});
