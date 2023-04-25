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
          <img src="/CBH Logo.png" alt="Logo" width={200} height={200} className="m-auto"/>
        </div>
        <div>
          <img src="/CBH Logo.png" alt="Logo" width={200} height={200} className="m-auto"/>
        </div>
        <div>
          <img src="/CBH Logo.png" alt="Logo" width={200} height={200} className="m-auto"/>
        </div>
        <div>
          <img src="/CBH Logo.png" alt="Logo" width={200} height={200} className="m-auto"/>
        </div>
        <div>
          <img src="/CBH Logo.png" alt="Logo" width={200} height={200} className="m-auto"/>
        </div>
        <div>
          <img src="/CBH Logo.png" alt="Logo" width={200} height={200} className="m-auto"/>
        </div>
      </Slider>
    </div>
  );
}
