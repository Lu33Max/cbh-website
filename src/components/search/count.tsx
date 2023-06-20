import React from 'react'
import { Colors } from '~/common/styles'

type input = {
  count: number | undefined
}

const Count: React.FC<input> = ({count}) => {

  return (
    <>
      <div className={`w-fit px-3 py-1 text-lg rounded-2xl border-2 border-[${Colors.light}] bg-white text-[${Colors.dark}]`}>
        Search Results: {count ?? "0"}
      </div>
    </>
  )
}

export default Count
