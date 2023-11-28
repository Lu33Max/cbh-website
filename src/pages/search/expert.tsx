import React, { useState, useEffect } from "react";
import { useHookstate, type State } from "@hookstate/core";
import { type NextPage } from "next";

import { BiX } from "react-icons/bi";
import Head from "next/head";
import AutoComplete from "~/components/search/expert/autofill_expert";

import Table from "~/components/search/table";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Popover from "react-bootstrap/Popover";

import { type IGroup, GroupSchema } from "~/common/filter/filter";
import { api } from "~/utils/api";
import { useRouter } from "next/router";
import { usePathname } from "next/navigation";
import { SampleSchema } from "~/common/database/samples";
import Header from "~/components/overall/header";
import ModalSaveExpert from "~/components/search/expert/modalSave";
import ModalLoadExpert from "~/components/search/expert/modalLoad";
import { Colors } from "~/common/styles";
import Footer from "~/components/overall/footer";
import useWindowSize from "~/utils/window";

const defaultGroup: IGroup = {
  not: false,
  link: "AND",
  activated: true,
  mandatory: true,
  filter: [
    {
      col: "CBH_Sample_ID",
      type: "equal",
      values: [""],
      activated: true,
      mandatory: true,
    },
  ],
  groups: [],
};

const ExpertSearch: NextPage = () => {
  const [page, setPage] = useState<number>(1);
  const [pagelength, setPagelength] = useState<number>(50);
  const [search] = useState<string | undefined>();
  const [newFilter, setNewFilter] = useState<IGroup>({
    not: false,
    link: "AND",
    activated: true,
    mandatory: true,
    filter: [
      {
        col: "CBH_Sample_ID",
        type: "equal",
        values: [""],
        activated: true,
        mandatory: true,
      },
    ],
    groups: [],
  });

  const [showSave, setShowSave] = useState(false);
  const [showLoad, setShowLoad] = useState(false);

  const state = useHookstate<IGroup>(defaultGroup);

  const windowSize = useWindowSize();

  /*Search Bar function */
  const router = useRouter();
  const pathname = usePathname();
  const { f } = router.query;

  //Test
  const { data: samples, refetch: refetchSamples } =
    api.samples.applyFilter.useQuery({
      group: newFilter,
      pages: page,
      pagelength: pagelength,
    });
  const { data: count } = api.samples.countExpert.useQuery({
    group: newFilter,
  });

  useEffect(() => {
    void refetchSamples();
  }, [search, page, pagelength, refetchSamples]);

  useEffect(() => {
    if (f !== undefined) {
      state.set(GroupSchema.parse(JSON.parse(f.toString())));
      applyFilter();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [f]);

  function applyFilter() {
    void router.push(
      `${pathname}?f=${encodeURIComponent(JSON.stringify(state.value))}`,
      undefined,
      { shallow: true }
    );
    const result = GroupSchema.safeParse(
      JSON.parse(JSON.stringify(state.value))
    );
    if (result.success) {
      setNewFilter(result.data);
    }
  }

  return (
    <>
      <Head>
        <title>Central BioHub</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="fixed flex max-h-full min-h-full min-w-full max-w-full flex-col overflow-hidden bg-gray-100">
        <Header />
        <div className="max-h-[calc(100vh-80px)] overflow-x-hidden overflow-y-scroll font-poppins">
          <div
            className={`flex w-full flex-row items-center justify-center text-[${Colors.dark}] border-[${Colors.dark}]`}
          >
            {windowSize.width && windowSize.width < 900 ? (
              <>
                <h1 className="mb-2 ml-5 mt-5 text-center text-5xl">
                  <b>EXPERT PRODUCT SEARCH</b>
                </h1>
              </>
            ) : (
              <>
                <div className="m-5 h-1 w-full rounded-3xl border-2 border-solid border-inherit"></div>
                <h1 className="mb-2 ml-5 mt-5 whitespace-nowrap text-5xl">
                  <b>EXPERT PRODUCT SEARCH</b>
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
                  Expert search is a tailor-made solution to improve your search
                  by understanding the precise needs and search behavior of life
                  science scientists and biomedical researchers worldwide.
                </i>
              </p>
            ) : (
              <p className={`my-7 text-center text-xl text-[${Colors.dark}]`}>
                <i>
                  Expert search is a tailor-made solution to improve your search
                  by understanding the precise needs and search behavior of life
                  science scientists and biomedical researchers worldwide.
                  Therefore, we provide you with a wide array of search options,
                  helping to dive deeper into our bio inventory to land on your
                  matching human biospecimens within no time. Our inventory is
                  vast, we offer well-annotated, high-quality biological
                  specimens such as human serum, plasma, whole blood, human
                  tissue samples, and more for research purposes.
                </i>
              </p>
            )}
            <section className="w-full max-w-[95dvw] overflow-x-auto">
              <InitialContentEditor self={state} />
            </section>
            <div
              className={`flex ${
                windowSize.width && windowSize.width < 800
                  ? "flex-col"
                  : "flex-row"
              } mt-3 w-full`}
            >
              <div
                className={`flex flex-row ${
                  windowSize.width && windowSize.width < 800
                    ? "mb-2 min-w-full"
                    : "w-[50%]"
                }`}
              >
                {/*apply filter button*/}
                <button
                  className={`${
                    windowSize.width && windowSize.width < 800
                      ? "w-full"
                      : "w-[10rem]"
                  } px-4 py-1 text-center text-xl text-[${
                    Colors.dark
                  }] rounded-l-2xl bg-[#D8E9D1] transition-colors ease-in-out hover:bg-[#bfdab4]`}
                  onClick={() => applyFilter()}
                >
                  Apply Filter
                </button>

                {/*reset filter button*/}
                <button
                  className={`${
                    windowSize.width && windowSize.width < 800
                      ? "w-full"
                      : "w-[10rem]"
                  } px-4 py-1 text-center text-xl text-[${
                    Colors.dark
                  }] rounded-r-2xl bg-[#F7D59B] transition-colors ease-in-out hover:bg-[#d8b475]`}
                  onClick={() =>
                    state.set({
                      not: false,
                      link: "AND",
                      activated: true,
                      mandatory: true,
                      filter: [
                        {
                          col: "CBH_Donor_ID",
                          type: "equal",
                          values: [],
                          activated: true,
                          mandatory: true,
                        },
                      ],
                      groups: [],
                    })
                  }
                >
                  Reset
                </button>
              </div>
              <div
                className={`flex flex-row ${
                  windowSize.width && windowSize.width < 800
                    ? "mb-2 min-w-full"
                    : "w-[50%] justify-end"
                }`}
              >
                {/*load filter button*/}
                <button
                  className={`${
                    windowSize.width && windowSize.width < 800
                      ? "w-full"
                      : "w-[10rem]"
                  } px-4 py-1 text-center text-xl text-[${
                    Colors.dark
                  }] rounded-l-2xl bg-[#D8E9D1] transition-colors ease-in-out hover:bg-[#bfdab4]`}
                  onClick={() => setShowLoad(true)}
                >
                  Load Filter
                </button>

                {/*save filter button*/}
                <button
                  className={`${
                    windowSize.width && windowSize.width < 800
                      ? "w-full"
                      : "w-[10rem]"
                  } px-4 py-1 text-center text-xl text-[${
                    Colors.dark
                  }] rounded-r-2xl bg-[#F7D59B] transition-colors ease-in-out hover:bg-[#d8b475]`}
                  onClick={() => setShowSave(true)}
                >
                  Save Filter
                </button>
              </div>
            </div>

            {/*modals to save and load the filters*/}
            <ModalSaveExpert
              showModal={showSave}
              setShowModal={setShowSave}
              filter={unfreeze(state)}
            />
            <ModalLoadExpert
              showModal={showLoad}
              setShowModal={setShowLoad}
              filter={state}
            />
          </div>
          <div className="mx-4 my-2">
            <Table
              page={page}
              pagelength={pagelength}
              count={count}
              optionalSamples={samples}
              setPage={setPage}
              setPagelength={setPagelength}
              expert={true}
              filterExpert={state.value}
            />
          </div>
          <Footer />
        </div>
      </div>
    </>
  );
};

export default ExpertSearch;

function unfreeze(group: State<IGroup>) {
  return GroupSchema.parse(JSON.parse(JSON.stringify(group.value)));
}

function InitialContentEditor(props: { self: State<IGroup> }) {
  const self = useHookstate(props.self);

  // Function to set the activated state of the group and its child groups
  function SetActivated(groupState: State<IGroup>, activated: boolean): void {
    groupState.activated.set(activated);
    groupState.groups.map((group: State<IGroup>) => {
      SetActivated(group, activated);
    });
  }

  // Function to set the optional state of the group and its child groups
  function SetOptional(groupState: State<IGroup>, optional: boolean): void {
    groupState.groups.map((group: State<IGroup>) => {
      SetOptional(group, optional);
    });
    groupState.mandatory.set(optional);
    groupState.filter.forEach((filter) => {
      filter.mandatory.set(optional);
    });
  }

  return (
    <>
      <div className="mt-3 w-fit min-w-full rounded-3xl bg-gradient-to-r from-[#164A41] to-[#4D774E] py-1 text-lg">
        <div className="font-body flex flex-row px-5 py-2 font-poppins text-2xl font-thin">
          <div className="flex w-[50%] flex-row items-center justify-start">
            {/* Button to toggle the NOT state */}
            <button
              className={`ml-5 w-[6rem] rounded-l-2xl border-2 border-solid border-[#F1B24A] px-4 py-1 text-center text-lg ${
                self.not.value === true
                  ? "bg-[#F1B24A] text-white"
                  : "bg-transparent text-white"
              } `}
              onClick={() => self.not.set(!self.not.value)}
            >
              NOT
            </button>
            {/* Button to set the link state to AND */}
            <button
              className={`w-[6rem] border-y-2 border-solid border-[#F1B24A] px-4 py-1 text-center text-lg ${
                self.link.value === "AND"
                  ? "bg-[#F1B24A] text-white"
                  : "bg-transparent text-white"
              }`}
              onClick={() => self.link.set("AND")}
            >
              AND
            </button>
            {/* Button to set the link state to OR */}
            <button
              className={`w-[6rem] rounded-r-2xl border-2 border-solid border-[#F1B24A] px-4 py-1 text-center text-lg ${
                self.link.value === "OR"
                  ? "bg-[#F1B24A] text-white"
                  : "bg-transparent text-white"
              }`}
              onClick={() => self.link.set("OR")}
            >
              OR
            </button>

            {/* Help button with popover explaining the buttons */}
            <OverlayTrigger
              trigger="hover"
              placement="bottom"
              rootClose={true}
              overlay={
                <Popover id="popover-basic" className="z-30">
                  <Popover.Body className="items-center justify-center rounded-xl border-2 border-solid border-green-900 bg-white px-2 py-3 text-center shadow-md">
                    <div>
                      The buttons for AND or OR indicate how the different filters should be connected within the group. <br />
                      Underneath you select the column which should be filtered and in which form and then you enter the value.
                    </div>
                  </Popover.Body>
                </Popover>
              }
            >
              {/*
              <button className="ml-5 w-[2.5rem] rounded-full border-2 border-solid border-green-900 bg-[#9DC88D] px-1 py-1 text-lg text-white shadow-md">
                ?
              </button>
              */}
              {/*button to tutorial site*/}
              <form action="/tutorial">
              <button type="submit" className="ml-5 w-[2.5rem] rounded-full border-2 border-solid border-green-900 bg-[#9DC88D] px-1 py-1 text-lg text-white shadow-md">
                ?
              </button>
              </form>
            </OverlayTrigger>
          </div>
          <div className="flex w-[50%] flex-row items-center justify-end pr-3">
            {/* Button to add a new group */}
            <button
              className="w-[10rem] whitespace-nowrap rounded-l-2xl border-2 border-solid border-[#9DC88D] bg-[#9DC88D] px-4 py-1 text-center text-lg text-white"
              onClick={() =>
                self.groups.set((groups) =>
                  (groups || []).concat({
                    not: false,
                    link: "AND",
                    activated: true,
                    mandatory: true,
                    filter: [
                      {
                        col: "CBH_Donor_ID",
                        type: "equal",
                        values: [],
                        activated: true,
                        mandatory: self.mandatory.value === true ? true : false,
                      },
                    ],
                    groups: [],
                  })
                )
              }
            >
              New Group
            </button>
            {/* Button to add a new filter rule */}
            <button
              className="w-[10rem] whitespace-nowrap border-2 border-solid border-y-[#9DC88D] bg-[#9DC88D] px-4 py-1 text-center text-lg text-white"
              onClick={() =>
                self.filter.set((filters) =>
                  (filters || []).concat([
                    {
                      col: "CBH_Donor_ID",
                      type: "equal",
                      values: [],
                      activated: true,
                      mandatory: self.mandatory.value === true ? true : false,
                    },
                  ])
                )
              }
            >
              New Rule
            </button>
            {/* Button to toggle the activated state of the group */}
            <button
              className="w-[10rem] whitespace-nowrap rounded-r-2xl border-2 border-solid border-orange-400 bg-orange-400 px-4 py-1 text-center text-lg text-white"
              onClick={() => {
                SetActivated(self, !self.activated.value);
              }}
            >
              {self.activated.value ? "deactivate" : "activate"}
            </button>
            {/* Button to toggle the optional state of the group */}
            <button
              className="relative w-fit whitespace-nowrap rounded-2xl bg-[#F1B24A] px-3 py-1 text-center text-lg text-white outline-none transition hover:bg-[#e8b25b]"
              onClick={() => {
                SetOptional(self, !self.mandatory.value);
              }}
            >
              {self.mandatory.value ? "!" : "?"}
            </button>
          </div>
        </div>

        {/* Render the filter list */}
        {self.filter.map(
          (
            filterState: State<{
              col: string;
              type: string;
              values: string[];
              activated: boolean;
              mandatory: boolean;
            }>,
            i
          ) => (
            <div key={i}>
              <div className="my-1 ml-5 flex flex-row">
                {/* Render the column select component */}
                <ColSelect
                  col={filterState.col}
                  activated={self.activated}
                  filterActivated={filterState.activated}
                  values={filterState.values}
                />
                {/* Render the type select component */}
                <TypeSelect
                  col={filterState.col}
                  type={filterState.type}
                  values={filterState.values}
                  activated={self.activated}
                  filterActivated={filterState.activated}
                />
                {/* Render the choose values component */}
                <ChooseValues
                  type={filterState.type}
                  values={filterState.values}
                  col={filterState.col}
                  activated={self.activated}
                  filterActivated={filterState.activated}
                />
                {/* Button to toggle the activated state of the filter */}
                <button
                  className="relative right-4 z-10 w-[10rem] whitespace-nowrap rounded-r-2xl bg-orange-400 py-1 pl-6 pr-3 text-center text-lg text-white outline-none transition hover:bg-orange-300"
                  onClick={() =>
                    filterState.activated.set(!filterState.activated.value)
                  }
                >
                  {!self.activated.value || !filterState.activated.value
                    ? "Activate"
                    : "Deactivate"}
                </button>
                {/* Button to delete the filter */}
                <button
                  className="relative right-8 w-fit whitespace-nowrap rounded-r-2xl bg-red-500 py-1 pl-6 pr-3 text-center text-lg text-white outline-none transition hover:bg-red-400"
                  onClick={() =>
                    self.filter.set((filter) =>
                      filter.filter((_, index) => index !== i)
                    )
                  }
                >
                  delete
                </button>
                {/* Button to toggle the mandatory state of the filter */}
                <button
                  className="relative right-8 w-fit whitespace-nowrap rounded-2xl bg-[#F1B24A] px-3 py-1 text-center text-lg text-white outline-none transition hover:bg-[#e8b25b]"
                  onClick={() =>
                    filterState.mandatory.set(!filterState.mandatory.value)
                  }
                >
                  {!self.mandatory.value || !filterState.mandatory.value
                    ? "?"
                    : "!"}
                </button>
              </div>
              <div className="mx-10">
                {/* Render the values for 'in' type filters */}
                {filterState.type.value === "in" && (
                  <>
                    {filterState.values.value.map((value: string, i) => (
                      <div
                        key={i}
                        className="m-1 inline-block w-fit bg-red-400 px-2"
                      >
                        {value}
                        {/* Button to remove a value from 'in' type filters */}
                        <button
                          onClick={() =>
                            filterState.values.set((value) =>
                              value.filter((_, index) => index !== i)
                            )
                          }
                        >
                          <BiX />
                        </button>
                      </div>
                    ))}
                  </>
                )}
              </div>
            </div>
          )
        )}

        {/* Render the group list editor */}
        <GroupListEditor groups={self} />
      </div>
    </>
  );
}


function GroupContentEditor(props: {
  self: State<IGroup>;
  parent: State<IGroup>;
  index: number;
}) {
  const self = useHookstate(props.self);
  const parent = useHookstate(props.parent);

  const i = props.index;

  // Function to set the activated state of the group and its child groups
  function SetActivated(groupState: State<IGroup>, activated: boolean): void {
    groupState.activated.set(activated);
    groupState.groups.map((group: State<IGroup>) => {
      SetActivated(group, activated);
    });
  }

  // Function to set the optional state of the group and its child groups
  function SetOptional(groupState: State<IGroup>, optional: boolean): void {
    groupState.groups.map((group: State<IGroup>) => {
      SetOptional(group, optional);
    });
    groupState.mandatory.set(optional);
    groupState.filter.forEach((filter) => {
      filter.mandatory.set(optional);
    });
  }

  return (
    <>
      <div className="mt-1 w-full rounded-3xl bg-[rgb(131,182,94)] bg-gradient-to-r to-[#4D774E] py-1 text-lg">
        <div className="font-body flex flex-row px-5 py-2 font-poppins text-2xl font-thin">
          <div className="flex w-[50%] flex-row items-center justify-start">
            {/* Button to toggle the NOT state */}
            <button
              className={`ml-5 w-[6rem] whitespace-nowrap rounded-l-2xl border-2 border-solid border-[#F1B24A] px-4 py-1 text-center text-lg ${
                self.not.value === true
                  ? "bg-[#F1B24A] text-white"
                  : "bg-transparent text-white"
              } `}
              onClick={() => self.not.set(!self.not.value)}
            >
              NOT
            </button>
            {/* Button to set the link state to AND */}
            <button
              className={`w-[6rem] whitespace-nowrap border-y-2 border-solid border-[#F1B24A] px-4 py-1 text-center text-lg ${
                self.link.value === "AND"
                  ? "bg-[#F1B24A] text-white"
                  : "bg-transparent text-white"
              }`}
              onClick={() => self.link.set("AND")}
            >
              AND
            </button>
            {/* Button to set the link state to OR */}
            <button
              className={`w-[6rem] whitespace-nowrap rounded-r-2xl border-2 border-solid border-[#F1B24A] px-4 py-1 text-center text-lg ${
                self.link.value === "OR"
                  ? "bg-[#F1B24A] text-white"
                  : "bg-transparent text-white"
              }`}
              onClick={() => self.link.set("OR")}
            >
              OR
            </button>
          </div>
          <div className="flex w-[50%] flex-row items-center justify-end pr-3">
            {/* Button to add a new group */}
            <button
              className="w-[10rem] whitespace-nowrap rounded-l-2xl border-2 border-solid border-[#9DC88D] bg-[#9DC88D] px-4 py-1 text-center text-lg text-white"
              onClick={() =>
                self.groups.set((groups) =>
                  (groups || []).concat({
                    not: false,
                    link: "AND",
                    activated: true,
                    mandatory: self.mandatory.value === true ? true : false,
                    filter: [
                      {
                        col: "CBH_Donor_ID",
                        type: "equal",
                        values: [],
                        activated: true,
                        mandatory: self.mandatory.value === true ? true : false,
                      },
                    ],
                    groups: [],
                  })
                )
              }
            >
              New Group
            </button>
            {/* Button to add a new filter rule */}
            <button
              className="w-[10rem] whitespace-nowrap border-2 border-solid border-y-[#9DC88D] bg-[#9DC88D] px-4 py-1 text-center text-lg text-white"
              onClick={() =>
                self.filter.set((filters) =>
                  (filters || []).concat([
                    {
                      col: "CBH_Donor_ID",
                      type: "equal",
                      values: [],
                      activated: true,
                      mandatory: self.mandatory.value === true ? true : false,
                    },
                  ])
                )
              }
            >
              New Rule
            </button>
            {/* Button to toggle the activated state of the group */}
            <button
              className="w-[10rem] whitespace-nowrap border-2 border-solid border-y-orange-400 border-l-orange-400 bg-orange-400 px-4 py-1 text-center text-lg text-white"
              disabled={!parent.activated.value}
              onClick={() => {
                SetActivated(self, !self.activated.value);
              }}
            >
              {self.activated.value ? "Deactivate" : "Activate"}
            </button>
            {/* Button to delete the group */}
            <button
              className="w-[6rem] whitespace-nowrap rounded-r-2xl border-2 border-red-500 bg-red-500 py-1 text-center text-lg text-white outline-none transition hover:border-red-400 hover:bg-red-400"
              onClick={() =>
                parent.groups.set((group) =>
                  group.filter((_, index) => index !== i)
                )
              }
            >
              Delete
            </button>
            {/* Button to toggle the mandatory state of the group */}
            <button
              className="relative w-fit whitespace-nowrap rounded-2xl bg-[#F1B24A] px-3 py-1 text-center text-lg text-white outline-none transition hover:bg-[#e8b25b]"
              disabled={!parent.mandatory.value}
              onClick={() => {
                SetOptional(self, !self.mandatory.value);
              }}
            >
              {self.mandatory.value ? "!" : "?"}
            </button>
          </div>
        </div>

        {/* Render the filter list */}
        {self.filter.map(
          (
            filterState: State<{
              col: string;
              type: string;
              values: string[];
              activated: boolean;
              mandatory: boolean;
            }>,
            i
          ) => (
            <div key={i}>
              <div className="my-1 ml-5 flex flex-row">
                {/* Render the column select component */}
                <ColSelect
                  col={filterState.col}
                  activated={self.activated}
                  filterActivated={filterState.activated}
                  values={filterState.values}
                />
                {/* Render the type select component */}
                <TypeSelect
                  col={filterState.col}
                  type={filterState.type}
                  values={filterState.values}
                  activated={self.activated}
                  filterActivated={filterState.activated}
                />
                {/* Render the choose values component */}
                <ChooseValues
                  type={filterState.type}
                  values={filterState.values}
                  col={filterState.col}
                  activated={self.activated}
                  filterActivated={filterState.activated}
                />
                {/* Button to toggle the activated state of the filter */}
                <button
                  className="relative right-4 z-10 w-[10rem] whitespace-nowrap rounded-r-2xl bg-orange-400 py-1 pl-6 pr-3 text-center text-lg text-white outline-none transition hover:bg-orange-300"
                  disabled={!self.activated.value}
                  onClick={() =>
                    filterState.activated.set(!filterState.activated.value)
                  }
                >
                  {!self.activated.value || !filterState.activated.value
                    ? "Activate"
                    : "Deactivate"}
                </button>
                {/* Button to delete the filter */}
                <button
                  className="relative right-8 w-fit whitespace-nowrap rounded-r-2xl bg-red-500 py-1 pl-6 pr-3 text-center text-lg text-white outline-none transition hover:bg-red-400"
                  onClick={() =>
                    self.filter.set((filter) =>
                      filter.filter((_, index) => index !== i)
                    )
                  }
                >
                  Delete
                </button>
                {/* Button to toggle the mandatory state of the filter */}
                <button
                  className="relative right-8 w-fit whitespace-nowrap rounded-2xl bg-[#F1B24A] px-3 py-1 text-center text-lg text-white outline-none transition hover:bg-[#e8b25b]"
                  disabled={!self.mandatory.value}
                  onClick={() =>
                    filterState.mandatory.set(!filterState.mandatory.value)
                  }
                >
                  {!self.mandatory.value || !filterState.mandatory.value
                    ? "?"
                    : "!"}
                </button>
              </div>
              <div className="mx-10">
                {/* Render the values for 'in' type filters */}
                {filterState.type.value === "in" && (
                  <>
                    {filterState.values.value.map((value: string, i) => (
                      <div
                        key={i}
                        className="m-1 inline-block w-fit bg-red-400 px-2"
                      >
                        {value}
                        {/* Button to remove a value from 'in' type filters */}
                        <button
                          onClick={() =>
                            filterState.values.set((value) =>
                              value.filter((_, index) => index !== i)
                            )
                          }
                        >
                          <BiX />
                        </button>
                      </div>
                    ))}
                  </>
                )}
              </div>
            </div>
          )
        )}
      </div>
    </>
  );
}


function GroupListEditor(props: { groups: State<IGroup> }) {
  const state = useHookstate(props.groups);

  return (
    <>
      {state.groups.length > 0 && (
        <div className="mx-2 mb-1 rounded-3xl border-4">
          {state.groups.map((groupState: State<IGroup>, i) => (
            <div key={i}>
              <GroupContentEditor self={groupState} parent={state} index={i} />
              <GroupListEditor groups={groupState} />
            </div>
          ))}
        </div>
      )}
    </>
  );
}

function ColSelect(props: {
  col: State<string>;  
  activated: State<boolean>; 
  filterActivated: State<boolean>;  
  values: State<string[]>;  
}) {
  const col = useHookstate(props.col);  
  const activated = useHookstate(props.activated); 
  const filterActivated = useHookstate(props.filterActivated); 
  const values = useHookstate(props.values);  

  useEffect(() => {
    values.set([]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [col.value]);

  return (
    <select
      name="col"
      id="col"
      className="z-20 w-fit rounded-l-full border-2 border-gray-500 px-3 py-1 text-lg outline-none transition focus:border-gray-700"
      value={col.value}  // Set the selected value of the dropdown to the selected column
      onChange={(e) => {
        col.set(e.target.value);  // Update the selected column when a different option is chosen
        values.set([]);
      }}
      disabled={!(activated.value && filterActivated.value)}  // Disable the dropdown if activation or filter activation is false
    >
      {Object.getOwnPropertyNames(SampleSchema.shape).map((property, i) => {
        if (property !== "id") {
          return (
            <option key={1000 + i} value={property}>
              {property.replaceAll("_", " ")}  {/*Display the column name with underscores replaced by spaces*/}
            </option>
          );
        }
      })}
    </select>
  );
}


function TypeSelect(props: {
  type: State<string>;
  col: State<string>;
  values: State<string[]>;
  activated: State<boolean>;
  filterActivated: State<boolean>;
}) {
  const type = useHookstate(props.type);
  const values = useHookstate(props.values);
  const activated = useHookstate(props.activated);
  const filterActivated = useHookstate(props.filterActivated);
  const numberCol = [
    "Age",
    "BMI",
    "Cut_Off_Numerical",
    "Freeze_Thaw_Cycles",
    "Pregnancy_Week",
    "Price",
    "Quantity",
    "Result_Numerical",
  ];

  return (
    <select
      className="z-20 w-fit border-y-2 border-gray-500 px-3 py-1 text-center text-lg outline-none transition focus:border-gray-700"
      value={type.value}
      onChange={(e) => {
        values.set([]);
        type.set(e.target.value);
      }}
      disabled={!(activated.value && filterActivated.value)}
    >
      {/*choose of the type of the filter*/}
      <option className="text-left" value={"equal"}>
        =
      </option>
      <option className="text-left" value={"in"}>
        in
      </option>
      {numberCol.find((item) => item === props.col.value) && (
        <>
          <option className="text-left" value={"less"}>
            &lt;
          </option>
          <option className="text-left" value={"lessequal"}>
            &lt;=
          </option>
          <option className="text-left" value={"more"}>
            &gt;
          </option>
          <option className="text-left" value={"moreequal"}>
            &gt;=
          </option>
          <option className="text-left" value={"between"}>
            &lt;x&lt;
          </option>
        </>
      )}
    </select>
  );
}

function ChooseValues(props: {
  values: State<string[]>;
  type: State<string>;
  col: State<string>;
  activated: State<boolean>;
  filterActivated: State<boolean>;
}) {
  const type = useHookstate(props.type);
  const values = useHookstate(props.values);
  const col = useHookstate(props.col);

  const empty = useHookstate("");

  function SetValues(value: string): void {
    values.set([value]);
  }

  function SetValuesBetween1(value: string): void {
    values.set((a) => [value, a[1] ?? ""]);
  }

  function SetValuesBetween2(value: string): void {
    values.set((a) => [a[0] ?? "", value]);
  }

  function In(value: string): void {
    if (!values.value.find((v) => v === value)) {
      values.set((v) => (v || []).concat([value]));
    }
  }

  return (
    <>
      <div className="w-full">
        {type.value !== "between" && type.value !== "in" && (
          <>
            <AutoComplete
              col={col.value}
              onSelect={SetValues}
              value={values[0] ?? empty}
            />
          </>
        )}
        {type.value === "between" && (
          <div className="flex flex-row">
            <div className="w-full">
              <AutoComplete
                col={col.value}
                onSelect={SetValuesBetween1}
                value={values[0] ?? empty}
              />
            </div>
            <div className="w-full">
              <AutoComplete
                col={col.value}
                onSelect={SetValuesBetween2}
                value={values[1] ?? empty}
              />
            </div>
          </div>
        )}
        {type.value === "in" && (
          <>
            <AutoComplete
              col={col.value}
              onSelect={In}
              value={values[values.length - 1] ?? empty}
            />
          </>
        )}
      </div>
    </>
  );
}
