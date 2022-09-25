export class Document {
  private id: string;
  private object_name: string;
  private creation_date: Date;
  private modify_date: Date;

  constructor(id: string, object_name: string, creation_date: Date, modify_date: Date) {
    this.id = id;
    this.object_name = object_name;
    this.creation_date = creation_date;
    this.modify_date = modify_date;
  }

  public getId(): string {
    return this.id;
  }
}

export interface DocumentDTO {
  id: string;
  object_name: string;
  creation_date: Date;
  modify_date: Date;
  keywords: string[];
  description: string;
  parent_folder: string;
  version: string;
  immutable: boolean;
  branched: boolean;
  type: string;
  root_id: string;
  predecessor_id: string;
  content: ContentDTO;
}
export interface ContentDTO {
  content_size: number;
  content_type: string;
  original_file_name: string;
}

export interface ModifyDocumentDTO {
  id: string;
  object_name: string;
  keywords: string[];
  description: string;
  type: string;
}

export interface NewDocumentDTO {
  object_name: string;
  keywords: string[];
  description: string;
  type: string;
  parent_folder: string;
}
