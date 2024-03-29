import { type NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/router";
import Header from "~/components/overall/header";
import Carousel, { CarouselType } from "~/components/home/carousel";
import useWindowSize from "~/utils/window";
import Footer from "~/components/overall/footer";

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>Central BioHub</title>
        <meta name="description" content="Central BioHub - Biospecimens Online" />
        <link rel="icon" href="/CBH_Logo_NoText.png" />
      </Head>

      <div className="fixed max-h-full min-h-full min-w-full max-w-full overflow-hidden bg-gray-100">
        <div className="flex flex-col">
          <Header />
          <Content />
        </div>
      </div>
    </>
  );
};

export default Home;

const Content: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const router = useRouter();
  const windowSize = useWindowSize();

  const onSearch = (event: React.FormEvent) => {
    event.preventDefault();
    const encodedSearchQuery = encodeURI(searchQuery);
    void router.push(`/search/overall?q=${encodedSearchQuery}`);
  };

  // Slider Contents
  const settings = {
    arrows: true,
    autoplay: true,
    dots: windowSize.width && windowSize.width < 500 ? false : true,
    infinite: true,
    speed: 500,
    autoplaySpeed: 5000,
    slidesToShow: Math.floor(windowSize.width ? windowSize.width / 250 : 6),
    slidesToScroll: windowSize.width && windowSize.width < 500 ? 1 : 2,
  };

  const style = "items-center justify-center text-center mx-10 ";

  return (
    <div className="max-h-[calc(100vh-80px)] overflow-x-hidden overflow-y-scroll font-poppins">
      <div className={`relative h-fit w-full`}>
        <Image
          src="/home/BannerNoFont.png"
          alt="Banner"
          className="w-full blur-sm filter"
          width={windowSize.width ? windowSize.width : 1920}
          height={windowSize.height ? windowSize.height : 700}
        />
        <div className="absolute inset-20 flex flex-col justify-center">
          <div className="text-center">
            <h1
              className="text-6xl font-bold text-white drop-shadow-sm"
              style={{
                textShadow: "0px 0px 4px rgba(0, 0, 0, 0.2)",
                WebkitTextStroke: "0.2px black",
              }}
            >
              Explore the Abundance
            </h1>
            <p
              className="mt-4 text-2xl font-bold text-white"
              style={{
                textShadow: "0px 0px 4px rgba(0, 0, 0, 0.2)",
                WebkitTextStroke: "0.2px black",
              }}
            >
              Find the perfect human biospecimens for you.
            </p>
          </div>

          <div className="justify-center text-center">
            {/*search input field with submit button*/}
            <div className="mt-10 flex items-center justify-center rounded px-4 py-2">
              <form onSubmit={onSearch}>
                <input
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  className="flex-grow-1 rounded-l-lg border-b border-l border-t border-solid border-white bg-white bg-opacity-60 text-center text-lg font-semibold text-[#164A41] placeholder-[#164A41]"
                  placeholder="Start exploring"
                ></input>
              </form>
              <button
                className="rounded-br-lg rounded-tr-lg bg-[#164A41] px-2 py-1 text-lg"
                onClick={onSearch}
              >
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
                    fill="white"
                  />
                  <path
                    d="M0 2.76626V18.6961L13.2156 9.00524L4.81522 0.797406C3.03565 -0.915755 0 0.311585 0 2.76626Z"
                    fill="white"
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
      {/*category carousel*/}
      <div className="mt-5 pt-5">
        <Carousel
          type={CarouselType.categories}
          settings={settings}
          style={style}
        />
      </div>
      <div
        className={`${
          windowSize.width && windowSize.width < 500 ? "mt-3" : "mt-10"
        } flex w-full flex-row items-center justify-center`}
      >
        <h1 className="relative">
          <span className="headline inline-block">Popular Samples</span>
          <span className="absolute -bottom-1 left-1/2 h-[2px] w-20 -translate-x-1/2 transform rounded-full bg-[#164A41]"></span>
        </h1>
      </div>

      <div
        className={`mb-10 mt-8 flex items-center text-center ${
          windowSize.width && windowSize.width < 600
            ? "flex-col gap-12"
            : "flex-row"
        } justify-evenly`}
      >
        <div className="relative bottom-0 left-0 shadow-[-30px_30px_0px_0px_rgba(157,200,141,0.25)] transition-all duration-300 ease-in-out hover:bottom-2 hover:left-2 hover:shadow-[-45px_45px_0px_0px_rgba(157,200,141,0.25)]">
          <div className="shadow-[-30px_30px_0px_0px_rgba(157,200,141,0.25)] duration-300 hover:shadow-[-23px_23px_0px_0px_rgba(157,200,141,0.25)]">
            <Image
              src="/home/cards/allergy.png"
              alt="allergy"
              className="border-b-2 border-[#164A41] object-contain"
              width={300}
              height={300}
            />
            <div className="flex w-[300px] flex-col bg-white p-6">
              <div className="h-full items-start text-center">
                Spring is Coming!
              </div>
              <div className="h-full items-start text-center">
                Allergy Season Ahead
              </div>
            </div>
          </div>
        </div>
        <div className="relative bottom-0 left-0 shadow-[-30px_30px_0px_0px_rgba(157,200,141,0.25)] transition-all duration-300 ease-in-out hover:bottom-2 hover:left-2 hover:shadow-[-45px_45px_0px_0px_rgba(157,200,141,0.25)]">
          <div className="shadow-[-30px_30px_0px_0px_rgba(157,200,141,0.25)] duration-300 hover:shadow-[-23px_23px_0px_0px_rgba(157,200,141,0.25)]">
            <Image
              src="/home/cards/pink.png"
              alt="pink stuff"
              className="border-b-2 border-[#164A41] object-contain"
              width={300}
              height={300}
            />
            <div className="flex w-[300px] flex-col bg-white p-6">
              <div className="h-full items-start text-center">
                Discover Endocrine Disorder Biospecimens
              </div>
            </div>
          </div>
        </div>
        <div className="relative bottom-0 left-0 shadow-[-30px_30px_0px_0px_rgba(157,200,141,0.25)] transition-all duration-300 ease-in-out hover:bottom-2 hover:left-2 hover:shadow-[-45px_45px_0px_0px_rgba(157,200,141,0.25)]">
          <div className="shadow-[-30px_30px_0px_0px_rgba(157,200,141,0.25)] duration-300 hover:shadow-[-23px_23px_0px_0px_rgba(157,200,141,0.25)]">
            <Image
              src="/home/cards/mosquito.png"
              alt="mosquito"
              className="border-b-2 border-[#164A41] object-contain"
              width={300}
              height={300}
            />
            <div className="flex w-[300px] flex-col bg-white p-6">
              <div className="h-full items-start text-center">
                Be Aware! Tropical Infection Biospecimens
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="mb-10 mt-20 flex w-full flex-row items-center justify-center">
        <h1 className="relative">
          <span className="headline inline-block">
            Our Partners - Your Biospecimen Suppliers
          </span>
          <span className="absolute -bottom-1 left-1/2 h-[2px] w-20 -translate-x-1/2 transform rounded-full bg-[#164A41]"></span>
        </h1>
      </div>
      <div>
        <div className="relative my-5 h-[auto] flex-row items-center justify-center justify-items-center bg-[rgba(157,200,141,0.25)]">
          <Carousel
          type={CarouselType.partners}
          settings={{
            ...settings,
            slidesToShow: 1,
            dots: false,
            slidesToScroll: 1,
          }}
          style={style}
          />
        </div>
      </div>
      <div className="m-auto mb-10 mt-5 flex items-center justify-center">
        <div className="headline mx-4 text-center text-[#164A41]">
          <div className="inline-block px-32 ">Follow Our Journey!</div>
          {/*social media icons*/}
          <div className="mt-2 flex w-full flex-wrap rounded-lg border-2 border-[#164A41] p-4">
            <Image
              src="/facebook.png"
              alt=""
              className="mx-4"
              width={32}
              height={60}
            />
            <Image
              src="/twitter.png"
              alt=""
              className="mx-4"
              width={75}
              height={60}
            />
            <Image
              src="/youtube.png"
              alt=""
              className="mx-4"
              width={75}
              height={60}
            />
            <Image
              src="/instagram.png"
              alt=""
              className="mx-4"
              width={60}
              height={60}
            />
            <Image
              src="/linkedin.png"
              alt=""
              className="mx-4"
              width={66}
              height={60}
            />
          </div>
        </div>
        <div className="headline mx-16 text-center text-[#164A41]">
          <div className="inline-block px-[140px] ">Testimonials</div>
          <div className="mt-2 flex w-full justify-end rounded-lg border-2 border-[#164A41]">
            <div className="flex flex-1 flex-col justify-center text-center text-2xl font-semibold">
              Look What People
              <br />
              Say About Us!
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
        <div className="headline mx-4 text-center text-[#164A41]">
          <div className="inline-block px-[140px]">Payment Methods</div>
          {/*payment icons*/}
          <div className="mt-2 flex w-full flex-wrap rounded-lg border-2 border-[#164A41] p-4">
            <Image
              src="/Paypal.png"
              alt=""
              className="ml-4 mr-6"
              width={55}
              height={60}
            />
            <Image
              src="/amex.png"
              alt=""
              className="mx-6"
              width={67}
              height={60}
            />
            <Image
              src="/Visa.png"
              alt=""
              className="mx-6"
              width={90}
              height={60}
            />
            <Image
              src="/Mastercard.png"
              alt=""
              className="ml-6 mr-4"
              width={91}
              height={60}
            />
          </div>
        </div>
      </div>
      <div className="headline relative mx-10 mb-4 justify-center rounded-lg border-2 border-[#164A41] p-4 text-center italic text-[#164A41]">
        <Carousel
          type={CarouselType.testimonials}
          settings={{
            ...settings,
            slidesToShow: 1,
            dots: false,
            slidesToScroll: 1,
          }}
          style={style}
        />
      </div>
      <Footer />
    </div>
  );
};
