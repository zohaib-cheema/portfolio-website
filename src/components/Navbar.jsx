import { useEffect, useState } from "react";
import { FaBars, FaTimes } from "react-icons/fa";
import logo from "../assets/kevinRushLogo.png";

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);

  const navLinks = [
    { title: "About Me", id: "traits" },
    { title: "Work", id: "experience" },
    { title: "Leadership", id: "leadership" },
    { title: "Projects", id: "projects" },
    { title: "Contact", id: "contact" },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 60);
    };
    window.addEventListener("scroll", handleScroll);

    // Intersection Observer to track visible section
    const observerOptions = {
      root: null,
      rootMargin: "0px",
      threshold: 0.6,
    };

    const observerCallback = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActive(entry.target.id);
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    navLinks.forEach((link) => {
      const section = document.getElementById(link.id);
      if (section) observer.observe(section);
    });

    return () => {
      window.removeEventListener("scroll", handleScroll);
      observer.disconnect();
    };
  }, []);

  const handleLinkClick = (id) => {
    setActive(id);
    setMenuOpen(false);
  };

  return (
    <nav
      className={`fixed top-0 left-0 z-50 w-full transition-all duration-300 px-6 py-4 ${
        scrolled
          ? "bg-[#0f172a]/70 backdrop-blur-md shadow-md"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <img src={logo} alt="logo" className="w-10 h-10 object-contain" />
        </div>

        {/* Desktop Nav Links */}
        <ul className="hidden sm:flex gap-8 text-white font-medium text-[16px]">
          {navLinks.map((link) => (
            <li
              key={link.id}
              className={`cursor-pointer transition-all duration-200 relative ${
                active === link.id
                  ? "text-white after:content-[''] after:absolute after:left-0 after:-bottom-1 after:w-full after:h-[2px] after:bg-gradient-to-r after:from-pink-400 after:via-slate-400 after:to-purple-500"
                  : "text-gray-400 hover:text-pink-400"
              }`}
              onClick={() => handleLinkClick(link.id)}
            >
              <a href={`#${link.id}`}>{link.title}</a>
            </li>
          ))}
        </ul>

        {/* Hamburger Icon */}
        <div className="sm:hidden text-white text-2xl cursor-pointer z-50" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <FaTimes /> : <FaBars />}
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="absolute top-16 right-6 bg-[#0f172a] text-white p-6 rounded-lg shadow-lg flex flex-col gap-4 sm:hidden animate-fade-in-down">
            {navLinks.map((link) => (
              <a
                key={link.id}
                href={`#${link.id}`}
                onClick={() => handleLinkClick(link.id)}
                className="hover:text-pink-400 transition-all"
              >
                {link.title}
              </a>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
