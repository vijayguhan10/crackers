import { useEffect, useState } from "react";
import CustomerCard from "./CustomerCard";
import { Link } from "react-router-dom";
import axios from "axios";
import CreateCustomer from "./CreateCustomer";
import { Loader } from "lucide-react";
function Index() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchCustomers = async () => {
    const token = localStorage.getItem("cracker_token");
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BASEURL}/customer/`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("fetched all customer : ", response.data);
      if (response.status === 200) {
        setCustomers(response.data);
      }
    } catch (error) {
      console.error("Error fetching customers:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const filteredCustomers = customers.filter((customer) => {
    const matchesSearch = customer.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "" ||
      (statusFilter === "active" && customer.status === true) ||
      (statusFilter === "inactive" && customer.status === false);

    return matchesSearch && matchesStatus;
  });

  return loading ? (
    <div className="flex justify-center items-center h-screen">
      <Loader size={50} className=" animate-spin" />
    </div>
  ) : (
    <div className="ml-[16.7%] bg-gray-100 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <div className="flex flex-row justify-between">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Customer Dashboard
            </h1>
            <CreateCustomer />
          </div>
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
              <option value="">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCustomers.map((customer) => (
            <div
              key={customer.id}
              className="bg-white p-4 rounded-lg flex flex-col space-y-4"
            >
              <CustomerCard customer={customer} />
              <Link
                to={`/billing/${customer._id}/${customer.name}`} 
                className="mt-auto bg-yellow-400 rounded-lg text-black px-2 w-24 py-2 text-center"
              >
                Billing
              </Link>
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
