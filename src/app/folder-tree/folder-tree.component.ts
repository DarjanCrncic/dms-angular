import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Errors, validFolderName } from './../shared/validator-messages';
import { FolderOptionsService } from './folder-options-service';
import { FolderService } from './folder-service';
import { FolderTreeService, FlatTreeNode } from './folder-tree-service';

@Component({
  selector: 'app-folder-tree',
  templateUrl: 'folder-tree.component.html',
  styleUrls: ['folder-tree.component.css']
})
export class FolderTreeComponent implements OnInit {
  newFolderForm: FormGroup = new FormGroup({});
  folderDeletedSub: Subscription | null = null;

  constructor(
    private folderOptionsService: FolderOptionsService,
    private folderTreeService: FolderTreeService
  ) {}

  ngOnInit(): void {
    this.folderTreeService.getFolderTree(
      this.folderTreeService?.getCurrentFolder()?.id
    );
  }

  getTreeControl() {
    return this.folderTreeService.treeControl;
  }

  getDataSource() {
    return this.folderTreeService.dataSource;
  }

  hasChild = (_: number, node: FlatTreeNode) => node.expandable;

  getErrorMessage(controlName: string) {
    const control = this.newFolderForm.get(controlName);
    return control?.hasError('required')
      ? Errors.required
      : control?.hasError('pattern')
      ? Errors.alphaNumeric
      : null;
  }

  onHoverIn(node: any) {
    this.folderOptionsService.node = node;
  }

  onHoverOut() {
    this.folderOptionsService.hoveredNodeChanged.next(null);
  }

  saveFolderTreeToLocalStorage() {
    this.folderTreeService.saveDataToLocal();
  }
}
