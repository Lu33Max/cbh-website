import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";

const buttonsSidebar = [
  { name: 'Home', link: '/' },
  { name: 'Explore', link: '/search/overall' },
  { name: 'Expert Search', link: '/search/expert' },
  { name: 'Cart', link: '/cart' },
  { name: 'About Us', link: '/about' },
  { name: 'Become a Supplier', link: '/supplier' },
];

const Sidebar: React.FC = () => {
  const router = useRouter();

  return(
    
    <div className="min-w-[250px] max-w-[250px] h-[95vh] bg-white flex flex-1 flex-col items-center justify-start py-5 px-5 overflow-y-auto overflow-x-hidden">
      <div>
        <Image src="/CBH Logo.png" alt="Logo" width={200} height={200}/>
      </div>
      <div>
        <nav style={{ display: "flex", flexDirection: "column" }} className="py-5">
          {buttonsSidebar.map((link, index) => (
            <Link key={index} href={link.link}> 
              <div className={`relative block w-full h-full py-2 px-4 font-medium text-gray-700 hover:bg-gray-100 transition duration-300 ease-in-out button-sidebar ${router.pathname === link.link ? 'bg-gray-200' : ''}`}>
                <div className={`activeButton absolute h-full w-[15%] bg-emerald-700 left-[-20%] ${router.pathname === link.link ? '' : 'hidden'}`}></div>
                {link.name}                                 
              </div>
            </Link>
          ))}
        </nav>
      </div>
      <div>
        <Image src="/Help.png" alt="Help" width={300} height={300} className="mb-[-28%]"/>
        <button className="button-contact"></button>
      </div>
      <div>
        <Image src="/social media.png" alt="social media" width={260} height={300} className="mt-5 mb-2"/>
      </div>
    </div>
  )
}

export default Sidebar;
