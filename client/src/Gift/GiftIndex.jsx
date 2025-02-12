import React from 'react';
import PurchaseData from './PurchaseData';
import Header from '../components/Header';
import GiftProducts from './Products';
const GiftIndex = () => {
  return (
    <div className="ml-0% sm:ml-[18%] mt-0 ">
      <div className="">
          <Header />
        <GiftProducts />
        <PurchaseData />
      </div>
    </div>
  );
};

export default GiftIndex;
