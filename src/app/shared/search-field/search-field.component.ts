import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { debounceTime, Subject, takeUntil } from 'rxjs';

@Component({
    selector: 'app-search-field',
    templateUrl: './search-field.component.html',
    styleUrls: ['./search-field.component.css']
})
export class SearchFieldComponent implements OnInit, OnDestroy {
    @Output() private search: EventEmitter<string> = new EventEmitter();
    private $componentDestroyed: Subject<null> = new Subject();
    value: FormControl;
    debounceTime = 500;

    constructor() {
        this.value = new FormControl('', [Validators.pattern('[\\w]+')]);
    }

    ngOnDestroy(): void {
        this.$componentDestroyed.next(null);
    }

    ngOnInit(): void {
        this.value.valueChanges
            .pipe(debounceTime(this.debounceTime), takeUntil(this.$componentDestroyed))
            .subscribe(() => {
                this.value.valid && this.search.emit(this.value.value);
            });
    }
}
