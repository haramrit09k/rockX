import { FavoritesService } from './favorites.service';

describe('FavoritesService', () => {
  let service: FavoritesService;

  beforeEach(() => {
    localStorage.clear();
    service = new FavoritesService();
  });

  it('toggles a character in browser-local favorites', () => {
    service.toggleCharacter('47');
    expect(service.isCharacterSaved('47')).toBeTrue();

    service.toggleCharacter('47');
    expect(service.isCharacterSaved('47')).toBeFalse();
  });

  it('keeps episode favorites separate from character favorites', () => {
    service.toggleEpisode('11');
    expect(service.isEpisodeSaved('11')).toBeTrue();
    expect(service.isCharacterSaved('11')).toBeFalse();
  });
});
