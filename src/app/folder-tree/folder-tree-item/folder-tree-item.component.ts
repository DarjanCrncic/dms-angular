import { FolderNode } from './../folder-node.model';
import { AclClass } from './../../shared/services/administration-service';
import { GrantRightsDialogComponent } from './../../shared/grant-rights-dialog/grant-rights-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import {
  SnackbarService,
  MessageTypes,
} from './../../shared/message-snackbar/snackbar-service';
import { FolderOptionsService } from './../folder-options-service';
import { Subscription } from 'rxjs';
import { DocumentService } from './../../document-list/documents-service';
import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { FolderService } from '../folder-service';

@Component({
  selector: 'app-folder-tree-item',
  templateUrl: './folder-tree-item.component.html',
  styleUrls: ['./folder-tree-item.component.css'],
})
export class FolderTreeItemComponent implements OnInit, OnDestroy {
  @Input() expanded = false;
  @Input() path = '';
  @Input() empty = true;
  @Input() node: FolderNode | null = null;
  public currentlySelected: boolean = false;
  showOptions = false;

  private currentFolderChangedSub: Subscription | null = null;
  private folderHoverChangedSub: Subscription | null = null;

  constructor(
    private folderService: FolderService,
    private folderOptionsService: FolderOptionsService,
    private snackbarService: SnackbarService,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.currentlySelected = this.folderService.getCurrentPath() === this.path;
    this.currentFolderChangedSub =
      this.folderService.currentFolderChanged.subscribe((newPath) => {
        this.currentlySelected = newPath === this.path;
      });
    this.folderHoverChangedSub =
      this.folderOptionsService.hoveredNodeChanged.subscribe((node) => {
        this.showOptions = this.path === node?.name && this.path !== '/';
      });
  }

  getFolderName(path: string) {
    const paths = path.split('/');
    return '/' + paths.pop();
  }

  handleFolderClick() {
    this.folderService.setCurrentFolder(this.path);
  }

  ngOnDestroy() {
    this.currentFolderChangedSub && this.currentFolderChangedSub.unsubscribe();
    this.folderHoverChangedSub && this.folderHoverChangedSub.unsubscribe();
  }

  deleteFolder() {
    const folder = this.folderOptionsService.getHoveredNode();
    if (!folder) return;

    if (folder.name === '/') {
      this.snackbarService.openSnackBar(
        'Root folder cannot be deleted.',
        MessageTypes.ERROR
      );
      throw new Error('Root folder cannot be deleted.');
    }

    this.folderService.deleteById(folder.id).subscribe(() => {
      const currentPath = this.folderService.getCurrentPath();
      const newPath =
        folder.name === currentPath || currentPath.startsWith(folder.name)
          ? '/'
          : null;
      this.folderService.folderDeleted.next(newPath);
    });
  }

  openAdminDialog() {
    if (this.node === null) return;
    const dialogRef = this.dialog.open(GrantRightsDialogComponent, {
      width: '800px',
      minHeight: '500px',
      data: {
        dto: this.node,
        type: AclClass.FOLDER,
      },
    });
  }
}
