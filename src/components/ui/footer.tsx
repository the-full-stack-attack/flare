import React from 'react';
import cn from '../../../lib/utils';

export function Footer() {
  return (
    <nav className="w-full z-10 bg-black/50 backdrop-blur-lg border-t border-yellow-500/20">
      <div className="max-w-[2000px] mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="text-gray-400 mb-4 md:mb-0">
            2024 Flare. All rights reserved.
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-gray-400">Made with</span>
            <span className="text-red-500 animate-pulse">❤️</span>
            <span className="text-gray-400">by</span>
            <a
              href="https://github.com/the-full-stack-attack/flare"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-gradient-to-r from-yellow-500 via-orange-500 to-pink-500 bg-clip-text text-transparent font-bold hover:underline"
            >
              Full Stack Attack
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
}
