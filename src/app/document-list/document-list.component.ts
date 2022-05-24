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

@Component({
  selector: 'app-document-list',
  templateUrl: './document-list.component.html',
  styleUrls: ['./document-list.component.css'],
})
export class DocumentListComponent implements OnInit, OnDestroy {
  displayedColumns: ColumnOption[] = [];

  isLoadingResults = false;
  private currentPath = "/";
  private dataSource = new MatTableDataSource<DocumentDTO>([]);
  private selection = new SelectionModel<DocumentDTO>(true, []);
  private folderChangedSub: Subscription = new Subscription();
  private displayedColumnsChangedSub: Subscription = new Subscription();

  constructor(
    private documentService: DocumentService,
    private folderService: FolderService,
    private colService: DocumentColumnService
  ) {}

  ngOnInit(): void {
    this.getDocuments(undefined, '/');
    this.displayedColumns = this.colService.getActiveColumns();

    console.log(this.displayedColumns);
    this.folderChangedSub = this.folderService.currentFolderChanged.subscribe(
      (path) => {
        this.currentPath = path;
        this.getDocuments(undefined, path);
      }
    );

    this.displayedColumnsChangedSub =
      this.colService.displayedColumnsChanged.subscribe(
        (newDisplayedColumns) => {
          this.displayedColumns = newDisplayedColumns;
        }
      );
  }
  ngOnDestroy(): void {
    this.folderChangedSub.unsubscribe();
    this.displayedColumnsChangedSub.unsubscribe();
  }

  getDocuments(sort?: Sort, path?: string) {
    this.isLoadingResults = true;
    this.documentService
      .getDocuments(sort, path)
      .subscribe((response: DocumentDTO[]) => {
        this.selection.clear();
        this.isLoadingResults = false;
        this.dataSource.data = response;
      });
  }

  getIdentifiers(): string[] {
    const identifiers = this.displayedColumns.filter(col => col.displayed).map(
      (colOpt) => colOpt.identifier
    );
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
    this.getDocuments(event, this.currentPath);
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
    console.log(this.selection);
    if (this.selection.selected.length === 0) {
      return;
    }
    this.documentService
      .deleteDocuments(this.selection.selected.map((doc) => doc.id))
      .subscribe((response) => {
        this.getDocuments(undefined, this.currentPath);
      });
  }
}
