
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
    companies: [Company!]

    funding(id: ID!): Funding!
    fundings: [Funding!]!
  },

  type Company {
    id: ID!
    name: String!
    ceo: String!
    location: String!
    employee_count: Int!
    is_hiring: Boolean
    fundings: [Funding]
  }

  type Funding {
    id: ID!
    round: String!
    amount: Int!
    company: Company
  }
`;

let companies = {
  1: {
    id: '1',
    name: 'Facebook Inc', 
    ceo: 'Mark Zuckeberg',
    location: 'Palo Alto, CA',
    employee_count: 12000,
    is_hiring: true,
    funding_ids: [356267]
  },

  2: {
    id: '2',
    name: 'Apple Inc', 
    ceo: 'Tim Cook',
    location: 'Cupertino, CA',
    employee_count: 3000,
    is_hiring: false,
    funding_ids: [836267]   
  },


  3: {
    id: '3',
    name: 'Betterment Inc', 
    ceo: 'Jon Stein',
    location: 'New York City, NY',
    employee_count: 500,
    is_hiring: true,
    funding_ids: [127673]   
  }
};

let fundings =  {

  1: {
    id: '127673',
    round: 'D',
    amount: 57000000,
    company_id: '3'
  },

  2: {
    id: '836267',
    round: 'A',
    amount: 2000000,
    company_id: '2'
  },

  3: {
    id: '356267',
    round: 'D',
    amount: 40000000,
    company_id: '1'
  }
}

const current_company = companies[1];

// NOTE: The resolver takes care of returning data for fields from the schema.
const resolvers = {
  Query: {

    // Fetch a single company
    company: (parent, { id }) => {
      return companies[id];
    },

    // Fetch the currently employed in company
    current_company: () => {
      return current;
    },

    // Fetch all the companies in the database
    companies: () => {
      return Object.values(companies);
    },

    // Fetch all the available company fundings
    fundings: () => {
      return Object.values(fundings);
    },

    funding: (parent, { id }) => {
      return fundings[id];
    },
  },

  Company: {
    fundings: company => {
      return Object.values(fundings).filter(
        funding => funding.company_id = company.id
      )
    }
  },

  Funding: {
    company: funding => {
      return companies[funding.company_id]
    }
  }
}

const server = new ApolloServer({
  typeDefs: schema,
  resolvers,
  context: {
    current_company: companies[1],
  },
});

// Using applyMiddleware to to set our express app as our middleware
server.applyMiddleware({ app, path: '/graphql' });

app.listen({ port: 3000 }, () => {
  console.log('Apollo Server on http://localhost:3000/graphql');
});