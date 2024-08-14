import React from 'react'
import Shopitem from './components/utils/Shopitem'
import Sidebar from './components/Sidebar'
import Coin from './components/Coin'
import Alert from '@mui/material/Alert';
import { useAuth } from './components/utils/AuthContext';



const Shop = () => {

  const { alert } = useAuth();

  const shopItems = [
    {
      name: "Bronze Badge",
      src: "../bronzebadge.png" ,
      credits: 20,
    },
    {
      name: "Silver Badge",
      src: "../silverbadge.png",
      credits: 75,
    },
    {
      name: "Gold Badge",
      src: "../goldbadge.png",
      credits: 200,
    },
    {
      name: "Diamond Badge",
      src: "../diamondbadge.png",
      credits: 1000,
    }
  ]

  return (
    <div className='h-screen ml-24'>
        <Sidebar from="shop" />
        
        <Coin />
        <div className="flex flex-row justify-center">
          {
            alert && (
              (alert === "Item bought!") ? 
              ( <Alert className="absolute top-6" variant="filled" severity="success">
                {alert}
              </Alert> ) :
              (
                <Alert className="absolute top-6" variant="filled" severity="info">
                  {alert}
                </Alert> 
              )
            )
          }
        </div>
        <div className="flex flex-row flex-wrap">
          {
            shopItems.map((item) => {
              return (
                <Shopitem 
                  name={item.name}
                  src={item.src}
                  credits={item.credits} />
              )
            })
          }
        </div>
    </div>
  )
}

export default Shop