import React, { useEffect, useState } from 'react'
import Shopitem from './components/utils/Shopitem'
import Sidebar from './components/Sidebar'
import Coin from './components/Coin'
import Alert from '@mui/material/Alert';
import { useAuth } from './components/utils/AuthContext';



const Shop = () => {

  const { alert, getShopBought } = useAuth();
  const [shopStatus, setShopStatus] = useState();
  const [shopItems, setShopItems] = useState([]);

  useEffect(() => {

    const fetchShopStatus = async () => {
      const shopStatus = await getShopBought();
      setShopItems([
        {
          name: "Bronze Badge",
          src: "../bronzebadge.png" ,
          credits: 20,
          hasMedal: shopStatus.bronze_medal,
          key: 1,
        },
        {
          name: "Silver Badge",
          src: "../silverbadge.png",
          credits: 75,
          hasMedal: shopStatus.silver_medal,
          key: 2,
        },
        {
          name: "Gold Badge",
          src: "../goldbadge.png",
          credits: 200,
          hasMedal: shopStatus.gold_medal,
          key: 3,
        },
        {
          name: "Diamond Badge",
          src: "../diamondbadge.png",
          credits: 1000,
          hasMedal: shopStatus.diamond_medal,
          key: 4,
        }
      ])
      setShopStatus(shopStatus);
    };
  
    fetchShopStatus();

  }, []);

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
                  key={item.key}
                  name={item.name}
                  src={item.src}
                  credits={item.hasMedal ? "Bought" : item.credits} />
              )
            })
          }
        </div>
    </div>
  )
}

export default Shop