import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { BehaviorSubject, concat, Observable, of } from 'rxjs';
import { catchError, debounceTime, distinctUntilChanged, map, startWith, switchMap } from 'rxjs/operators';
import { FavoritesService } from '../services/favorites.service';
import { CharacterConnection, CharacterPreview, PortalService } from '../services/portal.service';

interface ExplorerState {
  loading: boolean;
  data?: CharacterConnection;
  errorMessage?: string;
}

@Component({
  selector: 'app-character-explorer',
  templateUrl: './character-explorer.component.html',
  styleUrls: ['./character-explorer.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CharacterExplorerComponent {
  readonly searchForm = new FormGroup({
    name: new FormControl(''),
    status: new FormControl(''),
    species: new FormControl('')
  });
  readonly pageSubject = new BehaviorSubject<number>(1);
  readonly state$: Observable<ExplorerState>;

  constructor(
    private readonly portalService: PortalService,
    private readonly favoritesService: FavoritesService
  ) {
    const filter$ = this.searchForm.valueChanges.pipe(
      startWith(this.searchForm.value),
      debounceTime(350),
      map(value => ({
        name: value.name ? value.name.trim() : undefined,
        status: value.status || undefined,
        species: value.species || undefined
      })),
      distinctUntilChanged((previous, current) =>
        previous.name === current.name &&
        previous.status === current.status &&
        previous.species === current.species
      )
    );

    this.state$ = filter$.pipe(
      switchMap(filter => {
        if (this.pageSubject.value !== 1) {
          this.pageSubject.next(1);
        }

        return this.pageSubject.pipe(
          switchMap(page => concat(
            of({ loading: true } as ExplorerState),
            this.portalService.searchCharacters(page, filter).pipe(
              map(data => ({ loading: false, data } as ExplorerState)),
              catchError(() => of({
                loading: false,
                errorMessage: 'No residents matched, or the public portal is temporarily busy. Try a broader search in a moment.'
              } as ExplorerState))
            )
          ))
        );
      })
    );
  }

  changePage(page: number): void {
    this.pageSubject.next(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  toggleSaved(event: Event, id: string): void {
    event.preventDefault();
    event.stopPropagation();
    this.favoritesService.toggleCharacter(id);
  }

  isSaved(id: string): boolean {
    return this.favoritesService.isCharacterSaved(id);
  }

  trackById(index: number, character: CharacterPreview): string {
    return character.id;
  }
}
