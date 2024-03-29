import { type NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import HeaderNEW from "~/components/overall/header";
import useWindowSize from "~/utils/window";
import Footer from "~/components/overall/footer";

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>Central BioHub</title>
        <meta name="description" content="Central BioHub - About us" />
        <link rel="icon" href="/CBH_Logo_NoText.png" />
      </Head>

      <div className="fixed max-h-full min-h-full min-w-full max-w-full overflow-hidden bg-gray-100">
        <div className="flex flex-col">
          <HeaderNEW />
          <Content />
        </div>
      </div>
    </>
  );
};

export default Home;

const Content: React.FC = () => {
  const windowSize = useWindowSize();

  return (
    <div className="max-h-[calc(100vh-80px)] overflow-x-hidden overflow-y-scroll font-poppins">
      <div className={`relative h-fit w-full`}>
        <Image
          src="/about/banner.jpg"
          alt="Banner"
          className="w-full blur-sm filter"
          width={windowSize.width ? windowSize.width : 1920}
          height={windowSize.height ? windowSize.height : 700}
        />
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
      <Footer />
    </div>
  );
};
