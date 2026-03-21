import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // Clear existing data
  await prisma.qualityLevel.deleteMany()
  await prisma.parameter.deleteMany()
  await prisma.game.deleteMany()

  // Create Cyberpunk 2077 game with parameters and quality levels
  const cyberpunk = await prisma.game.create({
    data: {
      name: 'Cyberpunk 2077',
      slug: 'cyberpunk-2077',
      coverImage: 'https://picsum.photos/seed/cyberpunk2077/800/450',
      parameters: {
        create: [
          {
            name: 'Shadows',
            slug: 'shadows',
            qualityLevels: {
              create: [
                {
                  level: 'Low',
                  imageUrl: 'https://picsum.photos/seed/cp2077-shadows-low/800/450',
                },
                {
                  level: 'Ultra',
                  imageUrl: 'https://picsum.photos/seed/cp2077-shadows-ultra/800/450',
                },
              ],
            },
          },
          {
            name: 'Textures',
            slug: 'textures',
            qualityLevels: {
              create: [
                {
                  level: 'Low',
                  imageUrl: 'https://picsum.photos/seed/cp2077-textures-low/800/450',
                },
                {
                  level: 'Ultra',
                  imageUrl: 'https://picsum.photos/seed/cp2077-textures-ultra/800/450',
                },
              ],
            },
          },
          {
            name: 'Anti-Aliasing',
            slug: 'anti-aliasing',
            qualityLevels: {
              create: [
                {
                  level: 'Low',
                  imageUrl: 'https://picsum.photos/seed/cp2077-aa-low/800/450',
                },
                {
                  level: 'Ultra',
                  imageUrl: 'https://picsum.photos/seed/cp2077-aa-ultra/800/450',
                },
              ],
            },
          },
        ],
      },
    },
  })

  // Create Red Dead Redemption 2 game with parameters and quality levels
  const rdr2 = await prisma.game.create({
    data: {
      name: 'Red Dead Redemption 2',
      slug: 'red-dead-redemption-2',
      coverImage: 'https://picsum.photos/seed/rdr2/800/450',
      parameters: {
        create: [
          {
            name: 'Shadows',
            slug: 'shadows',
            qualityLevels: {
              create: [
                {
                  level: 'Low',
                  imageUrl: 'https://picsum.photos/seed/rdr2-shadows-low/800/450',
                },
                {
                  level: 'Ultra',
                  imageUrl: 'https://picsum.photos/seed/rdr2-shadows-ultra/800/450',
                },
              ],
            },
          },
          {
            name: 'Textures',
            slug: 'textures',
            qualityLevels: {
              create: [
                {
                  level: 'Low',
                  imageUrl: 'https://picsum.photos/seed/rdr2-textures-low/800/450',
                },
                {
                  level: 'Ultra',
                  imageUrl: 'https://picsum.photos/seed/rdr2-textures-ultra/800/450',
                },
              ],
            },
          },
        ],
      },
    },
  })

  console.log({ cyberpunk, rdr2 })
  console.log('Database seeded successfully!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
