import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { concat, Observable, of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { FavoritesService } from '../services/favorites.service';
import { Character, EpisodeSummary, PortalService } from '../services/portal.service';

interface CharacterState {
  loading: boolean;
  character?: Character;
  errorMessage?: string;
}

@Component({
  selector: 'app-character-details',
  templateUrl: './character-details.component.html',
  styleUrls: ['./character-details.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CharacterDetailsComponent {
  readonly state$: Observable<CharacterState> = this.route.paramMap.pipe(
    map(params => params.get('id')),
    switchMap(id => concat(
      of({ loading: true } as CharacterState),
      id ? this.portalService.getCharacter(id).pipe(
        map(character => ({ loading: false, character } as CharacterState)),
        catchError(() => of({ loading: false, errorMessage: 'This character slipped into another dimension.' } as CharacterState))
      ) : of({ loading: false, errorMessage: 'No character was selected.' } as CharacterState)
    ))
  );

  constructor(
    private readonly route: ActivatedRoute,
    private readonly portalService: PortalService,
    private readonly favoritesService: FavoritesService
  ) {}

  toggleSaved(id: string): void {
    this.favoritesService.toggleCharacter(id);
  }

  isSaved(id: string): boolean {
    return this.favoritesService.isCharacterSaved(id);
  }

  retry(): void {
    window.location.reload();
  }

  trackEpisode(index: number, episode: EpisodeSummary): string {
    return episode.id;
  }
}
