import React from "react";
import Link from "next/link";
import { useRouter } from "next/router";

const HoverImages: React.FC = () => {
  const router = useRouter();

  return(
      
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
      
  )
}

export default HoverImages;
