
// Import required libraries
import express from 'express';
import { ApolloServer, gql } from 'apollo-server-express';

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
    current_company: Company
    company(id: ID!): Company
  }

  type Company {
    id: ID!
    name: String!
    ceo: String!
    location: String!
    employee_count: Int!
    is_hiring: Boolean
  }
`;

let companies = {
  1: {
    id: '1',
    name: 'Facebook Inc', 
    ceo: 'Mark Zuckeberg',
    location: 'Palo Alto, CA',
    employee_count: 12000,
    is_hiring: true  
  },

  2: {
    id: '2',
    name: 'Apple Inc', 
    ceo: 'Tim Cook',
    location: 'Cupertino, CA',
    employee_count: 3000,
    is_hiring: false  
  },


  3: {
    id: '3',
    name: 'Betterment Inc', 
    ceo: 'Jon Stein',
    location: 'New York City, NY',
    employee_count: 500,
    is_hiring: true  
  },

  4: {
    id: '4',
    name: 'Stride Health Inc', 
    ceo: 'Noah Lang',
    location: 'San Francisco, CA',
    employee_count: 40,
    is_hiring: true  
  },

  5: {
    id: '5',
    name: 'Square Inc', 
    ceo: 'Jack Dorsey',
    location: 'San Francisco, CA',
    employee_count: 900,
    is_hiring: false
  },
};

const current = companies[4];

// NOTE: The resolver takes care of returning data for fields from the schema.

const resolvers = {
  Query: {
    company: (parent, { id }) => {
      return companies[id];
    },

    current_company: () => {
      return current;
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