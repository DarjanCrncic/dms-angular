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
  content: {
    content_size: number,
    content_type: string,
    original_file_name: string
  }
}