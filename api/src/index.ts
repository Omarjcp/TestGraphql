import { ApolloServer } from 'apollo-server-express'
import { ApolloServerPluginDrainHttpServer } from 'apollo-server-core'
import express from 'express'
import http from 'http'
import path from 'path'
import { PrismaClient } from '@prisma/client'
import { readFileSync } from 'fs'
import resolvers from './resolvers'

const typeDefs = readFileSync(
  path.join(__dirname, './graphql/schema.graphql'),
  'utf8'
)
const orm = new PrismaClient()
const port = 4000

!(async function () {
  const app = express()
  const httpServer = http.createServer(app)

  app.use('/static', express.static(path.join(__dirname, '../public')))

  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: {
      orm,
    },
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
  })

  await server.start()
  server.applyMiddleware({
    app,
    path: '/graphql',
  })

  await new Promise<void>((resolve) => httpServer.listen({ port }, resolve))
  console.log(`Server ready at http://localhost:${port + server.graphqlPath}`)
})()
