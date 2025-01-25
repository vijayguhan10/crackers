import React, { useEffect, useState } from 'react';
import axios from 'axios';
import UserEditPopup from './UserEditPopup';
import {
  UserIcon,
  CalendarIcon,
  DollarSignIcon,
  MapPinIcon,
  PhoneIcon
} from 'lucide-react';
import TotalTransactions from './TotalTransactions';
import Header from '../components/Header';
import CompanyEditPopup from './CompanyEditPopup';

const UserData = () => {
  const [companyData, setCompanyData] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showEditUserPopup, setShowEditUserPopup] = useState(false);
  const [showEditCompanyPopup, setShowEditCompanyPopup] = useState(false);
  const [editUserData, setEditUserData] = useState({});
  const [editCompanyData, setEditCompanyData] = useState({});

  const fetchCompanyData = async () => {
    try {
      const token = localStorage.getItem('cracker_token');
      const response = await axios.get(
        `${process.env.REACT_APP_BASEURL}/company/user`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      const { admin, ...companyDetails } = response.data;
      console.log('😊😊 ', companyDetails);
      setUserData(admin);
      setCompanyData(companyDetails);

      setEditUserData({
        name: admin?.name,
        email: admin?.email,
        password: ''
      });
      setEditCompanyData(companyDetails);

      setError(null);
    } catch (err) {
      setError('Error fetching company and user details.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCompanyData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-gray-500 text-xl">Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-red-500 text-xl">{error}</p>
      </div>
    );
  }

  return (
    <div>
      <Header />
      <div className="flex flex-col xl:flex-row xl:h-96 xl:w-full pt-5 px-4 space-y-6 xl:space-y-0">
        <div className="bg-white  p-6  w-full xl:w-3/6">
          <div className="flex space-x-4 items-center">
            <div className="p-3 bg-blue-100 rounded-full">
              <UserIcon size={40} className="text-blue-600" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-800">
                {userData?.name || 'N/A'}
              </h1>
              <h2 className="text-sm text-gray-500">
                Admin ID: {userData?._id || 'N/A'}
              </h2>
            </div>
          </div>

          <div className="mt-6 space-y-4">
            <div className="flex items-center space-x-3">
              <PhoneIcon size={20} className="text-gray-500" />
              <p className="text-gray-700 font-medium">
                {companyData?.personcontact || 'N/A'}
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <MapPinIcon size={20} className="text-gray-500" />
              <p className="text-gray-700 font-medium">
                {companyData?.shopaddress || 'N/A'}
              </p>
            </div>
          </div>

          <div className="mt-6 space-y-4">
            <div className="flex items-center space-x-3">
              <CalendarIcon size={20} className="text-gray-500" />
              <p className="text-gray-700 font-medium">
                <span className="font-bold text-gray-900">
                  Date of Joining:
                </span>{' '}
                {companyData?.createdat
                  ? new Date(companyData.createdat).toLocaleDateString('en-GB')
                  : 'N/A'}
              </p>
            </div>
          </div>

          <div className="mt-6 flex space-x-4">
            <button
              onClick={() => setShowEditUserPopup(true)}
              className="bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700"
            >
              Edit Profile
            </button>
            <button
              onClick={() => setShowEditCompanyPopup(true)}
              className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700"
            >
              Edit Company Details
            </button>
          </div>
        </div>
        <div className="w-full xl:w-2/3">
          <TotalTransactions />
        </div>
      </div>
      <UserEditPopup
        editUserData={editUserData}
        setEditUserData={setEditUserData}
        showEditUserPopup={showEditUserPopup}
        setShowEditUserPopup={setShowEditUserPopup}
        fetchCompanyData={fetchCompanyData}
      />

      <CompanyEditPopup
        editCompanyData={editCompanyData}
        setEditCompanyData={setEditCompanyData}
        showEditCompanyPopup={showEditCompanyPopup}
        setShowEditCompanyPopup={setShowEditCompanyPopup}
        fetchCompanyData={fetchCompanyData}
      />
      <div className="border border-black mt-10"></div>
    </div>
  );
};

export default UserData;
