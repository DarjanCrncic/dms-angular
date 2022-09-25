import { FlatTreeNode, FolderTreeService } from '../folder-tree-service';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { FolderService } from '../folder-service';
import { GrantRightsDialogComponent } from './../../shared/grant-rights-dialog/grant-rights-dialog.component';
import { MessageTypes, SnackbarService } from './../../shared/message-snackbar/snackbar-service';
import { RenameDialogComponent } from './../../shared/rename-dialog/rename-dialog.component';
import { AclClass } from './../../shared/services/administration-service';
import { FolderOptionsService } from './../folder-options-service';

@Component({
  selector: 'app-folder-tree-item',
  templateUrl: './folder-tree-item.component.html',
  styleUrls: ['./folder-tree-item.component.css']
})
export class FolderTreeItemComponent implements OnInit, OnDestroy {
  @Input() expanded = false;
  @Input() empty = true;
  @Input() node: FlatTreeNode = {
    id: '',
    expandable: false,
    name: '',
    level: 0,
    empty: true,
    parent_folder_id: ''
  };
  public currentlySelected: boolean = false;
  showOptions = false;

  private currentFolderChangedSub: Subscription | null = null;
  private folderHoverChangedSub: Subscription | null = null;

  constructor(
    private folderService: FolderService,
    private folderOptionsService: FolderOptionsService,
    private snackbarService: SnackbarService,
    private folderTreeService: FolderTreeService,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.currentlySelected = this.folderTreeService.getCurrentFolder()?.id === this.node.id;

    this.currentFolderChangedSub = this.folderTreeService.selectedFolderChanged.subscribe((newFolder) => {
      this.currentlySelected = newFolder.id === this.node.id;
    });

    this.folderHoverChangedSub = this.folderOptionsService.hoveredNodeChanged.subscribe((selected) => {
      this.showOptions = this.node.name === selected?.name && this.node.name !== '/';
    });
  }

  getFolderName(path: string) {
    const paths = path.split('/');
    return '/' + paths.pop();
  }

  handleFolderClick() {
    this.folderTreeService.setCurrentFolder(this.node.id);
  }

  ngOnDestroy() {
    this.currentFolderChangedSub && this.currentFolderChangedSub.unsubscribe();
    this.folderHoverChangedSub && this.folderHoverChangedSub.unsubscribe();
  }

  deleteFolder() {
    const folder = this.folderOptionsService.getHoveredNode();
    if (!folder) return;

    if (folder.name === '/') {
      this.snackbarService.openSnackBar('Root folder cannot be deleted.', MessageTypes.ERROR);
      throw new Error('Root folder cannot be deleted.');
    }

    this.folderService.deleteById(folder.id).subscribe(() => {
      this.folderTreeService.removeNode(folder.id);
      this.snackbarService.openSnackBar('Folder successfully deleted.', MessageTypes.SUCCESS);
    });
  }

  openAdminDialog() {
    if (this.node === null) return;
    const dialogRef = this.dialog.open(GrantRightsDialogComponent, {
      width: '800px',
      minHeight: '500px',
      data: {
        dto: this.node,
        type: AclClass.FOLDER
      }
    });
  }

  openRenameDialog() {
    if (this.node === null) return;
    const dialogRef = this.dialog.open(RenameDialogComponent, {
      width: '800px',
      data: {
        update: true,
        node: this.node
      }
    });
  }

  openAddFolderDialog() {
    if (this.node === null) return;
    const dialogRef = this.dialog.open(RenameDialogComponent, {
      width: '800px',
      data: {
        update: false,
        node: this.node
      }
    });
  }
}
