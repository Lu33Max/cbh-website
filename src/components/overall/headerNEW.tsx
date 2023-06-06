import React, { useState } from 'react';
import Link from "next/link";
import Image from "next/image";
import { BiSearch } from 'react-icons/bi';
import { useRouter } from 'next/router';

const HeaderNEW: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [activeHeader, setActiveHeader] = useState<number>(0);
  const [buttonClicked, setButtonClicked] = useState<boolean>(false);
  const [navigationColor, setNavigationColor] = useState<string>('gray-700');
  const [contactColor, setContactColor] = useState<string>('gray-700');

  const router = useRouter();

  const onSearch = (event: React.FormEvent) => {
    event.preventDefault();

    const encodedSearchQuery = encodeURI(searchQuery);
    void router.push(`/search/overall?q=${encodedSearchQuery}`);
  };

  const navigationButtons = [
    { name: 'Home', link: '/' },
    { name: 'Explore', link: '/search' },
    { name: 'Expert Search', link: '/expertsearch' },
    { name: 'Cart', link: '/Cart' },
    { name: 'About Us', link: '/About' },
  ];

  const handleButtonClick = () => {
    setActiveHeader(activeHeader === 1 ? 0 : 1);
    setButtonClicked(!buttonClicked);
    setNavigationColor('[#164A41]');
    setContactColor('[#164A41]');
  };

  return (
    <>
      {/* Header */}
      <div className='bg-white h-[80px] flex flex-row pl-10 pr-5 items-center font-body font-poppins text-xl text-[#164A41] font-thin'>
        <Image src="/cbh_logos/logo_black.png" alt="Logo" width={200} height={80} className='z-20'/>
        <div className='flex flex-row justify-between mx-auto gap-5 z-20'>
          <button
            onClick={handleButtonClick}
            className={`flex flex-row ${buttonClicked ? 'text-white' : 'text-[#164A41]'}`}>

            Services

            <svg width="12" height="21" viewBox="0 0 20 36" fill="none" xmlns="http://www.w3.org/2000/svg" className="transform rotate-90 translate-y-[4px] ml-2">
              <path opacity="0.4" d="M13.2156 9.00221L0 18.6931L0 33.0375C0 35.4922 3.03565 36.7195 4.81522 34.9808L18.371 21.7359C20.543 19.6136 20.543 16.1617 18.371 14.0394L13.2156 9.00221Z" fill="black"/>
              <path d="M0 2.76626V18.6961L13.2156 9.00524L4.81522 0.797406C3.03565 -0.915755 0 0.311585 0 2.76626Z" fill="black"/>
            </svg>
          </button>

          <button onClick={() => setActiveHeader(activeHeader === 2 ? 0 : 2)} className={`flex flex-row ${buttonClicked ? 'text-white' : `text-${navigationColor}`}`}>
            
            Navigation

            <svg width="12" height="21" viewBox="0 0 20 36" fill="none" xmlns="http://www.w3.org/2000/svg" className="transform rotate-90 translate-y-[4px] ml-2">
              <path opacity="0.4" d="M13.2156 9.00221L0 18.6931L0 33.0375C0 35.4922 3.03565 36.7195 4.81522 34.9808L18.371 21.7359C20.543 19.6136 20.543 16.1617 18.371 14.0394L13.2156 9.00221Z" fill="black"/>
              <path d="M0 2.76626V18.6961L13.2156 9.00524L4.81522 0.797406C3.03565 -0.915755 0 0.311585 0 2.76626Z" fill="black"/>
            </svg>
          </button>

          <button className={`flex flex-row ${buttonClicked ? 'text-white' : `text-${contactColor}`}`}>
            
            Contact
            
            </button>
        </div>
        <span className='relative block w-full max-w-[30%] z-20'>
          <form onSubmit={onSearch}>
            <input 
              value={searchQuery} 
              onChange={event => setSearchQuery(event.target.value)} 
              className='bg-[#9DC88D] w-[100%] bg-opacity-20 text-black pl-10 pr-5 py-1 text-lg rounded-m placeholder:italic placeholder:text-gray-700 placeholder-center focus:outline-none my-1 drop-shadow-lg' 
              placeholder='Search for specimen...'
            />
          </form>
          <div className='absolute inset-y-0 left-0 flex items-center pl-2'>
            <BiSearch color='#555555'/>
          </div>
        </span>
      </div>

      {/* Services */}
      <div className={`overflow-visible absolute top-0 w-full text-black bg-[#164A41] z-10 transition-height duration-500 ease-in-out ${activeHeader === 1 ? "h-[450px]" : "h-0 opacity-0"}`}>
        <div className="flex flex-row w-full items-center justify-center mt-[5%]">
          <div className="flex flex-col items-center border border-solid border-[#9DC88D] mx-3 rounded-lg">
            <span className="text-center text-2xl text-white justify-center">Easy Online</span>
            <span className="text-center text-2xl text-white justify-center">Ordering Process</span>
            <Image src="/image 10.png" alt="Logo" width={200} height={200} className="mx-10" />
          </div>
          <div className="flex flex-col items-center border border-solid border-[#9DC88D] mx-3 rounded-lg">
            <span className="text-center text-2xl text-white justify-center">Worldwide</span>
            <span className="text-center text-2xl text-white justify-center">Express Delivery</span>
            <Image src="/image 12.png" alt="Logo" width={200} height={200} className="mx-10" />
          </div>
          <div className="flex flex-col items-center border border-solid border-[#9DC88D] mx-3 rounded-lg">
           <span className="text-center text-2xl text-white justify-center">800.000+</span>
           <span className="text-center text-2xl text-white justify-center">Samples in Stock</span>
            <Image src="/image 11.png" alt="Logo" width={200} height={200} className="mx-10" />
          </div>
        </div>
        <div className="flex flex-row w-full items-center justify-center absolute bottom-0 left-0 bg-white h-[15%] transition-transform ">
          <div className="flex flex-col items-start mx-3">
            <label style={{ fontSize: '18px' }}>Become a Part of us!</label>
          </div>
          <div className="flex flex-col items-center mx-3 border-solid rounded-lg border-2 border-[#164A41] pl-4 ">
           <div className="flex">
            <button className="bg-white mr-2" style={{ fontSize: '18px' }}>Register now!</button>
             <button className="rounded-br-lg rounded-tr-lg bg-[#F1B24A] px-2 py-1 ml-8 text-lg">
                <svg
                  width="12"
                  height="21"
                  viewBox="0 0 20 36"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    opacity="0.4"
                    d="M13.2156 9.00221L0 18.6931L0 33.0375C0 35.4922 3.03565 36.7195 4.81522 34.9808L18.371 21.7359C20.543 19.6136 20.543 16.1617 18.371 14.0394L13.2156 9.00221Z"
                    fill="#164A41"
                  />
                  <path
                    d="M0 2.76626V18.6961L13.2156 9.00524L4.81522 0.797406C3.03565 -0.915755 0 0.311585 0 2.76626Z"
                    fill="#164A41"
                  />
                </svg>
              </button>
            </div>
          </div>

          <div className="flex flex-col items-end mx-3">
            <label style={{ fontSize: '18px' }}>Don&apos;t miss out!</label>
          </div>
          <div className="flex flex-col items-center mx-3 border border-solid rounded-lg border-2 border-[#164A41] pl-4">
           <div className="flex">
            <button className="bg-white mr-2" style={{ fontSize: '18px' }}>Newsletter</button>
             <button className="rounded-br-lg rounded-tr-lg bg-[#F1B24A] px-2 py-1 ml-8 text-lg">
                <svg
                  width="12"
                  height="21"
                  viewBox="0 0 20 36"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    opacity="0.4"
                    d="M13.2156 9.00221L0 18.6931L0 33.0375C0 35.4922 3.03565 36.7195 4.81522 34.9808L18.371 21.7359C20.543 19.6136 20.543 16.1617 18.371 14.0394L13.2156 9.00221Z"
                    fill="#164A41"
                  />
                  <path
                    d="M0 2.76626V18.6961L13.2156 9.00524L4.81522 0.797406C3.03565 -0.915755 0 0.311585 0 2.76626Z"
                    fill="#164A41"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className={`absolute top-0 w-full text-black bg-[#164A41] font-poppins z-10 ${activeHeader === 2 ? "h-[450px]" : "h-0 hidden" }`}>
        <div className="flex flex-col items-center mt-[2%]">
          <nav style={{ display: "flex", flexDirection: "column", justifyContent: "center" }} className="ml-[-317px] pt-12 items-left border border-[#9DC88D] px-20 mt-7 rounded-lg">
            {navigationButtons.map((link, index) => (
              <Link key={index} href={link.link}> 
                <div className={`tracking-wider ml-[-80px] relative block text-3xl w-auto h-full py-2 px-8 font-poppins text-white hover:bg-[#9DC88DBF] transition duration-300 ease-in-out ${router.pathname === link.link ? 'bg-gray-200' : ''}`}>
                  <div className={`activeButton absolute h-full w-[15%] ${activeHeader === 2 ? "bg-emerald-700" : ""} left-[-20%] ${router.pathname === link.link ? '' : 'hidden'}`}></div>
                  {link.name}                                 
                </div>
              </Link>
            ))}
          </nav>
        </div>
        <div className="flex flex-row w-full items-center justify-center absolute bottom-0 left-0 bg-white h-[15%] transition-transform">
          <div className="flex flex-col items-start mx-3">
            <label style={{ fontSize: '18px' }}>Become a Part of us!</label>
          </div>
          <div className="flex flex-col items-center mx-3 border-solid rounded-lg border-2 border-[#164A41] pl-4 ">
           <div className="flex">
            <button className="bg-white mr-2" style={{ fontSize: '18px' }}>Register now!</button>
             <button className="rounded-br-lg rounded-tr-lg bg-[#F1B24A] px-2 py-1 ml-8 text-lg">
                <svg
                  width="12"
                  height="21"
                  viewBox="0 0 20 36"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    opacity="0.4"
                    d="M13.2156 9.00221L0 18.6931L0 33.0375C0 35.4922 3.03565 36.7195 4.81522 34.9808L18.371 21.7359C20.543 19.6136 20.543 16.1617 18.371 14.0394L13.2156 9.00221Z"
                    fill="#164A41"
                  />
                  <path
                    d="M0 2.76626V18.6961L13.2156 9.00524L4.81522 0.797406C3.03565 -0.915755 0 0.311585 0 2.76626Z"
                    fill="#164A41"
                  />
                </svg>
              </button>
            </div>
          </div>

          <div className="flex flex-col items-end mx-3">
            <label style={{ fontSize: '18px' }}>Don&apos;t miss out!</label>
          </div>
          <div className="flex flex-col items-center mx-3 border border-solid rounded-lg border-2 border-[#164A41] pl-4">
           <div className="flex">
            <button className="bg-white mr-2" style={{ fontSize: '18px' }}>Newsletter</button>
             <button className="rounded-br-lg rounded-tr-lg bg-[#F1B24A] px-2 py-1 ml-8 text-lg">
                <svg
                  width="12"
                  height="21"
                  viewBox="0 0 20 36"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    opacity="0.4"
                    d="M13.2156 9.00221L0 18.6931L0 33.0375C0 35.4922 3.03565 36.7195 4.81522 34.9808L18.371 21.7359C20.543 19.6136 20.543 16.1617 18.371 14.0394L13.2156 9.00221Z"
                    fill="#164A41"
                  />
                  <path
                    d="M0 2.76626V18.6961L13.2156 9.00524L4.81522 0.797406C3.03565 -0.915755 0 0.311585 0 2.76626Z"
                    fill="#164A41"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default HeaderNEW;
