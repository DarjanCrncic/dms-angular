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
  public currentlySelected: boolean = false;

  private currentFolderChangedSub = new Subscription();

  constructor(
    private folderService: FolderService,
  ) {}

  ngOnInit(): void {
    this.currentlySelected = this.folderService.getCurrentPath() === this.path;
    this.currentFolderChangedSub = this.folderService.currentFolderChanged.subscribe((newPath) => {
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

  ngOnDestroy() {
    this.currentFolderChangedSub && this.currentFolderChangedSub.unsubscribe();
  }
}
