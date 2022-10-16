import { DragDropModule } from '@angular/cdk/drag-drop';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatTreeModule } from '@angular/material/tree';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DmsAdministrationPageComponent } from './dms-administration-page/dms-administration-page.component';
import { DmsLoginPageComponent } from './dms-login-page/dms-login-page.component';
import { DmsWorkPageComponent } from './dms-work-page/dms-work-page.component';
import { DocumentActionsComponent } from './document-list/document-actions/document-actions.component';
import {
    DocumentColumnDialogComponent,
    DocumentColumnSelectComponent
} from './document-list/document-column-select/document-column-select.component';
import { DocumentFormDialogComponent } from './document-list/document-form-dialog/document-form-dialog';
import { DocumentListComponent } from './document-list/document-list.component';
import { FolderTreeItemComponent } from './folder-tree/folder-tree-item/folder-tree-item.component';
import { FolderTreeComponent } from './folder-tree/folder-tree.component';
import { HeaderComponent } from './header/header.component';
import { AuthInterceptor } from './interceptors/basic-auth.interceptor';
import { ErrorInterceptor } from './interceptors/error-interceptor';
import { JwtInterceptor } from './interceptors/jwt-auth-interceptor';
import { ContentHeaderComponent } from './shared/content-header/content-header.component';
import { GrantRightsDialogComponent } from './shared/grant-rights-dialog/grant-rights-dialog.component';
import { PermissionRowComponent } from './shared/grant-rights-dialog/permission-row/permission-row.component';
import { MessageSnackbarComponent } from './shared/message-snackbar/message-snackbar.component';
import { PageNotFoundComponent } from './shared/page-not-found/page-not-found.component';
import { RenameDialogComponent } from './shared/rename-dialog/rename-dialog.component';
import { VersionTreeDialogComponent } from './shared/version-tree-dialog/version-tree-dialog.component';
import { AdministrationMenuComponent } from './administration-menu/administration-menu.component';
import { UsersListComponent } from './users-list/users-list.component';
import { SearchFieldComponent } from './shared/search-field/search-field.component';
import { AdmininstrationSearchComponentComponent } from './admininstration-search-component/admininstration-search-component.component';
import { UsersFormDialogComponent } from './users-list/users-form-dialog/users-form-dialog.component';
import { UsersActionsComponent } from './users-list/users-actions/users-actions.component';
import { GroupsListComponent } from './groups-list/groups-list.component';
import { GroupsActionsComponent } from './groups-list/groups-actions/groups-actions.component';
import { GroupsFormDialogComponent } from './groups-list/groups-form-dialog/groups-form-dialog.component';
import { GroupsMembersDialogComponent } from './groups-list/groups-members-dialog/groups-members-dialog.component';

@NgModule({
    declarations: [
        AppComponent,
        HeaderComponent,
        FolderTreeComponent,
        FolderTreeItemComponent,
        DocumentListComponent,
        ContentHeaderComponent,
        DocumentColumnSelectComponent,
        DocumentColumnDialogComponent,
        DocumentFormDialogComponent,
        MessageSnackbarComponent,
        DmsWorkPageComponent,
        DmsLoginPageComponent,
        PageNotFoundComponent,
        GrantRightsDialogComponent,
        DocumentActionsComponent,
        PermissionRowComponent,
        RenameDialogComponent,
        DmsAdministrationPageComponent,
        VersionTreeDialogComponent,
        AdministrationMenuComponent,
        UsersListComponent,
        SearchFieldComponent,
        AdmininstrationSearchComponentComponent,
        UsersFormDialogComponent,
        UsersActionsComponent,
        GroupsListComponent,
        GroupsActionsComponent,
        GroupsFormDialogComponent,
        GroupsMembersDialogComponent
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
        MatMenuModule
    ],
    providers: [
        {
            provide: HTTP_INTERCEPTORS,
            useClass: AuthInterceptor,
            multi: true
        },
        {
            provide: HTTP_INTERCEPTORS,
            useClass: ErrorInterceptor,
            multi: true
        },
        {
            provide: HTTP_INTERCEPTORS,
            useClass: JwtInterceptor,
            multi: true
        }
    ],
    bootstrap: [AppComponent],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule {}
