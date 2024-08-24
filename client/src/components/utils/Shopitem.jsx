import React, { useState } from 'react'
import Button from '../Button';
import { useAuth } from './AuthContext';

const Shopitem = (props) => {

  const { handleShopBuy, coins, setCoins, setAlert } = useAuth();
  const [credits, setCredits] = useState(props.credits);

  function handleButton() {
    if (coins >= props.credits) {
      handleShopBuy(props.name, props.credits);
      setAlert("Item bought!");
      setCredits("Bought")
      setTimeout(() => setAlert(null), 3000);
    } else {
      setAlert("Cannot buy item, don't have enough credits")
      setTimeout(() => setAlert(null), 3000);
    }
  }

  return (
    (<div className='flex flex-col items-center bg-blue-950 rounded-xl shadow-xl p-6 m-6'>
        <img className="w-[250px] h-[250px]" src={props.src} />
        <p className='font-nunito text-2xl mb-6'>{props.name}</p>
        {credits === "Bought" ? (<p className="text-xl text-red-600 font-nunito">Bought</p>) : (<Button onClick={handleButton} content={"Buy for " + props.credits + " credits"} />)}
        
    </div>)
  )
}

export default Shopitem