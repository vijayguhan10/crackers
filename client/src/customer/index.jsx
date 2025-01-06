import { useState } from "react";
import CustomerCard from "./CustomerCard";
import CustomerData from "./customer.json";

function Index() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [customers, setCustomers] = useState(CustomerData);

  const handleStatusToggle = (customerId) => {
    const updatedCustomers = customers.map((customer) => {
      if (customer.id === customerId) {
        return {
          ...customer,
          status: customer.status === "Active" ? "Inactive" : "Active",
        };
      }
      return customer;
    });
    setCustomers(updatedCustomers);
  };

  const filteredCustomers = customers.filter((customer) => {
    const matchesSearch =
      customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || customer.status.toLowerCase() === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="ml-[16.7%] bg-gray-100 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Customer Dashboard
          </h1>

          <div className="flex flex-col sm:flex-row gap-4">
            <input
              type="text"
              placeholder="Search customers..."
              className="flex-1 p-2 border rounded-lg"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />

            <select
              className="p-2 border rounded-lg"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCustomers.map((customer) => (
            <div
              key={customer.id}
              className="bg-white p-4 rounded-lg "
            >
              <CustomerCard customer={customer} />
              <button
                onClick={() => handleStatusToggle(customer.id)}
                className={`mt-4  p-2 rounded-lg ${
                  customer.status === "Active" ? "bg-red-500" : "bg-green-500"
                } text-white`}
              >
                {customer.status === "Active" ? "Deactivate" : "Activate"}
              </button>
            </div>
          ))}
        </div>

        {filteredCustomers.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">
              No customers found matching your criteria.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Index;
