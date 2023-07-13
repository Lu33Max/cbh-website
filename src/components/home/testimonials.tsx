import React from "react";
import Slider from "react-slick";

export default function SimpleSlider() {
  const settings = {
    arrows: true,
    autoplay: true,
    dots: true,
    infinite: true,
    speed: 1000,
    autoplaySpeed: 10000,
    slidesToShow: 1,
    slidesToScroll: 1,
  };

  return (
    <div className="mx-10 h-[20vh] max-w-full font-poppins text-2xl">
      <Slider {...settings} className="items-center justify-center text-center">
        <div>
          <div className="mb-2">
            <p className="">
              Undoubtedly, Central BioHub is an internet store with millions of
              banked samples readily available. Last day, I ordered AI plasma
              specimens within ten minutes. Other industries can take a leaf out
              of their book.
            </p>
            <p className="text-lime-600 ">- Alžbeta, CZ (18.01.2023)</p>
          </div>
        </div>
        <div>
          <div>
            <p className="">
              I downloaded the Central Biohub mobile app on my iPhone 12. Now I
              can browse for IBD sera on my way to work without the need for a
              laptop. Moreover, It has a user-friendly design with all website
              features. I loved it!
            </p>
            <p className="text-lime-600 ">- Zhara, Qatar (04.12.2022)</p>
          </div>
        </div>
        <div>
          <div>
            <p className="">
              Wow, I made my first purchase through your Android app. It is a
              straightforward and easy-to-use application with lots of tools and
              features.
            </p>
            <p className="text-lime-600 ">- Elsie M., USA (29.11.2022)</p>
          </div>
        </div>
        <div>
          <div>
            <p className="">
              Previously, I spent a long time in sample procurement of allergy
              biospecimens, which was tiring. This platform helped me to speed
              up the acquisition procedure of serum samples.
            </p>
            <p className="text-lime-600 ">
              - George, USA (California) (23.11.2022)
            </p>
          </div>
        </div>
        <div>
          <div>
            <p className="">
              CentralBioHub was a great help in finding the right samples for my
              project. Previously, I used to spend a long time in sample
              procurement. Now, CentralBioHub is my preferred platform for
              biospecimen acquisition.
            </p>
            <p className="text-lime-600 ">- Chiyo, JP (24.10.2022)</p>
          </div>
        </div>
        <div>
          <div>
            <p className="">
              Instead of contacting the sales department, I was able to reserve
              the desired samples per category and discuss them with the project
              management team before purchase. This saved a lot of my time
              without the exchange of Excel sheets or other files.
            </p>
            <p className="text-lime-600 ">- Thorben, DE (11.10.2022)</p>
          </div>
        </div>
        <div>
          <div>
            <p className="">
              This webshop for human biospecimen procurement is truly a game
              changer in the whole biomedical industry. The biggest advantage is
              that we can directly view every sample detail, without having to
              make requests as we do with other biospecimen providers.
            </p>
            <p className="text-lime-600 ">- Claudia, DE (20.09.2022)</p>
          </div>
        </div>
      </Slider>
    </div>
  );
}
