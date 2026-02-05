import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink, Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
    selector: 'app-login',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, RouterLink],
    templateUrl: './login.component.html',
    styleUrl: './login.component.css'
})
export class LoginComponent {
    loginForm: FormGroup;
    isLoading = signal(false);
    errorMessage = signal<string | null>(null);
    showErrorModal = signal(false);
    showPassword = signal(false);

    constructor(
        private fb: FormBuilder,
        private authService: AuthService,
        private router: Router
    ) {
        this.loginForm = this.fb.group({
            email: ['', [Validators.required, Validators.email]],
            password: ['', [Validators.required, Validators.minLength(6)]]
        });
    }

    togglePasswordVisibility(): void {
        this.showPassword.update(v => !v);
    }

    closeErrorModal(): void {
        this.showErrorModal.set(false);
    }

    async onSubmit(): Promise<void> {
        console.log('onSubmit called', this.loginForm.valid);
        if (this.loginForm.invalid) {
            this.loginForm.markAllAsTouched();
            this.errorMessage.set('Por favor, completa todos los campos correctamente.');
            this.showErrorModal.set(true);
            return;
        }

        this.isLoading.set(true);
        this.errorMessage.set(null);

        const { email, password } = this.loginForm.value;
        const response = await this.authService.signIn(email, password);

        this.isLoading.set(false);

        if (response.success) {
            this.router.navigate(['/dashboard']);
        } else {
            console.log('Login failed', response.error);
            const msg = response.error || 'Credenciales inválidas o error de conexión.';
            this.errorMessage.set(msg);
            this.showErrorModal.set(true);
        }
    }

    get email() { return this.loginForm.get('email'); }
    get password() { return this.loginForm.get('password'); }
}
