export class FolderNode {
  path: string;
  subfolders: FolderNode[];
  
  constructor(path: string, subfolders: FolderNode[]) {
    this.path = path;
    this.subfolders = subfolders;
  }
}