import { DocumentService } from './../../document-list/documents-service';
import { DocumentDTO } from './../../document-list/document.model';
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class CopyService {
  private _documents: DocumentDTO[] = [];

  constructor(private documentService: DocumentService) {}

  public setDocumentsForCopy(documents: DocumentDTO[]) {
    this._documents = [...documents];
  }

  public getDocumentsForCopy() {
    return this._documents;
  }

  public copyDocuments(newFolderId: string) {
    const ids = this._documents.map(doc => doc.id);
    return this.documentService.copyDocuments(ids, newFolderId);
  }
}
