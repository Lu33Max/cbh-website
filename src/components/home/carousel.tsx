import Image from "next/image";
import React from "react";

import Slider from "react-slick";
import { type ISliderSettings } from "~/common/types";

export const CarouselType = {
  categories: 0,
  partners: 1,
  testimonials: 2
}

type props = {
  type: number,
  settings: ISliderSettings,
  style: string
}

const Carousel: React.FC<props> = ({type, settings, style}) => {
  // Categories
  const categories = 24
  const categoryContents: JSX.Element[] = []
  const categoryLabels = ["Overall", "Pregnancy", "Infectious Diseases", "Sexually Transmitted Diseases", "Cancer Samples", "Allergies", "Autoimmune Disease", "Cardiovascular Diseases", 
  "Musculoskeletal System and Connective Tissue", "Endocrine Disorders", "COVID 19", "Gynaecology", "Healthy Donors", "Metabolic Disorders", "Parasitology", "Neurological Disorders", 
  "Respiratory Tract Infections", "Tropical Infections", "Other Vector Borne Diseases", "Specimen Matrix", "Tissue Bank", "Cell Products", "Other Biofluids", "Dermatological Diseases"]

  for(let i = 0; i < categories; i++){
    categoryContents.push(
      <div key={100 + i} className="flex flex-col justify-start">
        <Image className="mx-auto mb-2" src={`/slider/categories/${i+1}.png`} alt={`category${i}`} width={80} height={80}/>
        {categoryLabels[i] || ""}
      </div>
    )
  }

  //Testimonials
  const testimonialContents: JSX.Element[] = [
    <div key={201} className="text-2xl">
      <p className="">Undoubtedly, Central BioHub is an internet store with millions of banked samples readily available. Last day, I ordered AI plasma specimens within ten minutes. Other industries can take a leaf out of their book.</p>
      <p className="text-lime-600 mt-2">- Alžbeta, CZ (18.01.2023)</p>
    </div>,
    <div key={202} className="text-2xl">
      <p className="">I downloaded the Central Biohub mobile app on my iPhone 12. Now I can browse for IBD sera on my way to work without the need for a laptop. Moreover, It has a user-friendly design with all website features. I loved it!</p>
      <p className="text-lime-600 mt-2">- Zhara, Qatar (04.12.2022)</p>
    </div>,       
    <div key={203} className="text-2xl">
      <p className="">Wow, I made my first purchase through your Android app. It is a straightforward and easy-to-use application with lots of tools and features.</p>
      <p className="text-lime-600 mt-2">- Elsie M., USA (29.11.2022)</p>
    </div>,
    <div key={204} className="text-2xl">
      <p className="">Previously, I spent a long time in sample procurement of allergy biospecimens, which was tiring. This platform helped me to speed up the acquisition procedure of serum samples.</p>
      <p className="text-lime-600 mt-2">- George, USA (California) (23.11.2022)</p>
    </div>,
    <div key={205} className="text-2xl">
      <p className="">CentralBioHub was a great help in finding the right samples for my project. Previously, I used to spend a long time in sample procurement. Now, CentralBioHub is my preferred platform for biospecimen acquisition.</p>
      <p className="text-lime-600 mt-2">- Chiyo, JP (24.10.2022)</p>
    </div>,
    <div key={206} className="text-2xl">
      <p className="">Instead of contacting the sales department, I was able to reserve the desired samples per category and discuss them with the project management team before purchase. This saved a lot of my time without the exchange of Excel sheets or other files.</p>
      <p className="text-lime-600 mt-2">- Thorben, DE (11.10.2022)</p>
    </div>,
    <div key={207} className="text-2xl">
      <p className="">This webshop for human biospecimen procurement is truly a game changer in the whole biomedical industry. The biggest advantage is that we can directly view every sample detail, without having to make requests as we do with other biospecimen providers.</p>
      <p className="text-lime-600 mt-2">- Claudia, DE (20.09.2022)</p>
    </div>
  ]

  return (
    <>
      {type === CarouselType.categories && (
        <Slider {...settings} className={style}>
          {categoryContents.map(el => (
            el
          ))}
        </Slider>
      )}
      {type === CarouselType.testimonials && (
        <Slider {...settings} className={style + "font-poppins"}>
        {testimonialContents.map(el => (
          el
        ))}
      </Slider>
      )}
    </>
  )
}

export default Carousel