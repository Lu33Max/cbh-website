import { type NextPage } from "next";
import Head from "next/head";

import Header from "~/components/overall/header";
import Sidebar from "~/components/overall/sidebar";
import SimpleSlider from "~/components/home/carousel"
import Testimonials from "~/components/home/testimonials";

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>Central BioHub</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico"/>
      </Head>
      
      <main className="bg-gray-200 min-h-screen max-h-screen max-w-[100vw] overflow-x-hidden overflow-y-hidden ">
        <div className="flex flex-col">
          <Header/>
          <div className="flex flex-row">
            <Sidebar/>
            <Content/>
          </div>
        </div>
      </main>
    </>
  );
};

export default Home;

const Content: React.FC = () => {

  return(
    <div className="max-h-[95vh] overflow-y-scroll overflow-x-hidden">
      <div className="flex flex-row w-full items-center justify-center">
        <div className="w-full border-2 border-solid h-3 border-gray-400 rounded-3xl m-5"></div>
        <h1 className="headline whitespace-nowrap ml-20 mr-20 mb-2">Welcome to CBH!</h1>
        <div className="w-full border-2 border-solid h-3 border-gray-400 rounded-3xl m-5"></div>
      </div>
      <img src="/banner.png" alt="Banner" className="m-auto w-full"/>
      <div className="flex flex-row w-full items-center justify-center">
        <div className="w-full border-2 border-solid h-3 border-gray-400 rounded-3xl m-5"></div>
        <h1 className="headline whitespace-nowrap ml-20 mr-20 mb-1">Biospecimen Categories</h1>
        <div className="w-full border-2 border-solid h-3 border-gray-400 rounded-3xl m-5"></div>
      </div>
      <div className="mt-5">
        <SimpleSlider/>
      </div>
      <div className="flex flex-row w-full items-center justify-center">
        <div className="w-full border-2 border-solid h-3 border-gray-400 rounded-3xl m-5"></div>
        <h1 className="headline whitespace-nowrap ml-20 mr-20 mb-2">Our Partners - Your Suppliers</h1>
        <div className="w-full border-2 border-solid h-3 border-gray-400 rounded-3xl m-5"></div>
      </div>
      <div className="flex flex-row w-full items-center justify-center">
        <a href="https://indorivclinical.com/" className="w-full ml-5 mr-20 sponsor-link">
          <img src="/image_13.png" alt="Indoriv Clinical Logo" className="imgSponsor m-auto"/>
        </a>
        <a href="https://audubonbio.com/" className="w-full ml-5 mr-5 sponsor-link">
          <img src="/image 16.png" alt="Audobon Bioscience Logo" className="imgSponsor m-auto"/>
        </a>
        <a href="https://www.innov-research.com/" className="w-full ml-5 mr-20 sponsor-link">
          <img src="/new.png" alt="Innovate Research Logo" className="imgSponsor m-auto"/>
        </a>
      </div>
      <div className="flex flex-row w-full items-center justify-center mt-5">
        <div className="w-full border-2 border-solid h-3 border-gray-400 rounded-3xl m-5"></div>
        <h1 className="headline whitespace-nowrap ml-20 mr-20 mb-2">Testimonials</h1>
        <div className="w-full border-2 border-solid h-3 border-gray-400 rounded-3xl m-5"></div>
      </div>
      <div className="mt-5">
        <Testimonials/>
      </div>

    </div>
  )
}
