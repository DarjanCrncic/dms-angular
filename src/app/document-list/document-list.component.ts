import { PageData } from './../shared/page-data.interface';
import { Component, OnInit } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { Document } from './document.model';
import { DocumentService } from './documents-service';

@Component({
  selector: 'app-document-list',
  templateUrl: './document-list.component.html',
  styleUrls: ['./document-list.component.css']
})
export class DocumentListComponent implements OnInit {

  private data: Document[] = [];
  displayedColumns: string[] = ['id', 'object_name', 'creation_date', 'modify_date', 'parent_folder'];
  isLoadingResults = false;
  
  constructor(private documentService: DocumentService) { }
  
  // pagination
  resultsLength = 100;
  pageIndex = 0;
  pageSize = 10;
  pageSizeOptions: number[] = [5, 10, 25, 100];

  pageEvent: PageEvent = new PageEvent;

  setPageSizeOptions(setPageSizeOptionsInput: string) {
    if (setPageSizeOptionsInput) {
      this.pageSizeOptions = setPageSizeOptionsInput.split(',').map(str => +str);
    }
  }

  onPageEvent(event:PageEvent):PageEvent {
    console.log(event);
    
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    
    this.getDocuments();
    return event;
  }

  
  ngOnInit(): void {
    this.getDocuments();
  }

 
  
  getDocuments() {
    const pageData: PageData = {
      pageIndex: this.pageIndex,
      pageSize: this.pageSize,
    }
    this.isLoadingResults = true;
    this.documentService.getDocuments(pageData).subscribe(response => {
      this.data = response.content;
      this.resultsLength = response.total_elements;
      this.isLoadingResults = false;
    });
  }

  getData() {
    return this.data;
  }
 
  ngAfterViewInit() {
  }
}


