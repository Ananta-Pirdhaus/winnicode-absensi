import React, { useState, useEffect } from "react";
import { axiosInstance } from "../../components/axios";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

// Menggunakan withReactContent untuk mengintegrasikan Swal dengan React
const MySwal = withReactContent(Swal);

function Siswa() {
  const [data, setData] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);

  // Mengambil data siswa dari API
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Menampilkan notifikasi loading
        MySwal.fire({
          title: "Loading...",
          text: "Fetching student data...",
          didOpen: () => {
            MySwal.showLoading();
          },
        });

        // Melakukan request GET untuk mengambil data siswa
        const response = await axiosInstance.get("/api/auth/student");
        setData(response.data);

        // Menutup notifikasi loading
        MySwal.close();
      } catch (error) {
        // Menutup notifikasi loading dan menampilkan notifikasi error
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

  const handleOpenModal = (student) => {
    setSelectedStudent(student);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedStudent(null);
  };

  return (
    <div className="col-span-full xl:col-span-12 bg-white dark:bg-gray-800 shadow-sm rounded-xl">
      <header className="px-5 py-4 border-b border-gray-100 dark:border-gray-700/60">
        <h2 className="font-semibold text-gray-800 dark:text-gray-100">
          Siswa
        </h2>
      </header>
      <div className="p-3">
        {/* Table */}
        <div className="overflow-x-auto">
          <table className="table-auto w-full">
            {/* Table header */}
            <thead className="text-xs font-semibold uppercase text-gray-400 dark:text-gray-500 bg-gray-50 dark:bg-gray-700 dark:bg-opacity-50">
              <tr>
                <th className="p-2 whitespace-nowrap">
                  <div className="font-semibold text-left">Nama</div>
                </th>
                <th className="p-2 whitespace-nowrap">
                  <div className="font-semibold text-left">Kelas</div>
                </th>
                <th className="p-2 whitespace-nowrap">
                  <div className="font-semibold text-left">Jurusan</div>
                </th>
                <th className="p-2 whitespace-nowrap">
                  <div className="font-semibold text-center">
                    Preview Absensi
                  </div>
                </th>
                <th className="p-2 whitespace-nowrap">
                  <div className="font-semibold text-center">
                    Status Absensi
                  </div>
                </th>
                <th className="p-2 whitespace-nowrap">
                  <div className="font-semibold text-center">Aksi</div>
                </th>
              </tr>
            </thead>
            {/* Table body */}
            <tbody className="text-sm divide-y divide-gray-100 dark:divide-gray-700/60">
              {data.map((siswa) => (
                <tr key={siswa.id}>
                  <td className="p-2 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-10 h-10 shrink-0 mr-2 sm:mr-3">
                        <img
                          className="rounded-full w-full h-full"
                          src={`data:image/jpeg;base64,${siswa.image}`} // Menggunakan Base64
                          alt={siswa.name}
                        />
                      </div>
                      <div className="font-medium text-gray-800 dark:text-gray-100">
                        {siswa.name}
                      </div>
                    </div>
                  </td>
                  <td className="p-2 whitespace-nowrap">
                    <div className="text-left">{siswa.kelas}</div>
                  </td>
                  <td className="p-2 whitespace-nowrap">
                    <div className="text-left">{siswa.jurusan}</div>
                  </td>
                  <td className="p-2 whitespace-nowrap">
                    <div className="p-4">
                      <button
                        onClick={() => handleOpenModal(siswa)}
                        className="bg-blue-500 text-white py-2 px-4 rounded-lg shadow-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        Preview Absensi
                      </button>
                      {isModalOpen && selectedStudent && (
                        <AbsensiModal
                          onClose={handleCloseModal}
                          student={selectedStudent}
                        />
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Siswa;
