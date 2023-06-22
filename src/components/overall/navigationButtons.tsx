import React from "react";
import Link from "next/link";
import { useRouter } from "next/router";

const buttonsSidebar = [
  { name: 'Home', link: '/newHomeLayout' },
  { name: 'Explore', link: '/search' },
  { name: 'Expert Search', link: '/expertsearch' },
  { name: 'Cart', link: '/cart' },
  { name: 'About Us', link: '/About' },
  { name: 'Become a Supplier', link: '/BecomeSup' },
  
];

const NavigationButtons: React.FC = () => {
  const router = useRouter();

  return(
    <div>
      <nav style={{ display: "flex", flexDirection: "row" }} className="py-5 mx-10">
        {buttonsSidebar.map((link, index) => (
          <Link key={index} href={link.link}>
            <div className={`relative block w-full py-2 px-4 font-medium text-gray-700 hover:bg-gray-100 transition duration-300 ease-in-out button-sidebar ${router.pathname === link.link ? 'bg-gray-200' : ''}`}>
              {/*<div className={`activeButton absolute h-full w-[15%] bg-emerald-700 left-[-20%] ${router.pathname === link.link ? '' : 'hidden'}`}></div>*/}
              {link.name}                                 
            </div>
          </Link>
        ))}
      </nav>
    </div>
  )
}

export default NavigationButtons;
