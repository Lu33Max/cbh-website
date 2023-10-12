import { useSession } from "next-auth/react";
import Link from "next/link";
import React, {
  type Dispatch,
  type SetStateAction,
  useState,
  useEffect,
} from "react";

import { FilterType, type IGroup } from "~/common/filter/filter";
import { api } from "~/utils/api";

type CustomModalProps = {
  showModal: boolean;
  setShowModal: Dispatch<SetStateAction<boolean>>;
  filter: IGroup;
};

const ModalSaveExpert: React.FC<CustomModalProps> = ({
  showModal,
  setShowModal,
  filter,
}) => {
  const [filtername, setFiltername] = useState<string>("");

  const { data: sessionData } = useSession();
  const { data: sessionFilter, refetch: refetchFilter } =
    api.filter.getAll.useQuery(
      {
        type: FilterType.expert,
      },
      {
        enabled: sessionData?.user !== undefined,
      }
    );
  const createFilter = api.filter.create.useMutation();

  useEffect(() => {
    if (showModal) {
      void refetchFilter();
    }
  }, [showModal, refetchFilter]);

  function onClose() {
    setShowModal(false);
    setFiltername("");
  }

  function onSubmit() {
    if (filtername !== "") {
      if (
        sessionFilter &&
        sessionFilter.find((e) => e.name === filtername) === undefined
      ) {
        createFilter.mutate({
          filter: JSON.stringify(filter),
          name: filtername,
          type: FilterType.expert,
        });

        if (!createFilter.isError) {
          setFiltername("");
          setShowModal(false);
        } else {
          alert("Something went wrong. Please try again.");
        }
      } else {
        alert("Name already taken");
      }
    } else {
      alert("Please enter a valid name");
    }
  }

  return (
    <>
      {showModal ? (
        <>
          <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto overflow-x-hidden text-lg outline-none focus:outline-none">
            <div className="relative mx-auto my-6 w-auto max-w-3xl">
              {/*content*/}
              <div className="relative flex w-full flex-col rounded-2xl border-0 bg-white shadow-lg outline-none focus:outline-none">
                {/*header*/}
                <div className="flex items-start justify-between rounded-t-2xl border-b border-solid border-slate-200 bg-[#D8E9D1] p-5">
                  <h3 className="w-full text-center text-3xl font-semibold">
                    Save filter
                  </h3>
                </div>
                {/*body*/}
                {sessionData?.user ? (
                  <div className="relative flex-auto p-5">
                    <input
                      className="mx-2 rounded-xl border-2 border-solid border-black px-2 py-1 text-center text-lg"
                      placeholder="Enter a name"
                      onChange={(e) => setFiltername(e.target.value)}
                    ></input>
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
                    className="mb-1 mr-1 rounded bg-[#D8E9D1] px-6 py-3 text-sm font-bold uppercase shadow outline-none transition-all duration-150 ease-linear hover:shadow-lg focus:outline-none active:bg-[#aabda3]"
                    type="button"
                    onClick={() => {
                      filtername !== ""
                        ? onSubmit()
                        : alert("Please enter a name");
                    }}
                  >
                    Save Filter
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

export default ModalSaveExpert;
