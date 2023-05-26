"use client";

import React, { useState } from 'react'

import { BiSearch, BiNews, BiLogIn } from 'react-icons/bi'
import { signIn, signOut, useSession } from "next-auth/react";
import { useRouter } from 'next/router';
import Link from 'next/link';

const Header: React.FC = () => {
  const { data: sessionData } = useSession();
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  const onSearch = (event: React.FormEvent) => {
    event.preventDefault();

    const encodedSearchQuery = encodeURI(searchQuery);
    void router.push(`/search?q=${encodedSearchQuery}`);
  }

  return (
  <div className='bg-[rgb(131,182,94)] h-[50px] flex flex-row px-5 py-2 items-center justify-between font-body font-poppins text-2xl text-white font-thin w-full'>
    <h3 className='whitespace-nowrap text-left'>
      Central BioHub <sup>©</sup> - Order Biospecimen Online
    </h3>
    <span className='relative block w-[100%] max-w-[800px] mx-[7%]'>
      <form onSubmit={onSearch}>
        <input 
         value={searchQuery} 
         onChange={event => setSearchQuery(event.target.value)} 
         className='bg-[#b5ceb0] w-[100%] text-black pl-10 pr-5 py-1 text-sm rounded-3xl placeholder:italic placeholder:text-slate-400 focus:outline-none my-1 drop-shadow-lg' 
          placeholder='search...'>
        </input>
      </form>  
      <div className='absolute inset-y-0 left-0 flex items-center pl-2'>
        <BiSearch color='grey'/>
      </div>    
    </span>
    <div className='flex flex-row gap-2'>
      <button className='flex flex-row gap-2 hover:bg-[rgb(149,201,112)] px-2'>
        <BiNews className='relative top-1'/>Newsletter
      </button>
        <button className='flex flex-row gap-2 hover:bg-[rgb(149,201,112)] px-2' onClick={sessionData ? () => void signOut() : () => void signIn()}>
          <BiLogIn className='relative top-1'/>{sessionData ? "Logout" : "Login"}
        </button>
    </div>
  </div>

  )
}

export default Header
