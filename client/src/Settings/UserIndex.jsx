import React from 'react';
import UserData from './UserData';
import Publications from './Publications';
import InvoiceTemplate from './InvoiceTemplate';
const Index = () => {
  return (
    <div className="ml-[16.7%] ">
      <UserData />
      <div>
        <InvoiceTemplate />
      </div>
      <Publications />
    </div>
  );
};

export default Index;
