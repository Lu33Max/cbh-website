import React, { useRef } from 'react';
import Slider from "react-slick";
import Image from "next/image";


export default function SimpleSlider() {
  const sliderRef = useRef(null);

  const goToPreviousSlide = () => {
    if (sliderRef.current) {
      //sliderRef.current.slickPrev();
    }
  };

  const goToNextSlide = () => {
    if (sliderRef.current) {
      //sliderRef.current.slickNext();
    }
  };

  const settings = {
    arrows: false,
    autoplay: true,
    dots: true,
    infinite: true,
    speed: 500,
    autoplaySpeed: 5000,
    slidesToShow: 6,
    slidesToScroll: 1,
  };

  return (
    <div className="h-[20vh] w-[96vw] mx-10 border border-solid border-[#164A41] rounded-lg pt-5 relative">
      <Slider ref={sliderRef} {...settings} className="items-center justify-center text-center">
      <div>
          <Image src="/erstens1.png" alt="Logo" width={150} height={150} className="m-auto"/>
        </div>
        <div>
          <Image src="/zweitens.png" alt="Logo" width={150} height={150} className="m-auto"/>
        </div>
        <div>
          <Image src="/drittens.png" alt="Logo" width={150} height={150} className="m-auto"/>
        </div>
        <div>
          <Image src="/vier.png" alt="Logo" width={150} height={150} className="m-auto"/>
        </div>
        <div>
          <Image src="/funf.png" alt="Logo" width={150} height={150} className="m-auto"/>
        </div>
        <div>
          <Image src="/sechs.png" alt="Logo" width={150} height={150} className="m-auto"/>
        </div>
        <div>
          <Image src="/sieben.png" alt="Logo" width={150} height={150} className="m-auto"/>
        </div>
        </Slider>
      <button type="button" className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-transparent border-none cursor-pointer text-white text-3xl scale-x-[-1]" onClick={goToPreviousSlide}>
      <svg xmlns="http://www.w3.org/2000/svg" id="Outline" viewBox="0 0 24 24" width="32" height="32"><path d="M15.4,9.88,10.81,5.29a1,1,0,0,0-1.41,0,1,1,0,0,0,0,1.42L14,11.29a1,1,0,0,1,0,1.42L9.4,17.29a1,1,0,0,0,1.41,1.42l4.59-4.59A3,3,0,0,0,15.4,9.88Z"/></svg>

      </button>
      <button type="button" className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-transparent border-none cursor-pointer text-white text-3xl" onClick={goToNextSlide}>
      <svg xmlns="http://www.w3.org/2000/svg" id="Outline" viewBox="0 0 24 24" width="32" height="32"><path d="M15.4,9.88,10.81,5.29a1,1,0,0,0-1.41,0,1,1,0,0,0,0,1.42L14,11.29a1,1,0,0,1,0,1.42L9.4,17.29a1,1,0,0,0,1.41,1.42l4.59-4.59A3,3,0,0,0,15.4,9.88Z"/></svg>
      </button>
    </div>
  );
}