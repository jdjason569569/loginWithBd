import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink, Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
    selector: 'app-login',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, RouterLink, TranslateModule],
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
        private router: Router,
        private translate: TranslateService
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
            this.errorMessage.set(this.translate.instant('LOGIN.ERROR_MODAL.INVALID_FORM'));
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
            const msg = response.error || this.translate.instant('LOGIN.ERROR_MODAL.FALLBACK');
            this.errorMessage.set(msg);
            this.showErrorModal.set(true);
        }
    }

    get email() { return this.loginForm.get('email'); }
    get password() { return this.loginForm.get('password'); }
}
