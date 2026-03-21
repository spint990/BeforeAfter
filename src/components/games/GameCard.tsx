'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface GameCardProps {
  game: {
    id: string;
    name: string;
    slug: string;
    coverImage?: string | null;
    parameters?: { id: string }[];
  };
  href?: string;
}

export default function GameCard({ game, href }: GameCardProps) {
  const cardHref = href || `/games/${game.slug}`;
  
  return (
    <Link href={cardHref} className="block group">
      <div className="relative aspect-[3/4] rounded-xl overflow-hidden bg-gray-800 border border-gray-700 transition-all duration-300 group-hover:scale-105 group-hover:shadow-xl group-hover:shadow-accent-primary/20 group-hover:border-accent-primary/50">
        {/* Cover Image */}
        {game.coverImage ? (
          <Image
            src={game.coverImage}
            alt={game.name}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-cover transition-transform duration-300 group-hover:scale-110"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-700 to-gray-800">
            <svg
              className="w-16 h-16 text-gray-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>
        )}
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
        
        {/* Game Name Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <h3 className="text-lg font-semibold text-white truncate">
            {game.name}
          </h3>
        </div>
      </div>
    </Link>
  );
}
