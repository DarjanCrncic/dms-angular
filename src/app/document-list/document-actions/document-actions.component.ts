import { VersionTreeDialogComponent } from './../../shared/version-tree-dialog/version-tree-dialog.component';
import { DocumentService } from './../documents-service';
import { AclClass } from './../../shared/services/administration-service';
import { FileUploadResponse } from './../../shared/services/file-upload-service';
import { MatDialog } from '@angular/material/dialog';
import { GrantRightsDialogComponent } from './../../shared/grant-rights-dialog/grant-rights-dialog.component';
import { ApiPaths } from './../../api-paths';
import { environment } from './../../../environments/environment';
import {
  SnackbarService,
  MessageTypes
} from './../../shared/message-snackbar/snackbar-service';
import { FileUploadService } from '../../shared/services/file-upload-service';
import { DocumentDTO } from './../document.model';
import { Component, OnInit, Input } from '@angular/core';
import { DocumentFormDialogComponent } from '../document-form-dialog/document-form-dialog';

@Component({
  selector: 'app-document-actions',
  templateUrl: './document-actions.component.html',
  styleUrls: ['./document-actions.component.css']
})
export class DocumentActionsComponent implements OnInit {
  @Input() docDTO!: DocumentDTO;
  loading: boolean = false;
  linkToFile: string = '';
  private file!: File;

  constructor(
    private fileUploadService: FileUploadService,
    private snackbarService: SnackbarService,
    public dialog: MatDialog,
    private documentService: DocumentService
  ) {}

  ngOnInit(): void {
    if (this.docDTO.content && this.docDTO.content.content_size > 0) {
      this.linkToFile =
        environment.baseUrl + ApiPaths.DocumentDownload + '/' + this.docDTO.id;
    }
  }

  onChange(event: any, id: string) {
    this.file = event.target.files[0];
    this.onUpload(id);
  }

  onUpload(id: string) {
    this.loading = !this.loading;
    this.fileUploadService.upload(this.file, id).subscribe({
      next: (event: FileUploadResponse) => {
        this.linkToFile = event.url_to_file;

        this.docDTO.content = {
          content_size: event.content_size,
          original_file_name: event.original_file_name,
          content_type: event.content_type
        };
        this.snackbarService.openSnackBar(
          'Docuement successfully uploaded.',
          MessageTypes.SUCCESS
        );
        this.loading = false;
      },
      error: (error) => {
        this.loading = false;
      }
    });
  }

  onDownload(id: string) {
    this.fileUploadService.download(id).subscribe({
      next: (event) => {
        const a = document.createElement('a');
        const objectUrl = URL.createObjectURL(event);
        a.href = objectUrl;
        a.download = this.docDTO.content.original_file_name;
        a.click();
        URL.revokeObjectURL(objectUrl);
      },
      error: () => {}
    });
  }

  onEdit(row: DocumentDTO) {
    const dialogRef = this.dialog.open(DocumentFormDialogComponent, {
      width: '800px',
      minHeight: '500px',
      data: row
    });
  }

  onAdministrate(row: DocumentDTO) {
    const dialogRef = this.dialog.open(GrantRightsDialogComponent, {
      width: '800px',
      minHeight: '500px',
      data: {
        dto: row,
        type: AclClass.DOCUMENT
      }
    });
  }

  onVersionTree(row: DocumentDTO) {
    const dialogRef = this.dialog.open(VersionTreeDialogComponent, {
      minWidth: '1000px',
      minHeight: '500px',
      data: {
        dto: row
      }
    });
  }
}
