import React from "react";
import { Routes, Route } from "react-router-dom";
import Dashboard from "../Dashboard/index";
import Billing from "../cart/Productdata";
import CustomerHistory from "../History/CustomerHistory";
import StockTable from "../stocks/StockTable";
import CustomerData from "../customer/index";
import GiftIndex from "../Gift/GiftIndex";
import UserSettings from "../Settings/UserIndex";
import Signup from "../components/Signup";
const InitialRouter = () => {
  return (
    <Routes>
      <Route path="/" element={<Signup />} />
      <Route path="/History" element={<CustomerHistory />} />
      <Route path="/billing" element={<Billing />} />
      <Route path="/stocks" element={<StockTable />} />
      <Route path="/customer" element={<CustomerData />} />
      <Route path="/settings" element={<UserSettings />} />
      <Route path="/gift" element={<GiftIndex />} />
    </Routes>
  );
};

export default InitialRouter;
