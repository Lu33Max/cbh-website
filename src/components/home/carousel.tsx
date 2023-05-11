import React from "react";
import Slider from "react-slick";
import Image from "next/image";

export default function SimpleSlider() {
  const settings = {
    arrows: true,
    autoplay: true,
    dots: true,
    infinite: true,
    speed: 500,
    autoplaySpeed: 5000,
    slidesToShow: 6,
    slidesToScroll: 1,   
  };
  return (
    <div className="h-[20vh] w-[100vw] mx-10">
      <Slider {...settings} className="items-center justify-center text-center">
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
    </div>
  );
}
