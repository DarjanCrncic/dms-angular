import { JwtInterceptor } from './interceptors/jwt-auth-interceptor';
import { DocumentFormDialog } from './document-list/document-form-dialog/document-form-dialog';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { ContentHeaderComponent } from './shared/content-header/content-header.component';
import { FolderTreeComponent } from './folder-tree/folder-tree.component';
import { AuthInterceptor } from './interceptors/basic-auth.interceptor';
import {
  DocumentColumnSelectComponent,
  DocumentColumnDialog,
} from './document-list/document-column-select/document-column-select.component';

import { BrowserModule } from '@angular/platform-browser';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatTreeModule } from '@angular/material/tree';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { FolderTreeItemComponent } from './folder-tree/folder-tree-item/folder-tree-item.component';
import { DocumentListComponent } from './document-list/document-list.component';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialogModule } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatListModule } from '@angular/material/list';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { ErrorInterceptor } from './interceptors/error-interceptor';
import { MessageSnackbarComponent } from './shared/message-snackbar/message-snackbar.component';
import { DmsWorkPageComponent } from './dms-work-page/dms-work-page.component';
import { DmsLoginPageComponent } from './dms-login-page/dms-login-page.component';
import { PageNotFoundComponent } from './shared/page-not-found/page-not-found.component';
import { MatMenuModule } from '@angular/material/menu';
import { GrantRightsDialogComponent } from './shared/grant-rights-dialog/grant-rights-dialog.component';
import { DocumentActionsComponent } from './document-list/document-actions/document-actions.component';
import { PermissionRowComponent } from './shared/grant-rights-dialog/permission-row/permission-row.component';
import { RenameDialogComponent } from './shared/rename-dialog/rename-dialog.component';
import { DmsAdministrationPageComponent } from './dms-administration-page/dms-administration-page.component';
@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FolderTreeComponent,
    FolderTreeItemComponent,
    DocumentListComponent,
    ContentHeaderComponent,
    DocumentColumnSelectComponent,
    DocumentColumnDialog,
    DocumentFormDialog,
    MessageSnackbarComponent,
    DmsWorkPageComponent,
    DmsLoginPageComponent,
    PageNotFoundComponent,
    GrantRightsDialogComponent,
    DocumentActionsComponent,
    PermissionRowComponent,
    RenameDialogComponent,
    DmsAdministrationPageComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    FormsModule,
    FlexLayoutModule,
    ReactiveFormsModule,

    MatToolbarModule,
    MatIconModule,
    MatTreeModule,
    MatProgressBarModule,
    MatSidenavModule,
    MatButtonModule,
    MatDividerModule,
    MatCardModule,
    MatProgressSpinnerModule,
    MatTableModule,
    MatSortModule,
    DragDropModule,
    MatCheckboxModule,
    MatDialogModule,
    MatTooltipModule,
    MatFormFieldModule,
    MatListModule,
    MatInputModule,
    MatSelectModule,
    MatSnackBarModule,
    MatMenuModule,
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ErrorInterceptor,
      multi: true,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: JwtInterceptor,
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
