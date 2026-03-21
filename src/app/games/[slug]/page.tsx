import { notFound } from 'next/navigation';
import ComparisonView from '@/components/comparison/ComparisonView';

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

// Game response type from API
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

async function getGame(slug: string): Promise<GameResponse | null> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const response = await fetch(`${baseUrl}/api/games/${slug}`, {
      cache: 'no-store',
    });

    if (!response.ok) {
      if (response.status === 404) {
        return null;
      }
      throw new Error(`Failed to fetch game: ${response.status}`);
    }

    return response.json();
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
