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
  public currentlySelected: boolean = false;

  constructor(private folderService: FolderService) {}

  ngOnInit(): void {
    this.folderService.currentFolderChanged.subscribe(newPath => {
      this.currentlySelected = newPath === this.path;
    });
  }

  getFolderName(path: string) {
    const paths = path.split('/');
    return '/' + paths.pop();
  }

  handleFolderClick() {
    this.folderService.setCurrentFolder(this.path);
  }

}
