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
      <div className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-gray-800 border border-gray-700/50 transition-all duration-300 group-hover:scale-[1.02] group-hover:shadow-2xl group-hover:shadow-purple-500/20 group-hover:border-purple-500/50">
        {/* Cover Image */}
        {game.coverImage ? (
          <Image
            src={game.coverImage}
            alt={game.name}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-cover transition-transform duration-500 group-hover:scale-110"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-800 via-gray-800 to-purple-900/20">
            <div className="w-16 h-16 rounded-xl bg-gray-700/50 flex items-center justify-center">
              <svg
                className="w-8 h-8 text-gray-500"
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
          </div>
        )}
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/40 to-transparent" />
        
        {/* Hover glow effect */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-t from-purple-600/20 to-transparent" />
        
        {/* Game Name Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-2 h-2 rounded-full bg-gradient-to-r from-purple-500 to-cyan-500" />
            <span className="text-xs font-medium text-purple-400 uppercase tracking-wider">
              {game.parameters?.length || 0} parameters
            </span>
          </div>
          <h3 className="text-lg font-semibold text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-gray-300 transition-all duration-300 truncate">
            {game.name}
          </h3>
        </div>
      </div>
    </Link>
  );
}
