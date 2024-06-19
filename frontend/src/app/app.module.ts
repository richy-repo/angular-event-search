import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { FavoriteComponent } from './favorite/favorite.component';
import { SearchComponent } from './search/search.component';
import { DetailComponent } from './detail/detail.component';
import {MatTabsModule} from '@angular/material/tabs';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { VenueComponent } from './venue/venue.component';
import { ArtistComponent } from './artist/artist.component';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { GoogleMapsModule } from '@angular/google-maps'

@NgModule({
  declarations: [
    AppComponent,
    FavoriteComponent,
    SearchComponent,
    DetailComponent,
    VenueComponent,
    ArtistComponent
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot([
      {path: '', component: SearchComponent},
      {path: 'favorite', component: FavoriteComponent},
    ]),
    MatTabsModule,
    BrowserAnimationsModule,
    MatProgressSpinnerModule,
    FormsModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    MatAutocompleteModule,
    ReactiveFormsModule,
    GoogleMapsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
