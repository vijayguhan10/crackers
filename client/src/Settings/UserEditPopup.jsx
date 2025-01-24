import React from 'react';
import axios from 'axios';

const UserEditPopup = ({
  editUserData,
  setEditUserData,
  showEditUserPopup,
  setShowEditUserPopup,
  fetchCompanyData
}) => {
  const handleEditUser = async () => {
    try {
      const token = localStorage.getItem('cracker_token');
      const filteredData = Object.entries(editUserData).reduce(
        (acc, [key, value]) => {
          if (value !== '') {
            acc[key] = value;
          }
          return acc;
        },
        {}
      );
      let reqData = { updateData: filteredData };
      const response = await axios.put(
        `${process.env.REACT_APP_BASEURL}/userAuth/`,
        reqData,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      localStorage.setItem('cracker_token', response.data.token);
      setShowEditUserPopup(false);
      fetchCompanyData();
    } catch (err) {
      console.error(err);
      alert('Error updating user details.');
    }
  };

  return (
    <>
      {showEditUserPopup && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg w-96 shadow-lg">
            <h2 className="text-xl font-bold mb-6 text-center">
              Edit User Details
            </h2>
            <div className="space-y-4">
              <div className="grid grid-cols-3 items-center gap-2">
                <label htmlFor="name" className="text-gray-700 font-medium">
                  Name:
                </label>
                <input
                  id="name"
                  type="text"
                  placeholder="Enter your name"
                  value={editUserData.name}
                  onChange={(e) =>
                    setEditUserData({ ...editUserData, name: e.target.value })
                  }
                  className="border p-2 rounded-md col-span-2 w-full"
                />
              </div>

              <div className="grid grid-cols-3 items-center gap-2">
                <label htmlFor="email" className="text-gray-700 font-medium">
                  Email:
                </label>
                <input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={editUserData.email}
                  onChange={(e) =>
                    setEditUserData({ ...editUserData, email: e.target.value })
                  }
                  className="border p-2 rounded-md col-span-2 w-full"
                />
              </div>

              <div className="grid grid-cols-3 items-center gap-2">
                <label htmlFor="password" className="text-gray-700 font-medium">
                  Password:
                </label>
                <input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={editUserData.password}
                  onChange={(e) =>
                    setEditUserData({
                      ...editUserData,
                      password: e.target.value
                    })
                  }
                  className="border p-2 rounded-md col-span-2 w-full"
                />
              </div>
            </div>

            <div className="flex justify-end mt-6">
              <button
                onClick={() => setShowEditUserPopup(false)}
                className="bg-gray-300 text-gray-700 py-2 px-4 rounded-lg mr-2 hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={handleEditUser}
                className="bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700"
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

export default UserEditPopup;
