import { Link } from "react-router-dom";
import Logo from "../assets/logo.png";

export default function Navbar() {
  return (
    <nav className="bg-cyan-900 h-14 fixed top-0 left-0 right-0 flex items-center justify-around z-50">
      <Link to="/">
        <img src={Logo} alt="logo" className="h-44 w-52" />
      </Link>
      <ul>
        <li>
          <Link to="/projects" className="text-lg text-white tracking-wide">
            Projects
          </Link>
        </li>
      </ul>
    </nav>
  );
}
