import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
    selector: 'app-dashboard',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './dashboard.component.html',
    styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
    isLoading = signal(true);

    userName = computed(() => {
        const profile = this.authService.profile();
        return profile?.name || 'Usuario';
    });

    userEmail = computed(() => {
        const user = this.authService.user();
        return user?.email || '';
    });

    currentTime = signal(new Date());
    greeting = computed(() => {
        const hour = this.currentTime().getHours();
        if (hour < 12) return 'Buenos días';
        if (hour < 18) return 'Buenas tardes';
        return 'Buenas noches';
    });

    constructor(
        private authService: AuthService,
        private router: Router
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

    getInitials(): string {
        const name = this.userName();
        return name
            .split(' ')
            .map(n => n[0])
            .join('')
            .toUpperCase()
            .substring(0, 2);
    }
}
