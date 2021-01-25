
// Import required libraries
import express from 'express';
import { ApolloServer } from 'apollo-server-express';

// Create an instance of the express server
const app = express();


const schema = gql `
  type Query {
    med: User
  }

  type User {
    username: String!
  }
`
const resolvers = {
  Query: {
    me: () => {
      return {
        username: "MediBoss"
      }
    }
  }
}

const server = new ApolloServer({
  typeDefs: schema,
  resolvers,
});

// Using applyMiddleware to to set our express app as our middleware
server.applyMiddleware({ app, path: '/graphql' });

app.listen({ port: 8000 }, () => {
  console.log('Apollo Server on http://localhost:8000/graphql');
});