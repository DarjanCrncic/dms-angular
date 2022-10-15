import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
    selector: 'app-administration-menu',
    templateUrl: './administration-menu.component.html',
    styleUrls: ['./administration-menu.component.css']
})
export class AdministrationMenuComponent {
    menuItems = [
        {
            path: '/administration/users',
            title: 'Users'
        },
        {
            path: '/administration/items',
            title: 'Items'
        },
        {
            path: '/administration/advanced-search',
            title: 'Advanced Search'
        }
    ];

    constructor(private router: Router) {}

    isCurrentlyActive(path: string) {
        return this.router.url == path;
    }
}
