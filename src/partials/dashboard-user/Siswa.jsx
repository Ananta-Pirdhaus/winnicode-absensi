import React, { useState, useEffect } from "react";
import { axiosInstance } from "../../components/axios";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import UploadModal from "../uploadModal";
import AbsensiModal from "./Absensi-Modal";

const MySwal = withReactContent(Swal);

function Siswa() {
  const [data, setData] = useState([]);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isAbsensiModalOpen, setIsAbsensiModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        MySwal.fire({
          title: "Loading...",
          text: "Fetching student data...",
          didOpen: () => {
            MySwal.showLoading();
          },
        });

        const response = await axiosInstance.get("/api/auth/student");
        setData(response.data);
        MySwal.close();
      } catch (error) {
        MySwal.close();
        MySwal.fire({
          icon: "error",
          title: "Oops...",
          text: "Something went wrong while fetching student data!",
        });
      }
    };

    fetchData();
  }, []);

  const handleOpenUploadModal = (student) => {
    setSelectedStudent(student);
    setIsUploadModalOpen(true);
  };

  const handleCloseUploadModal = () => {
    setIsUploadModalOpen(false);
    setSelectedStudent(null);
  };

  const handleOpenAbsensiModal = (student) => {
    setSelectedStudent(student);
    setIsAbsensiModalOpen(true);
  };

  const handleCloseAbsensiModal = () => {
    setIsAbsensiModalOpen(false);
    setSelectedStudent(null);
  };

  const handleUploadSuccess = (url) => {
    // Do something with the successful upload URL
    console.log("Upload successful:", url);
  };

  return (
    <div className="col-span-full xl:col-span-12 bg-white dark:bg-gray-800 shadow-sm rounded-xl">
      <header className="px-5 py-4 border-b border-gray-100 dark:border-gray-700/60">
        <h2 className="font-semibold text-gray-800 dark:text-gray-100">
          Siswa
        </h2>
      </header>
      <div className="p-3">
        <div className="overflow-x-auto">
          <table className="table-auto w-full">
            <thead className="text-xs font-semibold uppercase text-gray-400 dark:text-gray-500 bg-gray-50 dark:bg-gray-700 dark:bg-opacity-50">
              <tr>
                <th className="p-2 whitespace-nowrap text-center">
                  <div className="font-semibold">Avatar</div>
                </th>
                <th className="p-2 whitespace-nowrap text-center">
                  <div className="font-semibold">Nama</div>
                </th>
                <th className="p-2 whitespace-nowrap text-center">
                  <div className="font-semibold">Kelas</div>
                </th>
                <th className="p-2 whitespace-nowrap text-center">
                  <div className="font-semibold">Jurusan</div>
                </th>
                <th className="p-2 whitespace-nowrap text-center">
                  <div className="font-semibold">Preview Absensi</div>
                </th>
                <th className="p-2 whitespace-nowrap text-center">
                  <div className="font-semibold">Status Absensi</div>
                </th>
                <th className="p-2 whitespace-nowrap text-center">
                  <div className="font-semibold">Aksi</div>
                </th>
              </tr>
            </thead>
            <tbody className="text-sm divide-y divide-gray-100 dark:divide-gray-700/60">
              {data.map((siswa) => (
                <tr key={siswa.id}>
                  <td className="p-2 whitespace-nowrap text-center">
                    <img
                      className="rounded-full w-10 h-10 mx-auto"
                      src={`${axiosInstance.defaults.baseURL}/uploads/${siswa.avatar}`}
                      alt={siswa.name}
                    />
                  </td>
                  <td className="p-2 whitespace-nowrap text-center">
                    {siswa.name}
                  </td>
                  <td className="p-2 whitespace-nowrap text-center">
                    {siswa.kelas?.nama || "N/A"}
                  </td>
                  <td className="p-2 whitespace-nowrap text-center">
                    {siswa.jurusan?.nama || "N/A"}
                  </td>
                  <td className="p-2 whitespace-nowrap text-center">
                    <button
                      onClick={() => handleOpenAbsensiModal(siswa)}
                      className="bg-blue-500 text-white py-2 px-4 rounded-lg shadow-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      Preview Absensi
                    </button>
                  </td>
                  <td className="p-2 whitespace-nowrap text-center">
                    {siswa.attendanceStatus?.status || "N/A"}
                  </td>
                  <td className="p-2 whitespace-nowrap text-center">
                    <button
                      onClick={() => handleOpenUploadModal(siswa)}
                      className="bg-blue-500 text-white py-2 px-4 rounded-lg shadow-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      Detail
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <UploadModal
        isOpen={isUploadModalOpen}
        onClose={handleCloseUploadModal}
        student={selectedStudent}
        handleUploadSuccess={handleUploadSuccess}
      />
      <AbsensiModal
        isOpen={isAbsensiModalOpen}
        onClose={handleCloseAbsensiModal}
        student={selectedStudent}
        studentImageSrc={`${axiosInstance.defaults.baseURL}/uploads/${selectedStudent?.avatar}`}
        studentName={selectedStudent?.name}
      />
    </div>
  );
}

export default Siswa;
