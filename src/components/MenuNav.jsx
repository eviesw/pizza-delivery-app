import { Link } from "react-scroll";

export default function MenuNav() {
  const menuCategories = [
    { id: "pizzas", name: "Pizzas" },
    { id: "burgers", name: "Burgers" },
    { id: "extras", name: "Extras" },
    { id: "drinks", name: "Drinks" },
    { id: "desserts", name: "Desserts" },
  ];

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-[96px] z-10 w-full">
      <div className="max-w-screen-xl mx-auto px-4">
        <ul className="flex space-x-12 py-2">
          {menuCategories.map((category) => (
            <li key={category.id}>
              <Link
                to={category.id}
                spy={true}
                smooth={true}
                offset={-210}
                duration={500}
                spyThrottle={100}
                activeClass="text-[#ff6347] border-b-2 border-[#ff6347]"
                className="block pt-3 pb-2 text-gray-600 hover:text-[#ff6347] cursor-pointer text-lg font-medium transition-all duration-200"
              >
                {category.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
