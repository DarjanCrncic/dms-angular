import { MAT_SNACK_BAR_DATA } from '@angular/material/snack-bar';
import { Component, OnInit, Inject, OnDestroy } from '@angular/core';

@Component({
    selector: 'app-error-snackbar',
    templateUrl: './message-snackbar.component.html',
    styleUrls: ['./message-snackbar.component.css']
})
export class MessageSnackbarComponent implements OnInit, OnDestroy {
    constructor(@Inject(MAT_SNACK_BAR_DATA) public data: any) {}
    public status: number = 0;
    private interval: any;

    ngOnInit(): void {
        this.interval = setInterval(() => {
            this.increaseTimer();
        }, 20);
    }

    ngOnDestroy(): void {
        if (this.interval) {
            clearInterval(this.interval);
        }
    }

    increaseTimer() {
        this.status += 1;
    }
}
