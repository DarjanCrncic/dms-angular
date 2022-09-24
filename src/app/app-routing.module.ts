import { AdministrationMenuComponent } from './administration-menu/administration-menu.component';
import { DocumentListComponent } from './document-list/document-list.component';
import { FolderTreeComponent } from './folder-tree/folder-tree.component';
import { CanActivateDms } from './security/can-activate-guard';
import { PageNotFoundComponent } from './shared/page-not-found/page-not-found.component';
import { DmsLoginPageComponent } from './dms-login-page/dms-login-page.component';
import { DmsWorkPageComponent } from './dms-work-page/dms-work-page.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

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
    canActivate: [CanActivateDms],
    children: [
      {
        path: 'users',
        component: DmsWorkPageComponent,
        canActivate: [CanActivateDms],
        children: [
          {
            path: '',
            component: AdministrationMenuComponent,
            outlet: 'sidenav'
          },
          {
            path: '',
            component: DocumentListComponent,
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
