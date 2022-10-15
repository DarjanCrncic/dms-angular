import { UsersFormDialogComponent } from './users-form-dialog/users-form-dialog.component';
import { SearchUtil, SearchClasses } from './../shared/search-field/search-util';
import { Subscription } from 'rxjs';
import { ColumnOption } from './../document-list/document-column-service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { UserDetails, UserService } from '../shared/services/user-service';

@Component({
    selector: 'app-users-list',
    templateUrl: './users-list.component.html',
    styleUrls: ['./users-list.component.css']
})
export class UsersListComponent implements OnInit, OnDestroy {
    displayedColumns: ColumnOption[] = [];

    isLoadingResults = false;
    dataSource = new MatTableDataSource<UserDetails>([]);
    private refreshData: Subscription = new Subscription();
    private sort: Sort = { active: 'creation_date', direction: 'desc' };
    private search: string = '';

    constructor(public dialog: MatDialog, private userService: UserService) {}

    ngOnInit(): void {
        this.displayedColumns = [
            { displayed: true, identifier: 'id', title: 'Id' },
            { displayed: true, identifier: 'first_name', title: 'First Name' },
            { displayed: true, identifier: 'last_name', title: 'Last Name' },
            { displayed: true, identifier: 'creation_date', title: 'Creation Date' },
            { displayed: true, identifier: 'modify_date', title: 'Modify Date' },
            { displayed: true, identifier: 'email', title: 'Email' }
        ];

        this.getUserDetails();

        this.refreshData = this.userService.refresh.subscribe(() => {
            this.getUserDetails();
        });
    }

    ngOnDestroy(): void {
        this.refreshData && this.refreshData.unsubscribe();
    }

    getUserDetails() {
        this.isLoadingResults = true;
        this.userService
            .getAvailableUsers(this.sort, SearchUtil.buildSearch(this.search, SearchClasses.USER))
            .subscribe((response: UserDetails[]) => {
                this.isLoadingResults = false;
                this.dataSource.data = response;
            });
    }

    getIdentifiers(): string[] {
        const identifiers = this.displayedColumns.filter((col) => col.displayed).map((colOpt) => colOpt.identifier);
        return [...identifiers, 'actions'];
    }

    // sorting
    sortData(event: Sort) {
        this.sort = event;
        this.getUserDetails();
    }

    drop(event: CdkDragDrop<string[]>) {
        moveItemInArray(this.displayedColumns, event.previousIndex, event.currentIndex);
    }

    handleQuickSearch($event: string) {
        this.search = $event;
        this.getUserDetails();
    }

    openAddDialog(): void {
        const dialogRef = this.dialog.open(UsersFormDialogComponent, {
            width: '800px',
            minHeight: '500px',
            data: null
        });
    }
}
