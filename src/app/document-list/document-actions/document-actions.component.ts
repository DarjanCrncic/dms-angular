import { FileUploadResponse } from './../../shared/services/file-upload-service';
import { MatDialog } from '@angular/material/dialog';
import { GrantRightsDialogComponent } from './../../shared/grant-rights-dialog/grant-rights-dialog.component';
import { DocumentFormDialog } from './../document-form-dialog/document-form-dialog';
import { ApiPaths } from './../../api-paths';
import { environment } from './../../../environments/environment';
import { SnackbarService, MessageTypes } from './../../shared/message-snackbar/snackbar-service';
import { FileUploadService } from '../../shared/services/file-upload-service';
import { DocumentDTO } from './../document.model';
import { Component, OnInit, Input } from '@angular/core';

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

  constructor(private fileUploadService: FileUploadService, private snackbarService: SnackbarService,  public dialog: MatDialog) {}

  ngOnInit(): void {
    if (this.docDTO.content && this.docDTO.content.content_size > 0) {
      this.linkToFile =
        environment.baseUrl + ApiPaths.DocumentDownload + '/' + this.docDTO.id;
    }
  }

  onChange(event: any) {
    this.file = event.target.files[0];
    this.onUpload();
  }

  onUpload() {
    this.loading = !this.loading;
    this.fileUploadService.upload(this.file, this.docDTO).subscribe({
      next: (event: FileUploadResponse) => {
        this.linkToFile = event.url_to_file;

        this.docDTO.content = {
          content_size: event.content_size,
          original_file_name: event.original_file_name,
          content_type: event.content_type,
        };
        this.snackbarService.openSnackBar("Docuement successfully uploaded.", MessageTypes.SUCCESS);
        this.loading = false;
      },
      error: (error) => {
        this.loading = false;
      },
    });
  }

  onDownload() {
    this.fileUploadService.download(this.docDTO).subscribe({
      next: (event) => {
        const a = document.createElement('a');
        const objectUrl = URL.createObjectURL(event);
        a.href = objectUrl;
        a.download = this.docDTO.content.original_file_name;
        a.click();
        URL.revokeObjectURL(objectUrl);
      },
      error: () => {},
    });
  }

  onEdit(row: DocumentDTO) {
    const dialogRef = this.dialog.open(DocumentFormDialog, {
      width: '800px',
      minHeight: '500px',
      data: row,
    });
  }

  onAdministrate(row: DocumentDTO) {
    const dialogRef = this.dialog.open(GrantRightsDialogComponent, {
      width: '800px',
      minHeight: '500px',
      data: row,
    });
  }
}
