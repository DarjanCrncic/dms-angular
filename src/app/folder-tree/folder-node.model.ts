export interface FolderNode {
  name: string;
  subfolders: FolderNode[];
  parent_folder_id: string;
  num_of_documents: number;
  id: string;
}
