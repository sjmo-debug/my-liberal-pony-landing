import { Outlet, Link, useLocation } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const navLinks = [
  { to: '/theSJMO', label: 'Home' },
  { to: '/theSJMO/projects', label: 'Projects' },
  { to: '/theSJMO/about', label: 'About' },
  { to: '/theSJMO/contact', label: 'Contact' },
];

export default function PortfolioLayout() {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-black text-white">
      <nav className="flex flex-wrap items-center gap-3 p-4 md:p-6">
        <Link
          to="/"
          className="inline-flex items-center gap-2 font-body text-sm md:text-base uppercase px-4 py-2 min-h-[44px] transition-all duration-300 border-2 border-white"
          aria-label="Return to main site"
        >
          <ArrowLeft className="w-4 h-4" />
          Main Site
        </Link>

        <div className="flex flex-wrap items-center gap-2">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.to;
            return (
              <Link
                key={link.to}
                to={link.to}
                className={`font-body text-sm md:text-base uppercase px-4 py-2 min-h-[44px] transition-all duration-300 border-2 border-white ${isActive ? 'font-bold' : ''}`}
              >
                {link.label}
              </Link>
            );
          })}
        </div>
      </nav>

      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  );
}
