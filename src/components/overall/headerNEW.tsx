import React, { useState } from 'react'
import Link from "next/link";
import Image from "next/image";

import { BiSearch } from 'react-icons/bi'
import { useRouter } from 'next/router';

const HeaderNEW: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [activeHeader, setActiveHeader] = useState<number>(0)

  const router = useRouter();

  const onSearch = (event: React.FormEvent) => {
    event.preventDefault();

    const encodedSearchQuery = encodeURI(searchQuery);
    void router.push(`/search/overall?q=${encodedSearchQuery}`);
  }

  const navigationButtons = [
    { name: 'Home', link: '/' },
    { name: 'Explore', link: '/search' },
    { name: 'Expert Search', link: '/expertsearch' },
    { name: 'Cart', link: '/Cart' },
    { name: 'About Us', link: '/About' },
    { name: 'Become a Supplier', link: '/BecomeSup' },
    
  ];

  return (
    <>
      <div className='bg-white h-[80px] flex flex-row pl-10 pr-5 items-center font-body font-poppins text-xl text-[#164A41] font-thin'>
        <Image src="/cbh_logos/logo_black.png" alt="Logo" width={200} height={80} className='z-20'/>
        <div className='flex flex-row justify-between mx-auto gap-5 z-20'>
          <button onClick={() => {activeHeader === 1 ? setActiveHeader(0) : setActiveHeader(1)}} className='flex flex-row'>Services
          
          <svg width="12" height="21" viewBox="0 0 20 36" fill="none" xmlns="http://www.w3.org/2000/svg" className="transform rotate-90 translate-y-[4px] ml-2  " >
            <path opacity="0.4" d="M13.2156 9.00221L0 18.6931L0 33.0375C0 35.4922 3.03565 36.7195 4.81522 34.9808L18.371 21.7359C20.543 19.6136 20.543 16.1617 18.371 14.0394L13.2156 9.00221Z" fill="black"/>
            <path d="M0 2.76626V18.6961L13.2156 9.00524L4.81522 0.797406C3.03565 -0.915755 0 0.311585 0 2.76626Z" fill="black"/>
          </svg>

          </button>

          <button onClick={() => {activeHeader === 2 ? setActiveHeader(0) : setActiveHeader(2)}} className='flex flex-row'>Navigation

          <svg width="12" height="21" viewBox="0 0 20 36" fill="none" xmlns="http://www.w3.org/2000/svg" className="transform rotate-90 translate-y-[4px] ml-2">
            <path opacity="0.4" d="M13.2156 9.00221L0 18.6931L0 33.0375C0 35.4922 3.03565 36.7195 4.81522 34.9808L18.371 21.7359C20.543 19.6136 20.543 16.1617 18.371 14.0394L13.2156 9.00221Z" fill="black"/>
            <path d="M0 2.76626V18.6961L13.2156 9.00524L4.81522 0.797406C3.03565 -0.915755 0 0.311585 0 2.76626Z" fill="black"/>
            </svg>
            
            </button>

          <button className='flex flex-row'>Contact

          <svg width="12" height="21" viewBox="0 0 20 36" fill="none" xmlns="http://www.w3.org/2000/svg" className="transform rotate-90 translate-y-[4px] ml-2 ">
            <path opacity="0.4" d="M13.2156 9.00221L0 18.6931L0 33.0375C0 35.4922 3.03565 36.7195 4.81522 34.9808L18.371 21.7359C20.543 19.6136 20.543 16.1617 18.371 14.0394L13.2156 9.00221Z" fill="black"/>
            <path d="M0 2.76626V18.6961L13.2156 9.00524L4.81522 0.797406C3.03565 -0.915755 0 0.311585 0 2.76626Z" fill="black"/>
            </svg>

          </button>
        </div>
        <span className='relative block w-full max-w-[30%] z-20'>
          <form onSubmit={onSearch}>
            <input 
              value={searchQuery} 
              onChange={event => setSearchQuery(event.target.value)} 
              className='bg-[#9DC88D] w-[100%] bg-opacity-20 text-black pl-10 pr-5 py-1 text-lg rounded-m placeholder:italic placeholder:text-gray-700 placeholder-center focus:outline-none my-1 drop-shadow-lg ' 
              placeholder='Search for specimen...'>
            </input>
          </form>
          <div className='absolute inset-y-0 left-0 flex items-center pl-2'>
            <BiSearch color='#555555'/>
          </div>
        </span>
        {/*
          <button className='flex flex-row gap-2 hover:bg-[rgb(149,201,112)] px-2'>
            <BiNews className='relative top-1'/>Newsletter
          </button>
          <button className='flex flex-row gap-2 hover:bg-[rgb(149,201,112)] px-2' onClick={sessionData ? () => void signOut() : () => void signIn()}>
            <BiLogIn className='relative top-1'/>{sessionData ? "Logout" : "Login"}
          </button>
        */}
      </div>

      {/* Services */}
      <div className={`absolute top-0 w-full text-black bg-gray-300 z-10 ${activeHeader === 1 ? "h-[450px]" : "h-0 hidden" }`}>
        <div className="flex flex-row w-full items-center justify-center mt-[5%]">
          <div className="flex flex-col items-center border border-solid border-black mx-3">
            <label className="mb-2">Label</label>
            <Image src="/CBH Logo.png" alt="Logo" width={200} height={200} className="mx-10" />
          </div>
          <div className="flex flex-col items-center border border-solid border-black mx-3">
            <label className="mb-2">Label</label>
            <Image src="/CBH Logo.png" alt="Logo" width={200} height={200} className="mx-10" />
          </div>
          <div className="flex flex-col items-center border border-solid border-black mx-3">
            <label className="mb-2">Label</label>
            <Image src="/CBH Logo.png" alt="Logo" width={200} height={200} className="mx-10" />
          </div>
        </div>
        <div className="flex flex-row w-full items-center justify-center absolute bottom-0 left-0 bg-white h-[15%]">
          <div className="flex flex-col items-start mx-3">
            <label style={{ fontSize: '18px' }}>Label</label>
          </div>
          <div className="flex flex-col items-center mx-3">
            <button className="bg-gray-300" style={{ fontSize: '18px' }}>Button</button>
          </div>
          <div className="flex flex-col items-end mx-3">
            <label style={{ fontSize: '18px' }}>Label</label>
          </div>
          <div className="flex flex-col items-center mx-3">
            <button className="bg-gray-300" style={{ fontSize: '18px' }}>Button</button>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className={`absolute top-0 w-full text-black bg-gray-300 z-10 ${activeHeader === 2 ? "h-[450px]" : "h-0 hidden" }`}>
        <div className="flex flex-col items-center mt-[2%]">
          <nav style={{ display: "flex", flexDirection: "column", justifyContent: "center" }} className="py-5 items-center">
            {navigationButtons.map((link, index) => (
              <Link key={index} href={link.link}> 
                <div className={`relative block w-full h-full py-2 px-4 font-medium text-gray-700 hover:bg-gray-100 transition duration-300 ease-in-out button-sidebar ${router.pathname === link.link ? 'bg-gray-200' : ''}`}>
                  <div className={`activeButton absolute h-full w-[15%] bg-emerald-700 left-[-20%] ${router.pathname === link.link ? '' : 'hidden'}`}></div>
                  {link.name}                                 
                </div>
              </Link>
            ))}
          </nav>
        </div>
        <div className="flex flex-row w-full items-center justify-center absolute bottom-0 left-0 bg-white h-[15%]">
          <div className="flex flex-col items-start mx-3">
            <label style={{ fontSize: '18px' }}>Label</label>
          </div>
          <div className="flex flex-col items-center mx-3">
            <button className="bg-gray-300" style={{ fontSize: '18px' }}>Button</button>
          </div>
          <div className="flex flex-col items-end mx-3">
            <label style={{ fontSize: '18px' }}>Label</label>
          </div>
          <div className="flex flex-col items-center mx-3">
            <button className="bg-gray-300" style={{ fontSize: '18px' }}>Button</button>
          </div>
        </div>
      </div>
    </>
  )
}

export default HeaderNEW
