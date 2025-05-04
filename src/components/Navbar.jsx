import logo from "../assets/kevinRushLogo.png";
import { FaLinkedin, FaGithub, FaInstagram } from "react-icons/fa";

const Navbar = () => {
  return (
    <nav className="mb-20 flex items-center justify-between py-6">
      <div className="flex flex-shrink-0 items-center">
        <img className="mx-2 w-10" src={logo} alt="logo" />
      </div>
      <div className="m-8 flex items-center justify-center gap-4 text-2xl">
        <a href="https://www.linkedin.com/in/zohaibsafdarcheema/" target="_blank" rel="noopener noreferrer">
          <FaLinkedin className="hover:text-purple-400 transition-colors duration-200" />
        </a>
        <a href="https://github.com/zohaib-cheema" target="_blank" rel="noopener noreferrer">
          <FaGithub className="hover:text-purple-400 transition-colors duration-200" />
        </a>
        <a href="https://www.instagram.com/zohaibcheema_" target="_blank" rel="noopener noreferrer">
          <FaInstagram className="hover:text-purple-400 transition-colors duration-200" />
        </a>
      </div>
    </nav>
  );
};

export default Navbar;

