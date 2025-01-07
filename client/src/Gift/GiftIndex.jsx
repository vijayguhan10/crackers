import React from "react";
import PurchaseData from "./PurchaseData";
import Header from "../components/Header";
import GiftProducts from "./Products";
import AvailableGift from "./AvailableGift";
const GiftIndex = () => {
  return (
    <div className="ml-[18%] mt-6 ">
      <div className="">
        <Header />
        <GiftProducts />
        <AvailableGift/>
        <PurchaseData />
      </div>
    </div>
  );
};

export default GiftIndex;
