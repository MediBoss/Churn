
// Import required libraries
import express from 'express';
import { ApolloServer } from 'apollo-server-express';

// Cors is needed to make HTTP requests to other domains
import cors from 'cors';

// Create an instance of the express server
const app = express();
app.use(cors());

// NOTE: The exclamation point after ID and String means they're non-nullable values.
// NOTE: The ID data type is an identifier used for caching & fetching.
// NOTE: "type" here is like "class" in Swift.
const schema = gql `
  type Query {
    me: User
    user(id: ID!): User
  }

  type User {
    id: ID!
    username: String!
  }
`;

let users = {
  1: {
    id: '1',
    username: 'Medi Boss', },
  2: {
    id: '2',
    username: 'Dave Davids', },
};

const me = users[1];

// NOTE: The resolver takes care of returning data for fields from the schema.
const resolvers = {
  Query: {
    user: (parent, { id }) => {
      return users[id];
    },

    me: () => {
      return me;
    },
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