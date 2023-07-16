import React, {
  useEffect,
  type SetStateAction,
  type Dispatch,
  useState,
} from "react";

import {
  NormalFilterSchema,
  type INormalFilter,
  FilterType,
} from "~/common/filter/filter";
import { useSession } from "next-auth/react";
import { api } from "~/utils/api";
import { type Filter } from "@prisma/client";
import Link from "next/link";

type CustomModalProps = {
  showModal: boolean;
  setShowModal: Dispatch<SetStateAction<boolean>>;
  setFilter: Dispatch<SetStateAction<INormalFilter>>;
};

const ModalLoad: React.FC<CustomModalProps> = ({
  showModal,
  setShowModal,
  setFilter,
}) => {
  const [selected, setSelected] = useState<Filter | undefined>();

  const { data: sessionData } = useSession();
  const { data: sessionFilter, refetch: refetchFilter } =
    api.filter.getAll.useQuery(
      {
        type: FilterType.normal,
      },
      {
        enabled: sessionData?.user !== undefined,
      }
    );

  useEffect(() => {
    if (showModal) {
      void refetchFilter();
    }
  }, [showModal, refetchFilter]);

  function onClose() {
    setShowModal(false);
    setSelected(undefined);
  }

  function applyFilter() {
    if (selected) {
      try {
        const parseFilter = NormalFilterSchema.parse(
          JSON.parse(selected.filter)
        );
        setFilter(parseFilter);
        setSelected(undefined);
        setShowModal(false);
      } catch (error) {
        console.error(error);
        alert("Something went wrong. Please try again.");
      }
    }
  }

  return (
    <>
      {showModal ? (
        <>
          <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto overflow-x-hidden outline-none focus:outline-none">
            <div className="relative mx-auto my-6 w-auto max-w-3xl">
              {/*content*/}
              <div className="relative w-full rounded-2xl border-0 bg-white shadow-lg outline-none focus:outline-none">
                {/*header*/}
                <div className="flex w-full rounded-t-2xl border-b border-solid border-slate-200 bg-[rgb(131,182,94)] p-5 text-center">
                  <h3 className="w-full text-center text-3xl font-semibold">
                    Load filters
                  </h3>
                </div>
                {/*body*/}
                {sessionData?.user ? (
                  <div className="mx-5 mt-3 flex max-h-[50vh] flex-col overflow-y-auto text-lg">
                    {sessionFilter && sessionFilter.length > 0 ? (
                      sessionFilter.map((filter, i) => (
                        <button
                          key={i}
                          onClick={() => setSelected(filter)}
                          className={`my-1 rounded-2xl py-1 ${
                            filter.name === selected?.name
                              ? "bg-[#9DC88D]"
                              : "bg-slate-100"
                          }`}
                        >
                          {filter.name}
                        </button>
                      ))
                    ) : (
                      <label>No filter found.</label>
                    )}
                  </div>
                ) : (
                  <div className="px-5 py-3">
                    <label className="flex flex-col justify-center text-center">
                      Want to save your current filter?
                      <br />{" "}
                      <Link href={"/auth/login"} className="text-blue-700">
                        <b>Sign In</b>
                      </Link>
                    </label>
                  </div>
                )}
                {/*footer*/}
                <div className="flex items-center justify-center rounded-b border-t border-solid border-slate-200 px-6 py-3">
                  <button
                    className="background-transparent mb-1 mr-1 px-6 py-2 text-sm font-bold uppercase text-red-500 outline-none transition-all duration-150 ease-linear focus:outline-none"
                    type="button"
                    onClick={onClose}
                  >
                    Close
                  </button>
                  <button
                    className="mb-1 mr-1 rounded bg-emerald-500 px-6 py-3 text-sm font-bold uppercase text-white shadow outline-none transition-all duration-150 ease-linear hover:shadow-lg focus:outline-none active:bg-emerald-600"
                    type="button"
                    onClick={applyFilter}
                  >
                    Load
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="fixed inset-0 z-40 bg-black opacity-25"></div>
        </>
      ) : (
        <></>
      )}
    </>
  );
};

export default ModalLoad;
