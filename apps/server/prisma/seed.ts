import { PrismaClient, Prisma } from '@prisma/client';

const prisma = new PrismaClient();

const userData: Prisma.UserCreateInput[] = [
  {
    email: 'a@a.com',
    password: 'asdfasdf',
  },
  {
    email: 'c@c.com',
    password: 'asdfasdf',
  },
];

async function dropCollections() {
  await prisma.user.deleteMany();
  await prisma.collection.deleteMany();
  await prisma.link.deleteMany();
  await prisma.usersOnCollections.deleteMany();
}

async function main() {
  console.log(`Dropping Collections ...`);
  await dropCollections();
  console.log(`Start seeding ...`);

  for (const u of userData) {
    const user = await prisma.user.create({
      data: {
        ...u,
        collections: {
          create: [
            {
              role: 'CREATOR',
              collection: {
                create: {
                  name: `${u.email}'s collection`,
                },
              },
            },
          ],
        },
      },
    });

    console.log(`Created user with id: ${user.id}`);
  }
  console.log(`Seeding finished.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
