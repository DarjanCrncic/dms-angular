import {
  FileUploadService,
  FileUploadResponse,
} from './../services/file-upload-service';
import {
  ChangeDetectorRef,
  Component,
  Inject,
  OnInit,
  OnDestroy,
} from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ContentDTO, DocumentDTO } from './../../document-list/document.model';
import { DocumentService } from './../../document-list/documents-service';

const EXCLUDED_KEYS = ['parent_folder_id', 'root_id', 'predecessor_id'];
const TD_WIDTH = 80;
const TD_PADDING = 11;

@Component({
  selector: 'app-version-tree-dialog',
  templateUrl: './version-tree-dialog.component.html',
  styleUrls: ['./version-tree-dialog.component.css'],
})
export class VersionTreeDialogComponent implements OnInit, OnDestroy {
  versions: DocumentDTO[] = [];
  selected: DocumentDTO | null = null;
  properties: { name: any; value: any }[] = [];
  isLoading: boolean = false;

  private file!: File;

  private taken = 0;
  versionMatrix: DocumentDTO[][] = [];

  constructor(
    public dialogRef: MatDialogRef<VersionTreeDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { dto: DocumentDTO },
    private documentService: DocumentService,
    private fileUploadService: FileUploadService
  ) {}

  ngOnInit(): void {
    this.refreshTree(this.data.dto.id);
  }

  ngOnDestroy(): void {
    this.documentService.refreshDocuments.next(null);
  }

  private refreshTree(pickId?: string) {
    this.isLoading = true;
    this.documentService.getVersions(this.data.dto.root_id).subscribe({
      next: (res) => {
        this.versions = res.sort();
        this.setUpVersionMatrix();
        this.versions.length > 0 &&
          pickId &&
          this.pickVersion(
            this.versions.find((ver) => ver.id === pickId) ?? this.versions[0]
          );
        this.isLoading = false;
      },
      complete: () => {
        this.isLoading = false;
      },
    });
  }

  onCancel() {
    this.dialogRef.close();
  }

  onDelete() {
    this.selected &&
      this.documentService
        .deleteDocuments([this.selected.id])
        .subscribe((res) => {
          this.refreshTree(this.selected?.predecessor_id);
        });
  }

  onVersion() {
    this.selected &&
      this.documentService
        .versionDocument(this.selected.id)
        .subscribe((res) => {
          this.refreshTree(res.id);
        });
  }

  createBranch() {
    this.selected &&
      this.documentService.branchDocument(this.selected.id).subscribe((res) => {
        this.refreshTree(res.id);
      });
  }

  pickVersion(version: DocumentDTO) {
    this.selected = version;
    this.properties = [];
    for (let [key, value] of Object.entries(version)) {
      switch (key) {
        case 'creator':
          this.properties.push({
            name: key,
            value: `${value.first_name} ${value.last_name}`,
          });
          break;
        case 'content':
          const valObj = value && (value as ContentDTO);
          this.properties.push({
            name: key,
            value: value ? valObj.original_file_name : '',
          });
          break;
        default:
          !EXCLUDED_KEYS.includes(value) &&
            this.properties.push({ name: key, value: value });
      }
    }
  }

  private getMainVersions() {
    return this.versions.filter((version) => {
      return version.version.split('.').length == 1;
    });
  }

  private getBranch(version: string) {
    return this.versions.filter((ver) => {
      return (
        ver.version.startsWith(version) &&
        ver.version.split('.').length - 1 == version.split('.').length
      );
    });
  }

  private setUpVersionMatrix() {
    this.taken = 0;
    const versionValues = this.versions
      .map((v) => v.version)
      .sort()
      .reverse();
    const colNum = this.versions.filter((ver) => ver.branched).length + 1;
    let height = 1;
    let maxDepth = 1;

    versionValues.forEach((v) => {
      const versionSum = this.getVersionHeight(v);
      const depth = v.split('.').length;
      if (depth > maxDepth) maxDepth = depth;
      if (versionSum > height) height = versionSum;
    });

    this.versionMatrix = new Array(height)
      .fill(0)
      .map(() => new Array(colNum).fill(0));
    this.getMainVersions().forEach((version) => {
      this.versionMatrix[+version.version - 1][0] = version;
      this.handleChildren(+version.version - 1, 1, version.version);
    });
  }

  private handleChildren(x: number, y: number, version: string) {
    const children = this.getBranch(version);
    if (children.length > 0) {
      this.taken += 1;
      const currentTaken = this.taken;
      children.forEach((child) => {
        const row = this.getVersionHeight(child.version) - 1;
        this.versionMatrix[row][currentTaken] = child;
        this.handleChildren(row, this.taken, child.version);
      });
    }
  }

  private getVersionHeight(v: string) {
    const numbers = v.split('.');
    return (
      v
        .split('.')
        .map((i) => +i)
        .reduce((a, b) => {
          return a + b;
        }) -
      numbers.length +
      1
    );
  }

  getHorizontalGapSize(version: DocumentDTO, row: number, column: number) {
    const predecessor_id = version.predecessor_id;
    if (predecessor_id == null || predecessor_id == version.id) return 0;

    let predPos = null;
    for (let j = 0; j < this.versionMatrix[0].length; j++) {
      if (this.versionMatrix[row][j].id == predecessor_id) {
        predPos = j;
        break;
      }
    }
    if (predPos == null) return 0;

    return column - predPos > 1
      ? (column - predPos - 1) * (TD_WIDTH + 2 * TD_PADDING) +
          2 * (TD_PADDING + column - predPos)
      : (TD_PADDING + 1) * 2;
  }

  // DOWNLOAD/UPLOAD

  onChange(event: any) {
    this.file = event.target.files[0];
    this.selected && this.onUpload(this.selected.id);
  }

  onUpload(id: string) {
    this.isLoading = !this.isLoading;
    this.fileUploadService.upload(this.file, id).subscribe({
      next: (event: FileUploadResponse) => {
        if (!this.selected) return;

        this.selected.content = {
          content_size: event.content_size,
          original_file_name: event.original_file_name,
          content_type: event.content_type,
        };
      },
      complete: () => {
        this.isLoading = false;
      },
    });
  }

  onDownload() {
    this.selected &&
      this.fileUploadService.download(this.selected.id).subscribe({
        next: (event) => {
          if (!this.selected) return;
          const a = document.createElement('a');
          const objectUrl = URL.createObjectURL(event);
          a.href = objectUrl;
          a.download = this.selected.content.original_file_name;
          a.click();
          URL.revokeObjectURL(objectUrl);
        },
        error: () => {},
      });
  }
}
