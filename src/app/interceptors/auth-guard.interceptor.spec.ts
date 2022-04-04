import { TestBed } from '@angular/core/testing';

import { AuthGuardInterceptor } from './auth-guard.interceptor';

describe('AuthGuardInterceptor', () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers: [
      AuthGuardInterceptor
      ]
  }));

  it('should be created', () => {
    const interceptor: AuthGuardInterceptor = TestBed.inject(AuthGuardInterceptor);
    expect(interceptor).toBeTruthy();
  });
});
