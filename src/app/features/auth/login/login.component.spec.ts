import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { LoginComponent } from './login.component';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { signal } from '@angular/core';

import { provideRouter } from '@angular/router';

describe('LoginComponent', () => {
    let component: LoginComponent;
    let fixture: ComponentFixture<LoginComponent>;
    let authServiceSpy: jasmine.SpyObj<AuthService>;

    beforeEach(async () => {
        const authSpy = jasmine.createSpyObj('AuthService', ['signIn']);

        await TestBed.configureTestingModule({
            imports: [LoginComponent, ReactiveFormsModule],
            providers: [
                { provide: AuthService, useValue: authSpy },
                provideRouter([])
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(LoginComponent);
        component = fixture.componentInstance;
        authServiceSpy = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should initialize the form with empty email and password', () => {
        expect(component.loginForm.get('email')?.value).toBe('');
        expect(component.loginForm.get('password')?.value).toBe('');
    });

    it('should show error modal when form is invalid on submit', () => {
        component.onSubmit();
        expect(component.showErrorModal()).toBeTrue();
        expect(component.errorMessage()).toBe('Por favor, completa todos los campos correctamente.');
    });

    it('should call authService.signIn and navigate on success', fakeAsync(() => {
        component.loginForm.setValue({
            email: 'test@example.com',
            password: 'password123'
        });

        authServiceSpy.signIn.and.returnValue(Promise.resolve({ success: true }));
        const navigateSpy = spyOn(TestBed.inject(Router), 'navigate');

        component.onSubmit();
        tick();

        expect(authServiceSpy.signIn).toHaveBeenCalledWith('test@example.com', 'password123');
        expect(navigateSpy).toHaveBeenCalledWith(['/dashboard']);
    }));

    it('should show error modal on auth failure', fakeAsync(() => {
        component.loginForm.setValue({
            email: 'test@example.com',
            password: 'wrong-password'
        });

        authServiceSpy.signIn.and.returnValue(Promise.resolve({
            success: false,
            error: 'Credenciales inválidas'
        }));

        component.onSubmit();
        tick();

        expect(component.showErrorModal()).toBeTrue();
        expect(component.errorMessage()).toBe('Credenciales inválidas');
    }));

    it('should toggle password visibility', () => {
        expect(component.showPassword()).toBeFalse();
        component.togglePasswordVisibility();
        expect(component.showPassword()).toBeTrue();
    });
});
