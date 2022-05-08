import { Component, Input, OnInit } from '@angular/core';
import { FolderService } from '../folder-service';

@Component({
  selector: 'app-folder-tree-item',
  templateUrl: './folder-tree-item.component.html',
  styleUrls: ['./folder-tree-item.component.css'],
})
export class FolderTreeItemComponent implements OnInit {
  @Input() expanded = false;
  @Input() path = '';
  @Input() empty = true;

  constructor(private folderService: FolderService) {}

  ngOnInit(): void {}

  getFolderName(path: string) {
    const paths = path.split('/');
    return '/' + paths.pop();
  }

  handleFolderClick() {
    this.folderService.setCurrentFolder(this.path);
  }
}
