import React, { useState } from "react";
import Sidebar from "../partials/Sidebar";
import Header from "../partials/Header";
import FilterButton from "../components/DropdownFilter";
import Datepicker from "../components/Datepicker";
import Absensi from "../partials/dashboard-user/Absensi";
import Izin from "../partials/dashboard-user/Izin";
import Alpha from "../partials/dashboard-user/Alpha";
import Siswa from "../partials/dashboard-user/Siswa";
import Banner from "../partials/Banner";
import { axiosInstance } from "../components/axios";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

function DashboardUser() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [siswaData, setSiswaData] = useState([]);

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };


  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
        <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        <main className="grow">
          <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto">
            <div className="sm:flex sm:justify-between sm:items-center mb-8">
              <div className="mb-4 sm:mb-0">
                <h1 className="text-2xl md:text-3xl text-gray-800 dark:text-gray-100 font-bold">
                  Dashboard Student
                </h1>
              </div>
              {/* <div className="grid grid-flow-col sm:auto-cols-max justify-start sm:justify-end gap-2">
                <FilterButton align="right" />
                <Datepicker align="right" />
              </div> */}
            </div>

            <div className="grid grid-cols-12 gap-6">
              {/* <Absensi />
              <Izin />
              <Alpha /> */}
              <Siswa data={siswaData} />
            </div>
          </div>
        </main>
        <Banner />
      </div>
    </div>
  );
}

export default DashboardUser;
