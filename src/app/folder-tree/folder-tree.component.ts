import { FlatTreeControl } from '@angular/cdk/tree';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import {
  MatTreeFlatDataSource,
  MatTreeFlattener,
} from '@angular/material/tree';
import { Subscription } from 'rxjs';
import { DocumentService } from './../document-list/documents-service';
import { Errors, validFolderName } from './../shared/validator-messages';
import { FolderNode } from './folder-node.model';
import { FolderOptionsService } from './folder-options-service';
import { FolderService } from './folder-service';

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
export class FolderTreeComponent implements OnInit, OnDestroy {
  newFolderForm: FormGroup = new FormGroup({});
  expandedNodes: FlatTreeNode[] = [];
  refreshSubscription: Subscription | null = null;
  folderDeletedSub: Subscription | null = null;

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

  constructor(
    private folderService: FolderService,
    private documentService: DocumentService,
    private folderOptionsService: FolderOptionsService
  ) {
    this.dataSource.data = [];
  }
  ngOnDestroy(): void {
    this.refreshSubscription && this.refreshSubscription.unsubscribe();
    this.folderDeletedSub && this.folderDeletedSub.unsubscribe();
  }
  ngOnInit(): void {
    this.refreshSubscription = this.documentService.addOrDeleteEvent.subscribe(
      () => this.getFolderTree()
    );
    this.getFolderTree();
    this.newFolderForm = new FormGroup({
      path: new FormControl('', [
        Validators.required,
        Validators.pattern(validFolderName),
      ]),
    });

    this.folderDeletedSub = this.folderService.folderDeleted.subscribe(
      (path) => {
        path ? this.getFolderTree(path) : this.getFolderTree();
      }
    );
  }

  getFolderTree(newPath?: string) {
    this.folderService.getFolderTree('/').subscribe((res) => {
      this.saveExpandedNodes();
      this.dataSource.data = [res];
      this.restoreExpandedNodes();
      newPath && this.folderService.setCurrentFolder(newPath);
    });
  }

  saveExpandedNodes() {
    this.expandedNodes = new Array<FlatTreeNode>();
    this.treeControl.dataNodes.forEach((node) => {
      if (
        (node.expandable && this.treeControl.isExpanded(node)) ||
        node.name === this.folderService.getCurrentPath()
      ) {
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
      this.getFolderTree();
    });
  }

  onHoverIn(node: any) {
    this.folderOptionsService.node = node;
  }

  onHoverOut() {
    this.folderOptionsService.hoveredNodeChanged.next(null);
  }
}
