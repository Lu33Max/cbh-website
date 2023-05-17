import React, {type Dispatch, type SetStateAction} from 'react'

type props = {
    range: number[],
    page: number,
    setPage: Dispatch<SetStateAction<number>>
}

const Footer: React.FC<props> = ({range, page, setPage}) => {
    return (
        <div>          
            {range.map((el, index) => (
                <>
                    {(el === 1) && (
                        <>
                            <button key={index} className={`justify-center mx-1 rounded-lg mb-5 px-3 py-2 ${page === index + 1 ? 'bg-[rgb(174,207,150)] border-2 border-solid border-green-900 py-1 text-lg text-green-900' : 'border-2 border-solid border-green-900 bg-white py-1 text-lg text-green-900'}`} onClick={() => setPage(el)}>{el}</button>
                            {(page-4 > 1) && (
                                <label key={0}>&nbsp;. . .&nbsp;</label>
                            )}
                        </>
                    )}
                    {(el >= page-3 && el <= page +3 && el !== 1 && el !== range.length) && (
                        <button key={index} className={`justify-center mx-1 rounded-lg mb-5 px-3 py-2 ${page === index + 1 ? 'bg-[rgb(174,207,150)] border-2 border-solid border-green-900 py-1 text-lg text-green-900' : 'border-2 border-solid border-green-900 bg-white py-1 text-lg text-green-900'}`} onClick={() => setPage(el)}>{el}</button>
                    )}
                    {(el === range.length && range.length !== 1) && (
                        <>
                            {(page+4 < range.length) && (
                                <label key={range.length+1}>&nbsp;. . .&nbsp;</label>
                            )}
                            <button key={index} className={`justify-center mx-1 rounded-lg mb-5 px-3 py-2 ${page === index + 1 ? 'bg-[rgb(174,207,150)] border-2 border-solid border-green-900 py-1 text-lg text-green-900' : 'border-2 border-solid border-green-900 bg-white py-1 text-lg text-green-900'}`} onClick={() => setPage(el)}>{el}</button>
                        </>
                    )}
                </>
            ))}
        </div>
    )
}

export default Footer
