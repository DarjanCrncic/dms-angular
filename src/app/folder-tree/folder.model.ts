export class Folder {
    id: string;
    creationDate: Date;
    modifyDate: Date;

    path: string;
    parentFolder: Folder;
    subFolders: Folder[];

    // documents: Document[];

    constructor(
        id: string,
        creationDate: Date,
        modifyDate: Date,
        path: string,
        parentFolder: Folder,
        subFolders: Folder[]
    ) {
        this.id = id;
        this.creationDate = creationDate;
        this.modifyDate = modifyDate;
        this.path = path;
        this.parentFolder = parentFolder;
        this.subFolders = subFolders;
    }
}
