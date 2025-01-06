import React from "react";
import { Routes, Route } from "react-router-dom";
import Dashboard from "../Dashboard/index";
import Billing from "../cart/Productdata";
import CustomerData from "../customer/index";
const InitialRouter = () => {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/billing" element={<Billing />} />
      <Route path="/customer" element={<CustomerData />} />
    </Routes>
  );
};

export default InitialRouter;
