import { GroupsFormDialogComponent } from './groups-form-dialog/groups-form-dialog.component';
import { GroupService, GroupDTO } from './../shared/services/group-service';
import { ColumnOption } from './../document-list/document-column-service';
import { Sort } from '@angular/material/sort';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Subscription } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { SearchClasses, SearchUtil } from '../shared/search-field/search-util';

@Component({
  selector: 'app-groups-list',
  templateUrl: './groups-list.component.html',
  styleUrls: ['./groups-list.component.css']
})
export class GroupsListComponent implements OnInit, OnDestroy {

  displayedColumns: ColumnOption[] = [];

    isLoadingResults = false;
    dataSource = new MatTableDataSource<GroupDTO>([]);
    private refreshData: Subscription = new Subscription();
    private sort: Sort = { active: 'creation_date', direction: 'desc' };
    private search: string = '';

    constructor(public dialog: MatDialog, private groupService: GroupService) {}

    ngOnInit(): void {
        this.displayedColumns = [
            { displayed: true, identifier: 'id', title: 'Id' },
            { displayed: true, identifier: 'group_name', title: 'Group Name' },
            { displayed: true, identifier: 'description', title: 'Description' },
            { displayed: true, identifier: 'creation_date', title: 'Creation Date'},
            { displayed: true, identifier: 'modify_date', title: 'Modify Date'}
        ];

        this.getGroups();

        this.refreshData = this.groupService.refresh.subscribe(() => {
            this.getGroups();
        });
    }

    ngOnDestroy(): void {
        this.refreshData && this.refreshData.unsubscribe();
    }

    getGroups() {
        this.isLoadingResults = true;
        this.groupService
            .getGroups(this.sort, SearchUtil.buildSearch(this.search, SearchClasses.GROUP))
            .subscribe((response: GroupDTO[]) => {
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
        this.getGroups();
    }

    drop(event: CdkDragDrop<string[]>) {
        moveItemInArray(this.displayedColumns, event.previousIndex, event.currentIndex);
    }

    handleQuickSearch($event: string) {
        this.search = $event;
        this.getGroups();
    }

    openAddDialog(): void {
        const dialogRef = this.dialog.open(GroupsFormDialogComponent, {
            width: '800px',
            minHeight: '500px',
            data: null
        });
    }
}
