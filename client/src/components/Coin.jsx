import React, { useEffect, useState } from 'react'
import { useAuth } from './utils/AuthContext'
import { AiFillCopyrightCircle } from "react-icons/ai";

const Coin = () => {

  const { coins } = useAuth();   
   
  return (

    <div className={'flex items-center flex-row float-right mr-12 mt-12 coin-style'}>
        <AiFillCopyrightCircle className="mr-2 text-yellow-600" />
        { coins }
    </div>
  )
}

export default Coin