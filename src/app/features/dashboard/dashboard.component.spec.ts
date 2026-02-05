import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { DashboardComponent } from './dashboard.component';
import { AuthService } from '../../core/services/auth.service';
import { Router } from '@angular/router';
import { signal } from '@angular/core';

describe('DashboardComponent', () => {
    let component: DashboardComponent;
    let fixture: ComponentFixture<DashboardComponent>;
    let mockAuthService: any;
    let routerSpy: jasmine.SpyObj<Router>;

    beforeEach(async () => {
        mockAuthService = {
            profile: signal({ name: 'David Test', email: 'david@example.com' }),
            user: signal({ email: 'david@example.com' }),
            signOut: jasmine.createSpy('signOut').and.returnValue(Promise.resolve())
        };

        const rSpy = jasmine.createSpyObj('Router', ['navigate']);

        await TestBed.configureTestingModule({
            imports: [DashboardComponent],
            providers: [
                { provide: AuthService, useValue: mockAuthService },
                { provide: Router, useValue: rSpy }
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(DashboardComponent);
        component = fixture.componentInstance;
        routerSpy = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    });

    it('should create', () => {
        fixture.detectChanges();
        expect(component).toBeTruthy();
    });

    it('should display the correct greeting based on time', () => {
        fixture.detectChanges();
        // Force time to Morning
        const morning = new Date();
        morning.setHours(9);
        component.currentTime.set(morning);
        expect(component.greeting()).toBe('Buenos días');

        // Force time to Afternoon
        const afternoon = new Date();
        afternoon.setHours(15);
        component.currentTime.set(afternoon);
        expect(component.greeting()).toBe('Buenas tardes');
    });

    it('should get initials from user name', () => {
        fixture.detectChanges();
        expect(component.getInitials()).toBe('DT');
    });

    it('should call logout in auth service', async () => {
        fixture.detectChanges();
        await component.logout();
        expect(mockAuthService.signOut).toHaveBeenCalled();
    });

    it('should set isLoading to false after timeout', fakeAsync(() => {
        fixture.detectChanges(); // Trigger ngOnInit
        expect(component.isLoading()).toBeTrue();
        tick(500);
        fixture.detectChanges();
        expect(component.isLoading()).toBeFalse();
    }));
});
