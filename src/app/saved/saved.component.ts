import { ChangeDetectionStrategy, Component } from '@angular/core';
import { combineLatest, Observable, of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { FavoritesService } from '../services/favorites.service';
import { CharacterPreview, Episode, PortalService } from '../services/portal.service';

interface SavedState {
  characters: CharacterPreview[];
  episodes: Episode[];
}

@Component({
  selector: 'app-saved',
  templateUrl: './saved.component.html',
  styleUrls: ['./saved.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SavedComponent {
  readonly state$: Observable<SavedState> = this.favoritesService.state$.pipe(
    switchMap(state => combineLatest([
      state.characters.length ? this.portalService.getCharactersByIds(state.characters) : of([]),
      state.episodes.length ? this.portalService.getEpisodesByIds(state.episodes) : of([])
    ])),
    map(([characters, episodes]) => ({ characters, episodes }))
  );

  constructor(
    private readonly favoritesService: FavoritesService,
    private readonly portalService: PortalService
  ) {}

  removeCharacter(id: string): void {
    this.favoritesService.toggleCharacter(id);
  }

  removeEpisode(id: string): void {
    this.favoritesService.toggleEpisode(id);
  }

  trackById(index: number, item: CharacterPreview | Episode): string {
    return item.id;
  }
}
