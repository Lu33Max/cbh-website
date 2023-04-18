import React from 'react'

import { BiSearch, BiNews, BiLogIn } from 'react-icons/bi'
import { signIn, signOut, useSession } from "next-auth/react";

const Header: React.FC = () => {
  const { data: sessionData } = useSession();

  return (
    <div className='bg-[#758476] h-[5vh] flex flex-row px-5 py-2 items-center justify-center font-body font-poppins text-2xl text-white font-thin'>
      <h3>Central BioHub<sup>©</sup> - Order Biospecimen Online</h3>
      <span className='relative block w-[100%] max-w-[800px] mx-[7%]'>
        <input className='bg-[#cfd8cf] w-[100%] text-black pl-10 pr-5 py-1 text-sm rounded-3xl placeholder:italic placeholder:text-slate-400 focus:outline-none my-1 drop-shadow-lg' placeholder='search...'></input>  
        <div className='absolute inset-y-0 left-0 flex items-center pl-2 '>
          <BiSearch color='grey'/>
        </div>    
      </span>
        <button className='flex flex-row gap-2 hover:bg-[#859486] px-2'>
          <BiNews className='relative top-1'/>Newsletter
        </button>
        <button className='flex flex-row gap-2 hover:bg-[#859486] px-2'onClick={sessionData ? () => void signOut() : () => void signIn()}>
          <BiLogIn className='relative top-1'/>{sessionData ? "Logout" : "Login"}
        </button>
    </div>
  )
}

export default Header
