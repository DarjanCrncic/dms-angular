import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-folder-tree-item',
  templateUrl: './folder-tree-item.component.html',
  styleUrls: ['./folder-tree-item.component.css'],
})
export class FolderTreeItemComponent implements OnInit {
  @Input() expanded = false;
  @Input() path = '';

  constructor() {}

  ngOnInit(): void {}

  getFolderName(path: string) {
    const paths = path.split('/');
    return '/' + paths.pop();
  }
}
