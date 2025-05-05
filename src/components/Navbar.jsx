import { useEffect, useState } from "react";
import logo from "../assets/kevinRushLogo.png";

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState("");

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 60);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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

        {/* Nav Links */}
        <ul className="hidden sm:flex gap-8 text-white font-medium text-[16px]">
          {[
            { title: "About Me", id: "about" },
            { title: "Work", id: "experience" },
            { title: "Leadership", id: "leadership" },
            { title: "Projects", id: "projects" },
            { title: "Contact", id: "contact" }, // ✅ Added Contact link
          ].map((link) => (
            <li
              key={link.id}
              className={`cursor-pointer transition-all duration-200 relative ${
                active === link.id
                  ? "text-white after:content-[''] after:absolute after:left-0 after:-bottom-1 after:w-full after:h-[2px] after:bg-gradient-to-r after:from-pink-400 after:via-slate-400 after:to-purple-500"
                  : "text-gray-400 hover:text-pink-400"
              }`}
              onClick={() => setActive(link.id)}
            >
              <a href={`#${link.id}`}>{link.title}</a>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
