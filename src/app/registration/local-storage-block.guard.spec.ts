import { TestBed, async, inject } from '@angular/core/testing';

import { LocalStorageBlockGuard } from './local-storage-block.guard';

describe('LocalStorageBlockGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [LocalStorageBlockGuard]
    });
  });

  it('should ...', inject([LocalStorageBlockGuard], (guard: LocalStorageBlockGuard) => {
    expect(guard).toBeTruthy();
  }));
});
