import { TestBed } from '@angular/core/testing';

import { AuthOnlyGuard } from './auth-only.guard';

describe('AuthOnlyGuard', () => {
  let guard: AuthOnlyGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(AuthOnlyGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
