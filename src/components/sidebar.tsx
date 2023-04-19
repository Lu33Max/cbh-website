import React from "react";
import Image from "next/image";
import Link from "next/link";

const buttonsSidebar = [
  { name: 'Home', link: '/' },
  { name: 'Explore', link: '/ueber-uns' },
  { name: 'Expert Search', link: '/angebot' },
  { name: 'Cart', link: '/kontakt' },
  { name: 'About Us', link: '/impressum' },
  { name: 'Become a Supplier', link: '/datenschutz' },
];

const Sidebar: React.FC = () => {
  return(
    <div className="w-[15%] min-h-[95vh] bg-white flex flex-col items-center justify-start py-5 px-5">
      <div>
        <Image src="/LogoCBH.png" alt="Logo" width={300} height={300}/>
      </div>
      <div>
        <nav style={{ display: "flex", flexDirection: "column" }}>
          {buttonsSidebar.map((link, index) => (
            <Link key={index} href={link.link}>
              {link.name}
            </Link>
          ))}
        </nav>
      </div>
    </div>
  )
}

export default Sidebar;
