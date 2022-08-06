import { EMPTY, Observable } from 'rxjs';
import { DocumentService } from './../../document-list/documents-service';
import { DocumentDTO } from './../../document-list/document.model';
import { Injectable } from '@angular/core';
import { EMPTY_OBSERVER } from 'rxjs/internal/Subscriber';

export enum COPY_ACTION {
  COPY, CUT, NULL
}
@Injectable({ providedIn: 'root' })
export class CopyService {
  private _documents: DocumentDTO[] = [];
  private action: COPY_ACTION = COPY_ACTION.NULL;

  constructor(private documentService: DocumentService) {}

  public setDocumentsForCopy(documents: DocumentDTO[], action: COPY_ACTION) {
    this._documents = [...documents];
    this.action = action;
  }

  public getDocumentsForCopy() {
    return this._documents;
  }

  public copyDocuments(newFolderId: string) {
    const ids = this._documents.map(doc => doc.id);
    if (this.action === COPY_ACTION.COPY) {
      return this.documentService.copyDocuments(ids, newFolderId);
    }
    if (this.action === COPY_ACTION.CUT) {
      return this.documentService.cutDocuments(ids, newFolderId);
    }
    return EMPTY;
  }

  public clearDocuments() {
    this._documents = [];
  }
}
