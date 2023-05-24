import { type NextPage } from "next";
import Head from "next/head";

import HeaderNEW from "~/components/overall/headerNEW";
import SimpleSlider from "~/components/home/carousel";
import HoverImages from "~/components/overall/hoverImages";
import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/router";

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>Central BioHub</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="min-h-screen overflow-hidden bg-gray-200">
        <HeaderNEW />
        <Content />
      </div>
    </>
  );
};

export default Home;

const Content: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const router = useRouter();

  const onSearch = (event: React.FormEvent) => {
    event.preventDefault();

    const encodedSearchQuery = encodeURI(searchQuery);
    void router.push(`/search?q=${encodedSearchQuery}`);
  };

  return (
    <div className="relative">
      <Image
        src="/home/BannerNoFont.png"
        alt="Banner"
        width={1920}
        height={350}
        className="w-full blur-sm filter"
      />
      <div className="absolute inset-20 flex justify-center pb-20">
        <div className="text-center">
          <h1 className="text-6xl font-bold text-white">
            <span
              style={{
                textShadow: "0px 0px 4px rgba(0, 0, 0, 0.2)",
                WebkitTextStroke: "0.4px black",
              }}
            >
              Explore the Abundance
            </span>
          </h1>

          <p className="mt-4 text-2xl font-bold text-white">
            <span
              style={{
                textShadow: "0px 0px 4px rgba(0, 0, 0, 0.2)",
                WebkitTextStroke: "0.4px black",
              }}
            >
              Find the perfect human biospecmens for you.
            </span>
          </p>

          <div className="justify-center text-center">
            <div className="mt-10 flex items-center justify-center rounded px-4 py-2">
              <form onSubmit={onSearch}>
                <input
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  className="flex-grow-1 rounded-l-lg border-b border-l border-t border-solid border-white bg-white bg-opacity-60 text-lg font-semibold text-[#164A41] placeholder-[#164A41]"
                  placeholder="Start exploring"
                ></input>
              </form>
              <button className="rounded-br-lg rounded-tr-lg bg-[#164A41] px-2 py-1 text-lg">
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
                    fill="black"
                  />
                  <path
                    d="M0 2.76626V18.6961L13.2156 9.00524L4.81522 0.797406C3.03565 -0.915755 0 0.311585 0 2.76626Z"
                    fill="black"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-10 flex w-full flex-row items-center justify-center">
        <div className="m-5  h-3 w-full rounded-3xl border-gray-400"></div>
        <h1 className="headline mb-2 ml-20 mr-20 whitespace-nowrap">
          Welcome to Central Biohub
        </h1>
        <div className="m-5  h-3 w-full rounded-3xl border-gray-400"></div>
      </div>
      <div className="flex w-full flex-row items-center justify-center">
        <h1 className="mx-20 mb-2 whitespace-nowrap text-xl">
          the world`s smartest biospecimen marketplace
        </h1>
      </div>
      <div className="mt-5 pt-5">
        <SimpleSlider />
      </div>
      <div className="mt-10 flex w-full flex-row items-center justify-center">
        <h1 className="relative">
          <span className="headline inline-block font-poppins">
            lorem ipsum
          </span>
          <span className="absolute -bottom-1 left-1/2 h-[2px] w-20 -translate-x-1/2 transform rounded-full bg-[#164A41]"></span>
        </h1>
      </div>
      <div className="mb-10 ml-[128px] mt-5 grid w-full grid-cols-3 items-center justify-center">
        <div>
          <Image
            src="/placeholderTest.jpg"
            alt=""
            className="custom-shadow mx-16 w-max border-b-2 border-[#164A41] object-contain"
            width={225}
            height={210}
          />
          <div className="mx-16 flex w-[225px] flex-col bg-white p-6">
            <div className="h-full items-start text-center font-poppins">
              lorem ipsum
            </div>
          </div>
        </div>
        <div>
          <Image
            src="/placeholderTest.jpg"
            alt=""
            className="custom-shadow mx-16 w-max border-b-2 border-[#164A41] object-contain"
            width={225}
            height={210}
          />
          <div className="mx-16 flex w-[225px] flex-col bg-white p-6">
            <div className="h-full items-start text-center font-poppins">
              lorem ipsum
            </div>
          </div>
        </div>
        <div>
          <Image
            src="/placeholderTest.jpg"
            alt=""
            className="custom-shadow mx-16 w-fit border-b-2 border-[#164A41] object-contain"
            width={225}
            height={210}
          />
          <div className="mx-16 flex w-[225px] flex-col bg-white p-6">
            <div className="h-full items-start text-center font-poppins">
              lorem ipsum
            </div>
          </div>
        </div>
      </div>
      <div className="my-10 flex w-full flex-row items-center justify-center">
        <h1 className="relative">
          <span className="headline inline-block font-poppins">
            Our Partners - Your Suppliers
          </span>
          <span className="absolute -bottom-1 left-1/2 h-[2px] w-20 -translate-x-1/2 transform rounded-full bg-[#164A41]"></span>
        </h1>
      </div>
      <div>
        <div className="my-6 flex h-fit w-full flex-row items-center justify-center">
          <Image
            src="/placeholdergreen.png"
            alt=""
            className="custom-shadow opacity-50"
            width={1920}
            height={280}
          />
        </div>
      </div>
      <div className="m-auto mb-10 mt-5 flex items-center justify-center">
        <div className="headline mx-4 text-center font-poppins text-[#164A41]">
          <div className="inline-block px-32">Follow Our Journey!</div>
          <div className="mt-2 flex w-full flex-wrap rounded-lg border-2 border-[#164A41] p-4">
            <Image src="facebook.png" alt="" className="mx-4" />
            <Image src="twitter.png" alt="" className="mx-4" />
            <Image src="youtube.png" alt="" className="mx-4" />
            <Image src="instagram.png" alt="" className="mx-4" />
            <Image src="linkedin.png" alt="" className="mx-4" />
          </div>
        </div>
        <div className="headline mx-16 text-center font-poppins text-[#164A41]">
          <div className="inline-block px-[140px] ">Testimonials</div>
          <div className="mt-2 flex w-full justify-end rounded-lg border-2 border-[#164A41]">
            <div className="flex flex-1 flex-col justify-center text-center font-poppins text-2xl font-semibold">
              <div>Look What People</div>
              <div>Say About Us!</div>
            </div>
            <button className="flex h-full rounded-br-lg rounded-tr-lg border-[#F1B24A] bg-[#F1B24A] px-8 py-[32px] text-lg">
              <svg
                width="19"
                height="32"
                viewBox="0 0 20 36"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="h-full"
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
        <div className="headline mx-4 text-center font-poppins text-[#164A41]">
          <div className="inline-block px-[140px]">Payment Methods</div>
          <div className="mt-2 flex w-full flex-wrap rounded-lg border-2 border-[#164A41] p-4">
            <Image src="Paypal.png" alt="" className="ml-4 mr-6" />
            <Image src="amex.png" alt="" className="mx-6" />
            <Image src="Visa.png" alt="" className="mx-6" />
            <Image src="Mastercard.png" alt="" className="ml-6 mr-4" />
          </div>
        </div>
      </div>
      <HoverImages />
      <div className="my-5 h-0 w-full rounded-3xl border-2 border-solid border-gray-400"></div>
      <div className="text-center">
        <h1 className="mb-2 font-poppins text-2xl text-[#164A41]">
          Central BioHub GmbH, Neuendorfstrasse 17, 16761 Hennigsdorf, Germany |
          Call: +49 3302 230 91 66 | Email: info@centralbiohub.com
        </h1>
        <h1 className="mb-2 font-poppins text-2xl text-[#164A41]">
          © 2023 www.centralbiohub.de All Rights Reserved - Link to Imprint here
        </h1>
      </div>
    </div>
  );
};
