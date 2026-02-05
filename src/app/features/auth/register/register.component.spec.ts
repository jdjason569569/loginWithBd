import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { RegisterComponent } from './register.component';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { RouterLink } from '@angular/router';
import { provideRouter } from '@angular/router';

describe('RegisterComponent', () => {
    let component: RegisterComponent;
    let fixture: ComponentFixture<RegisterComponent>;
    let authServiceSpy: jasmine.SpyObj<AuthService>;

    beforeEach(async () => {
        const authSpy = jasmine.createSpyObj('AuthService', ['signUp']);

        await TestBed.configureTestingModule({
            imports: [RegisterComponent, ReactiveFormsModule, RouterLink],
            providers: [
                { provide: AuthService, useValue: authSpy },
                provideRouter([])
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(RegisterComponent);
        component = fixture.componentInstance;
        authServiceSpy = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should validate matching passwords', () => {
        component.registerForm.get('password')?.setValue('password123');
        component.registerForm.get('confirmPassword')?.setValue('different');
        expect(component.registerForm.hasError('passwordMismatch')).toBeTrue();

        component.registerForm.get('confirmPassword')?.setValue('password123');
        expect(component.registerForm.hasError('passwordMismatch')).toBeFalse();
    });

    it('should call authService.signUp on valid submit', fakeAsync(() => {
        component.registerForm.setValue({
            name: 'David Test',
            email: 'test@example.com',
            password: 'password123',
            confirmPassword: 'password123'
        });

        authServiceSpy.signUp.and.returnValue(Promise.resolve({ success: true }));

        component.onSubmit();
        tick();

        expect(authServiceSpy.signUp).toHaveBeenCalledWith('test@example.com', 'password123', 'David Test');
        expect(component.successMessage()).toContain('Registro exitoso');
    }));

    it('should show error on signUp failure', fakeAsync(() => {
        component.registerForm.setValue({
            name: 'David Test',
            email: 'test@example.com',
            password: 'password123',
            confirmPassword: 'password123'
        });

        authServiceSpy.signUp.and.returnValue(Promise.resolve({
            success: false,
            error: 'Email ya registrado'
        }));

        component.onSubmit();
        tick();

        expect(component.errorMessage()).toBe('Email ya registrado');
    }));
});
