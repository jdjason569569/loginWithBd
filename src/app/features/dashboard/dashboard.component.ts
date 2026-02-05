import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
    selector: 'app-dashboard',
    standalone: true,
    imports: [CommonModule, TranslateModule],
    templateUrl: './dashboard.component.html',
    styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
    isLoading = signal(true);

    userName = computed(() => {
        const profile = this.authService.profile();
        return profile?.name || this.translate.instant('DASHBOARD.USER');
    });

    userEmail = computed(() => {
        const user = this.authService.user();
        return user?.email || '';
    });

    currentTime = signal(new Date());
    greeting = computed(() => {
        const hour = this.currentTime().getHours();
        if (hour < 12) return 'DASHBOARD.GREETING_MORNING';
        if (hour < 18) return 'DASHBOARD.GREETING_AFTERNOON';
        return 'DASHBOARD.GREETING_NIGHT';
    });

    constructor(
        private authService: AuthService,
        private router: Router,
        public translate: TranslateService
    ) { }

    ngOnInit(): void {
        // Wait for profile to load
        setTimeout(() => {
            this.isLoading.set(false);
        }, 500);

        // Update time every minute
        setInterval(() => {
            this.currentTime.set(new Date());
        }, 60000);
    }

    async logout(): Promise<void> {
        await this.authService.signOut();
    }

    changeLanguage(lang: string): void {
        this.translate.use(lang);
    }

    getInitials(): string {
        const name = this.userName();
        if (!name || name === 'DASHBOARD.USER' || name === 'Usuario') return '??';
        return name
            .split(' ')
            .map((n: string) => n[0])
            .join('')
            .toUpperCase()
            .substring(0, 2);
    }
}
