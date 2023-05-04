import React, {useState} from 'react'

const Group: React.FC = () => {

  return (
    <div className='bg-orange-100 mx-5'>
    <div className='flex flex-row px-5 py-2 font-body font-poppins text-2xl font-thin'>
        <div className='bg-gray-400 rounded-s px-3'>
            <input type="checkbox" id="not" name="not" value="not"/><label>NOT</label>
        </div>
        <button className='bg-blue-700 text-white px-3 rounded-s'>AND</button>
        <button className='bg-blue-400 text-white px-3 rounded-s'>OR</button>
        <div className='ml-96'>
            <button className='bg-[rgb(131,182,94)] text-white px-3 rounded-lg'>new Rule</button>
            <button className='bg-[rgb(131,182,94)] text-white px-3 rounded-lg'>new Group</button>
        </div>
    </div>
    </div>
    
  )
}

export default Group
