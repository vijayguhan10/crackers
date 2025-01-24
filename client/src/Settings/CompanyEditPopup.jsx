import React from 'react';
import axios from 'axios';

const CompanyEditPopup = ({
  editCompanyData,
  setEditCompanyData,
  showEditCompanyPopup,
  setShowEditCompanyPopup,
  fetchCompanyData
}) => {
  const handleEditCompany = async () => {
    try {
      const token = localStorage.getItem('cracker_token');
      const filteredData = Object.entries(editCompanyData).reduce(
        (acc, [key, value]) => {
          if (value !== '') {
            acc[key] = value;
          }
          return acc;
        },
        {}
      );
      await axios.put(
        `${process.env.REACT_APP_BASEURL}/company/`,
        filteredData,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      setShowEditCompanyPopup(false);
      fetchCompanyData();
    } catch (err) {
      console.error(err);
      alert('Error updating company details.');
    }
  };

  return (
    <>
      {showEditCompanyPopup && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center p-1">
          <div className="bg-white p-6 rounded-lg w-[40%]">
            <h2 className="text-xl font-bold mb-4">Edit Company Details</h2>
            <form className="space-y-4">
              <div className="flex items-center">
                <label className="w-40 text-gray-700 font-medium">
                  Company Name:
                </label>
                <input
                  type="text"
                  placeholder="Company Name"
                  value={editCompanyData.companyname}
                  onChange={(e) =>
                    setEditCompanyData({
                      ...editCompanyData,
                      companyname: e.target.value
                    })
                  }
                  className="border w-full p-2"
                />
              </div>
              <div className="flex items-center">
                <label className="w-40 text-gray-700 font-medium">
                  Tagline:
                </label>
                <input
                  type="text"
                  placeholder="Tagline"
                  value={editCompanyData.companytagline}
                  onChange={(e) =>
                    setEditCompanyData({
                      ...editCompanyData,
                      companytagline: e.target.value
                    })
                  }
                  className="border w-full p-2"
                />
              </div>
              <div className="flex items-center">
                <label className="w-40 text-gray-700 font-medium">
                  Person Contact:
                </label>
                <input
                  type="text"
                  placeholder="Person Contact"
                  value={editCompanyData.personcontact}
                  onChange={(e) =>
                    setEditCompanyData({
                      ...editCompanyData,
                      personcontact: e.target.value
                    })
                  }
                  className="border w-full p-2"
                />
              </div>
              <div className="flex items-center">
                <label className="w-40 text-gray-700 font-medium">
                  Shop Address:
                </label>
                <input
                  type="text"
                  placeholder="Shop Address"
                  value={editCompanyData.shopaddress}
                  onChange={(e) =>
                    setEditCompanyData({
                      ...editCompanyData,
                      shopaddress: e.target.value
                    })
                  }
                  className="border w-full p-2"
                />
              </div>
              <div className="flex items-center">
                <label className="w-40 text-gray-700 font-medium">
                  Payment Terms:
                </label>
                <input
                  type="text"
                  placeholder="Payment Terms"
                  value={editCompanyData.paymentterms}
                  onChange={(e) =>
                    setEditCompanyData({
                      ...editCompanyData,
                      paymentterms: e.target.value
                    })
                  }
                  className="border w-full p-2"
                />
              </div>

              <div className="border-t pt-4 mt-4">
                <h3 className="font-medium text-gray-700 mb-2">Bank Details</h3>
                <div className="flex items-center">
                  <label className="w-40 text-gray-700 font-medium">
                    Account Name:
                  </label>
                  <input
                    type="text"
                    placeholder="Account Name"
                    value={editCompanyData.bankdetails.accountname}
                    onChange={(e) =>
                      setEditCompanyData({
                        ...editCompanyData,
                        bankdetails: {
                          ...editCompanyData.bankdetails,
                          accountname: e.target.value
                        }
                      })
                    }
                    className="border w-full p-2"
                  />
                </div>
                <div className="flex items-center">
                  <label className="w-40 text-gray-700 font-medium">
                    Account No:
                  </label>
                  <input
                    type="text"
                    placeholder="Account Number"
                    value={editCompanyData.bankdetails.accountno}
                    onChange={(e) =>
                      setEditCompanyData({
                        ...editCompanyData,
                        bankdetails: {
                          ...editCompanyData.bankdetails,
                          accountno: e.target.value
                        }
                      })
                    }
                    className="border w-full p-2"
                  />
                </div>
                <div className="flex items-center">
                  <label className="w-40 text-gray-700 font-medium">
                    Account Type:
                  </label>
                  <input
                    type="text"
                    placeholder="Account Type"
                    value={editCompanyData.bankdetails.accounttype}
                    onChange={(e) =>
                      setEditCompanyData({
                        ...editCompanyData,
                        bankdetails: {
                          ...editCompanyData.bankdetails,
                          accounttype: e.target.value
                        }
                      })
                    }
                    className="border w-full p-2"
                  />
                </div>
                <div className="flex items-center">
                  <label className="w-40 text-gray-700 font-medium">
                    Bank Name:
                  </label>
                  <input
                    type="text"
                    placeholder="Bank Name"
                    value={editCompanyData.bankdetails.bankname}
                    onChange={(e) =>
                      setEditCompanyData({
                        ...editCompanyData,
                        bankdetails: {
                          ...editCompanyData.bankdetails,
                          bankname: e.target.value
                        }
                      })
                    }
                    className="border w-full p-2"
                  />
                </div>
                <div className="flex items-center">
                  <label className="w-40 text-gray-700 font-medium">
                    Branch:
                  </label>
                  <input
                    type="text"
                    placeholder="Branch"
                    value={editCompanyData.bankdetails.branch}
                    onChange={(e) =>
                      setEditCompanyData({
                        ...editCompanyData,
                        bankdetails: {
                          ...editCompanyData.bankdetails,
                          branch: e.target.value
                        }
                      })
                    }
                    className="border w-full p-2"
                  />
                </div>
                <div className="flex items-center">
                  <label className="w-40 text-gray-700 font-medium">
                    IFSC:
                  </label>
                  <input
                    type="text"
                    placeholder="IFSC"
                    value={editCompanyData.bankdetails.ifsc}
                    onChange={(e) =>
                      setEditCompanyData({
                        ...editCompanyData,
                        bankdetails: {
                          ...editCompanyData.bankdetails,
                          ifsc: e.target.value
                        }
                      })
                    }
                    className="border w-full p-2"
                  />
                </div>
              </div>
            </form>
            <div className="flex justify-end mt-4">
              <button
                onClick={() => setShowEditCompanyPopup(false)}
                className="bg-gray-300 text-gray-700 py-2 px-4 rounded-lg mr-2"
              >
                Cancel
              </button>
              <button
                onClick={handleEditCompany}
                className="bg-green-600 text-white py-2 px-4 rounded-lg"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CompanyEditPopup;
