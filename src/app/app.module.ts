import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';


import { AppComponent } from './app.component';
import { MatAutocompleteModule } from "@angular/material/autocomplete";
import { MatButtonModule } from "@angular/material/button";
import { MatCardModule } from "@angular/material/card";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIcon, MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { MatListModule } from "@angular/material/list";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { MatSidenavModule } from "@angular/material/sidenav";
import { MatSlideToggleModule } from "@angular/material/slide-toggle";
import { MatToolbarModule } from "@angular/material/toolbar";

import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import { SideBarComponent } from './side-bar/side-bar.component';
import { MainPageComponent } from './main-page/main-page.component';
import {RouterModule} from "@angular/router";
import {AuthService} from "./services/auth.service";
import {PageNotFoundComponent} from "./page-not-found/page-not-found.component";
import {MovieInfoComponent} from "./movie-info/movie-info.component";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {HttpClientModule} from "@angular/common/http";
import {HttpService} from "./services/http.service";
import { FavoritesComponent } from './favorites/favorites.component';
import { RegistrationComponent } from './registration/registration.component';
import {SearchListComponent} from "./search-list/search-list.component";
import { MovieListComponent } from './movie-list/movie-list.component';
import {DataService} from "./services/data.service";
import {AuthGuard} from "./favorites/auth.guard";
import {LocalStorageService} from "./services/local-storage.service";
import {LocalStorageBlockGuard} from "./registration/local-storage-block.guard";
import {ScrollingModule} from '@angular/cdk/scrolling';
import {InfiniteScrollModule} from 'ngx-infinite-scroll';


const routes = [
  {path: "movie/:id", component: MovieInfoComponent},
  {path: "search", component: MainPageComponent, children: [
      {path: "", component: SearchListComponent}
    ]},
  {path: "favorite/:username", component: FavoritesComponent, canActivate: [AuthGuard]},
  {path: "registration", component: RegistrationComponent, canActivate: [LocalStorageBlockGuard]},
  {path: "", redirectTo: "/search", pathMatch: "full"},
  {path: "**", component: PageNotFoundComponent}
];


@NgModule({
  declarations: [
    AppComponent,
    SideBarComponent,
    MainPageComponent,
    MovieInfoComponent,
    PageNotFoundComponent,
    RegistrationComponent,
    FavoritesComponent, MovieListComponent, SearchListComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forRoot(routes),
    BrowserAnimationsModule,
    MatToolbarModule,
    MatSidenavModule,
    MatSlideToggleModule,
    MatInputModule,
    MatFormFieldModule,
    MatIconModule,
    MatAutocompleteModule,
    MatButtonModule,
    MatListModule,
    MatCardModule,
    MatProgressSpinnerModule,
    ScrollingModule,
    InfiniteScrollModule
  ],
  providers: [AuthService, HttpService, DataService, AuthGuard, LocalStorageService, LocalStorageBlockGuard],
  bootstrap: [AppComponent]
})
export class AppModule { }
