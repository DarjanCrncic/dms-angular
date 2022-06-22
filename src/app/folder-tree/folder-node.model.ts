export interface FolderNode {
  path: string;
  subfolders: FolderNode[];
  num_of_documents: number;
  id: string;
}