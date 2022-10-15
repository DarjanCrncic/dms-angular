import { UserDetails } from './../../services/user-service';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup, FormGroupDirective } from '@angular/forms';

@Component({
    selector: 'app-permission-row',
    templateUrl: './permission-row.component.html',
    styleUrls: ['./permission-row.component.css']
})
export class PermissionRowComponent implements OnInit {
    @Input() permissions: string[] = [];
    @Input() users: UserDetails[] = [];
    @Input() index: number = 0;
    @Output() removeEntryEmitter: EventEmitter<number> = new EventEmitter();

    subForm: FormGroup = new FormGroup({});

    constructor(private parentForm: FormGroupDirective) {}

    ngOnInit(): void {
        this.subForm = this.parentForm.control;
    }

    removeEntry() {
        this.removeEntryEmitter.emit(this.index);
    }

    getOnlyUsernames(): string[] {
        return this.users.map((user) => user.username);
    }
}
