import { Link, NavLink } from "react-router-dom";
import { GiFullPizza } from "react-icons/gi";
import { FaUser } from "react-icons/fa";
import { RiMenu3Line, RiCloseLine } from "react-icons/ri";
import { useState } from "react";
import { useUser } from "../contexts/UserContext";

export default function Navbar() {
  const { user } = useUser();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="bg-[#ff6347] fixed w-full z-20 top-0 start-0 border-b border-[#ff4f2b]">
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
        <Link
          to="/"
          className="flex items-center space-x-3 rtl:space-x-reverse text-white"
        >
          <GiFullPizza className="text-4xl md:text-7xl" />
          <h1 className="text-4xl md:text-7xl">PIZZA PALACE</h1>
        </Link>

        {/* Burger Menu Button */}
        <button
          onClick={toggleMenu}
          className="md:hidden p-2 text-white hover:text-gray-200"
        >
          {isMenuOpen ? <RiCloseLine size={24} /> : <RiMenu3Line size={24} />}
        </button>

        {/* Navigation Links */}
        <div
          className={`${
            isMenuOpen ? "block" : "hidden"
          } w-full md:block md:w-auto md:order-1`}
        >
          <ul className="flex flex-col p-4 md:p-0 mt-4 font-medium border border-[#ff4f2b] rounded-lg bg-[#ff6347] md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0">
            <li className="py-2 md:py-0">
              <NavLink
                to="/"
                onClick={() => setIsMenuOpen(false)}
                className="text-white hover:text-gray-200 text-xl md:text-2xl"
              >
                MENU
              </NavLink>
            </li>
            <li className="py-2 md:py-0">
              <NavLink
                to="/login"
                className="flex items-center gap-2 text-white hover:text-gray-200 text-xl md:text-2xl"
                onClick={() => setIsMenuOpen(false)}
              >
                {user ? (
                  <>
                    <FaUser className="text-xl md:text-2xl" />
                    ACCOUNT
                  </>
                ) : (
                  "LOGIN"
                )}
              </NavLink>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}
