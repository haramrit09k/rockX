import { TestBed } from '@angular/core/testing';
import { Apollo } from 'apollo-angular';
import { of } from 'rxjs';
import { CharacterConnection, Episode, PortalService } from './portal.service';

describe('PortalService', () => {
  let service: PortalService;
  const apollo = jasmine.createSpyObj('Apollo', ['query']);
  const connection: CharacterConnection = {
    info: { count: 1, pages: 1, next: null, prev: null },
    results: [{
      id: '1',
      name: 'Rick Sanchez',
      status: 'Alive',
      species: 'Human',
      type: '',
      gender: 'Male',
      image: 'https://example.com/rick.jpeg',
      origin: { id: '1', name: 'Earth (C-137)' },
      location: { id: '3', name: 'Citadel of Ricks' }
    }]
  };
  const episode: Episode = {
    id: '1',
    name: 'Pilot',
    airDate: 'December 2, 2013',
    episode: 'S01E01',
    characters: connection.results
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [{ provide: Apollo, useValue: apollo }]
    });
    service = TestBed.inject(PortalService);
    apollo.query.calls.reset();
  });

  it('returns a filtered character connection from GraphQL', () => {
    apollo.query.and.returnValue(of({ data: { characters: connection } }));

    service.searchCharacters(1, { name: 'Rick' }).subscribe(result => {
      expect(result).toEqual(connection);
    });

    expect(apollo.query).toHaveBeenCalledWith(jasmine.objectContaining({
      fetchPolicy: 'cache-first',
      variables: { page: 1, filter: { name: 'Rick' } }
    }));
  });

  it('returns an episode and its nested cast', () => {
    apollo.query.and.returnValue(of({ data: { episode } }));

    service.getEpisode('1').subscribe(result => {
      expect(result.characters[0].name).toBe('Rick Sanchez');
    });
  });
});
