import React, { type Dispatch, type SetStateAction } from 'react'
import { OverlayTrigger, Popover } from 'react-bootstrap';
import { BiCartAdd } from 'react-icons/bi';
import { Colors } from '~/common/styles';

const Header: React.FC<{count: number | undefined, pagelength: number, range: number[], showPage: number, setPage: Dispatch<SetStateAction<number>>, setPagelength: Dispatch<SetStateAction<number>>, children?: React.ReactNode | React.ReactNode[], setSamplesToAdd: Dispatch<SetStateAction<number>>, addSamplesToCart: () => void }> = ({count, pagelength, range, showPage, setPage, setPagelength, children, setSamplesToAdd, addSamplesToCart}) => {
  return (
    <div className='px-16 mb-6'>         
      <div className="flex flex-row w-full items-center mt-3 mb-2">
        <Count count={count}/>
        <Cart pagelength={pagelength} setSamplesToAdd={setSamplesToAdd} addSamplesToCart={addSamplesToCart}/>

        <div className="mx-auto">
          <Footer range={range} page={showPage} setPage={setPage} />
        </div>     

        <ShowRows pagelength={pagelength} setPagelength={setPagelength} setPage={setPage}/>
        {children}
      </div>
    </div>
  )
}

export default Header
  
const Count: React.FC<{count: number | undefined}> = ({count}) => {
  return (
    <div className={`w-fit px-3 py-1 text-lg rounded-2xl border-2 border-[${Colors.light}] bg-white text-[${Colors.dark}]`}>
      Search Results: {count ?? "0"}
    </div>
  )
}

const Cart: React.FC<{pagelength: number, setSamplesToAdd: Dispatch<SetStateAction<number>>, addSamplesToCart: () => void}> = ({pagelength, setSamplesToAdd, addSamplesToCart}) => {

  return (
    <OverlayTrigger trigger="click" placement="right" rootClose={true} overlay={
        <Popover id="popover-basic" className={`bg-white rounded-xl p-2 text-center border-2 border-[${Colors.dark}]`}>
          <Popover.Header as="h3" className='mb-2'>Here you choose the first <br/> samples from the top.</Popover.Header>
          <Popover.Body>
            <div className='flex flex-row justify-center'>
              <select className='text-center text-xl w-[3vw]' onChange={(e) => setSamplesToAdd(Number(e.target.value))}>
                <option disabled selected hidden>0</option>
                <option value={pagelength/5}>{pagelength/5}</option>
                <option value={pagelength*2/5}>{pagelength*2/5}</option>
                <option value={pagelength*3/5}>{pagelength*3/5}</option>
                <option value={pagelength*4/5}>{pagelength*4/5}</option>
                <option value={pagelength}>all</option>
              </select>
              <button onClick={addSamplesToCart} className={`bg-[${Colors.light}] px-4 py-1 rounded-xl ml-2`}>Add</button>
            </div>
          </Popover.Body>
        </Popover>
      }>
        <button className='bg-gray-300 text-3xl rounded-xl p-1 ml-2'><BiCartAdd/></button>
      </OverlayTrigger>    
  )
}

const Footer: React.FC<{range: number[], page: number, setPage: Dispatch<SetStateAction<number>>}> = ({range, page, setPage}) => {
  return (
    <div className='flex flex-row items-center'>          
      {range.map((el, index) => (
        <>
          {(el === 1) && (
            <>
              <button key={index} className={`justify-center mx-1 rounded-xl px-3 py-1 border-2 border-solid border-[${Colors.dark}] text-lg text-[${Colors.dark}] ${page === index + 1 ? `bg-[${Colors.accent_light}]` : `bg-[${Colors.light_light}]`}`} onClick={() => setPage(el)}>{el}</button>
              {(page-3 > 1) && (
                  <label key={1000}>&nbsp;. . .&nbsp;</label>
              )}
            </>
          )}
          {(el >= page - 2 && el <= page + 2 && el !== 1 && el !== range.length) && (
            <button key={1000 + index} className={`justify-center mx-1 rounded-xl px-3 py-1 border-2 border-solid border-[${Colors.dark}] text-lg text-[${Colors.dark}] ${page === index + 1 ? `bg-[${Colors.accent_light}]` : `bg-[${Colors.light_light}]`}`} onClick={() => setPage(el)}>{el}</button>
          )}
          {(el === range.length && range.length !== 1) && (
            <>
              {(page + 3 < range.length) && (
                  <label key={range.length + 1}>&nbsp;. . .&nbsp;</label>
              )}
              <button key={1000 + index} className={`justify-center mx-1 rounded-xl px-3 py-1 border-2 border-solid border-[${Colors.dark}] text-lg text-[${Colors.dark}] ${page === index + 1 ? `bg-[${Colors.accent_light}]` : `bg-[${Colors.light_light}]`}`} onClick={() => setPage(el)}>{el}</button>
            </>
          )}
        </>
      ))}
    </div>
  )
}

const ShowRows: React.FC<{pagelength: number, setPagelength: Dispatch<SetStateAction<number>>, setPage: Dispatch<SetStateAction<number>>}> = ({pagelength, setPagelength, setPage}) => {

  const handlePageLengthChange = (length: number) => {
    setPagelength(length);
  };

  return (
    <>
      <p className={`ml-4 w-fit px-3 py-1 text-lg rounded-l-2xl border-2 bg-white border-[${Colors.light}] text-[${Colors.dark}] outline-none transition h-10`}>Show rows</p>
      <select className={`w-fit px-3 py-2 text-lg rounded-r-2xl border-2 border-l-0 bg-white border-[${Colors.light}] text-[${Colors.dark}] outline-none transition h-10`} name="pagelength" id="pagelength" value={pagelength} onChange={e => {handlePageLengthChange(parseInt(e.target.value)); setPage(1)}}>
        <option value={50}>50</option>
        <option value={100}>100</option>
        <option value={150}>150</option>
        <option value={200}>200</option>
        <option value={250}>250</option>
        <option value={500}>500</option>
        <option value={1000}>1000</option>
      </select>
    </>
  )
}