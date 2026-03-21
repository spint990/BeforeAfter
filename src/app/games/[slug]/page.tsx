import { notFound } from 'next/navigation';
import ComparisonView from '@/components/comparison/ComparisonView';
import { prisma } from '@/lib/prisma';

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

// Game response type
interface GameResponse {
  id: string;
  name: string;
  slug: string;
  coverImage: string | null;
  parameters: Array<{
    id: string;
    name: string;
    slug: string;
    qualityLevels: Array<{
      id: string;
      level: string;
      imageUrl: string;
    }>;
  }>;
}

// Fetch game by slug using Prisma directly
async function getGame(slug: string): Promise<GameResponse | null> {
  try {
    const game = await prisma.game.findFirst({
      where: {
        OR: [{ id: slug }, { slug: slug }],
      },
      include: {
        parameters: {
          include: {
            qualityLevels: {
              orderBy: {
                level: 'asc',
              },
            },
          },
          orderBy: {
            name: 'asc',
          },
        },
      },
    });

    return game;
  } catch (error) {
    console.error('Error fetching game:', error);
    return null;
  }
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const game = await getGame(slug);

  if (!game) {
    return {
      title: 'Game Not Found - Before/After',
    };
  }

  return {
    title: `${game.name} - Graphics Comparison - Before/After`,
    description: `Compare ${game.name} graphics settings side-by-side. ${game.parameters.length} parameters available for comparison.`,
  };
}

export default async function GameDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const game = await getGame(slug);

  if (!game) {
    notFound();
  }

  return <ComparisonView game={game} />;
}
