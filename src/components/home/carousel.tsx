import React from "react";
import Slider from "react-slick";

export default function SimpleSlider() {
  const settings = {
    arrows: true,
    autoplay: true,
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 5,
    slidesToScroll: 1,   
  };
  return (
    <div className="h-[20vh] w-[80vw] mx-10">
      <Slider {...settings} className="items-center justify-center text-center">
        <div>
          <img src="/erstens1.png" alt="Logo" width={150} height={150} className="m-auto"/>
        </div>
        <div>
          <img src="/zweitens.png" alt="Logo" width={150} height={150} className="m-auto"/>
        </div>
        <div>
          <img src="/drittens.png" alt="Logo" width={150} height={150} className="m-auto"/>
        </div>
        <div>
          <img src="/vier.png" alt="Logo" width={150} height={150} className="m-auto"/>
        </div>
        <div>
          <img src="/funf.png" alt="Logo" width={150} height={150} className="m-auto"/>
        </div>
        <div>
          <img src="/sechs.png" alt="Logo" width={150} height={150} className="m-auto"/>
        </div>
        <div>
          <img src="/sieben.png" alt="Logo" width={150} height={150} className="m-auto"/>
        </div>
      </Slider>
    </div>
  );
}
