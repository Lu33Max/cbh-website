import React, { useState } from 'react'
import Link from "next/link";
import Image from "next/image";

import { BiSearch, BiNews, BiLogIn } from 'react-icons/bi'
import { signIn, signOut, useSession } from "next-auth/react";
import { useRouter } from 'next/router';

const HeaderNEW: React.FC = () => {
  const { data: sessionData } = useSession();

  const [searchQuery, setSearchQuery] = useState<string>("");
  const [activeHeader, setActiveHeader] = useState<number>(0)

  const router = useRouter();

  const onSearch = (event: React.FormEvent) => {
    event.preventDefault();

    const encodedSearchQuery = encodeURI(searchQuery);
    void router.push(`/search?q=${encodedSearchQuery}`);
  }

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
      <div className={`absolute top-0 w-full text-black bg-white z-10 ${activeHeader === 1 ? "h-[400px]" : "h-0 hidden" }`}>
        Header1
      </div>
      <div className={`absolute top-0 w-full text-black bg-white z-10 ${activeHeader === 2 ? "h-[400px]" : "h-0 hidden" }`}>
        Header2
      </div>
    </>
  )
}

export default HeaderNEW
