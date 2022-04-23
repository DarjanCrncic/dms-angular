import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { merge, of as observableOf } from 'rxjs';
import { catchError, map, startWith, switchMap } from 'rxjs/operators';
import { Document } from './document.model';
import { DocumentService } from './documents-service';

@Component({
  selector: 'app-document-list',
  templateUrl: './document-list.component.html',
  styleUrls: ['./document-list.component.css']
})
export class DocumentListComponent implements OnInit {

  private data: Document[] = [];
  displayedColumns: string[] = ['id', 'object_name', 'creation_date', 'modify_date'];
  resultsLength = 0;
  isLoadingResults = false;

  getData() {
    return this.data;
  }

  constructor(private documentService: DocumentService) { }

  ngOnInit(): void {
    this.documentService.getDocuments().subscribe(response => {
      this.data = response;
    });
  }

 
  ngAfterViewInit() {
  }
}


