import { TestBed } from '@angular/core/testing';

import { ApiTransactionService } from './api-transaction.service';

describe('ApiTransactionService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ApiTransactionService = TestBed.get(ApiTransactionService);
    expect(service).toBeTruthy();
  });
});
