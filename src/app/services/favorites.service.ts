import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

interface FavoriteState {
  characters: string[];
  episodes: string[];
}

const storageKey = 'portal-search-favorites';

@Injectable({ providedIn: 'root' })
export class FavoritesService {
  private readonly stateSubject = new BehaviorSubject<FavoriteState>(this.readState());

  get state$(): Observable<FavoriteState> {
    return this.stateSubject.asObservable();
  }

  isCharacterSaved(id: string): boolean {
    return this.stateSubject.value.characters.includes(id);
  }

  isEpisodeSaved(id: string): boolean {
    return this.stateSubject.value.episodes.includes(id);
  }

  toggleCharacter(id: string): void {
    this.update('characters', id);
  }

  toggleEpisode(id: string): void {
    this.update('episodes', id);
  }

  private update(type: keyof FavoriteState, id: string): void {
    const current = this.stateSubject.value;
    const values = current[type].includes(id)
      ? current[type].filter(value => value !== id)
      : [...current[type], id];
    const next = { ...current, [type]: values };
    localStorage.setItem(storageKey, JSON.stringify(next));
    this.stateSubject.next(next);
  }

  private readState(): FavoriteState {
    try {
      const value = JSON.parse(localStorage.getItem(storageKey) || 'null') as FavoriteState | null;
      return value && Array.isArray(value.characters) && Array.isArray(value.episodes)
        ? value
        : { characters: [], episodes: [] };
    } catch (error) {
      return { characters: [], episodes: [] };
    }
  }
}
