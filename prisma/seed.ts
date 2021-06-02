import { PrismaClient, Prisma } from '@prisma/client'

const prisma = new PrismaClient()
const userData: Prisma.UserCreateInput[] = [
  {
    name: 'John',
    email: 'john@mail.com',
    posts: {
      create: [
        {
          title: 'Title1',
          content: 'Some text',
          published: true,
        },
      ],
    },
  },
  {
    name: 'Jane',
    email: 'jane@mail.com',
    posts: {
      create: [
        {
          title: 'Title2',
          content: 'Another text',
          published: true,
        },
      ],
    },
  },
  {
    name: 'Alice',
    email: 'alice@mail.com',
    posts: {
      create: [
        {
          title: 'Title3',
          content: 'And another',
          published: true,
        },
        {
          title: 'Title4',
          content: 'And another once again',
        },
      ],
    },
  },
]

async function main() {
  console.log(`Наполнение БД фиктивными данными...`)
  for (const u of userData) {
    const user = await prisma.user.create({
      data: u,
    })
    console.log(`Пользователь с id ${user.id} успешно создан`)
  }
  console.log(`Наполнение БД данными закончено.`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })