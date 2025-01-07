import Photos from "./Photos";
import React from "react";
import UserData from "./UserData";
import Publications from "./Publications";
import InvoiceTemplate from "./InvoiceTemplate";
const Index = () => {
  return (
    <div className="ml-[18%] mt-5">
      <UserData />
      <Photos />
      <div>
        <InvoiceTemplate />
      </div>
      <Publications />
    </div>
  );
};

export default Index;
