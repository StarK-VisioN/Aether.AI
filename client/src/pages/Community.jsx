import { useUser } from '@clerk/clerk-react';
import React, { useEffect, useState } from 'react'
import { dummyPublishedCreationData } from '../assets/assets';
import { Heart } from 'lucide-react';

const Community = () => {

  const [creations, setCreations] = useState([]);
  const {user} = useUser();

  const fetchCreations = async() => {
    setCreations(dummyPublishedCreationData)
  }

  useEffect(() =>{
    if(user) {
      fetchCreations();
    }
  }, [])

  return (
    <div className='flex-1 h-full flex flex-col gap-4 p-6'>
      Creations
      {/* display - list of created images */}
      <div className='bg-white h-full w-full rounded-xl overflow-y-scroll'>
        {
          creations.map((creation, index) =>(
            <div key={index} className='relative group inline-block pl-3 pt-3 w-full sm:max-w-1/2 lg:max-w-1/3'>
              <img src={creation.content} alt="" className='w-full h-full object-cover rounded-lg' />
            
              <div className='absolute bottom-0 left-3 right-0 hidden group-hover:flex items-center justify-between gap-2 p-3 bg-gradient-to-t from-black/90 to-transparent text-white rounded-b-lg'>
                <p className='text-sm flex-1'>{creation.prompt}</p>
                <div className='flex gap-1 items-center flex-shrink-0'>
                  <Heart className={`min-w-5 h-5 hover:scale-110 cursor-pointer ${creation.likes.includes(user.id) ? 'fill-red-500 text-red-600' : 'text-white'}`} />
                  <p className='text-sm'>{creation.likes.length}</p>
                </div>
              </div>
            </div>
          ))
        }
      </div>
    </div>
  )
}

export default Community