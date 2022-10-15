import { Subject } from 'rxjs';
import { Injectable } from '@angular/core';

interface TreeNode {
    expandable: boolean;
    id: string;
    name: string;
    level: number;
    empty: boolean;
}

@Injectable({ providedIn: 'root' })
export class FolderOptionsService {
    constructor() {}

    private _node: TreeNode | null = null;
    hoveredNodeChanged: Subject<TreeNode | null> = new Subject();

    set node(node: TreeNode) {
        this._node = node;
        this.hoveredNodeChanged.next(node);
    }

    getHoveredNode() {
        return this._node;
    }
}
