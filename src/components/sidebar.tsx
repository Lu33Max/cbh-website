import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";


const buttonsSidebar = [
  { name: 'Home', link: '/' },
  { name: 'Explore', link: '/Explore' },
  { name: 'Expert Search', link: '/Expert' },
  { name: 'Cart', link: '/Cart' },
  { name: 'About Us', link: '/About' },
  { name: 'Become a Supplier', link: '/BecomeSup' },
  
];

const Sidebar: React.FC = () => {
  const router = useRouter();

  return(
    <div className="w-[15%] min-h-[95vh] bg-white flex flex-col items-center justify-start py-5 px-5">
      <div>
        <Image src="/CBH Logo.png" alt="Logo" width={300} height={300}/>
      </div>
      <div>
        <nav style={{ display: "flex", flexDirection: "column" }} className="py-5">
          {buttonsSidebar.map((link, index) => (
            <Link key={index} href={link.link}>
              <div className={`relative block w-full py-2 px-4 text-lg font-medium text-gray-700 hover:bg-gray-100 transition duration-300 ease-in-out button-sidebar ${router.pathname === link.link ? 'bg-gray-200' : ''}`}>
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
        <Image src="/social media.png" alt="social media" width={260} height={300} className="mt-5"/>
      </div>
    </div>
  )
}

export default Sidebar;
