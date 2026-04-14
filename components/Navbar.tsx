
import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, useScroll, useSpring } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { useModal } from '../context/ModalContext';

const Navbar: React.FC = () => {
  const [activeSection, setActiveSection] = useState('home');
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { pathname, hash } = useLocation();
  const navigate = useNavigate();
  const { isModalOpen } = useModal();

  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  const isHome = pathname === '/';

  const navItems = [
    { label: 'HOME', href: '/#home' },
    { label: 'ABOUT', href: '/#about' },
    { label: 'EXPERIENCE', href: '/#experience' },
    { label: 'SKILLS', href: '/#skills' },
    { label: 'CONTACT', href: '/#contact' },
  ];

  useEffect(() => {
    if (!isHome) {
      setActiveSection('');
      return;
    }

    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
      const sections = ['home', 'about', 'experience', 'skills', 'contact'];
      const scrollPosition = window.scrollY + 150;

      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isHome]);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href.startsWith('/#')) {
      const id = href.replace('/#', '');
      if (isHome) {
        e.preventDefault();
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
      } else {
        // Just let the Link handle navigation back home
      }
    }
  };

  const handleMobileNavClick = (href: string) => {
    handleNavClick({ preventDefault: () => { } } as any, href);
    setMobileMenuOpen(false);
  };

  return (
    <div className={`fixed top-0 left-0 w-full z-[100] transition-all duration-300 ${isModalOpen ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
      <motion.div className="h-[2px] bg-black origin-left" style={{ scaleX }} />

      {/* Desktop Navigation */}
      <div className="hidden md:flex justify-center pt-4 md:pt-8 px-4 md:px-6">
        <motion.nav
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className={`flex items-center gap-1 px-2 py-1.5 md:py-2 rounded-2xl border transition-all duration-700 ${scrolled || !isHome
              ? 'bg-zinc-900/80 backdrop-blur-2xl border-zinc-700 shadow-[0_20px_50px_rgba(0,0,0,0.3)]'
              : 'bg-black/10 backdrop-blur-md border-white/10'
            }`}
        >
          <Link to="/" className="group flex items-center gap-2 md:gap-3 px-3 md:px-4 py-2 mr-1 md:mr-2">
            <div className="w-7 h-7 md:w-8 md:h-8 bg-white rounded-lg flex items-center justify-center text-black font-display text-base md:text-lg group-hover:rotate-12 transition-transform">
              D
            </div>
            <span className={`hidden sm:block text-[10px] font-black tracking-tighter transition-opacity text-white ${scrolled || !isHome ? 'opacity-100' : 'opacity-0'}`}>APIN.</span>
          </Link>

          <div className="flex items-center gap-0.5 md:gap-1">
            {navItems.map((item) => {
              const id = item.href.replace('/#', '');
              const isActive = isHome && activeSection === id;

              return (
                <Link
                  key={item.href}
                  to={item.href}
                  onClick={(e) => handleNavClick(e, item.href)}
                  className={`relative px-3 md:px-5 py-2 text-[9px] md:text-[10px] font-black tracking-[0.2em] md:tracking-[0.25em] transition-all rounded-xl flex items-center justify-center ${isActive ? 'text-white' : 'text-zinc-500 hover:text-zinc-400'
                    }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="nav-glow"
                      className="absolute inset-0 bg-zinc-800/80 rounded-xl -z-10"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                  {item.label}
                </Link>
              );
            })}
          </div>

          <Link to="/#contact" onClick={(e) => handleNavClick(e, '/#contact')} className="px-4 md:px-5 py-2 md:py-2.5 bg-white text-black rounded-xl text-[9px] md:text-[10px] font-black tracking-[0.2em] hover:bg-zinc-200 transition-colors whitespace-nowrap">
            HIRE
          </Link>
        </motion.nav>
      </div>

      {/* Mobile Navigation */}
      <div className={`md:hidden flex items-center justify-between px-4 py-3 mx-4 mt-4 rounded-2xl transition-all duration-700 ${scrolled || !isHome
          ? 'bg-black/20 backdrop-blur-xl border border-white/10 shadow-[0_8px_32px_0_rgba(31,38,135,0.37)]'
          : 'bg-transparent border border-transparent'
        }`}>
        <Link to="/" className="group flex items-center gap-2">
          <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center text-black font-display text-base group-hover:rotate-12 transition-transform">
            D
          </div>
        </Link>

        <div className="flex items-center gap-1">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2.5 rounded-lg hover:bg-zinc-800/50 transition-colors text-white"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: mobileMenuOpen ? 1 : 0, y: mobileMenuOpen ? 0 : -10 }}
        transition={{ duration: 0.2 }}
        className={`md:hidden ${mobileMenuOpen ? 'block' : 'hidden pointer-events-none'}`}
      >
        <div className="mx-4 mt-2 rounded-2xl border border-white/10 bg-black/20 backdrop-blur-xl shadow-[0_8px_32px_0_rgba(31,38,135,0.37)]">
          <div className="flex flex-col p-4 gap-2">
            {navItems.map((item) => {
              const id = item.href.replace('/#', '');
              const isActive = isHome && activeSection === id;
              return (
                <Link
                  key={item.href}
                  to={item.href}
                  onClick={(e) => {
                    handleNavClick(e, item.href);
                    setMobileMenuOpen(false);
                  }}
                  className={`relative px-4 py-3 text-sm font-black tracking-[0.15em] transition-all rounded-lg text-center ${isActive ? 'text-white bg-zinc-800' : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
                    }`}
                >
                  {item.label}
                </Link>
              );
            })}
            <div className="h-[1px] bg-zinc-700 my-2" />
            <Link
              to="/#contact"
              onClick={(e) => {
                handleNavClick(e, '/#contact');
                setMobileMenuOpen(false);
              }}
              className="px-4 py-3 bg-white text-black rounded-lg text-sm font-black tracking-[0.15em] hover:bg-zinc-200 transition-colors text-center"
            >
              HIRE
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Navbar;
