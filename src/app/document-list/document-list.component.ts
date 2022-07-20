import { GrantRightsDialogComponent } from './../shared/grant-rights-dialog/grant-rights-dialog.component';
import {
  SnackbarService,
  MessageTypes,
} from './../shared/message-snackbar/snackbar-service';
import { DocumentFormDialog } from './document-form-dialog/document-form-dialog';
import { MatDialog } from '@angular/material/dialog';
import { SelectionModel } from '@angular/cdk/collections';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Subscription } from 'rxjs';
import { FolderService } from './../folder-tree/folder-service';
import { DocumentColumnService, ColumnOption } from './document-column-service';
import { DocumentDTO } from './document.model';
import { DocumentService } from './documents-service';
import { FolderTreeService } from '../folder-tree/folder-tree-service';

@Component({
  selector: 'app-document-list',
  templateUrl: './document-list.component.html',
  styleUrls: ['./document-list.component.css'],
})
export class DocumentListComponent implements OnInit, OnDestroy {
  displayedColumns: ColumnOption[] = [];

  isLoadingResults = false;
  private dataSource = new MatTableDataSource<DocumentDTO>([]);
  private selection = new SelectionModel<DocumentDTO>(true, []);
  private folderChangedSub: Subscription = new Subscription();
  private displayedColumnsChangedSub: Subscription = new Subscription();
  private refreshData: Subscription = new Subscription();

  constructor(
    private documentService: DocumentService,
    private folderService: FolderService,
    private colService: DocumentColumnService,
    private snackbarService: SnackbarService,
    private folderTreeService: FolderTreeService
  ) {}

  ngOnInit(): void {
    this.displayedColumns = this.colService.getActiveColumns();

    this.folderChangedSub =
      this.folderTreeService.selectedFolderChanged.subscribe((folder) => {
        this.getDocuments(undefined, folder.id);
      });

    this.refreshData = this.documentService.refreshDocuments.subscribe(() => {
      const currentFolder = this.folderTreeService.getCurrentFolder();
      currentFolder && this.getDocuments(undefined, currentFolder.id);
    });

    this.displayedColumnsChangedSub =
      this.colService.displayedColumnsChanged.subscribe(
        (newDisplayedColumns) => {
          this.displayedColumns = newDisplayedColumns;
        }
      );

    const currentFolder = this.folderTreeService.getCurrentFolder();
    currentFolder && this.getDocuments(undefined, currentFolder.id);
  }

  ngOnDestroy(): void {
    this.folderChangedSub && this.folderChangedSub.unsubscribe();
    this.refreshData && this.refreshData.unsubscribe();
    this.displayedColumnsChangedSub &&
      this.displayedColumnsChangedSub.unsubscribe();
  }

  getDocuments(sort?: Sort, folderId?: string) {
    this.isLoadingResults = true;
    this.documentService
      .getDocuments(sort, folderId)
      .subscribe((response: DocumentDTO[]) => {
        this.selection.clear();
        this.isLoadingResults = false;
        this.dataSource.data = response;
      });
  }

  getIdentifiers(): string[] {
    const identifiers = this.displayedColumns
      .filter((col) => col.displayed)
      .map((colOpt) => colOpt.identifier);
    return ['select', ...identifiers, 'actions'];
  }

  getData() {
    return this.dataSource;
  }

  getSelection() {
    return this.selection;
  }

  // sorting
  sortData(event: Sort) {
    this.getDocuments(event, this.folderTreeService.getCurrentFolder()?.id);
  }

  // moveable columns
  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(
      this.displayedColumns,
      event.previousIndex,
      event.currentIndex
    );
  }

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  isAnySelected() {
    return this.selection.selected.length > 0;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    if (this.isAllSelected()) {
      this.selection.clear();
      return;
    }

    this.selection.select(...this.dataSource.data);
  }

  /** The label for the checkbox on the passed row */
  checkboxLabel(row?: DocumentDTO): string {
    if (!row) {
      return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row`;
  }

  onGroupDelete() {
    const currentFolder = this.folderTreeService.getCurrentFolder();
    if (this.selection.selected.length === 0 || !currentFolder) {
      return;
    }
    this.documentService
      .deleteDocuments(this.selection.selected.map((doc) => doc.id))
      .subscribe((response) => {
        this.getDocuments(undefined, currentFolder.id);
        this.snackbarService.openSnackBar(
          'Documents deleted.',
          MessageTypes.SUCCESS
        );
      });
  }

  getHeaderTitle() {
    return this.getCurrentPath();
  }

  getCurrentPath() {
    const currentFolder = this.folderTreeService.getCurrentFolder();
    return currentFolder ? currentFolder.name : '';
  }
}
