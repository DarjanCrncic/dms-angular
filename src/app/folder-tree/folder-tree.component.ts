import { FolderNode } from './folder-node.model';
import { FolderService } from './folder-service';
import { FlatTreeControl } from '@angular/cdk/tree';
import { Component, OnInit } from '@angular/core';
import {
  MatTreeFlatDataSource,
  MatTreeFlattener,
} from '@angular/material/tree';

/** Flat node with expandable and level information */
interface ExampleFlatNode {
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
  private _transformer = (node: FolderNode, level: number) => {
    return {
      expandable: !!node.subfolders && node.subfolders.length > 0,
      name: node.path,
      level: level,
      empty: node.subfolders.length === 0 && node.num_of_documents === 0
    };
  };

  treeControl = new FlatTreeControl<ExampleFlatNode>(
    (node) => node.level,
    (node) => node.expandable,
  );

  treeFlattener = new MatTreeFlattener(
    this._transformer,
    (node) => node.level,
    (node) => node.expandable,
    (node) => node.subfolders,
  );

  dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);

  constructor(private folderService: FolderService) {
    this.dataSource.data = [];
  }
  ngOnInit(): void {
    this.folderService.getFolderTree('/').subscribe((res) => {
      console.log(res);
      this.dataSource.data = [res];
      this.folderService.setCurrentFolder("/");
    });
  }

  hasChild = (_: number, node: ExampleFlatNode) => node.expandable;
}
