import { Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { User, Session, AuthError } from '@supabase/supabase-js';
import { SupabaseService } from './supabase.service';

export interface UserProfile {
    id: string;
    name: string;
    email: string | null;
}

export interface AuthResponse {
    success: boolean;
    error?: string;
}

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private currentUser = signal<User | null>(null);
    private currentSession = signal<Session | null>(null);
    private userProfile = signal<UserProfile | null>(null);

    readonly user = this.currentUser.asReadonly();
    readonly session = this.currentSession.asReadonly();
    readonly profile = this.userProfile.asReadonly();

    constructor(
        private supabase: SupabaseService,
        private router: Router
    ) {
        this.initAuthListener();
    }

    private async initAuthListener(): Promise<void> {
        // Get initial session
        const { data: { session } } = await this.supabase.auth.getSession();
        if (session) {
            this.currentSession.set(session);
            this.currentUser.set(session.user);
            await this.loadUserProfile(session.user.id);
        }

        // Listen for auth changes
        this.supabase.auth.onAuthStateChange(async (event, session) => {
            this.currentSession.set(session);
            this.currentUser.set(session?.user ?? null);

            if (session?.user) {
                await this.loadUserProfile(session.user.id);
            } else {
                this.userProfile.set(null);
            }
        });
    }

    private async loadUserProfile(userId: string): Promise<void> {
        const { data, error } = await this.supabase.db
            .from('profiles')
            .select('id, name, email')
            .eq('id', userId)
            .single();

        if (data && !error) {
            this.userProfile.set(data as UserProfile);
        }
    }

    async signIn(email: string, password: string): Promise<AuthResponse> {
        try {
            const { data, error } = await this.supabase.auth.signInWithPassword({
                email,
                password
            });

            if (error) {
                return { success: false, error: this.getErrorMessage(error) };
            }

            return { success: true };
        } catch (err) {
            return { success: false, error: 'Error inesperado. Intente nuevamente.' };
        }
    }

    async signUp(email: string, password: string, name: string): Promise<AuthResponse> {
        try {
            const { data, error } = await this.supabase.auth.signUp({
                email,
                password,
                options: {
                    data: { name }
                }
            });

            if (error) {
                return { success: false, error: this.getErrorMessage(error) };
            }

            return { success: true };
        } catch (err) {
            return { success: false, error: 'Error inesperado. Intente nuevamente.' };
        }
    }

    async signOut(): Promise<void> {
        await this.supabase.auth.signOut();
        this.router.navigate(['/login']);
    }

    isAuthenticated(): boolean {
        return this.currentSession() !== null;
    }

    private getErrorMessage(error: AuthError): string {
        switch (error.message) {
            case 'Invalid login credentials':
                return 'Credenciales inválidas. Verifique su email y contraseña.';
            case 'Email not confirmed':
                return 'Debe confirmar su email antes de iniciar sesión.';
            case 'User already registered':
                return 'Este email ya está registrado.';
            case 'Signup requires a valid password':
                return 'La contraseña debe tener al menos 6 caracteres.';
            default:
                return error.message || 'Error de autenticación.';
        }
    }
}
