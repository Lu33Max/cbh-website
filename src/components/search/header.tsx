import React, { type Dispatch, type SetStateAction } from "react";
import { OverlayTrigger, Popover } from "react-bootstrap";
import { BiCartAdd } from "react-icons/bi";
import { Colors } from "~/common/styles";
import useWindowSize from "~/utils/window";

const Header: React.FC<{
  count: number | undefined;
  pagelength: number;
  range: number[];
  showPage: number;
  setPage: Dispatch<SetStateAction<number>>;
  setPagelength: Dispatch<SetStateAction<number>>;
  children?: React.ReactNode | React.ReactNode[];
  setSamplesToAdd: Dispatch<SetStateAction<number>>;
  addSamplesToCart: () => void;
}> = ({
  count,
  pagelength,
  range,
  showPage,
  setPage,
  setPagelength,
  children,
  setSamplesToAdd,
  addSamplesToCart,
}) => {
  const windowSize = useWindowSize();

  return (
    <div
      className={`${
        windowSize.width && windowSize.width < 900 ? "px-5" : "px-16"
      } mb-6`}
    >
      {windowSize.width && windowSize.width < 1100 ? (
        <div className="mt-3">
          <div className="mb-3 flex w-full flex-row items-center">
            <Count count={count} />
            <Cart
              pagelength={pagelength}
              setSamplesToAdd={setSamplesToAdd}
              addSamplesToCart={addSamplesToCart}
            />
            <div className="mx-auto"></div>
            <ShowRows
              pagelength={pagelength}
              setPagelength={setPagelength}
              setPage={setPage}
            />
            {children}
          </div>
          <div className="flex flex-row justify-center">
            <Pages range={range} page={showPage} setPage={setPage} />
          </div>
        </div>
      ) : (
        <div className="mb-2 mt-3 flex w-full flex-row items-center">
          <Count count={count} />
          <Cart
            pagelength={pagelength}
            setSamplesToAdd={setSamplesToAdd}
            addSamplesToCart={addSamplesToCart}
          />

          <div className="mx-auto">
            <Pages range={range} page={showPage} setPage={setPage} />
          </div>

          <ShowRows
            pagelength={pagelength}
            setPagelength={setPagelength}
            setPage={setPage}
          />
          {children}
        </div>
      )}
    </div>
  );
};

export default Header;

const Count: React.FC<{ count: number | undefined }> = ({ count }) => {
  const windowSize = useWindowSize();
  return (
    <div
      className={`w-fit rounded-2xl border-2 px-3 py-1 text-lg border-[${Colors.light}] bg-white text-[${Colors.dark}]`}
    >
      {windowSize.width && windowSize.width < 600 ? "Res:" : "Search Results:"}{" "}
      {count ?? "0"}
    </div>
  );
};

const Cart: React.FC<{
  pagelength: number;
  setSamplesToAdd: Dispatch<SetStateAction<number>>;
  addSamplesToCart: () => void;
}> = ({ pagelength, setSamplesToAdd, addSamplesToCart }) => {
  return (
    <OverlayTrigger
      trigger="click"
      placement="right"
      rootClose={true}
      overlay={
        <Popover
          id="popover-basic"
          className={`rounded-xl border-2 bg-white p-2 text-center border-[${Colors.dark}]`}
        >
          <Popover.Header as="h3" className="mb-2">
            Choose how many samples
            <br />
            from the top you want to
            <br />
            add to the cart.
          </Popover.Header>
          <Popover.Body>
            <div className="flex flex-row justify-center gap-3">
              <select
                className={`w-fit rounded-lg border-2 text-center text-lg border-[${Colors.dark}]`}
                onChange={(e) => setSamplesToAdd(Number(e.target.value))}
              >
                <option disabled selected hidden>
                  0
                </option>
                <option value={pagelength / 5}>{pagelength / 5}</option>
                <option value={(pagelength * 2) / 5}>
                  {(pagelength * 2) / 5}
                </option>
                <option value={(pagelength * 3) / 5}>
                  {(pagelength * 3) / 5}
                </option>
                <option value={(pagelength * 4) / 5}>
                  {(pagelength * 4) / 5}
                </option>
                <option value={pagelength}>all</option>
              </select>
              <button
                onClick={addSamplesToCart}
                className={`w-fit rounded-lg border-2 px-3 py-1 text-lg border-[${Colors.dark}] bg-[#D8E9D1] transition-colors ease-in-out hover:bg-[#bfdab4] text-[${Colors.dark}]`}
              >
                Add
              </button>
            </div>
          </Popover.Body>
        </Popover>
      }
    >
      <button
        className={`bg-white text-[${Colors.dark}] transition-colors ease-in-out hover:bg-[#bfdab4] border-[${Colors.light}] ml-2 rounded-xl border-2 p-1 text-3xl`}
      >
        <BiCartAdd />
      </button>
    </OverlayTrigger>
  );
};

const Pages: React.FC<{
  range: number[];
  page: number;
  setPage: Dispatch<SetStateAction<number>>;
}> = ({ range, page, setPage }) => {
  const windowSize = useWindowSize();
  return (
    <div className="flex flex-row items-center">
      {range.map((el, index) => (
        <>
          {el === 1 && (
            <>
              <button
                key={index}
                className={`mx-1 justify-center rounded-xl border-2 border-solid px-3 py-1 border-[${
                  Colors.dark
                }] text-lg text-[${Colors.dark}] ${
                  page === index + 1
                    ? `bg-[${Colors.accent_light}]`
                    : `bg-[${Colors.light_light}]`
                }`}
                onClick={() => setPage(el)}
              >
                {el}
              </button>
              {windowSize.width &&
                ((windowSize.width < 600 && page - 2 > 1) ||
                  (windowSize.width >= 600 && page - 3 > 1)) && (
                  <label key={1000} className="whitespace-nowrap">
                    &nbsp;. . .&nbsp;
                  </label>
                )}
            </>
          )}
          {windowSize.width &&
            ((windowSize.width < 600 && el >= page - 1 && el <= page + 1) ||
              (windowSize.width >= 600 && el >= page - 2 && el <= page + 2)) &&
            el !== 1 &&
            el !== range.length && (
              <button
                key={1000 + index}
                className={`mx-1 justify-center rounded-xl border-2 border-solid px-3 py-1 border-[${
                  Colors.dark
                }] text-lg text-[${Colors.dark}] ${
                  page === index + 1
                    ? `bg-[${Colors.accent_light}]`
                    : `bg-[${Colors.light_light}]`
                }`}
                onClick={() => setPage(el)}
              >
                {el}
              </button>
            )}
          {el === range.length && range.length !== 1 && (
            <>
              {windowSize.width &&
                ((windowSize.width < 600 && page + 2 < range.length) ||
                  (windowSize.width >= 600 && page + 3 < range.length)) && (
                  <label key={range.length + 1} className="whitespace-nowrap">
                    &nbsp;. . .&nbsp;
                  </label>
                )}
              <button
                key={1000 + index}
                className={`mx-1 justify-center rounded-xl border-2 border-solid px-3 py-1 border-[${
                  Colors.dark
                }] text-lg text-[${Colors.dark}] ${
                  page === index + 1
                    ? `bg-[${Colors.accent_light}]`
                    : `bg-[${Colors.light_light}]`
                }`}
                onClick={() => setPage(el)}
              >
                {el}
              </button>
            </>
          )}
        </>
      ))}
    </div>
  );
};

const ShowRows: React.FC<{
  pagelength: number;
  setPagelength: Dispatch<SetStateAction<number>>;
  setPage: Dispatch<SetStateAction<number>>;
}> = ({ pagelength, setPagelength, setPage }) => {
  const windowSize = useWindowSize();

  const handlePageLengthChange = (length: number) => {
    setPagelength(length);
  };

  return (
    <>
      <p
        className={`ml-2 w-fit rounded-l-2xl border-2 bg-white px-3 py-1 text-lg border-[${Colors.light}] text-[${Colors.dark}] h-10 outline-none transition`}
      >
        {windowSize.width && windowSize.width < 600 ? "Rows" : "Show rows"}
      </p>
      <select
        className={`w-fit rounded-r-2xl border-2 border-l-0 bg-white px-3 py-2 text-lg border-[${Colors.light}] text-[${Colors.dark}] h-10 outline-none transition`}
        name="pagelength"
        id="pagelength"
        value={pagelength}
        onChange={(e) => {
          handlePageLengthChange(parseInt(e.target.value));
          setPage(1);
        }}
      >
        <option value={50}>50</option>
        <option value={100}>100</option>
        <option value={150}>150</option>
        <option value={200}>200</option>
        <option value={250}>250</option>
        <option value={500}>500</option>
        <option value={1000}>1000</option>
      </select>
    </>
  );
};
