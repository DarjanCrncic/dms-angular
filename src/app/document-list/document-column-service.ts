import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

export interface ColumnOption {
  identifier: string,
  title: string,
  displayed: boolean,
}

@Injectable({providedIn: 'root'})
export class DocumentColumnService {

  displayedColumnsChanged = new Subject<ColumnOption[]>();
  
  constructor() { }
  
  getActiveColumns(): ColumnOption[] {
    return this.displayableColumns.filter(col => col.displayed).map(a => ({...a}));
  }

  getAllColumns(): ColumnOption[] {
    return this.displayableColumns.map(a => ({...a}));
  }

  saveNewColumns(newSelection: ColumnOption[]) {
    const newDisplayedColumns = newSelection.map(a => ({...a}));
    this.displayableColumns = newDisplayedColumns;
    this.displayedColumnsChanged.next(newDisplayedColumns);
  }

  private displayableColumns: ColumnOption[] = [
    {
      identifier: "id",
      title: "ID",
      displayed: true
    },
    {
      identifier: "object_name",
      title: "File Name",
      displayed: true
    },
    {
      identifier: "creation_date",
      title: "Creation Date",
      displayed: true
    },
    {
      identifier: "modify_date",
      title: "Modify Date",
      displayed: true
    },
    {
      identifier: "description",
      title: "Description",
      displayed: true
    },
    {
      identifier: "parent_folder",
      title: "Folder",
      displayed: true
    }
  ];
}

