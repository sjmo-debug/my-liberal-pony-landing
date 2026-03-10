import { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import BackgroundManager from '@/components/BackgroundManager';

const navLinks = [
  { to: '/theSJMO', label: 'Home' },
  { to: '/theSJMO/projects', label: 'Projects' },
  { to: '/theSJMO/about', label: 'About' },
  { to: '/theSJMO/contact', label: 'Contact' },
];

export default function PortfolioLayout() {
  const [isButtonHovered, setIsButtonHovered] = useState(false);
  const location = useLocation();

  const borderColor = isButtonHovered ? 'border-black' : 'border-foreground';

  return (
    <div className="min-h-screen transition-all duration-500">
      <BackgroundManager isVisible={isButtonHovered} />
      <div className={`min-h-screen flex flex-col transition-colors duration-500 relative z-10 ${isButtonHovered ? 'text-black' : 'bg-background text-foreground'}`}>
        {/* Navigation */}
        <nav className="flex flex-wrap items-center gap-3 p-4 md:p-6">
          <Link
            to="/"
            onMouseEnter={() => setIsButtonHovered(true)}
            onMouseLeave={() => setIsButtonHovered(false)}
            className={`inline-flex items-center gap-2 font-body text-sm md:text-base uppercase px-4 py-2 min-h-[44px] transition-all duration-300 border-2 ${borderColor}`}
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
                  onMouseEnter={() => setIsButtonHovered(true)}
                  onMouseLeave={() => setIsButtonHovered(false)}
                  className={`font-body text-sm md:text-base uppercase px-4 py-2 min-h-[44px] transition-all duration-300 border-2 ${borderColor} ${isActive ? 'font-bold' : ''}`}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>
        </nav>

        {/* Page content */}
        <main className="flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
