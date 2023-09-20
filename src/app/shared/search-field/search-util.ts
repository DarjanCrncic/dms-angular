export enum SearchClasses {
    DOCUMENT,
    USER,
    GROUP
}

export class SearchUtil {
    private static defaultFields: Map<SearchClasses, string[]> = new Map();

    static {
        this.defaultFields.set(SearchClasses.DOCUMENT, ['objectName', 'creator', 'type', 'description']);
        this.defaultFields.set(SearchClasses.USER, ['firstName', 'lastName', 'email', 'username']);
        this.defaultFields.set(SearchClasses.GROUP, ['groupName', 'description'])
    }

    public static buildSearch(v: string, searchClass: SearchClasses, fields?: string[]): string {
        if (!v) return '';
        fields = fields ?? this.defaultFields.get(searchClass);

        return fields ? '(' + fields.join(`~LIKE~${v}~OR~`) + `~LIKE~${v})` : '';
    }
}
