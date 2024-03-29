import React, { useEffect, useState } from "react";

import { type NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { usePathname } from "next/navigation";

import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Popover from "react-bootstrap/Popover";
import { BiHome, BiX } from "react-icons/bi";

import { type INormalFilter } from "~/common/filter/filter";
import { Colors } from "~/common/styles";
import { gridData } from "~/common/data";

import { NormalFilterSchema } from "~/common/filter/filter";
import Header from "~/components/overall/header";
import AutoComplete from "~/components/search/normal/autofill";
import Footer from "~/components/overall/footer";
import Table from "~/components/search/table";
import ModalLoad from "~/components/search/normal/modalLoad";
import ModalSave from "~/components/search/normal/modalSave";

import useWindowSize from "~/utils/window";
import { api } from "~/utils/api";

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>Central BioHub</title>
        <meta name="description" content="Central BioHub - Overall Search" />
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
  const defaultFilter: INormalFilter = {
    CBH_Master_ID: {
      value: undefined,
      mandatory: true,
    },
    CBH_Donor_ID: {
      value: undefined,
      mandatory: true,
    },
    CBH_Sample_ID: {
      value: undefined,
      mandatory: true,
    },
    Price: {
      min: undefined,
      max: undefined,
      mandatory: true,
    },
    Matrix: {
      value: [],
      mandatory: true,
    },
    Quantity: {
      min: undefined,
      max: undefined,
      mandatory: true,
    },
    Unit: {
      value: [],
      mandatory: true,
    },
    Lab_Parameter: {
      value: [],
      mandatory: true,
    },
    Result_Interpretation: {
      value: [],
      mandatory: true,
    },
    Result_Unit: {
      value: [],
      mandatory: true,
    },
    Result_Numerical: {
      min: undefined,
      max: undefined,
      mandatory: true,
    },
    Diagnosis: {
      value: [],
      mandatory: true,
    },
    ICD_Code: {
      value: [],
      mandatory: true,
    },
  };

  /*Search Bar function */
  const router = useRouter();
  const pathname = usePathname();
  const { q, f, c } = router.query;

  const [page, setPage] = useState<number>(1);
  const [pagelength, setPagelength] = useState<number>(50);
  const [search, setSearch] = useState<string | undefined>();
  const [filter, setFilter] = useState<INormalFilter>(defaultFilter);
  const [showSave, setShowSave] = useState(false);
  const [showLoad, setShowLoad] = useState(false);
  const [showFilter, setShowFilter] = useState<boolean>(false);
  const [categoryQuery, setCategoryQuery] = useState<string>("Overall");

  const [showCategories, setShowCategories] = useState<boolean>(false);

  const [isPriceActive, setIsPriceActive] = useState(false);
  const [isGeneralDataActive, setIsGeneralDataActive] = useState(false);
  const [isQuantityActive, setIsQuantityActive] = useState(false);
  const [isLabActive, setIsLabActive] = useState(false);
  const [isDiagnosisActive, setIsDiagnosisActive] = useState(false);

  const windowSize = useWindowSize();

  const { data: samples, isLoading: isLoading} = api.samples.getAll.useQuery({
    pages: page,
    lines: pagelength,
    search: search,
    filter: filter,
    category: categoryQuery,
  });
  const { data: count } = api.samples.countNormal.useQuery({
    search: search,
    filter: filter,
    category: categoryQuery,
  });

  useEffect(() => {
    setPage(1);
  }, [search, pagelength, filter]);

  useEffect(() => {
    setSearch(q?.toString());
  }, [q]);

  useEffect(() => {
    setCategoryQuery(c?.toString() ?? "Overall");
  }, [c]);

  useEffect(() => {
    if (f !== undefined) {
      setFilter(NormalFilterSchema.parse(JSON.parse(f.toString())));
    }
  }, [f]);

  useEffect(() => {

    // Check if the current filter object differs from the default filter object
    if (!(JSON.stringify(filter) === JSON.stringify(defaultFilter))) {

      // If the filter object is not equal to the default filter object,
      // perform a redirection using router.push
      void router.push(
        `${pathname}?${
          search ? `q=${encodeURIComponent(search)}&` : ""
        }f=${encodeURIComponent(JSON.stringify(filter))}&c=${encodeURIComponent(
          categoryQuery
        )}`,
        undefined,
        { shallow: true }
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter, categoryQuery]);

  function handleFilterChange(value: string, column: string): void {
    // Define a type representing the keys of the INormalFilter interface
    type FilterKey = keyof INormalFilter;

    if (column in filter) {
      const temp = filter[column as FilterKey];

      // Check if the accessed filter object has a 'value' property that is an array
      if (
        "value" in temp &&
        Array.isArray(temp.value) &&
        // Ensure the value is not already in the array
        !temp.value.find((e) => e === value)
      ) {
        // Add the new value to the 'value' array of the filter object
        temp.value.push(value);

        // Update the filter state with the modified filter object
        setFilter((filter) => ({ ...filter, [column]: temp }));
      }
    }
  }

  const categoriesButton: React.ReactNode = (
    <>
      {
        //categories button
        <button
          className={`text-xl text-[${Colors.dark}] mx-3 flex flex-row rounded-lg pl-2 pr-4 hover:bg-[#D8E9D1] active:bg-[#cae4c2]`}
          onClick={() => setShowCategories(prev => !prev)}
        >
          Categories
          <svg
            width="12"
            height="21"
            viewBox="0 0 20 36"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={`ml-2 translate-y-[4px] ${showCategories ? "-scale-x-100" : "" } rotate-90 transform ease-in-out transition-all`}
          >
            <path
              opacity="0.4"
              d="M13.2156 9.00221L0 18.6931L0 33.0375C0 35.4922 3.03565 36.7195 4.81522 34.9808L18.371 21.7359C20.543 19.6136 20.543 16.1617 18.371 14.0394L13.2156 9.00221Z"
              fill="black"
            />
            <path
              d="M0 2.76626V18.6961L13.2156 9.00524L4.81522 0.797406C3.03565 -0.915755 0 0.311585 0 2.76626Z"
              fill="black"
            />
          </svg>
        </button>
      }
    </>
  );

  return (
    <div className="max-h-[calc(100dvh-80px)] overflow-x-hidden overflow-y-scroll font-poppins">
      <div
        className={`flex w-full flex-row items-center justify-center text-[${Colors.dark}] border-[${Colors.dark}]`}
      >
        {windowSize.width && windowSize.width < 900 ? (
          <>
            <h1 className="mb-2 ml-5 mt-5 text-center text-5xl">
              <b>OVERALL PRODUCT SEARCH</b>
            </h1>
          </>
        ) : (
          <>
            <div className="m-5 h-1 w-full rounded-3xl border-2 border-solid border-inherit"></div>
            <h1 className="mb-2 ml-5 mt-5 whitespace-nowrap text-5xl">
              <b>OVERALL PRODUCT SEARCH</b>
            </h1>
            <div className="m-5 h-1 w-full rounded-3xl border-2 border-solid border-inherit"></div>
          </>
        )}
      </div>

      <div
        className={`${
          windowSize.width && windowSize.width < 900 ? "px-5" : "px-20"
        }`}
      >
        {windowSize.width && windowSize.width < 900 ? (
          <p className={`my-7 text-center text-xl text-[${Colors.dark}]`}>
            <i>
              Overall search is a tailor-made solution to improve your search by
              understanding the precise needs and search behavior of life
              science scientists and biomedical researchers worldwide.
            </i>
          </p>
        ) : (
          <p className={`my-7 text-center text-xl text-[${Colors.dark}]`}>
            <i>
              Overall search is a tailor-made solution to improve your search by
              understanding the precise needs and search behavior of life
              science scientists and biomedical researchers worldwide.
              Therefore, we provide you with a wide array of search options,
              helping to dive deeper into our bio inventory to land on your
              matching human biospecimens within no time. Our inventory is vast,
              we offer well-annotated, high-quality biological specimens such as
              human serum, plasma, whole blood, human tissue samples, and more
              for research purposes.
            </i>
          </p>
        )}

        {/*hierarchy tree*/}
        <div className="mb-4 mt-2 flex flex-row items-center text-3xl font-extralight">
          <Link className="relative top-1" href={"/"}>
            <BiHome />
          </Link>
          <label className="mx-1">|</label>
          <Link className="relative top-1 text-xl" href={"/search/overall"}>
            Overall Search
          </Link>
          <label className="mx-1">|</label>
          <Link
            className="relative top-1 text-xl"
            href={`/search/overall?c=${encodeURI(categoryQuery)}`}
          >
            {categoryQuery}
          </Link>
        </div>

        {windowSize.width && windowSize.width < 700 ? (
          <div className="flex flex-col">
            <div className="flex flex-row items-stretch justify-center">
              {/*load filter button*/}
              <button
                className={`w-full px-4 py-1 text-center text-xl text-[${Colors.dark}] rounded-l-2xl bg-[#D8E9D1] transition-colors ease-in-out hover:bg-[#bfdab4]`}
                onClick={() => setShowLoad(true)}
              >
                Load Filter
              </button>

              {/*save filter button*/}
              <button
                className={`w-full px-4 py-1 text-center text-xl text-[${Colors.dark}] rounded-r-2xl bg-[#F7D59B] transition-colors ease-in-out hover:bg-[#d8b475]`}
                onClick={() => setShowSave(true)}
              >
                Save Filter
              </button>
            </div>
            <div className="mt-2 flex flex-row items-center">
              {/*button to show the filter options*/}
              <button
                className={`text-xl text-[${Colors.dark}] flex flex-row rounded-lg pl-2 pr-4 hover:bg-[#dae9d5] active:bg-[#cae4c2]`}
                onClick={() => setShowFilter(prev => !prev)}
              >
                Filter
                <svg
                  width="12"
                  height="21"
                  viewBox="0 0 20 36"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className={`ml-2 translate-y-[4px] ${showFilter ? "-rotate-90" : "rotate-90"} transform`}
                >
                  <path
                    opacity="0.4"
                    d="M13.2156 9.00221L0 18.6931L0 33.0375C0 35.4922 3.03565 36.7195 4.81522 34.9808L18.371 21.7359C20.543 19.6136 20.543 16.1617 18.371 14.0394L13.2156 9.00221Z"
                    fill="black"
                  />
                  <path
                    d="M0 2.76626V18.6961L13.2156 9.00524L4.81522 0.797406C3.03565 -0.915755 0 0.311585 0 2.76626Z"
                    fill="black"
                  />
                </svg>
              </button>

              {/*choose category*/}
              <div>{categoriesButton}</div>
            </div>
          </div>
        ) : (
          <>
            <div className="flex w-full flex-row">
              <div className="flex w-[50%] flex-row items-center justify-start">
                <button
                  className={`text-xl text-[${Colors.dark}] flex flex-row rounded-lg pl-2 pr-4 hover:bg-[#dae9d5] active:bg-[#cae4c2]`}
                  onClick={() => setShowFilter(!showFilter)}
                >
                  Filter
                  <svg
                    width="12"
                    height="21"
                    viewBox="0 0 20 36"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className={`ml-2 translate-y-[4px] ${showFilter ? "-scale-x-100" : "" } rotate-90 transform ease-in-out transition-all`}
                  >
                    <path
                      opacity="0.4"
                      d="M13.2156 9.00221L0 18.6931L0 33.0375C0 35.4922 3.03565 36.7195 4.81522 34.9808L18.371 21.7359C20.543 19.6136 20.543 16.1617 18.371 14.0394L13.2156 9.00221Z"
                      fill="black"
                    />
                    <path
                      d="M0 2.76626V18.6961L13.2156 9.00524L4.81522 0.797406C3.03565 -0.915755 0 0.311585 0 2.76626Z"
                      fill="black"
                    />
                  </svg>
                </button>

                {/*choose category*/}
                <div>{categoriesButton}</div>
              </div>

              <div className="flex w-[50%] flex-row justify-end">
                {/*load filter button*/}
                <button
                  className={`w-[10rem] px-4 py-1 text-center text-xl text-[${Colors.dark}] rounded-l-2xl border-r-0 bg-[#D8E9D1] transition-colors ease-in-out hover:bg-[#bfdab4]`}
                  onClick={() => setShowLoad(true)}
                >
                  Load Filter
                </button>
                {/*save filter button*/}
                <button
                  className={`w-[10rem] px-4 py-1 text-center text-xl text-[${Colors.dark}] rounded-r-2xl bg-[#F7D59B] transition-colors ease-in-out hover:bg-[#d8b475]`}
                  onClick={() => setShowSave(true)}
                >
                  Save Filter
                </button>
              </div>
            </div>

            <div>
              {/*shows different categories*/}
              <div className={`grid ${
                showCategories ? "mt-4 grid-rows-[2fr]" : "grid-rows-[0fr]"
              } transition-all ease-in-out duration-300`}>
                  <div className="flex w-full flex-wrap overflow-hidden">
                    {gridData.map((item) => (
                      <div
                        key={item.id}
                        className="flex w-1/6 flex-col items-start p-4"
                      >
                        <button
                          value={item?.label}
                          onClick={(e) => {
                            setCategoryQuery(e.currentTarget.value);
                            setShowCategories(!showCategories);
                          }}
                        >
                          <b>{item.label}</b>
                        </button>
                        <Image
                          src={item.src}
                          alt={item.label}
                          width="100"
                          height="100"
                          className="py-2"
                        />
                        {item.subs.map((sub, i) => (
                          <button
                            key={`sub-${item.id}-${i}`}
                            value={sub}
                            onClick={(e) => {
                              setCategoryQuery(e.currentTarget.value);
                              setShowCategories(!showCategories);
                            }}
                          >
                            {sub}
                          </button>
                        ))}
                      </div>
                    ))}
                  </div>
                </div>
            </div>
          </>
        )}

        {/*Modals to save and load filter*/}
        <ModalSave
          showModal={showSave}
          setShowModal={setShowSave}
          filter={filter}
        />
        <ModalLoad
          showModal={showLoad}
          setShowModal={setShowLoad}
          setFilter={setFilter}
        />

        <div
          className={`grid ${
            showFilter ? "mt-4 grid-rows-[2fr]" : "grid-rows-[0fr]"
          } transition-all ease-in-out`}
        >
          {/* Input fields */}
          <div
            className={`items-center justify-center overflow-hidden  ${
              showFilter ? "mb-2" : ""
            }`}
          >
            <div
              className={`grid ${
                windowSize.width && windowSize.width < 900
                  ? "grid-cols-2"
                  : "grid-cols-4"
              } max-w-full gap-2`}
            >
              {/* CBH Master ID */}
              <div className="items-center text-center">
                <input
                  type="text"
                  value={filter.CBH_Master_ID.value}
                  className="w-full items-center justify-center rounded-lg bg-gray-50 px-2 py-1 text-center text-lg shadow-md"
                  placeholder="CBHMasterID"
                  onChange={(e) => {
                    const temp =
                      e.currentTarget.value.length > 0
                        ? e.currentTarget.value
                        : undefined;
                    setFilter((filter) => ({
                      ...filter,
                      CBH_Master_ID: {
                        value: temp,
                        mandatory: filter.CBH_Master_ID.mandatory,
                      },
                    }));
                  }}
                />
              </div>

              {/* CBH Donor ID */}
              <div className="items-center text-center">
                <input
                  type="text"
                  value={filter.CBH_Donor_ID.value}
                  className="w-full items-center justify-center rounded-lg bg-gray-50 px-2 py-1 text-center text-lg shadow-md"
                  placeholder="CBHDonorID"
                  onChange={(e) => {
                    const temp =
                      e.currentTarget.value.length > 0
                        ? e.currentTarget.value
                        : undefined;
                    setFilter((filter) => ({
                      ...filter,
                      CBH_Donor_ID: {
                        value: temp,
                        mandatory: filter.CBH_Donor_ID.mandatory,
                      },
                    }));
                  }}
                />
              </div>

              {/* CBH Sample ID */}
              <div className="items-center text-center">
                <input
                  type="text"
                  value={filter.CBH_Sample_ID.value}
                  className="w-full items-center justify-center rounded-lg bg-gray-50 px-2 py-1 text-center text-lg shadow-md"
                  placeholder="CBHSampleID"
                  onChange={(e) => {
                    const temp =
                      e.currentTarget.value.length > 0
                        ? e.currentTarget.value
                        : undefined;
                    setFilter((filter) => ({
                      ...filter,
                      CBH_Sample_ID: {
                        value: temp,
                        mandatory: filter.CBH_Sample_ID.mandatory,
                      },
                    }));
                  }}
                />
              </div>

              {/* Price */}
              <div className="items-center text-center">
                <OverlayTrigger
                  trigger="click"
                  placement="bottom"
                  rootClose={true}
                  onExit={() => setIsPriceActive(false)}
                  onEnter={() => setIsPriceActive(true)}
                  overlay={
                    <Popover
                      id="popover-basic"
                      className="z-20 min-w-[10vw] items-center justify-center rounded-xl border-2 border-solid border-green-900 bg-white px-2 py-3 text-center shadow-md"
                    >
                      <Popover.Body>
                        <div className="relative grid auto-cols-max grid-flow-col items-center justify-center gap-3 text-lg">
                          <input
                            type="number"
                            value={filter.Price.min}
                            required
                            className={`peer/min w-[200px] rounded-full border-2 px-3 py-1 text-lg outline-none transition hover:border-green-800 focus:border-yellow-400`}
                            onChange={(e) => {
                              const temp = filter.Price;
                              temp.min =
                                e.currentTarget.value.length > 0
                                  ? parseFloat(e.currentTarget.value)
                                  : undefined;
                              setFilter((filter) => ({
                                ...filter,
                                Price: temp,
                              }));
                            }}
                          />
                          <label
                            className={`pointer-events-none absolute left-4 text-gray-400 transition peer-valid/min:-translate-y-2/3 peer-valid/min:scale-75 peer-valid/min:bg-white peer-valid/min:px-1 peer-hover/min:text-green-800 peer-focus/min:-translate-y-2/3 peer-focus/min:scale-75 peer-focus/min:bg-white peer-focus/min:px-1 peer-focus/min:text-yellow-400`}
                          >
                            min Price
                          </label>
                          <input
                            type="number"
                            value={filter.Price.max}
                            required
                            className="peer/max w-[200px] rounded-full border-2 px-3 py-1 text-lg outline-none transition hover:border-green-800 focus:border-yellow-400"
                            onChange={(e) => {
                              const temp = filter.Price;
                              temp.max =
                                e.currentTarget.value.length > 0
                                  ? parseFloat(e.currentTarget.value)
                                  : undefined;
                              setFilter((filter) => ({
                                ...filter,
                                Price: temp,
                              }));
                            }}
                          />
                          <label className="pointer-events-none absolute left-56 text-gray-400 transition peer-valid/max:-translate-y-2/3 peer-valid/max:scale-75 peer-valid/max:bg-white peer-valid/max:px-1 peer-hover/max:text-green-800 peer-focus/max:-translate-y-2/3 peer-focus/max:scale-75 peer-focus/max:bg-white peer-focus/max:px-1 peer-focus/max:text-yellow-400">
                            max Price
                          </label>
                        </div>
                      </Popover.Body>
                    </Popover>
                  }
                >
                  <button
                    className={`flex w-full flex-row items-center justify-center rounded-lg border-2 border-solid border-green-900 bg-white py-1 text-lg text-green-900 shadow-md ${
                      isPriceActive
                        ? " border-yellow-500 text-yellow-500"
                        : "active:border-yellow-500 active:bg-gray-100 active:text-yellow-500"
                    }`}
                  >
                    Price
                    <svg
                      width="12"
                      height="21"
                      viewBox="0 0 20 36"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className={`mb-2 ml-3 translate-y-[4px] rotate-90 transform ${
                        isPriceActive ? "-scale-x-100" : ""
                      }`}
                    >
                      <path
                        opacity="0.4"
                        d="M13.2156 9.00221L0 18.6931L0 33.0375C0 35.4922 3.03565 36.7195 4.81522 34.9808L18.371 21.7359C20.543 19.6136 20.543 16.1617 18.371 14.0394L13.2156 9.00221Z"
                        fill={`${isPriceActive ? "orange" : "black"}`}
                      />
                      <path
                        d="M0 2.76626V18.6961L13.2156 9.00524L4.81522 0.797406C3.03565 -0.915755 0 0.311585 0 2.76626Z"
                        fill={`${isPriceActive ? "orange" : "black"}`}
                      />
                    </svg>
                  </button>
                </OverlayTrigger>
              </div>

              {/* General Data */}
              <div className="items-center text-center">
                <OverlayTrigger
                  trigger="click"
                  placement="bottom"
                  rootClose={true}
                  onExit={() => setIsGeneralDataActive(false)}
                  onEnter={() => setIsGeneralDataActive(true)}
                  overlay={
                    <Popover
                      id="popover-basic"
                      className="z-20 min-w-[10vw] items-center justify-center rounded-xl border-2 border-solid border-green-900 bg-white px-2 py-3 text-center shadow-md"
                    >
                      <Popover.Body>
                        <div className="relative grid auto-cols-max grid-flow-col items-center justify-center gap-3 text-lg">
                          <AutoComplete
                            col="Matrix"
                            onSelect={handleFilterChange}
                            value={
                              filter.Matrix.value[
                                filter.Matrix.value.length - 1
                              ] ?? ""
                            }
                          />
                          <label
                            className={`pointer-events-none absolute left-4 text-gray-400 transition peer-valid:-translate-y-2/3 peer-valid:scale-75 peer-valid:bg-white peer-valid:px-1 peer-hover:text-green-800 peer-focus:-translate-y-2/3 peer-focus:scale-75 peer-focus:bg-white peer-focus:px-1 peer-focus:text-yellow-400`}
                          >
                            Matrix
                          </label>
                        </div>
                      </Popover.Body>
                    </Popover>
                  }
                >
                  <button
                    className={`flex w-full flex-row items-center justify-center rounded-lg border-2 border-solid border-green-900 bg-white py-1 text-lg text-green-900 shadow-md ${
                      isGeneralDataActive
                        ? " border-yellow-500 text-yellow-500"
                        : "active:border-yellow-500 active:bg-gray-100 active:text-yellow-500"
                    }`}
                  >
                    General Data
                    <svg
                      width="12"
                      height="21"
                      viewBox="0 0 20 36"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className={`mb-2 ml-3 translate-y-[4px] rotate-90 transform ${
                        isGeneralDataActive ? "-scale-x-100" : ""
                      }`}
                    >
                      <path
                        opacity="0.4"
                        d="M13.2156 9.00221L0 18.6931L0 33.0375C0 35.4922 3.03565 36.7195 4.81522 34.9808L18.371 21.7359C20.543 19.6136 20.543 16.1617 18.371 14.0394L13.2156 9.00221Z"
                        fill={`${isGeneralDataActive ? "orange" : "black"}`}
                      />
                      <path
                        d="M0 2.76626V18.6961L13.2156 9.00524L4.81522 0.797406C3.03565 -0.915755 0 0.311585 0 2.76626Z"
                        fill={`${isGeneralDataActive ? "orange" : "black"}`}
                      />
                    </svg>
                  </button>
                </OverlayTrigger>
              </div>

              {/* Quantity Information */}
              <div className="items-center text-center">
                <OverlayTrigger
                  trigger="click"
                  placement="bottom"
                  rootClose={true}
                  onExit={() => setIsQuantityActive(false)}
                  onEnter={() => setIsQuantityActive(true)}
                  overlay={
                    <Popover
                      id="popover-basic"
                      className="z-20 min-w-[10vw] items-center justify-center rounded-xl border-2 border-solid border-green-900 bg-white px-2 py-3 text-center  shadow-md"
                    >
                      <Popover.Body>
                        <div className="relative grid auto-cols-max grid-flow-col items-center justify-center gap-3 text-lg">
                          <input
                            type="number"
                            value={filter.Quantity.min}
                            required
                            className="peer/min w-[200px] rounded-full border-2 px-3 py-1 text-lg outline-none transition hover:border-green-800 focus:border-yellow-400"
                            onChange={(e) => {
                              const temp = filter.Quantity;
                              temp.min =
                                e.currentTarget.value.length > 0
                                  ? parseFloat(e.currentTarget.value)
                                  : undefined;
                              setFilter((filter) => ({
                                ...filter,
                                Quantity: temp,
                              }));
                            }}
                          />
                          <label
                            className={`pointer-events-none absolute left-4 text-gray-400 transition peer-valid/min:-translate-y-2/3 peer-valid/min:scale-75 peer-valid/min:bg-white peer-valid/min:px-1 peer-hover/min:text-green-800 peer-focus/min:-translate-y-2/3 peer-focus/min:scale-75 peer-focus/min:bg-white peer-focus/min:px-1 peer-focus/min:text-yellow-400`}
                          >
                            min Quantity
                          </label>
                          <input
                            type="number"
                            value={filter.Quantity.max}
                            required
                            className="peer/max w-[200px] rounded-full border-2 px-3 py-1 text-lg outline-none transition hover:border-green-800 focus:border-yellow-400"
                            onChange={(e) => {
                              const temp = filter.Quantity;
                              temp.max =
                                e.currentTarget.value.length > 0
                                  ? parseFloat(e.currentTarget.value)
                                  : undefined;
                              setFilter((filter) => ({
                                ...filter,
                                Quantity: temp,
                              }));
                            }}
                          />
                          <label
                            className={`pointer-events-none absolute left-56 text-gray-400 transition peer-valid/max:-translate-y-2/3 peer-valid/max:scale-75 peer-valid/max:bg-white peer-valid/max:px-1 peer-hover/max:text-green-800 peer-focus/max:-translate-y-2/3 peer-focus/max:scale-75 peer-focus/max:bg-white peer-focus/max:px-1 peer-focus/max:text-yellow-400`}
                          >
                            max Quantity
                          </label>
                          <AutoComplete
                            col="Unit"
                            onSelect={handleFilterChange}
                            value={
                              filter.Unit.value[filter.Unit.value.length - 1] ??
                              ""
                            }
                            classname="peer/unit"
                          />
                          <label
                            className={`pointer-events-none absolute right-32 text-gray-400 transition peer-valid/unit:-translate-y-1/2 peer-valid/unit:scale-75 peer-valid/unit:bg-white peer-valid/unit:p-1 peer-hover:text-green-800 peer-focus/unit:-translate-y-1/2 peer-focus/unit:scale-75 peer-focus/unit:bg-white peer-focus/unit:p-1 peer-focus/unit:text-yellow-400`}
                          >
                            Unit
                          </label>
                        </div>
                      </Popover.Body>
                    </Popover>
                  }
                >
                  <button
                    className={`flex w-full flex-row items-center justify-center rounded-lg border-2 border-solid border-green-900 bg-white py-1 text-lg text-green-900 shadow-md ${
                      isQuantityActive
                        ? " border-yellow-500 text-yellow-500"
                        : "active:border-yellow-500 active:bg-gray-100 active:text-yellow-500"
                    }`}
                  >
                    Quantity Information
                    <svg
                      width="12"
                      height="21"
                      viewBox="0 0 20 36"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className={`mb-2 ml-3 translate-y-[4px] rotate-90 transform ${
                        isQuantityActive ? "-scale-x-100" : ""
                      }`}
                    >
                      <path
                        opacity="0.4"
                        d="M13.2156 9.00221L0 18.6931L0 33.0375C0 35.4922 3.03565 36.7195 4.81522 34.9808L18.371 21.7359C20.543 19.6136 20.543 16.1617 18.371 14.0394L13.2156 9.00221Z"
                        fill={`${isQuantityActive ? "orange" : "black"}`}
                      />
                      <path
                        d="M0 2.76626V18.6961L13.2156 9.00524L4.81522 0.797406C3.03565 -0.915755 0 0.311585 0 2.76626Z"
                        fill={`${isQuantityActive ? "orange" : "black"}`}
                      />
                    </svg>
                  </button>
                </OverlayTrigger>
              </div>

              {/* Laboratory */}
              <div className="items-center text-center">
                <OverlayTrigger
                  trigger="click"
                  placement="bottom"
                  rootClose={true}
                  onExit={() => setIsLabActive(false)}
                  onEnter={() => setIsLabActive(true)}
                  overlay={
                    <Popover
                      id="popover-basic"
                      className="z-20 min-w-[10vw] items-center justify-center rounded-xl border-2 border-solid border-green-900 bg-white px-2 py-3 text-center  shadow-md"
                    >
                      <Popover.Body>
                        <div className="relative grid auto-cols-max grid-flow-col items-center justify-center gap-3 text-lg">
                          <AutoComplete
                            col="Lab_Parameter"
                            onSelect={handleFilterChange}
                            value={
                              filter.Lab_Parameter.value[
                                filter.Lab_Parameter.value.length - 1
                              ] ?? ""
                            }
                            classname="peer/param"
                          />
                          <label
                            className={`pointer-events-none absolute left-4 text-gray-400 transition peer-valid/param:-translate-y-2/3 peer-valid/param:scale-75 peer-valid/param:bg-white peer-valid/param:px-1 peer-hover/param:text-green-800 peer-focus/param:-translate-y-2/3 peer-focus/param:scale-75 peer-focus/param:bg-white peer-focus/param:px-1 peer-focus/param:text-yellow-400`}
                          >
                            Parameter
                          </label>
                          <AutoComplete
                            col="Result_Interpretation"
                            onSelect={handleFilterChange}
                            value={
                              filter.Result_Interpretation.value[
                                filter.Result_Interpretation.value.length - 1
                              ] ?? ""
                            }
                            classname="peer/interp"
                          />
                          <label
                            className={`pointer-events-none absolute left-56 text-gray-400 transition peer-valid/interp:-translate-y-2/3 peer-valid/interp:scale-75 peer-valid/interp:bg-white peer-valid/interp:px-1 peer-hover/interp:text-green-800 peer-focus/interp:-translate-y-2/3 peer-focus/interp:scale-75 peer-focus/interp:bg-white peer-focus/interp:px-1 peer-focus/interp:text-yellow-400`}
                          >
                            Result Interpretation
                          </label>
                          <input
                            type="number"
                            value={filter.Result_Numerical.min || ""}
                            required
                            className="peer/min w-[200px] rounded-full border-2 px-3 py-1 text-lg outline-none transition hover:border-green-800 focus:border-yellow-400"
                            onChange={(e) => {
                              const temp = filter.Result_Numerical;
                              temp.min =
                                e.currentTarget.value.length > 0
                                  ? parseFloat(e.currentTarget.value)
                                  : undefined;
                              setFilter((filter) => ({
                                ...filter,
                                Result_Numerical: temp,
                              }));
                            }}
                          />
                          <label
                            className={`pointer-events-none absolute left-[433px] text-gray-400 transition peer-valid/min:-translate-y-2/3 peer-valid/min:scale-75 peer-valid/min:bg-white peer-valid/min:px-1 peer-hover/min:text-green-800 peer-focus/min:-translate-y-2/3 peer-focus/min:scale-75 peer-focus/min:bg-white peer-focus/min:px-1 peer-focus/min:text-yellow-400`}
                          >
                            Min result
                          </label>
                          <input
                            type="number"
                            value={filter.Result_Numerical.max || ""}
                            required
                            className="peer/max w-[200px] rounded-full border-2 px-3 py-1 text-lg outline-none transition hover:border-green-800 focus:border-yellow-400"
                            onChange={(e) => {
                              const temp = filter.Result_Numerical;
                              temp.max =
                                e.currentTarget.value.length > 0
                                  ? parseFloat(e.currentTarget.value)
                                  : undefined;
                              setFilter((filter) => ({
                                ...filter,
                                Result_Numerical: temp,
                              }));
                            }}
                          />
                          <label
                            className={`pointer-events-none absolute right-80 text-gray-400 transition peer-valid/max:-translate-y-2/3 peer-valid/max:scale-75 peer-valid/max:bg-white peer-valid/max:px-1 peer-hover/max:text-green-800 peer-focus/max:-translate-y-2/3 peer-focus/max:scale-75 peer-focus/max:bg-white peer-focus/max:px-1 peer-focus/max:text-yellow-400`}
                          >
                            Max result
                          </label>
                          <AutoComplete
                            col="Result_Unit"
                            onSelect={handleFilterChange}
                            value={
                              filter.Result_Unit.value[
                                filter.Result_Unit.value.length - 1
                              ] ?? ""
                            }
                          />
                          <label
                            className={`pointer-events-none absolute right-36 text-gray-400 transition peer-valid:-translate-y-2/3 peer-valid:scale-75 peer-valid:bg-white peer-valid:px-1 peer-hover:text-green-800 peer-focus:-translate-y-2/3 peer-focus:scale-75 peer-focus:bg-white peer-focus:px-1 peer-focus:text-yellow-400`}
                          >
                            Unit
                          </label>
                        </div>
                      </Popover.Body>
                    </Popover>
                  }
                >
                  <button
                    className={`flex w-full flex-row items-center justify-center rounded-lg border-2 border-solid border-green-900 bg-white py-1 text-lg text-green-900 shadow-md ${
                      isLabActive
                        ? " border-yellow-500 text-yellow-500"
                        : "active:border-yellow-500 active:bg-gray-100 active:text-yellow-500"
                    }`}
                  >
                    Laboratory
                    <svg
                      width="12"
                      height="21"
                      viewBox="0 0 20 36"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className={`mb-2 ml-3 translate-y-[4px] rotate-90 transform ${
                        isLabActive ? "-scale-x-100" : ""
                      }`}
                    >
                      <path
                        opacity="0.4"
                        d="M13.2156 9.00221L0 18.6931L0 33.0375C0 35.4922 3.03565 36.7195 4.81522 34.9808L18.371 21.7359C20.543 19.6136 20.543 16.1617 18.371 14.0394L13.2156 9.00221Z"
                        fill={`${isLabActive ? "orange" : "black"}`}
                      />
                      <path
                        d="M0 2.76626V18.6961L13.2156 9.00524L4.81522 0.797406C3.03565 -0.915755 0 0.311585 0 2.76626Z"
                        fill={`${isLabActive ? "orange" : "black"}`}
                      />
                    </svg>
                  </button>
                </OverlayTrigger>
              </div>

              {/* Clinical Diagnosis */}
              <div className="items-center text-center">
                <OverlayTrigger
                  trigger="click"
                  placement="bottom"
                  rootClose={true}
                  onExit={() => setIsDiagnosisActive(false)}
                  onEnter={() => setIsDiagnosisActive(true)}
                  overlay={
                    <Popover
                      id="popover-basic"
                      className="z-20 min-w-[10vw] items-center justify-center rounded-xl border-2 border-solid border-green-900 bg-white px-2 py-3 text-center  shadow-md"
                    >
                      <Popover.Body>
                        <div className="relative grid auto-cols-max grid-flow-col items-center justify-center gap-3 text-lg">
                          <AutoComplete
                            col="Diagnosis"
                            onSelect={handleFilterChange}
                            value={
                              filter.Diagnosis.value[
                                filter.Diagnosis.value.length - 1
                              ] ?? ""
                            }
                            classname="peer/dia"
                          />
                          <label
                            className={`pointer-events-none absolute left-4 text-gray-400 transition peer-valid/dia:-translate-y-2/3 peer-valid/dia:scale-75 peer-valid/dia:bg-white peer-valid/dia:px-1 peer-hover/dia:text-green-800 peer-focus/dia:-translate-y-2/3 peer-focus/dia:scale-75 peer-focus/dia:bg-white peer-focus/dia:px-1 peer-focus/dia:text-yellow-400`}
                          >
                            Diagnosis
                          </label>
                          <AutoComplete
                            col="ICD_Code"
                            onSelect={handleFilterChange}
                            value={
                              filter.ICD_Code.value[
                                filter.ICD_Code.value.length - 1
                              ] ?? ""
                            }
                          />
                          <label
                            className={`pointer-events-none absolute left-56 text-gray-400 transition peer-valid:-translate-y-2/3 peer-valid:scale-75 peer-valid:bg-white peer-valid:px-1 peer-hover:text-green-800 peer-focus:-translate-y-2/3 peer-focus:scale-75 peer-focus:bg-white peer-focus:px-1 peer-focus:text-yellow-400`}
                          >
                            ICD Code
                          </label>
                        </div>
                      </Popover.Body>
                    </Popover>
                  }
                >
                  <button
                    className={`flex w-full flex-row items-center justify-center rounded-lg border-2 border-solid border-green-900 bg-white py-1 text-lg text-green-900 shadow-md ${
                      isDiagnosisActive
                        ? " border-yellow-500 text-yellow-500"
                        : "active:border-yellow-500 active:bg-gray-100 active:text-yellow-500"
                    }`}
                  >
                    Diagnosis
                    <svg
                      width="12"
                      height="21"
                      viewBox="0 0 20 36"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className={`mb-2 ml-3 translate-y-[4px] rotate-90 transform ${
                        isDiagnosisActive ? "-scale-x-100" : ""
                      }`}
                    >
                      <path
                        opacity="0.4"
                        d="M13.2156 9.00221L0 18.6931L0 33.0375C0 35.4922 3.03565 36.7195 4.81522 34.9808L18.371 21.7359C20.543 19.6136 20.543 16.1617 18.371 14.0394L13.2156 9.00221Z"
                        fill={`${isDiagnosisActive ? "orange" : "black"}`}
                      />
                      <path
                        d="M0 2.76626V18.6961L13.2156 9.00524L4.81522 0.797406C3.03565 -0.915755 0 0.311585 0 2.76626Z"
                        fill={`${isDiagnosisActive ? "orange" : "black"}`}
                      />
                    </svg>
                  </button>
                </OverlayTrigger>
              </div>
            </div>
          </div>

          {/* Displaying active filters */}
          <div className="overflow-hidden mt-3">
            <span
              className={`mx-1 justify-center rounded-lg bg-[${
                Colors.light_light
              }] px-3 py-3 ${search ? "" : "hidden"}`}
            >
              Search: {search}{" "}
              <button
                className="relative top-1 text-xl"
                onClick={() => setSearch(undefined)}
              >
                <BiX />
              </button>
            </span>
            <span
              className={`mx-1 justify-center rounded-lg bg-[${
                Colors.light_light
              }] px-3 py-3 ${filter.Matrix.value.length > 0 ? "" : "hidden"}`}
            >
              Matrix:&nbsp;
              {filter.Matrix.value.map((item, i) => (
                <>
                  <>{i !== 0 ? <>, {item}</> : <>{item}</>} </>
                  <button
                    className="relative top-1 text-xl"
                    onClick={() => {
                      setFilter((filter) => ({
                        ...filter,
                        Matrix: {
                          value: filter.Matrix.value.filter(
                            (_, index) => index !== i
                          ),
                          mandatory: filter.Matrix.mandatory,
                        },
                      }));
                    }}
                  >
                    <BiX />
                  </button>
                </>
              ))}
              <button
                className="bg-[${Colors.light_light}] relative w-fit rounded-2xl px-3 py-1 text-center text-lg outline-none transition hover:bg-[rgb(183,224,153)]"
                onClick={() => {
                  const temp1 = filter.Matrix;
                  temp1.mandatory = !temp1.mandatory;
                  setFilter((filter) => ({ ...filter, Matrix: temp1 }));
                }}
              >
                {filter.Matrix.mandatory ? "!" : "?"}
              </button>
            </span>
            <span
              className={`mx-1 mb-5 justify-center rounded-lg bg-[${
                Colors.light_light
              }] px-3 py-3 ${filter.Unit.value.length > 0 ? "" : "hidden"}`}
            >
              Unit:&nbsp;
              {filter.Unit.value.map((item, i) => (
                <>
                  {i !== 0 ? <>, {item}</> : <>{item}</>}
                  <button
                    className="relative top-1 text-xl"
                    onClick={() => {
                      setFilter((filter) => ({
                        ...filter,
                        Unit: {
                          value: filter.Unit.value.filter(
                            (_, index) => index !== i
                          ),
                          mandatory: filter.Unit.mandatory,
                        },
                      }));
                    }}
                  >
                    <BiX />
                  </button>
                </>
              ))}
              <button
                className="bg-[${Colors.light_light}] relative w-fit rounded-2xl px-3 py-1 text-center text-lg outline-none transition hover:bg-[rgb(183,224,153)]"
                onClick={() => {
                  const temp2 = filter.Unit;
                  temp2.mandatory = !temp2.mandatory;
                  setFilter((filter) => ({ ...filter, Unit: temp2 }));
                }}
              >
                {filter.Unit.mandatory ? "!" : "?"}
              </button>
            </span>
            <span
              className={`mx-1 mb-5 justify-center rounded-lg bg-[${
                Colors.light_light
              }] px-3 py-3 ${
                filter.Lab_Parameter.value.length > 0 ? "" : "hidden"
              }`}
            >
              Parameter:&nbsp;
              {filter.Lab_Parameter.value.map((item, i) => (
                <>
                  {i !== 0 ? <>, {item}</> : <>{item}</>}
                  <button
                    className="relative top-1 text-xl"
                    onClick={() => {
                      setFilter((filter) => ({
                        ...filter,
                        Lab_Parameter: {
                          value: filter.Lab_Parameter.value.filter(
                            (_, index) => index !== i
                          ),
                          mandatory: filter.Lab_Parameter.mandatory,
                        },
                      }));
                    }}
                  >
                    <BiX />
                  </button>
                </>
              ))}
              <button
                className="bg-[${Colors.light_light}] relative w-fit rounded-2xl px-3 py-1 text-center text-lg outline-none transition hover:bg-[rgb(183,224,153)]"
                onClick={() => {
                  const temp3 = filter.Lab_Parameter;
                  temp3.mandatory = !temp3.mandatory;
                  setFilter((filter) => ({ ...filter, Lab_Parameter: temp3 }));
                }}
              >
                {filter.Lab_Parameter.mandatory ? "!" : "?"}
              </button>
            </span>
            <span
              className={`mx-1 mb-5 justify-center rounded-lg bg-[${
                Colors.light_light
              }] px-3 py-3 ${
                filter.Result_Interpretation.value.length > 0 ? "" : "hidden"
              }`}
            >
              Res.Interpretation:&nbsp;
              {filter.Result_Interpretation.value.map((item, i) => (
                <>
                  {i !== 0 ? <>, {item}</> : <>{item}</>}
                  <button
                    className="relative top-1 text-xl"
                    onClick={() => {
                      setFilter((filter) => ({
                        ...filter,
                        Result_Interpretation: {
                          value: filter.Result_Interpretation.value.filter(
                            (_, index) => index !== i
                          ),
                          mandatory: filter.Result_Interpretation.mandatory,
                        },
                      }));
                    }}
                  >
                    <BiX />
                  </button>
                </>
              ))}
              <button
                className="bg-[${Colors.light_light}] relative w-fit rounded-2xl px-3 py-1 text-center text-lg outline-none transition hover:bg-[rgb(183,224,153)]"
                onClick={() => {
                  const temp4 = filter.Result_Interpretation;
                  temp4.mandatory = !temp4.mandatory;
                  setFilter((filter) => ({
                    ...filter,
                    Result_Interpretation: temp4,
                  }));
                }}
              >
                {filter.Result_Interpretation.mandatory ? "!" : "?"}
              </button>
            </span>
            <span
              className={`mx-1 mb-5 justify-center rounded-lg bg-[${
                Colors.light_light
              }] px-3 py-3 ${
                filter.Result_Unit.value.length > 0 ? "" : "hidden"
              }`}
            >
              Res.Unit:&nbsp;
              {filter.Result_Unit.value.map((item, i) => (
                <>
                  {i !== 0 ? <>, {item}</> : <>{item}</>}
                  <button
                    className="relative top-1 text-xl"
                    onClick={() => {
                      setFilter((filter) => ({
                        ...filter,
                        Result_Unit: {
                          value: filter.Result_Unit.value.filter(
                            (_, index) => index !== i
                          ),
                          mandatory: filter.Result_Unit.mandatory,
                        },
                      }));
                    }}
                  >
                    <BiX />
                  </button>
                </>
              ))}
              <button
                className="bg-[${Colors.light_light}] relative w-fit rounded-2xl px-3 py-1 text-center text-lg outline-none transition hover:bg-[rgb(183,224,153)]"
                onClick={() => {
                  const temp5 = filter.Result_Unit;
                  temp5.mandatory = !temp5.mandatory;
                  setFilter((filter) => ({ ...filter, Result_Unit: temp5 }));
                }}
              >
                {filter.Result_Unit.mandatory ? "!" : "?"}
              </button>
            </span>
            <span
              className={`mx-1 mb-5 justify-center rounded-lg bg-[${
                Colors.light_light
              }] px-3 py-3 ${
                filter.Diagnosis.value.length > 0 ? "" : "hidden"
              }`}
            >
              Diagnosis:&nbsp;
              {filter.Diagnosis.value.map((item, i) => (
                <>
                  {i !== 0 ? <>, {item}</> : <>{item}</>}
                  <button
                    className="relative top-1 text-xl"
                    onClick={() => {
                      setFilter((filter) => ({
                        ...filter,
                        Diagnosis: {
                          value: filter.Diagnosis.value.filter(
                            (_, index) => index !== i
                          ),
                          mandatory: filter.Diagnosis.mandatory,
                        },
                      }));
                    }}
                  >
                    <BiX />
                  </button>
                </>
              ))}
              <button
                className="bg-[${Colors.light_light}] relative w-fit rounded-2xl px-3 py-1 text-center text-lg outline-none transition hover:bg-[rgb(183,224,153)]"
                onClick={() => {
                  const temp6 = filter.Diagnosis;
                  temp6.mandatory = !temp6.mandatory;
                  setFilter((filter) => ({ ...filter, Diagnosis: temp6 }));
                }}
              >
                {filter.Diagnosis.mandatory ? "!" : "?"}
              </button>
            </span>
            <span
              className={`mx-1 mb-5 justify-center rounded-lg bg-[${
                Colors.light_light
              }] px-3 py-3 ${filter.ICD_Code.value.length > 0 ? "" : "hidden"}`}
            >
              ICD:&nbsp;
              {filter.ICD_Code.value.map((item, i) => (
                <>
                  {i !== 0 ? <>, {item}</> : <>{item}</>}
                  <button
                    className="relative top-1 text-xl"
                    onClick={() => {
                      setFilter((filter) => ({
                        ...filter,
                        ICD_Code: {
                          value: filter.ICD_Code.value.filter(
                            (_, index) => index !== i
                          ),
                          mandatory: filter.ICD_Code.mandatory,
                        },
                      }));
                    }}
                  >
                    <BiX />
                  </button>
                </>
              ))}
              <button
                className="bg-[${Colors.light_light}] relative w-fit rounded-2xl px-3 py-1 text-center text-lg outline-none transition hover:bg-[rgb(183,224,153)]"
                onClick={() => {
                  const temp7 = filter.ICD_Code;
                  temp7.mandatory = !temp7.mandatory;
                  setFilter((filter) => ({ ...filter, ICD_Code: temp7 }));
                }}
              >
                {filter.ICD_Code.mandatory ? "!" : "?"}
              </button>
            </span>

            <span
              className={`mx-1 mb-5 justify-center rounded-lg bg-[${
                Colors.light_light
              }] px-3 py-3 ${filter.Price.min ? "" : "hidden"}`}
            >
              Price min:&nbsp;
              {filter.Price.min && (
                <>
                  <>{filter.Price.min}</>
                  <button
                    className="relative top-1 text-xl"
                    onClick={() => {
                      setFilter((filter) => ({
                        ...filter,
                        Price: {
                          min: undefined,
                          max: filter.Price.max,
                          mandatory: filter.Price.mandatory,
                        },
                      }));
                    }}
                  >
                    <BiX />
                  </button>
                </>
              )}
              <button
                className="bg-[${Colors.light_light}] relative w-fit rounded-2xl px-3 py-1 text-center text-lg outline-none transition hover:bg-[rgb(183,224,153)]"
                onClick={() => {
                  const temp8 = filter.Price;
                  temp8.mandatory = !temp8.mandatory;
                  setFilter((filter) => ({ ...filter, Price: temp8 }));
                }}
              >
                {filter.Price.mandatory ? "!" : "?"}
              </button>
            </span>

            <span
              className={`mx-1 mb-5 justify-center rounded-lg bg-[${
                Colors.light_light
              }] px-3 py-3 ${filter.Price.max ? "" : "hidden"}`}
            >
              Price max:&nbsp;
              {filter.Price.max && (
                <>
                  <>{filter.Price.max}</>
                  <button
                    className="relative top-1 text-xl"
                    onClick={() => {
                      setFilter((filter) => ({
                        ...filter,
                        Price: {
                          min: filter.Price.min,
                          max: undefined,
                          mandatory: filter.Price.mandatory,
                        },
                      }));
                    }}
                  >
                    <BiX />
                  </button>
                </>
              )}
              <button
                className="bg-[${Colors.light_light}] relative w-fit rounded-2xl px-3 py-1 text-center text-lg outline-none transition hover:bg-[rgb(183,224,153)]"
                onClick={() => {
                  const temp9 = filter.Price;
                  temp9.mandatory = !temp9.mandatory;
                  setFilter((filter) => ({ ...filter, Price: temp9 }));
                }}
              >
                {filter.Price.mandatory ? "!" : "?"}
              </button>
            </span>

            <span
              className={`mx-1 mb-5 justify-center rounded-lg bg-[${
                Colors.light_light
              }] px-3 py-3 ${filter.Quantity.min ? "" : "hidden"}`}
            >
              Quantity min:&nbsp;
              {filter.Quantity.min && (
                <>
                  <>{filter.Quantity.min}</>
                  <button
                    className="relative top-1 text-xl"
                    onClick={() => {
                      setFilter((filter) => ({
                        ...filter,
                        Quantity: {
                          min: undefined,
                          max: filter.Quantity.max,
                          mandatory: filter.Quantity.mandatory,
                        },
                      }));
                    }}
                  >
                    <BiX />
                  </button>
                </>
              )}
              <button
                className="bg-[${Colors.light_light}] relative w-fit rounded-2xl px-3 py-1 text-center text-lg outline-none transition hover:bg-[rgb(183,224,153)]"
                onClick={() => {
                  const temp10 = filter.Quantity;
                  temp10.mandatory = !temp10.mandatory;
                  setFilter((filter) => ({ ...filter, Quantity: temp10 }));
                }}
              >
                {filter.Quantity.mandatory ? "!" : "?"}
              </button>
            </span>

            <span
              className={`mx-1 mb-5 justify-center rounded-lg bg-[${
                Colors.light_light
              }] px-3 py-3 ${filter.Quantity.max ? "" : "hidden"}`}
            >
              Quantity max:&nbsp;
              {filter.Quantity.max && (
                <>
                  <>{filter.Quantity.max}</>
                  <button
                    className="relative top-1 text-xl"
                    onClick={() => {
                      setFilter((filter) => ({
                        ...filter,
                        Quantity: {
                          min: filter.Quantity.min,
                          max: undefined,
                          mandatory: filter.Quantity.mandatory,
                        },
                      }));
                    }}
                  >
                    <BiX />
                  </button>
                </>
              )}
              <button
                className="bg-[${Colors.light_light}] relative w-fit rounded-2xl px-3 py-1 text-center text-lg outline-none transition hover:bg-[rgb(183,224,153)]"
                onClick={() => {
                  const temp11 = filter.Quantity;
                  temp11.mandatory = !temp11.mandatory;
                  setFilter((filter) => ({ ...filter, Quantity: temp11 }));
                }}
              >
                {filter.Quantity.mandatory ? "!" : "?"}
              </button>
            </span>
          </div>
        </div>
      </div>

      <div className="mx-4 my-2">
        {/*table*/}
        {isLoading === false &&
        <Table
          page={page}
          pagelength={pagelength}
          count={count}
          optionalSamples={samples}
          setPage={setPage}
          setPagelength={setPagelength}
          expert={false}
          filterNormal={filter}
        />
        }
        {/*loading symbol*/}
        {isLoading === true &&
          <>
          <div className="w-full flex flex-row justify-center" role="status">
            <svg aria-hidden="true" className="items-center w-8 h-8 text-gray-200 animate-spin dark:text-gray-500 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
            </svg>
          </div>
          </>
        }
      </div>

      <Footer />
    </div>
  );
};
