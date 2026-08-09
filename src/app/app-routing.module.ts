import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CharacterDetailsComponent } from './character-details/character-details.component';
import { CharacterExplorerComponent } from './character-explorer/character-explorer.component';
import { EpisodeDetailsComponent } from './episode-details/episode-details.component';
import { SavedComponent } from './saved/saved.component';

const routes: Routes = [
  {
    path: '',
    component: CharacterExplorerComponent
  },
  {
    path: 'characters/:id',
    component: CharacterDetailsComponent
  },
  {
    path: 'episodes/:id',
    component: EpisodeDetailsComponent
  },
  {
    path: 'saved',
    component: SavedComponent
  },
  {
    path: '**',
    redirectTo: ''
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
