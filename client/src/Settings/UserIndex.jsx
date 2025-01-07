import Photos from "./Photos";
import React from "react";
import UserData from "./UserData";
import Publications from "./Publications";
const Index = () => {
  return (
    <div className="ml-[18%] mt-5">
      <Photos />
      <UserData />
      <Publications />
    </div>
  );
};

export default Index;
