import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { concat, Observable, of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { FavoritesService } from '../services/favorites.service';
import { CharacterPreview, Episode, PortalService } from '../services/portal.service';

interface EpisodeState {
  loading: boolean;
  episode?: Episode;
  errorMessage?: string;
}

@Component({
  selector: 'app-episode-details',
  templateUrl: './episode-details.component.html',
  styleUrls: ['./episode-details.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EpisodeDetailsComponent {
  readonly state$: Observable<EpisodeState> = this.route.paramMap.pipe(
    map(params => params.get('id')),
    switchMap(id => concat(
      of({ loading: true } as EpisodeState),
      id ? this.portalService.getEpisode(id).pipe(
        map(episode => ({ loading: false, episode } as EpisodeState)),
        catchError(() => of({ loading: false, errorMessage: 'That episode could not be found.' } as EpisodeState))
      ) : of({ loading: false, errorMessage: 'No episode was selected.' } as EpisodeState)
    ))
  );

  constructor(
    private readonly route: ActivatedRoute,
    private readonly portalService: PortalService,
    private readonly favoritesService: FavoritesService
  ) {}

  toggleSaved(id: string): void {
    this.favoritesService.toggleEpisode(id);
  }

  isSaved(id: string): boolean {
    return this.favoritesService.isEpisodeSaved(id);
  }

  retry(): void {
    window.location.reload();
  }

  trackCharacter(index: number, character: CharacterPreview): string {
    return character.id;
  }
}
