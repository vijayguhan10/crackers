import React from "react";
import { Routes, Route } from "react-router-dom";
import Dashboard from "../Dashboard/index";
import Billing from "../cart/Productdata";
import CustomerHistory from "../History/CustomerHistory";
import StockTable from "../stocks/StockTable";
import CustomerData from "../customer/index";
import UserSettings from "../Settings/UserIndex";
const InitialRouter = () => {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/History" element={<CustomerHistory />} />
      <Route path="/billing" element={<Billing />} />
      <Route path="/stocks" element={<StockTable />} />
      <Route path="/customer" element={<CustomerData />} />
      <Route path="/settings" element={<UserSettings />} />
    </Routes>
  );
};

export default InitialRouter;
