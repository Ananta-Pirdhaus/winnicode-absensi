import React, { useState, useEffect } from "react";
import RegisterImages from "../images/register_images.png";
import { Link } from "react-router-dom";
import { axiosInstance } from "../components/axios";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

function Register() {
  // State to manage form input values
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [classSelection, setClassSelection] = useState(""); // State for class dropdown
  const [majorSelection, setMajorSelection] = useState(""); // State for major dropdown
  const [loading, setLoading] = useState(false);
  const [classes, setClasses] = useState([]); // State for class options
  const [majors, setMajors] = useState([]); // State for major options
  const MySwal = withReactContent(Swal);

  // Fetch data for classes and majors
  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const classResponse = await axiosInstance.get("/api/auth/kelas");
        setClasses(classResponse.data); // Assuming the response is an array of classes

        const majorResponse = await axiosInstance.get("/api/auth/jurusan");
        setMajors(majorResponse.data); // Assuming the response is an array of majors
      } catch (error) {
        console.error("Error fetching class or major data:", error);
        await Swal.fire({
          title: "Error",
          text: "Failed to fetch class or major options.",
          icon: "error",
        });
      }
    };

    fetchOptions();
  }, []);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission

    setLoading(true); // Set loading to true

    try {
      const response = await axiosInstance.post("/api/auth/register", {
        username,
        email,
        password,
        class: classSelection, // Include class in the payload
        major: majorSelection, // Include major in the payload
      });
      console.log("Registration successful:", response.data);

      // Show success alert
      await Swal.fire({
        title: "Registration Successful",
        text: "You are being redirected to the login page.",
        icon: "success",
        timer: 2000,
        showConfirmButton: false,
      });

      // Redirect to login page
      window.location.href = "/login";
    } catch (error) {
      console.error("Registration error:", error);
      // Handle error (e.g., show error message)
      await Swal.fire({
        title: "Registration Failed",
        text: "Please try again.",
        icon: "error",
      });
    } finally {
      setLoading(false); // Reset loading state
    }
  };

  return (
    <section className="min-h-screen bg-gray-100 text-gray-900 flex justify-center">
      <div className="max-w-screen-xl m-0 sm:m-10 bg-white shadow sm:rounded-lg flex justify-center flex-1">
        <div className="lg:w-1/2 xl:w-5/12 p-6 sm:p-12">
          <div className="mt-12 flex flex-col items-center">
            <h1 className="text-2xl xl:text-3xl font-extrabold">Sign up</h1>
            <form onSubmit={handleSubmit} className="w-full flex-1 mt-8">
              <div className="mx-auto max-w-xs">
                <input
                  className="w-full px-8 py-4 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white"
                  type="text"
                  placeholder="Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
                <input
                  className="w-full px-8 py-4 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white my-5"
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <input
                  className="w-full px-8 py-4 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white"
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <div className="my-5">
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Class
                  </label>
                  <select
                    className="w-full px-8 py-4 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white"
                    value={classSelection}
                    onChange={(e) => setClassSelection(e.target.value)}
                  >
                    <option value="" disabled>
                      Select Class
                    </option>
                    {classes.map((option, index) => (
                      <option key={index} value={option.id}>
                        {" "}
                        {/* Assuming `option` has `id` and `name` */}
                        {option.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="my-5">
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Major
                  </label>
                  <select
                    className="w-full px-8 py-4 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white"
                    value={majorSelection}
                    onChange={(e) => setMajorSelection(e.target.value)}
                  >
                    <option value="" disabled>
                      Select Major
                    </option>
                    {majors.map((option, index) => (
                      <option key={index} value={option.id}>
                        {" "}
                        {/* Assuming `option` has `id` and `name` */}
                        {option.name}
                      </option>
                    ))}
                  </select>
                </div>
                <button
                  type="submit"
                  className={`mt-5 tracking-wide font-semibold bg-indigo-500 text-gray-100 w-full py-4 rounded-lg hover:bg-indigo-700 transition-all duration-300 ease-in-out flex items-center justify-center focus:shadow-outline focus:outline-none ${
                    loading ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                  disabled={loading}
                >
                  {loading ? (
                    <svg
                      className="w-6 h-6 animate-spin"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <circle cx="12" cy="12" r="10" />
                      <path d="M12 6v6l4 2" />
                    </svg>
                  ) : (
                    <svg
                      className="w-6 h-6 -ml-2"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M16 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
                      <circle cx="8.5" cy="7" r="4" />
                      <path d="M20 8v6M23 11h-6" />
                    </svg>
                  )}
                  <span className="ml-3">
                    {loading ? "Loading..." : "Register"}
                  </span>
                </button>
                <Link
                  to="/login"
                  className="mt-5 block text-center tracking-wide font-semibold bg-indigo-500 text-gray-100 w-full py-4 rounded-lg hover:bg-indigo-700 transition-all duration-300 ease-in-out items-center justify-center focus:shadow-outline focus:outline-none"
                >
                  <span>Already have an account? Login</span>
                </Link>
              </div>
            </form>
          </div>
        </div>
        <div className="flex-1 bg-indigo-100 text-center hidden lg:flex">
          <div
            className="m-12 xl:m-16 w-full bg-contain bg-center bg-no-repeat"
            style={{
              backgroundImage: `url(${RegisterImages})`,
            }}
          ></div>
        </div>
      </div>
    </section>
  );
}

export default Register;
