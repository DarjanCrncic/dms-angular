import { GroupsListComponent } from './groups-list/groups-list.component';
import { CanActivateChildDms } from './security/can-activate-child-guard';
import { CanActivateChildAdministration } from './security/can-activate-child-administration';
import { CanActivateAdministration } from './security/can-activate-administration';
import { AdministrationMenuComponent } from './administration-menu/administration-menu.component';
import { DocumentListComponent } from './document-list/document-list.component';
import { FolderTreeComponent } from './folder-tree/folder-tree.component';
import { CanActivateDms } from './security/can-activate-guard';
import { PageNotFoundComponent } from './shared/page-not-found/page-not-found.component';
import { DmsLoginPageComponent } from './dms-login-page/dms-login-page.component';
import { DmsWorkPageComponent } from './dms-work-page/dms-work-page.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UsersListComponent } from './users-list/users-list.component';
import { AdmininstrationSearchComponentComponent } from './admininstration-search-component/admininstration-search-component.component';

const routes: Routes = [
    { path: '', redirectTo: '/login', pathMatch: 'full' },
    {
        path: 'dms',
        component: DmsWorkPageComponent,
        pathMatch: 'full',
        canActivate: [CanActivateDms],
        children: [
            {
                path: '',
                component: FolderTreeComponent,
                outlet: 'sidenav'
            },
            {
                path: '',
                component: DocumentListComponent,
                outlet: 'content'
            }
        ]
    },
    {
        path: 'administration',
        canActivate: [CanActivateDms, CanActivateAdministration],
        canActivateChild: [CanActivateChildDms, CanActivateChildAdministration],
        children: [
            {
                path: 'users',
                component: DmsWorkPageComponent,
                children: [
                    {
                        path: '',
                        component: AdministrationMenuComponent,
                        outlet: 'sidenav'
                    },
                    {
                        path: '',
                        component: UsersListComponent,
                        outlet: 'content'
                    }
                ]
            },
            {
                path: 'groups',
                component: DmsWorkPageComponent,
                children: [
                    {
                        path: '',
                        component: AdministrationMenuComponent,
                        outlet: 'sidenav'
                    },
                    {
                        path: '',
                        component: GroupsListComponent,
                        outlet: 'content'
                    }
                ]
            },
            {
                path: 'advanced-search',
                component: DmsWorkPageComponent,
                children: [
                    {
                        path: '',
                        component: AdministrationMenuComponent,
                        outlet: 'sidenav'
                    },
                    {
                        path: '',
                        component: AdmininstrationSearchComponentComponent,
                        outlet: 'content'
                    }
                ]
            }
        ]
    },
    { path: 'login', component: DmsLoginPageComponent, pathMatch: 'full' },
    { path: '**', component: PageNotFoundComponent }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule {}
