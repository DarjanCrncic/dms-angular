import { filter, Subject } from 'rxjs';
import { FolderService } from './folder-service';
import { FolderNode } from './folder-node.model';
import { FlatTreeControl } from '@angular/cdk/tree';
import { Injectable } from '@angular/core';
import {
  MatTreeFlatDataSource,
  MatTreeFlattener,
} from '@angular/material/tree';

export interface FlatTreeNode {
  id: string;
  expandable: boolean;
  name: string;
  parent_folder_id: string;
  level: number;
  empty: boolean;
}

@Injectable({ providedIn: 'root' })
export class FolderTreeService {
  treeControl = new FlatTreeControl<FlatTreeNode>(
    (node) => node.level,
    (node) => node.expandable
  );

  private _transformer = (node: FolderNode, level: number) => {
    return {
      expandable: node.subfolders.length > 0,
      id: node.id,
      name: node.name,
      parent_folder_id: node.parent_folder_id,
      level: level,
      empty: node.subfolders.length === 0 && node.num_of_documents === 0,
    };
  };

  treeFlattener = new MatTreeFlattener(
    this._transformer,
    (node) => node.level,
    (node) => node.expandable,
    (node) => node.subfolders
  );

  _dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);
  expandedNodes: FlatTreeNode[] = [];
  originalFolderData: FolderNode[] = [];
  private selectedFolderId: string = '';
  selectedFolderChanged: Subject<FolderNode> = new Subject();

  constructor(private folderService: FolderService) {
    this._dataSource.data = [];
  }

  get dataSource() {
    return this._dataSource;
  }

  setCurrentFolder(id: string) {
    const current = this.originalFolderData.find(folder => folder.id === id);
    if (!current) return;
    this.selectedFolderId = current.id;
    this.selectedFolderChanged.next(current);
    this.saveDataToLocal();
  }

  getCurrentFolder() {
    const current = this.originalFolderData.find(folder => folder.id === this.selectedFolderId);
    return current;
  }

  getFolderTree(newId?: string) {
    this.folderService.getFolderTree().subscribe((res) => {
      this.originalFolderData = res;
      this._dataSource.data = this.transformFlatToTree(res);

      this.setCurrentToRoot();
      this.restoreFromLocal();
      newId && this.setCurrentFolder(newId);
    });
  }

  saveExpandedNodes() {
    this.expandedNodes = new Array<FlatTreeNode>();
    this.treeControl.dataNodes.forEach((node) => {
      if (
        (node.expandable && this.treeControl.isExpanded(node)) ||
        node.id === this.selectedFolderId
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

  updateNode(id: string, node: FolderNode) {
    const index = this.originalFolderData.findIndex((s) => s.id === node.id);
    this.originalFolderData[index].name = node.name;

    this.refreshTree();
    this.expandById(node.id);
  }

  addNodeToTree(parent: FlatTreeNode, newData: FolderNode) {
    newData.num_of_documents = 0;
    newData.subfolders = [];
    this.originalFolderData.push(newData);

    const parentNode = this.originalFolderData.find(
      (node) => node.id === parent.id
    );
    if (!parentNode) throw new Error("Can't find parent node.");

    this.refreshTree();
    this.expandById(parentNode.id);
  }

  expandById(id: string) {
    const node = this.treeControl.dataNodes.find((node) => node.id === id);
    if (node) this.treeControl.expand(node);
  }

  refreshTree() {
    this.saveExpandedNodes();
    this._dataSource.data = this.transformFlatToTree(this.originalFolderData);
    this.restoreExpandedNodes();
  }

  transformFlatToTree(nodes: FolderNode[]): FolderNode[] {
    const rootNode = nodes.find((node) => node.name === '/');
    if (!rootNode) throw new Error('Root node not found.');

    this._getChildNodesRecursive(rootNode);
    return [rootNode];
  }

  _getChildNodesRecursive(parent: FolderNode) {
    parent.subfolders = this.originalFolderData.filter(
      (node) => node.parent_folder_id === parent.id
    );
    parent.subfolders.forEach((child) => this._getChildNodesRecursive(child));
  }

  setCurrentToRoot() {
    const root = this.originalFolderData.find(folder => folder.name === '/');
    if (root) this.selectedFolderId = root.id;
  }

  removeNode(id: string) {
    const node = this.originalFolderData.find((s) => s.id === id);
    if (!node) return;

    this.setCurrentFolder(node.parent_folder_id);
    this.filterChildrenRec(id);

    this.refreshTree();
  }

  private filterChildrenRec(parentId: string) {
    const children = this.originalFolderData.filter(folder => folder.parent_folder_id === parentId);
    children.forEach(child => this.filterChildrenRec(child.id));

    this.originalFolderData = this.originalFolderData.filter(folder => folder.id !== parentId);
  }

  saveDataToLocal() {
    this.saveExpandedNodes();
    localStorage.setItem(LS_FOLDER_TREE, JSON.stringify(this.expandedNodes));
    localStorage.setItem(LS_CURRENT_FOLDER, this.selectedFolderId);
  }

  restoreFromLocal() {
    const localTree = localStorage.getItem(LS_FOLDER_TREE) ?? null;
    if (localTree) {
      this.expandedNodes = JSON.parse(localTree);
      this.restoreExpandedNodes();
    }

    const currentFolder = localStorage.getItem(LS_CURRENT_FOLDER);
    if (currentFolder) {
      this.setCurrentFolder(currentFolder);
    }
  }

  clearLocalData() {
    localStorage.removeItem(LS_CURRENT_FOLDER);
    localStorage.removeItem(LS_FOLDER_TREE);
  }
}

export const LS_FOLDER_TREE = 'folderTree';
export const LS_CURRENT_FOLDER = 'currentFolder';
