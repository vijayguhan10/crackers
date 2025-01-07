import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import cracker from "../assets/Crackers.png";
import ACS from "../assets/ACS_full-removebg-preview.png";

function Signup() {
  const [showPassword, setShowPassword] = useState(false);
  const [showLogin, setShowLogin] = useState(false); // State to toggle login view
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="  flex items-center justify-center p-4">
      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 bg-white rounded-2xl shadow-xl">
        <div className="p-8 lg:p-12">
          <div className="mb-8 h-24 ">
            <h1 className="text-3xl mt-10">
              Welcome to the Cracekrs Model ERP
            </h1>
          </div>

          <div className="space-y-6">
            <div>
              {!showLogin ? (
                <>
                  <h1 className="text-4xl font-bold text-gray-900">Sign Up</h1>
                  <p className="text-gray-500 mt-2">
                    Secure Your Communications with Easymail
                  </p>
                </>
              ) : (
                <h1 className="text-4xl font-bold text-gray-900">Login</h1>
              )}
            </div>

            <div className="space-y-4">
              {showLogin ? (
                // Login Fields
                <>
                  <div>
                    <input
                      type="email"
                      name="email"
                      placeholder="Email"
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={formData.email}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
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
                </>
              ) : (
                // Sign Up Fields
                <>
                  <div>
                    <input
                      type="text"
                      name="name"
                      placeholder="Daniel Ahmadi"
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={formData.name}
                      onChange={handleChange}
                    />
                  </div>

                  <div>
                    <input
                      type="email"
                      name="email"
                      placeholder="11Danielahmadi@gmail.com"
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={formData.email}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
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
                </>
              )}
            </div>

            <div className="mt-8">
              <button className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition duration-300">
                {showLogin ? "Login" : "Sign Up"}
              </button>
            </div>

            <div className="mt-4 text-center">
              <button
                type="button"
                className="text-blue-500 underline"
                onClick={() => setShowLogin(!showLogin)}
              >
                {showLogin ? "Switch to Sign Up" : "Switch to Login"}
              </button>
            </div>
          </div>
        </div>

        <div className="hidden lg:block bg-gradient-to-br from-[#afffd7] to-blue-400 rounded-r-2xl p-12">
          <div className="h-full flex flex-col justify-between">
            <div className=" backdrop-blur-sm rounded-2xl p-6">
              <div className="text-gray-800">
                <div className="flex justify-between items-center mb-4"></div>
                <img src={ACS} alt="ACS Logo" />
              </div>
              <img
                src={cracker}
                className="w-[80%] h-[60%] mt-10 ml-10"
                alt="Cracker"
              />
            </div>
            <div className="space-y-4 -mt-4">
              <div className="flex justify-end gap-4"></div>
              <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg">
                <div className="flex items-start gap-4 ">
                  <div className="w-10 h-10 bg-orange-100  rounded-lg flex items-center justify-center">
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
                  <div className="">
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
