import { Subject, takeUntil } from 'rxjs';
import { GroupDTO } from './../../services/group-service';
import { UserDetails } from './../../services/user-service';
import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, FormGroupDirective, AbstractControl } from '@angular/forms';

@Component({
    selector: 'app-permission-row',
    templateUrl: './permission-row.component.html',
    styleUrls: ['./permission-row.component.css']
})
export class PermissionRowComponent implements OnInit, OnDestroy {
    @Input() permissions: string[] = [];
    @Input() users: UserDetails[] = [];
    @Input() groups: GroupDTO[] = [];
    @Input() index: number = 0;
    @Output() removeEntryEmitter: EventEmitter<number> = new EventEmitter();

    subForm: FormGroup = new FormGroup({});
    permissionsControl: AbstractControl<any, any> = new FormControl();

    private componentDestroyed$ = new Subject();

    constructor(private parentForm: FormGroupDirective) {}

    ngOnInit(): void {
        this.subForm = this.parentForm.control;
        this.permissionsControl = this.subForm.controls['permissions'];

        this.subForm.controls['permissions'].valueChanges.pipe(takeUntil(this.componentDestroyed$)).subscribe((v) => {
            if (v.length > 0 && !v.includes('READ')) {
                this.subForm.controls['permissions'].setValue([...v, 'READ'], { emitEvent: false });
            }
        });
    }

    removeEntry() {
        this.removeEntryEmitter.emit(this.index);
    }

    getOnlyUsernames(): string[] {
        return this.users.map((user) => user.username);
    }

    ngOnDestroy(): void {
        this.componentDestroyed$.next(true);
        this.componentDestroyed$.complete();
    }
}
