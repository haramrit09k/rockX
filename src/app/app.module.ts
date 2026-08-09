import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { GraphQLModule } from './graphql.module';
import { CharacterExplorerComponent } from './character-explorer/character-explorer.component';
import { CharacterDetailsComponent } from './character-details/character-details.component';
import { EpisodeDetailsComponent } from './episode-details/episode-details.component';
import { SavedComponent } from './saved/saved.component';

@NgModule({
  declarations: [
    AppComponent,
    CharacterExplorerComponent,
    CharacterDetailsComponent,
    EpisodeDetailsComponent,
    SavedComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    GraphQLModule,
    HttpClientModule,
    ReactiveFormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
