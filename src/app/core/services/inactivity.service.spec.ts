import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { InactivityService } from './inactivity.service';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';

describe('InactivityService', () => {
    let service: InactivityService;
    let authServiceSpy: jasmine.SpyObj<AuthService>;

    beforeEach(() => {
        const spy = jasmine.createSpyObj('AuthService', ['isAuthenticated', 'signOut']);

        TestBed.configureTestingModule({
            providers: [
                InactivityService,
                { provide: AuthService, useValue: spy }
            ]
        });

        service = TestBed.inject(InactivityService);
        authServiceSpy = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should NOT call signOut if activity is detected', fakeAsync(() => {
        authServiceSpy.isAuthenticated.and.returnValue(true);
        service.startMonitoring();

        // Pass some time but simulate activity
        tick(30000); // 30s
        window.dispatchEvent(new Event('mousemove'));

        tick(40000); // Another 40s (total 70s, but only 40s since last activity)

        expect(authServiceSpy.signOut).not.toHaveBeenCalled();

        service.stopMonitoring();
    }));

    it('should call signOut after 1 minute of inactivity', fakeAsync(() => {
        authServiceSpy.isAuthenticated.and.returnValue(true);
        service.startMonitoring();

        // Pass 1 minute (60000ms)
        tick(60001);

        expect(authServiceSpy.signOut).toHaveBeenCalled();

        service.stopMonitoring();
    }));

    it('should NOT call signOut if not authenticated', fakeAsync(() => {
        authServiceSpy.isAuthenticated.and.returnValue(false);
        service.startMonitoring();

        tick(60001);

        expect(authServiceSpy.signOut).not.toHaveBeenCalled();

        service.stopMonitoring();
    }));
});
