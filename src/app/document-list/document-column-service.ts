import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { ApiPaths } from 'src/app/api-paths';
import { environment } from 'src/environments/environment';

export interface ColumnOption {
  identifier: string;
  title: string;
  displayed: boolean;
}

@Injectable({ providedIn: 'root' })
export class DocumentColumnService {
  displayedColumnsChanged = new Subject<ColumnOption[]>();

  constructor(private httpClient: HttpClient) {
    this.getDocColPrefsForUser();
  }

  getDocColPrefsForUser() {
    this.httpClient
      .get<ColumnOption[]>(environment.baseUrl + ApiPaths.DocColPref)
      .subscribe((response) => {
        this.displayableColumns = response;
        this.displayedColumnsChanged.next(response);
      });
  }

  saveNewSelectionForUser(options: ColumnOption[]) {
    return this.httpClient.post<ColumnOption[]>(
      environment.baseUrl + ApiPaths.DocColPref,
      options
    );
  }

  getActiveColumns(): ColumnOption[] {
    return this.displayableColumns
      .filter((col) => col.displayed)
      .map((a) => ({ ...a }));
  }

  getAllColumns(): ColumnOption[] {
    return this.displayableColumns.map((a) => ({ ...a }));
  }

  saveNewColumns(newSelection: ColumnOption[]) {
    const newDisplayedColumns = newSelection.map((a) => ({ ...a }));

    this.saveNewSelectionForUser(newDisplayedColumns).subscribe((response) => {
      this.displayableColumns = response;
      this.displayedColumnsChanged.next(response);
    });
  }

  private displayableColumns: ColumnOption[] = [];
}
