import { Injectable } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface PageInfo {
  count: number;
  pages: number;
  next: number | null;
  prev: number | null;
}

export interface NamedPlace {
  id: string | null;
  name: string;
}

export interface EpisodeSummary {
  id: string;
  name: string;
  airDate: string;
  episode: string;
}

export interface CharacterPreview {
  id: string;
  name: string;
  status: string;
  species: string;
  type: string;
  gender: string;
  image: string;
  origin: NamedPlace;
  location: NamedPlace;
}

export interface Character extends CharacterPreview {
  episode: EpisodeSummary[];
}

export interface CharacterConnection {
  info: PageInfo;
  results: CharacterPreview[];
}

export interface Episode {
  id: string;
  name: string;
  airDate: string;
  episode: string;
  characters: CharacterPreview[];
}

export interface CharacterFilter {
  name?: string;
  status?: string;
  species?: string;
}

interface CharactersQuery {
  characters: CharacterConnection;
}

interface CharacterQuery {
  character: Character | null;
}

interface EpisodeQuery {
  episode: Episode | null;
}

interface SavedCharactersQuery {
  charactersByIds: CharacterPreview[];
}

interface SavedEpisodesQuery {
  episodesByIds: Episode[];
}

const previewFields = gql`
  fragment CharacterPreviewFields on Character {
    id
    name
    status
    species
    type
    gender
    image
    origin { id name }
    location { id name }
  }
`;

const charactersDocument = gql`
  query Characters($page: Int, $filter: FilterCharacter) {
    characters(page: $page, filter: $filter) {
      info { count pages next prev }
      results {
        id
        name
        status
        species
        image
        location { name }
      }
    }
  }
`;

const characterDocument = gql`
  query CharacterDetails($id: ID!) {
    character(id: $id) {
      ...CharacterPreviewFields
      episode { id name airDate: air_date episode }
    }
  }
  ${previewFields}
`;

const episodeDocument = gql`
  query EpisodeDetails($id: ID!) {
    episode(id: $id) {
      id
      name
      airDate: air_date
      episode
      characters { ...CharacterPreviewFields }
    }
  }
  ${previewFields}
`;

const savedCharactersDocument = gql`
  query SavedCharacters($ids: [ID!]!) {
    charactersByIds(ids: $ids) { ...CharacterPreviewFields }
  }
  ${previewFields}
`;

const savedEpisodesDocument = gql`
  query SavedEpisodes($ids: [ID!]!) {
    episodesByIds(ids: $ids) {
      id
      name
      airDate: air_date
      episode
      characters { id }
    }
  }
`;

@Injectable({ providedIn: 'root' })
export class PortalService {
  constructor(private readonly apollo: Apollo) {}

  searchCharacters(page: number, filter: CharacterFilter): Observable<CharacterConnection> {
    return this.apollo.query<CharactersQuery>({
      query: charactersDocument,
      variables: { page, filter },
      fetchPolicy: 'cache-first'
    }).pipe(map(result => result.data.characters));
  }

  getCharacter(id: string): Observable<Character | undefined> {
    return this.apollo.query<CharacterQuery>({
      query: characterDocument,
      variables: { id },
      fetchPolicy: 'cache-first'
    }).pipe(map(result => result.data.character || undefined));
  }

  getEpisode(id: string): Observable<Episode> {
    return this.apollo.query<EpisodeQuery>({
      query: episodeDocument,
      variables: { id },
      fetchPolicy: 'cache-first'
    }).pipe(map(result => {
      if (!result.data.episode) {
        throw new Error('Episode not found');
      }
      return result.data.episode;
    }));
  }

  getCharactersByIds(ids: string[]): Observable<CharacterPreview[]> {
    return this.apollo.query<SavedCharactersQuery>({
      query: savedCharactersDocument,
      variables: { ids },
      fetchPolicy: 'cache-first'
    }).pipe(map(result => result.data.charactersByIds || []));
  }

  getEpisodesByIds(ids: string[]): Observable<Episode[]> {
    return this.apollo.query<SavedEpisodesQuery>({
      query: savedEpisodesDocument,
      variables: { ids },
      fetchPolicy: 'cache-first'
    }).pipe(map(result => result.data.episodesByIds || []));
  }
}
