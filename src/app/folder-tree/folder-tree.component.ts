import { Errors, validFolderName } from './../shared/validator-messages';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { FolderNode } from './folder-node.model';
import { FolderService } from './folder-service';
import { FlatTreeControl } from '@angular/cdk/tree';
import { Component, OnInit } from '@angular/core';
import {
  MatTreeFlatDataSource,
  MatTreeFlattener,
} from '@angular/material/tree';

/** Flat node with expandable and level information */
interface FlatTreeNode {
  id: string;
  expandable: boolean;
  name: string;
  level: number;
  empty: boolean;
}

/**
 * @title Tree with flat nodes
 */
@Component({
  selector: 'app-folder-tree',
  templateUrl: 'folder-tree.component.html',
  styleUrls: ['folder-tree.component.css'],
})
export class FolderTreeComponent implements OnInit {
  newFolderForm: FormGroup = new FormGroup({});
  expandedNodes: FlatTreeNode[] = [];

  private _transformer = (node: FolderNode, level: number) => {
    return {
      expandable: !!node.subfolders && node.subfolders.length > 0,
      id: node.id,
      name: node.path,
      level: level,
      empty: node.subfolders.length === 0 && node.num_of_documents === 0,
    };
  };

  treeControl = new FlatTreeControl<FlatTreeNode>(
    (node) => node.level,
    (node) => node.expandable
  );

  treeFlattener = new MatTreeFlattener(
    this._transformer,
    (node) => node.level,
    (node) => node.expandable,
    (node) => node.subfolders
  );

  dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);

  constructor(private folderService: FolderService) {
    this.dataSource.data = [];
  }
  ngOnInit(): void {
    this.getFolderTree('/');
    this.newFolderForm = new FormGroup({
      path: new FormControl('', [
        Validators.required,
        Validators.pattern(validFolderName),
      ]),
    });
  }

  getFolderTree(currentFolder: string) {
    this.saveExpandedNodes();
    this.folderService.getFolderTree('/').subscribe((res) => {
      this.dataSource.data = [res];
      this.restoreExpandedNodes();
      this.folderService.setCurrentFolder(currentFolder);
    });
  }

  saveExpandedNodes() {
    this.expandedNodes = new Array<FlatTreeNode>();
    this.treeControl.dataNodes.forEach((node) => {
      if (node.expandable && this.treeControl.isExpanded(node)) {
        this.expandedNodes.push(node);
      }
    });
  }

  restoreExpandedNodes() {
    this.expandedNodes.forEach((node) => {
      const found = this.treeControl.dataNodes.find(
        (n) => n.name === node.name
      );
      if (found) {
        this.treeControl.expand(found);
      }
    });
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

  addFolderClick() {
    const formVal = this.newFolderForm.value;
    if (!this.newFolderForm.valid) return;
    this.folderService.createNewFolder(formVal.path).subscribe((res) => {
      this.getFolderTree(this.folderService.getCurrentPath());
    });
  }

  deleteFolder() {
    if (this.folderService.getCurrentPath() === '/') return;
    const found = this.treeControl.dataNodes.find(
      (n) => n.name === this.folderService.getCurrentPath()
    );
    if (!found) return;

    this.folderService.deleteById(found.id).subscribe(() => {
      this.getFolderTree(this.folderService.getParentPath());
    });
  }
}
