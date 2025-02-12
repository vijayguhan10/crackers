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
          if (value !== '') acc[key] = value;
          return acc;
        },
        {}
      );
      await axios.put(`${process.env.REACT_APP_BASEURL}/company/`, filteredData, {
        headers: { Authorization: `Bearer ${token}` }
      });
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
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center p-2">
          <div className="bg-white p-6 rounded-lg w-[95%] md:w-[60%] lg:w-[40%] max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4 text-center">Edit Company Details</h2>
            <form className="space-y-4">
              {[
                { label: 'Company Name', key: 'companyname' },
                { label: 'Tagline', key: 'companytagline' },
                { label: 'Person Contact', key: 'personcontact' },
                { label: 'Shop Address', key: 'shopaddress' },
                { label: 'Payment Terms', key: 'paymentterms' }
              ].map(({ label, key }) => (
                <div key={key} className="flex flex-col md:flex-row items-start md:items-center gap-2">
                  <label className="md:w-40 text-gray-700 font-medium">{label}:</label>
                  <input
                    type="text"
                    placeholder={label}
                    value={editCompanyData[key] || ''}
                    onChange={(e) => setEditCompanyData({ ...editCompanyData, [key]: e.target.value })}
                    className="border w-full p-2 rounded"
                  />
                </div>
              ))}

              <div className="border-t pt-4 mt-4">
                <h3 className="font-medium text-gray-700 mb-2 text-center">Bank Details</h3>
                {[
                  { label: 'Account Name', key: 'accountname' },
                  { label: 'Account No', key: 'accountno' },
                  { label: 'Account Type', key: 'accounttype' },
                  { label: 'Bank Name', key: 'bankname' },
                  { label: 'Branch', key: 'branch' },
                  { label: 'IFSC', key: 'ifsc' }
                ].map(({ label, key }) => (
                  <div key={key} className="flex flex-col md:flex-row items-start md:items-center gap-2">
                    <label className="md:w-40 text-gray-700 font-medium">{label}:</label>
                    <input
                      type="text"
                      placeholder={label}
                      value={editCompanyData.bankdetails?.[key] || ''}
                      onChange={(e) =>
                        setEditCompanyData({
                          ...editCompanyData,
                          bankdetails: { ...editCompanyData.bankdetails, [key]: e.target.value }
                        })
                      }
                      className="border w-full p-2 rounded"
                    />
                  </div>
                ))}
              </div>
            </form>

            <div className="flex flex-col sm:flex-row justify-end mt-4 gap-2">
              <button
                onClick={() => setShowEditCompanyPopup(false)}
                className="bg-gray-300 text-gray-700 py-2 px-4 rounded-lg w-full sm:w-auto"
              >
                Cancel
              </button>
              <button
                onClick={handleEditCompany}
                className="bg-green-600 text-white py-2 px-4 rounded-lg w-full sm:w-auto"
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
