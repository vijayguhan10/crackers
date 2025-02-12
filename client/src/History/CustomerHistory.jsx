import React from "react";
import HistoryCard from "./HistoryCard";
const CustomerHistory = () => {
  return (
    <div className=" ml-[0.2%] sm:ml-[18%] mt-6 ">
      <div className="">
        <h1 className=" ml-20 sm:ml-0 text-4xl">History Data</h1>
        <HistoryCard/>
      </div>
    </div>
  );
};

export default CustomerHistory;
