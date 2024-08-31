import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import RegisterImages from "../images/register_images.png";
import withReactContent from "sweetalert2-react-content";
import { axiosInstance } from "../components/axios";

function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [classSelection, setClassSelection] = useState(""); // State for class dropdown
  const [majorSelection, setMajorSelection] = useState(""); // State for major dropdown
  const [loading, setLoading] = useState(false);
  const [classes, setClasses] = useState([]); // State for class options
  const [majors, setMajors] = useState([]); // State for all major options
  const [filteredMajors, setFilteredMajors] = useState([]); // State for filtered major options
  const MySwal = withReactContent(Swal);

  // Fetch data for classes and majors
  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const classResponse = await axiosInstance.get("/api/auth/kelas");
        setClasses(classResponse.data); // Assuming the response is an array of classes
        const majorResponse = await axiosInstance.get("/api/auth/jurusan");
        setMajors(majorResponse.data); // Assuming the response is an array of majors
        setFilteredMajors(majorResponse.data); // Initialize filtered majors with all majors initially
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

  // Update filtered majors when classSelection changes
  useEffect(() => {
    if (classSelection) {
      // Get the selected class name
      const selectedClass = classes.find(
        (cls) => cls.id === parseInt(classSelection, 10)
      );
      if (selectedClass) {
        const filtered = majors.filter(
          (major) => major.nama.startsWith(selectedClass.nama) // Filter based on class name prefix
        );
        setFilteredMajors(filtered);
      }
    } else {
      setFilteredMajors(majors);
    }
  }, [classSelection, majors, classes]);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission

    setLoading(true); // Set loading to true

    try {
      const response = await axiosInstance.post("/api/auth/register", {
        username,
        email,
        password,
        kelasId: parseInt(classSelection, 10), // Convert to integer
        jurusanId: parseInt(majorSelection, 10), // Convert to integer
      });

      console.log("Registration successful:", response.data);
      console.table(response.data);

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
                <div className="mb-4">
                  <label
                    htmlFor="username"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Username
                  </label>
                  <input
                    type="text"
                    id="username"
                    name="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                </div>
                <div className="mb-4">
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                </div>
                <div className="mb-4">
                  <label
                    htmlFor="class"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Class
                  </label>
                  <select
                    id="class"
                    name="class"
                    value={classSelection}
                    onChange={(e) => setClassSelection(e.target.value)}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  >
                    <option value="">Select Class</option>
                    {classes.map((cls) => (
                      <option key={cls.id} value={cls.id}>
                        {cls.nama}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="mb-4">
                  <label
                    htmlFor="major"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Major
                  </label>
                  <select
                    id="major"
                    name="major"
                    value={majorSelection}
                    onChange={(e) => setMajorSelection(e.target.value)}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  >
                    <option value="">Select Major</option>
                    {filteredMajors.map((major) => (
                      <option key={major.id} value={major.id}>
                        {major.nama}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="mb-4">
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Password
                  </label>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full py-2 px-4 bg-indigo-600 text-white font-medium rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                    loading ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  {loading ? "Registering..." : "Register"}
                </button>
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
