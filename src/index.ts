import Hapi from '@hapi/hapi'
import prisma from '../prisma/plugins/prisma'
import users from '../prisma/plugins/users'
import posts from '../prisma/plugins/posts'
import providers from '../prisma/plugins/providers'

const server: Hapi.Server = Hapi.server({
  port: process.env.PORT || 3000,
  host: process.env.HOST || 'localhost',
})

export async function start(): Promise<Hapi.Server> {
  await server.register([prisma])
  await server.register([users, posts, providers])
  await server.start()
  return server
}

process.on('unhandledRejection', async (err) => {
  await server.app.prisma.$disconnect()
  console.log(err)
  process.exit(1)
})

start()
  .then((server) => {
    console.log(`
🚀 Server ready at: ${server.info.uri}
⭐️ See sample requests: http://pris.ly/e/ts/rest-hapi#3-using-the-rest-api
`)
  })
  .catch((err) => {
    console.log(err)
  })