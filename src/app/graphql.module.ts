import { NgModule } from '@angular/core';
import { APOLLO_OPTIONS } from 'apollo-angular';
import { HttpLink } from 'apollo-angular/http';
import { ApolloClientOptions, InMemoryCache } from '@apollo/client/core';

export function createApollo(httpLink: HttpLink): ApolloClientOptions<unknown> {
  return {
    link: httpLink.create({ uri: 'https://rickandmortyapi.com/graphql' }),
    cache: new InMemoryCache()
  };
}

@NgModule({
  providers: [
    {
      provide: APOLLO_OPTIONS,
      useFactory: createApollo,
      deps: [HttpLink]
    }
  ]
})
export class GraphQLModule {}
