import React from "react";
import Link from "next/link";
import { useRouter } from "next/router";

const buttonsSidebar = [
  { name: "Home", link: "/newHomeLayout" },
  { name: "Explore", link: "/search" },
  { name: "Expert Search", link: "/expertsearch" },
  { name: "Cart", link: "/cart" },
  { name: "About Us", link: "/About" },
  { name: "Become a Supplier", link: "/BecomeSup" },
];

const NavigationButtons: React.FC = () => {
  const router = useRouter();

  return (
    <div>
      <nav
        style={{ display: "flex", flexDirection: "row" }}
        className="mx-10 py-5"
      >
        {buttonsSidebar.map((link, index) => (
          <Link key={index} href={link.link}>
            <div
              className={`button-sidebar relative block w-full px-4 py-2 font-medium text-gray-700 transition duration-300 ease-in-out hover:bg-gray-100 ${
                router.pathname === link.link ? "bg-gray-200" : ""
              }`}
            >
              {/*<div className={`activeButton absolute h-full w-[15%] bg-emerald-700 left-[-20%] ${router.pathname === link.link ? '' : 'hidden'}`}></div>*/}
              {link.name}
            </div>
          </Link>
        ))}
      </nav>
    </div>
  );
};

export default NavigationButtons;
