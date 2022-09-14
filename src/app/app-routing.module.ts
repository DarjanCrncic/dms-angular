import { CanActivateDms } from './security/can-activate-guard';
import { PageNotFoundComponent } from './shared/page-not-found/page-not-found.component';
import { DmsLoginPageComponent } from './dms-login-page/dms-login-page.component';
import { DmsWorkPageComponent } from './dms-work-page/dms-work-page.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DmsAdministrationPageComponent } from './dms-administration-page/dms-administration-page.component';

const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  {
    path: 'dms',
    component: DmsWorkPageComponent,
    pathMatch: 'full',
    canActivate: [CanActivateDms]
  },
  {
    path: 'administration',
    component: DmsAdministrationPageComponent,
    pathMatch: 'full',
    canActivate: [CanActivateDms]
  },
  { path: 'login', component: DmsLoginPageComponent, pathMatch: 'full' },
  { path: '**', component: PageNotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
