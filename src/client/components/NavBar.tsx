import React, { JSX, useState } from 'react';
import { motion } from 'motion/react';
import cn from '../../../lib/utils';

function NavBar(): JSX.Element {
  /*
  Tracks whether the mobile menu (hamburger) is open or closed
  By default, the menu is closed: false.
  */
  const [isOpen, setIsOpen] = useState(false);

  // Handler function that toggles the 'isOpen' state.
  const handleMenuToggle = () => {
    // Debugging to make sure toggle is firing
    console.log('Toggling mobile menu. Current state:', isOpen);
    setIsOpen((prev) => !prev);
  };

  /**
   * 'menuVariants' is an object used by Motion for animating the mobile nav
   *  - 'closed' => The menu is hidden at scaleY(0)
   *  - 'open' => The menu is fully visible scaleY(1)
   */

  const menuVariants = {
    closed: {
      opacity: 0,
      scaleY: 0,
      originY: 0,
      transition: { duration: 0.2 },
    },
    open: {
      opacity: 1,
      scaleY: 1,
      originY: 0,
      transition: { duration: 0.3 },
    },
  };

  return (
    <nav className="w-full bg-secondary text-secondary-foreground shadow-sm">
      <div
        className={cn(
          'mx-auto flex max-w-7xl items-center justify-between p-4',
          // Example: Change background color when menu is open
          isOpen && 'bg-primary'
        )}
      >
        <div className="flex items-center">
          <a
            className="text-xl font-bold tracking-wide focus:outline-none focus:ring-2 focus:ring-offset-2"
            href="/"
            aria-label="Flare Home"
          >
            Flare
          </a>
        </div>

        <div className="hidden md:flex gap-4">
          <a
            href="/Events"
            aria-label="Go to Events page"
            className="hover:underline focus:outline-none focus:ring-1 focus:ring-ring rounded-sm px-3 py-2"
          >
            Events
          </a>

          <a
              href="/CreateEvents"
              aria-label="Create your Event"
              className="hover:underline focus:outline-none focus:ring-1 focus:ring-ring rounded-sm px-3 py-2"
          >
            Create Your Event
          </a>


          <a
            href="/AiConversations"
            aria-label="Go to AI Conversations page"
            className="hover:underline focus:outline-none focus:ring-1 focus:ring-ring rounded-sm px-3 py-2"
          >
            AI
          </a>
          <a
            href="/Task"
            aria-label="Go to Task page"
            className="hover:underline focus:outline-none focus:ring-1 focus:ring-ring rounded-sm px-3 py-2"
          >
            Task
          </a>
          <a
            href="/Dashboard"
            aria-label="Go to Dashboard page"
            className="hover:underline focus:outline-none focus:ring-1 focus:ring-ring rounded-sm px-3 py-2"
          >
            Dashboard
          </a>
          <a
              href="/logout"
              aria-label="Logout"
              className="hover:underline focus:outline-none focus:ring-1 focus:ring-ring rounded-sm px-3 py-2"
          >
            Logout
          </a>
        </div>

        <button
          type="button"
          aria-label="Toggle Mobile Menu"
          className="md:hidden flex items-center rounded-sm p-2 focus:outline-none focus:ring-2 focus:ring-ring"
          onClick={handleMenuToggle}
        >
          <svg className="h-6 w-6 fill-current" viewBox="0 0 24 24">
            {isOpen ? (
              <path
                // 'X' icon
                d="M6 18L18 6M6 6l12 12"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            ) : (
              <path
                // 'Hamburger' lines
                d="M4 5h16M4 12h16M4 19h16"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            )}
          </svg>
        </button>
      </div>

      <motion.div
          className="flex flex-col origin-top bg-secondary text-secondary-foreground md:hidden"
          initial="closed"
          animate={isOpen ? 'open' : 'closed'}
          variants={menuVariants}
      >
        <a
            href="/Events"
            aria-label="Go to Events page"
            className="border-t border-border px-4 py-2 hover:underline focus:outline-none focus:ring-1 focus:ring-ring"
            onClick={handleMenuToggle}
        >
          Events
        </a>

        <a
            href="/CreateEvents"
            aria-label="Create your Event"
            className="border-t border-border px-4 py-2 hover:underline focus:outline-none focus:ring-1 focus:ring-ring"
            onClick={handleMenuToggle}
        >
          Create Event
        </a>
        <a
            href="/AiConversations"
            aria-label="Go to AI page"
            className="border-t border-border px-4 py-2 hover:underline focus:outline-none focus:ring-1 focus:ring-ring"
            onClick={handleMenuToggle}
        >
          AI
        </a>
        <a
            href="/Task"
            aria-label="Go to Task page"
            className="border-t border-border px-4 py-2 hover:underline focus:outline-none focus:ring-1 focus:ring-ring"
            onClick={handleMenuToggle}
        >
          Task
        </a>
        <a
            href="/Chatroom"
            aria-label="Go to Chatroom page"
            className="border-t border-border px-4 py-2 hover:underline focus:outline-none focus:ring-1 focus:ring-ring"
            onClick={handleMenuToggle}
        >
          Chat
        </a>
        <a
            href="/Signup"
            aria-label="Go to Signup page"
            className="border-t border-border px-4 py-2 hover:underline focus:outline-none focus:ring-1 focus:ring-ring"
            onClick={handleMenuToggle}
        >
          Signup
        </a>
        <a
            href="/Dashboard"
            aria-label="Go to Dashboard page"
            className="border-y border-border px-4 py-2 hover:underline focus:outline-none focus:ring-1 focus:ring-ring"
            onClick={handleMenuToggle}
        >
          Dashboard
        </a>
      </motion.div>
    </nav>
  );
}

export default NavBar;
