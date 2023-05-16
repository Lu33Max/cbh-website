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
      <div className='bg-gradient-to-r from-[#164A41] to-[#9DC88D] h-[100px] flex flex-row pl-10 pr-5 items-center font-body font-poppins text-2xl text-white font-thin'>
        <Image src="/cbh_logos/logo_white.png" alt="Logo" width={250} height={100} className='z-20'/>
        <div className='flex flex-row mx-auto gap-5 z-20'>
          <button onClick={() => {activeHeader === 1 ? setActiveHeader(0) : setActiveHeader(1)}}>Biospecimen</button>
          <button onClick={() => {activeHeader === 2 ? setActiveHeader(0) : setActiveHeader(2)}}>Company</button>
          <button>Contact</button>
        </div>
        <span className='relative block w-full max-w-[30%] z-20'>
          <form onSubmit={onSearch}>
            <input 
              value={searchQuery} 
              onChange={event => setSearchQuery(event.target.value)} 
              className='bg-[#9DC88D] w-[100%] text-black pl-10 pr-5 py-1 text-lg rounded-3xl placeholder:italic placeholder:text-gray-700 focus:outline-none my-1 drop-shadow-lg' 
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
      <div className={`absolute top-0 w-full text-black bg-[#4D774E] z-10 ${activeHeader === 1 ? "h-[400px]" : "h-0 hidden" }`}>
        Header1
      </div>
      <div className={`absolute top-0 w-full text-black bg-[#4D774E] z-10 ${activeHeader === 2 ? "h-[400px]" : "h-0 hidden" }`}>
        Header2
      </div>
    </>
  )
}

export default HeaderNEW
