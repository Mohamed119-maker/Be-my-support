import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { adminBlockGuard } from './admin-block.guard';

describe('adminBlockGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => adminBlockGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
