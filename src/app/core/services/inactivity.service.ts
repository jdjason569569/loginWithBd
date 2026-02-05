import { Injectable, NgZone } from '@angular/core';
import { AuthService } from './auth.service';
import { fromEvent, merge, Subject, timer, startWith } from 'rxjs';
import { switchMap, takeUntil } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class InactivityService {
    private readonly IDLE_TIMEOUT = 60000; // 1 minute in milliseconds
    private stop$ = new Subject<void>();

    constructor(
        private authService: AuthService,
        private ngZone: NgZone
    ) { }

    /**
     * Starts monitoring user activity.
     * Use NgZone.runOutsideAngular to avoid triggering change detection on every movement.
     */
    startMonitoring(): void {
        this.ngZone.runOutsideAngular(() => {
            const userActivity$ = merge(
                fromEvent(window, 'mousemove'),
                fromEvent(window, 'mousedown'),
                fromEvent(window, 'keypress'),
                fromEvent(window, 'wheel'),
                fromEvent(window, 'touchstart'),
                fromEvent(window, 'scroll')
            );

            userActivity$.pipe(
                startWith(null), // Initialize the timer immediately
                switchMap(() => timer(this.IDLE_TIMEOUT)),
                takeUntil(this.stop$)
            ).subscribe(() => {
                // Return to Angular zone to perform the logout and navigation
                this.ngZone.run(() => {
                    if (this.authService.isAuthenticated()) {
                        console.log('Inactividad detectada: Cerrando sesión...');
                        this.authService.signOut();
                    }
                });
            });
        });
    }

    /**
     * Stops monitoring user activity.
     */
    stopMonitoring(): void {
        this.stop$.next();
        this.stop$.complete();
    }
}
