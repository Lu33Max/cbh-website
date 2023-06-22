import React, { useState, useContext } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/router";
import ClickContext from "~/context/click";
import { signOut, useSession } from "next-auth/react";

import { BiCart, BiLogIn, BiLogOut, BiSearch } from "react-icons/bi";

const Header: React.FC = () => {
  const { data: sessionData } = useSession();
  const [cartSamples,] = useContext(ClickContext)
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [activeHeader, setActiveHeader] = useState<number>(0);
  const [buttonClicked, setButtonClicked] = useState<boolean>(false);
  const [contactColor, setContactColor] = useState<string>("gray-700");

  const router = useRouter();

  const onSearch = (event: React.FormEvent) => {
    event.preventDefault();

    const encodedSearchQuery = encodeURI(searchQuery);
    void router.push(`/search/overall?q=${encodedSearchQuery}`);
  };

  const navigationButtons = [
    { name: "Home", link: "/" },
    { name: "Explore", link: "/search/overall" },
    { name: "Expert Search", link: "/search/expert" },
    { name: "Cart", link: "/cart" },
    { name: "About Us", link: "/about" },
  ];

  const handleButtonClick = (input: number) => {
    setActiveHeader(activeHeader === input ? 0 : input);
    setButtonClicked(activeHeader === input ? false : true);
    setContactColor("#164A41");
  };

  return (
    <>
      {/* Header */}
      <div
        className={`${buttonClicked ? "bg-[#164A41]" : "bg-white"} font-body relative z-[999] flex h-[80px] flex-row items-center pl-10 pr-5 font-poppins text-xl font-thin text-[#164A41] transition duration-500 ease-in-out`}
      >
        <a onClick={() => void router.push("/")}>
          <Image
            src="/cbh_logos/logo_black.png"
            alt="Logo"
            width={200}
            height={80}
            className="z-20 cursor-pointer"
          />
        </a>
        <div className="z-20 mx-auto flex flex-row justify-between gap-2">
          <button
            onClick={() => handleButtonClick(1)}
            className={`flex flex-row rounded-lg pl-2 pr-4 ${buttonClicked ? "text-white" : "text-[#164A41]"} ${activeHeader === 1 ? "bg-[#9DC88D]" : ""}`}
          >
            Services
            <div
              className={` ${activeHeader === 1 ? "-mr-3 rotate-180 pb-2 pr-2" : ""}`}
            >
              <svg
                width="12"
                height="21"
                viewBox="0 0 20 36"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className={`ml-2 translate-y-[4px] rotate-90 transform`}
              >
                <path
                  opacity="0.4"
                  d="M13.2156 9.00221L0 18.6931L0 33.0375C0 35.4922 3.03565 36.7195 4.81522 34.9808L18.371 21.7359C20.543 19.6136 20.543 16.1617 18.371 14.0394L13.2156 9.00221Z"
                  fill="black"
                />
                <path
                  d="M0 2.76626V18.6961L13.2156 9.00524L4.81522 0.797406C3.03565 -0.915755 0 0.311585 0 2.76626Z"
                  fill="black"
                />
              </svg>
            </div>
          </button>

          <button
            onClick={() => handleButtonClick(2)}
            className={`flex flex-row rounded-lg pl-2 pr-4 ${buttonClicked ? "text-white" : "text-[#164A41]"} ${activeHeader === 2 ? "bg-[#9DC88D]" : ""}`}
          >
            Navigation
            <div
              className={` ${activeHeader === 2 ? "-mr-3 rotate-180 pb-2 pr-2" : ""}`}
            >
              <svg
                width="12"
                height="21"
                viewBox="0 0 20 36"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="ml-2 translate-y-[4px] rotate-90 transform"
              >
                <path
                  opacity="0.4"
                  d="M13.2156 9.00221L0 18.6931L0 33.0375C0 35.4922 3.03565 36.7195 4.81522 34.9808L18.371 21.7359C20.543 19.6136 20.543 16.1617 18.371 14.0394L13.2156 9.00221Z"
                  fill="black"
                />
                <path
                  d="M0 2.76626V18.6961L13.2156 9.00524L4.81522 0.797406C3.03565 -0.915755 0 0.311585 0 2.76626Z"
                  fill="black"
                />
              </svg>
            </div>
          </button>

          <button
            className={`flex flex-row justify-center z-[999] w-[100px] text-center ${buttonClicked ? "text-white" : `text-${contactColor}`}`}
          >
            Contact
          </button>

          <button 
            className={`flex flex-row justify-center z-[999] w-[100px] text-center ${buttonClicked ? "text-white" : `text-${contactColor}`}`}
            onClick={() => void router.push("/cart")}
          >
            <BiCart className="text-3xl text-center relative bottom-1"/>
            Cart
            <div className="ml-1">({cartSamples.length})</div>
          </button>
        </div>
        <span className="relative z-20 block w-full max-w-[30%]">
          <form onSubmit={onSearch}>
            <input
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              className="rounded-m placeholder-center my-1 w-[100%] bg-[#9DC88D] bg-opacity-20 py-1 pl-10 pr-5 text-lg text-black drop-shadow-lg placeholder:italic placeholder:text-gray-700 focus:outline-none"
              placeholder="Search for specimen..."
            />
          </form>
          <div className="absolute inset-y-0 left-0 flex items-center pl-2">
            <BiSearch color="#555555" />
          </div>
        </span>
        <button className={`ml-5 mr-2 flex flex-row ${buttonClicked ? "text-white" : `text-${contactColor}`}`} onClick={sessionData ? () => void signOut() : () => void router.push(`/auth/login?prev=${router.asPath}`)}>
          {sessionData ? (
            <>
              <BiLogOut className="text-3xl mr-1 relative bottom-[0.125rem]"/>
              Logout
            </>
          ) : (
            <>
              <BiLogIn className="text-3xl mr-1 relative bottom-[0.125rem]"/>
              Login
            </>
          )}
        </button>
      </div>

      {/* Services */}
      <div
        className={`transition-height absolute top-0 w-full overflow-visible bg-[#164A41] text-black duration-500 ease-in-out ${
          activeHeader === 1 ? "z-[900] h-[450px]" : "-z-10 h-0 opacity-0"
        }`}
      >
        <div className="mt-[5%] flex w-full flex-row items-center justify-center">
          <div className="mx-3 flex flex-col items-center rounded-lg border border-solid border-[#9DC88D]">
            <span className="justify-center text-center text-2xl text-white">
              Easy Online
            </span>
            <span className="justify-center text-center text-2xl text-white">
              Ordering Process
            </span>
            <Image
              src="/image 10.png"
              alt="Logo"
              width={200}
              height={200}
              className="mx-10"
            />
          </div>
          <div className="mx-3 flex flex-col items-center rounded-lg border border-solid border-[#9DC88D]">
            <span className="justify-center text-center text-2xl text-white">
              Worldwide
            </span>
            <span className="justify-center text-center text-2xl text-white">
              Express Delivery
            </span>
            <Image
              src="/image 12.png"
              alt="Logo"
              width={200}
              height={200}
              className="mx-10"
            />
          </div>
          <div className="mx-3 flex flex-col items-center rounded-lg border border-solid border-[#9DC88D]">
            <span className="justify-center text-center text-2xl text-white">
              800.000+
            </span>
            <span className="justify-center text-center text-2xl text-white">
              Samples in Stock
            </span>
            <Image
              src="/image 11.png"
              alt="Logo"
              width={200}
              height={200}
              className="mx-10"
            />
          </div>
        </div>
        <div className="absolute bottom-0 left-0 flex h-[15%] w-full flex-row items-center justify-center bg-white transition-transform ">
          <div className="mx-3 flex flex-col items-start">
            <label style={{ fontSize: "18px" }}>Become a Part of us!</label>
          </div>
          <div className="mx-3 flex flex-col items-center rounded-lg border-2 border-solid border-[#164A41] pl-4 ">
            <div className="flex">
              <button className="mr-2 bg-white" style={{ fontSize: "18px" }}>
                Register now!
              </button>
              <button className="ml-8 rounded-br-lg rounded-tr-lg bg-[#F1B24A] px-2 py-1 text-lg">
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

          <div className="mx-3 flex flex-col items-end">
            <label style={{ fontSize: "18px" }}>Don&apos;t miss out!</label>
          </div>
          <div className="mx-3 flex flex-col items-center rounded-lg border-2 border-solid border-[#164A41] pl-4">
            <div className="flex">
              <button className="mr-2 bg-white" style={{ fontSize: "18px" }}>
                Newsletter
              </button>
              <button className="ml-8 rounded-br-lg rounded-tr-lg bg-[#F1B24A] px-2 py-1 text-lg">
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
      <div
        className={`transition-height absolute top-0 w-full overflow-visible bg-[#164A41] text-black duration-500 ease-in-out ${activeHeader === 2 ? "z-[900] h-[450px]" : "-z-10 h-0 opacity-0"}`}
      >
        <div className="mt-[2%] flex flex-col items-center">
          <nav
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
            }}
            className="items-left ml-[-317px] mt-14 rounded-lg border border-[#9DC88D] px-20 py-2"
          >
            {navigationButtons.map((link, index) => (
              <Link key={index} href={link.link}>
                <div
                  className={`relative ml-[-80px] block h-full w-auto rounded-r-full px-8 py-2 font-poppins text-3xl tracking-wider text-white transition duration-300 ease-in-out hover:bg-[#9DC88DBF]`}
                >
                  {link.name}
                </div>
              </Link>
            ))}
          </nav>
        </div>
        <div className="absolute bottom-0 left-0 flex h-[15%] w-full flex-row items-center justify-center bg-white transition-transform">
          <div className="mx-3 flex flex-col items-start">
            <label style={{ fontSize: "18px" }}>Become a Part of us!</label>
          </div>
          <div className="mx-3 flex flex-col items-center rounded-lg border-2 border-solid border-[#164A41] pl-4 ">
            <div className="flex">
              <button className="mr-2 bg-white" style={{ fontSize: "18px" }}>
                Register now!
              </button>
              <button className="ml-8 rounded-br-lg rounded-tr-lg bg-[#F1B24A] px-2 py-1 text-lg">
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

          <div className="mx-3 flex flex-col items-end">
            <label style={{ fontSize: "18px" }}>Don&apos;t miss out!</label>
          </div>
          <div className="mx-3 flex flex-col items-center rounded-lg border-2 border-solid border-[#164A41] pl-4">
            <div className="flex">
              <button className="mr-2 bg-white" style={{ fontSize: "18px" }}>
                Newsletter
              </button>
              <button className="ml-8 rounded-br-lg rounded-tr-lg bg-[#F1B24A] px-2 py-1 text-lg">
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

export default Header;
