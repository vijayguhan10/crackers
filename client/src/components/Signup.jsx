import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import axios from 'axios';
import cracker from '../assets/Crackers.png';
import ACS from '../assets/ACS_full-removebg-preview.png';
import { ToastContainer, toast } from 'react-toastify';
function Signup() {
  const [showPassword, setShowPassword] = useState(false);
  const [isSignup, setIsSignup] = useState(true);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async () => {
    try {
      if (isSignup) {
        const response = await axios.post('http://your-api-endpoint/signup', {
          name: formData.name,
          email: formData.email,
          password: formData.password,
          confirmPassword: formData.confirmPassword
        });
        toast.success('Signup successful!');
      } else {
        const response = await axios.post(
          `${process.env.REACT_APP_BASEURL}/userAuth/login`,
          {
            email: formData.email,
            password: formData.password
          }
        );
        localStorage.setItem('cracker_token', response.data.token);

        console.log('Response of the Login : ', response);
        toast.success('Login successful!');

        navigate('/dashboard');
      }
    } catch (error) {
      console.error(error);
      toast.error('An error occurred. Please try again.');
    }
  };

  return (
    <div className="flex items-center justify-center p-4">
      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 bg-white rounded-2xl shadow-xl">
        <div className="p-8 lg:p-12">
          <div className="mb-8 h-24 ">
            <h1 className="text-3xl mt-10">
              Welcome to the Crackers Model ERP
            </h1>
          </div>

          <div className="space-y-6">
            <div>
              <h1 className="text-4xl font-bold text-gray-900">
                {isSignup ? 'Sign Up' : 'Login'}
              </h1>
              <p className="text-gray-500 mt-2">
                {isSignup
                  ? 'Secure Your Communications with Easymail'
                  : 'Welcome Back'}
              </p>
            </div>

            <div className="space-y-4">
              {isSignup && (
                <div>
                  <input
                    type="text"
                    name="name"
                    placeholder="Your Name"
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={formData.name}
                    onChange={handleChange}
                  />
                </div>
              )}

              <div>
                <input
                  type="email"
                  name="email"
                  placeholder="Your Email"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>

              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  placeholder="Password"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.password}
                  onChange={handleChange}
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <FaEyeSlash className="text-gray-500" />
                  ) : (
                    <FaEye className="text-gray-500" />
                  )}
                </button>
              </div>

              {isSignup && (
                <div>
                  <input
                    type="password"
                    name="confirmPassword"
                    placeholder="Re-Type Password"
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                  />
                </div>
              )}
            </div>

            <div className="mt-10">
              <button
                onClick={handleSubmit}
                className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition duration-300"
              >
                {isSignup ? 'Sign Up' : 'Login'}
              </button>
              <p
                className="text-center text-gray-600 mt-4 cursor-pointer"
                onClick={() => setIsSignup(!isSignup)}
              >
                {isSignup
                  ? 'Already have an account? Login here'
                  : "Don't have an account? Sign up here"}
              </p>
            </div>
          </div>
        </div>

        <div className="hidden lg:block bg-gradient-to-br from-[#afffd7] to-blue-400 rounded-r-2xl p-12">
          <div className="h-full flex flex-col justify-between">
            <div className="backdrop-blur-sm rounded-2xl p-6">
              <div className="text-gray-800">
                <img src={ACS} alt="ACS Logo" />
              </div>
              <img
                src={cracker}
                alt="Crackers"
                className="w-[80%] h-[60%] mt-10 ml-10"
              />
            </div>
            <div className="space-y-4 -mt-4">
              <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                    <svg
                      className="w-6 h-6 text-orange-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"
                      />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">
                      Your data, your rules
                    </h3>
                    <p className="text-sm text-gray-600">
                      Your data belongs to you, and our encryption ensures that
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Signup;
