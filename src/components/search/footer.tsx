import React, {type Dispatch, type SetStateAction} from 'react'

type props = {
    range: number[],
    page: number,
    setPage: Dispatch<SetStateAction<number>>
}

const Footer: React.FC<props> = ({range, page, setPage}) => {
    console.log(range)
    return (
        <div>          
            {range.map((el, index) => (
                <>
                    {(el === 1) && (
                        <>
                            <button key={index} onClick={() => setPage(el)}>{el}</button>
                            {(page-4 > 1) && (
                                <label key={0}>&nbsp;. . .&nbsp;</label>
                            )}
                        </>
                    )}
                    {(el >= page-3 && el <= page +3 && el !== 1 && el !== range.length) && (
                        <button key={index}  onClick={() => setPage(el)}>{el}</button>
                    )}
                    {(el === range.length && range.length !== 1) && (
                        <>
                            {(page+4 < range.length) && (
                                <label key={range.length+1}>&nbsp;. . .&nbsp;</label>
                            )}
                            <button key={index} onClick={() => setPage(el)}>{el}</button>
                        </>
                    )}
                </>
            ))}
        </div>
    )
}

export default Footer
