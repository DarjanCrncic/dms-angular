import { FileUploadResponse } from './file-upload-response.interface';
import { ApiPaths } from './../../api-paths';
import { environment } from './../../../environments/environment';
import { Component, Input, OnInit } from '@angular/core';
import { DocumentDTO } from './../../document-list/document.model';
import { FileUploadService } from './file-upload-service';

@Component({
  selector: 'app-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.css'],
})
export class FileUploadComponent implements OnInit {
  @Input() docDTO!: DocumentDTO;
  loading: boolean = false;
  linkToFile: string = '';
  private file!: File;

  constructor(private fileUploadService: FileUploadService) {}

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
}
