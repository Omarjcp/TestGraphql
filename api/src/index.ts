import { ApolloServer } from 'apollo-server'

//query

const typeDefs = `
type Query {
    info: String!
}
`

//resolvers
const resolvers = {
  Query: {
    info: () => `This is the API`,
  },
}

// iniciar servidor
const server = new ApolloServer({
  typeDefs,
  resolvers,
})

server.listen().then(({ url }) => console.log(`Server is runnin on ${url}`))
