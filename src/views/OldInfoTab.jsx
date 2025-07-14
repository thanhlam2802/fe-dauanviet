import React, { useState, useEffect, useMemo } from "react"; // Import useMemo
import axios from "axios";

function OldInfoTab() {
  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

  const [provinces, setProvinces] = useState([]);
  const [viewedProvince, setViewedProvince] = useState(null);
  const [viewedDistrict, setViewedDistrict] = useState(null);

  const [districtsOfProvince, setDistrictsOfProvince] = useState([]);
  const [communesOfDistrict, setCommunesOfDistrict] = useState([]);

  const [loadingProvinces, setLoadingProvinces] = useState(true);
  const [loadingDistricts, setLoadingDistricts] = useState(false);
  const [loadingCommunes, setLoadingCommunes] = useState(false);
  const [errorProvinces, setErrorProvinces] = useState(null);
  const [errorDistricts, setErrorDistricts] = useState(null);
  const [errorCommunes, setErrorCommunes] = useState(null);

  const [provinceSearchQuery, setProvinceSearchQuery] = useState("");
  const [districtSearchQuery, setDistrictSearchQuery] = useState("");
  const [communeSearchQuery, setCommuneSearchQuery] = useState("");

 
  useEffect(() => {
    const fetchProvinces = async () => {
      setLoadingProvinces(true);
      setErrorProvinces(null);
      try {
        const response = await axios.get(`${API_BASE_URL}/tinhs`);
        if (Array.isArray(response.data)) {
          setProvinces(response.data);
        } else {
          console.error(
            "Backend did not return an array for /tinhs:",
            response.data
          );
          setErrorProvinces("Dữ liệu Tỉnh/Thành phố không hợp lệ.");
          setProvinces([]);
        }
      } catch (error) {
        console.error("Error fetching provinces:", error);
        setErrorProvinces(
          "Không thể tải dữ liệu Tỉnh/Thành phố. Vui lòng kiểm tra server."
        );
        setProvinces([]);
      } finally {
        setLoadingProvinces(false);
      }
    };
    fetchProvinces();
  }, [API_BASE_URL]);

  // Effect to fetch districts when viewedProvince changes
  useEffect(() => {
    const fetchDistricts = async () => {
      if (viewedProvince) {
        setLoadingDistricts(true);
        setErrorDistricts(null);
        try {
          const response = await axios.get(
            `${API_BASE_URL}/huyens?tinhId=${viewedProvince.id_tinh}`
          );
          if (Array.isArray(response.data)) {
            setDistrictsOfProvince(response.data);
            setViewedDistrict(null);
            setCommunesOfDistrict([]);
          } else {
            console.error(
              "Backend did not return an array for districts:",
              response.data
            );
            setErrorDistricts("Dữ liệu Quận/Huyện không hợp lệ.");
            setDistrictsOfProvince([]);
          }
        } catch (error) {
          console.error(
            `Error fetching districts for province ${viewedProvince.id_tinh}:`,
            error
          );
          setErrorDistricts(
            `Không thể tải dữ liệu Quận/Huyện cho ${viewedProvince.ten}.`
          );
          setDistrictsOfProvince([]);
        } finally {
          setLoadingDistricts(false);
        }
      } else {
        setDistrictsOfProvince([]);
        setErrorDistricts(null);
        setLoadingDistricts(false);
      }
    };
    fetchDistricts();
  }, [viewedProvince, API_BASE_URL]);

  // Effect to fetch communes when viewedDistrict changes
  useEffect(() => {
    const fetchCommunes = async () => {
      if (viewedDistrict) {
        setLoadingCommunes(true);
        setErrorCommunes(null);
        try {
          const response = await axios.get(
            `${API_BASE_URL}/xas?huyenId=${viewedDistrict.id_quan}`
          );
          if (Array.isArray(response.data)) {
            setCommunesOfDistrict(response.data);
          } else {
            console.error(
              "Backend did not return an array for communes:",
              response.data
            );
            setErrorCommunes("Dữ liệu Phường/Xã không hợp lệ.");
            setCommunesOfDistrict([]);
          }
        } catch (error) {
          console.error(
            `Error fetching communes for district ${viewedDistrict.id_quan}:`,
            error
          );
          setErrorCommunes(
            `Không thể tải dữ liệu Phường/Xã cho ${viewedDistrict.ten}.`
          );
          setCommunesOfDistrict([]);
        } finally {
          setLoadingCommunes(false);
        }
      } else {
        setCommunesOfDistrict([]);
        setErrorCommunes(null);
        setLoadingCommunes(false);
      }
    };
    fetchCommunes();
  }, [viewedDistrict, API_BASE_URL]);

  const handleViewDistricts = (province) => {
    setViewedProvince(province);
    setDistrictSearchQuery(""); // Clear district search when changing province
    setCommuneSearchQuery(""); // Clear commune search when changing province
  };

  const handleViewCommunes = (district) => {
    setViewedDistrict(district);
    setCommuneSearchQuery(""); // Clear commune search when changing district
  };

  const handleBackToProvinces = () => {
    setViewedProvince(null);
    setViewedDistrict(null);
    setProvinceSearchQuery(""); // Clear province search when going back
  };

  const handleBackToDistricts = () => {
    setViewedDistrict(null);
    setDistrictSearchQuery(""); // Clear district search when going back
  };

  // --- Filtering Logic for Search ---
  const filteredProvinces = useMemo(() => {
    if (!provinceSearchQuery) {
      return provinces;
    }
    const lowerCaseQuery = provinceSearchQuery.toLowerCase();
    return provinces.filter(
      (province) =>
        province.ten.toLowerCase().includes(lowerCaseQuery) ||
        String(province.id).includes(lowerCaseQuery)
    );
  }, [provinces, provinceSearchQuery]);

  const filteredDistricts = useMemo(() => {
    if (!districtSearchQuery) {
      return districtsOfProvince;
    }
    const lowerCaseQuery = districtSearchQuery.toLowerCase();
    return districtsOfProvince.filter(
      (district) =>
        district.ten.toLowerCase().includes(lowerCaseQuery) ||
        String(district.id_quan).includes(lowerCaseQuery)
    );
  }, [districtsOfProvince, districtSearchQuery]);

  const filteredCommunes = useMemo(() => {
    if (!communeSearchQuery) {
      return communesOfDistrict;
    }
    const lowerCaseQuery = communeSearchQuery.toLowerCase();
    return communesOfDistrict.filter(
      (commune) =>
        commune.ten.toLowerCase().includes(lowerCaseQuery) ||
        String(commune.id_xa).includes(lowerCaseQuery)
    );
  }, [communesOfDistrict, communeSearchQuery]);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-6 text-gray-800">
        Thông tin địa chỉ
      </h2>

      {/* Conditional rendering for Provinces, Districts, or Communes */}
      {!viewedProvince && (
        // Display Provinces Table
        <div>
          <h3 className="text-xl font-medium mb-4 text-gray-700">
            Danh sách Tỉnh/Thành phố
          </h3>
          {/* Province Search Input */}
          <div className="mb-4">
            <input
              type="text"
              placeholder="Tìm kiếm Tỉnh/Thành phố..."
              value={provinceSearchQuery}
              onChange={(e) => setProvinceSearchQuery(e.target.value)}
              className="p-2 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th className="py-3 px-6 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                    Mã Tỉnh
                  </th>
                  <th className="py-3 px-6 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                    Tên Tỉnh
                  </th>
                  <th className="py-3 px-6 text-center text-xs font-medium text-gray-600 uppercase tracking-wider">
                    Hành động
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {loadingProvinces ? (
                  <tr>
                    <td
                      colSpan="3"
                      className="py-4 px-6 text-center text-blue-500"
                    >
                      Đang tải dữ liệu Tỉnh/Thành phố...
                    </td>
                  </tr>
                ) : errorProvinces ? (
                  <tr>
                    <td
                      colSpan="3"
                      className="py-4 px-6 text-center text-red-500"
                    >
                      Lỗi: {errorProvinces}
                    </td>
                  </tr>
                ) : filteredProvinces.length > 0 ? (
                  filteredProvinces.map((province) => (
                    <tr key={province.id_tinh}>
                      <td className="py-4 px-6 whitespace-nowrap text-sm font-medium text-gray-900">
                        {province.id_tinh}
                      </td>
                      <td className="py-4 px-6 whitespace-nowrap text-sm text-gray-700">
                        {province.ten}
                      </td>
                      <td className="py-4 px-6 whitespace-nowrap text-center text-sm">
                        <button
                          onClick={() => handleViewDistricts(province)}
                          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                        >
                          Xem
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="3"
                      className="py-4 px-6 text-center text-gray-500"
                    >
                      {provinceSearchQuery
                        ? "Không tìm thấy Tỉnh/Thành phố phù hợp."
                        : "Không có dữ liệu Tỉnh/Thành phố nào."}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {viewedProvince && !viewedDistrict && (
        // Display Districts Table
        <div className="mt-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-medium text-gray-700">
              Quận/Huyện của:{" "}
              <span className="font-semibold text-blue-600">
                {viewedProvince.ten}
              </span>
            </h3>
            <button
              onClick={handleBackToProvinces}
              className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-2"
            >
              &larr; Quay lại Tỉnh
            </button>
          </div>
          {/* District Search Input */}
          <div className="mb-4">
            <input
              type="text"
              placeholder="Tìm kiếm Quận/Huyện..."
              value={districtSearchQuery}
              onChange={(e) => setDistrictSearchQuery(e.target.value)}
              className="p-2 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {loadingDistricts ? (
            <p className="py-4 px-6 text-blue-500">
              Đang tải dữ liệu Quận/Huyện...
            </p>
          ) : errorDistricts ? (
            <p className="py-4 px-6 text-red-500">Lỗi: {errorDistricts}</p>
          ) : filteredDistricts.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-sm">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="py-3 px-6 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                      Mã Huyện
                    </th>
                    <th className="py-3 px-6 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                      Tên Huyện
                    </th>
                    <th className="py-3 px-6 text-center text-xs font-medium text-gray-600 uppercase tracking-wider">
                      Hành động
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredDistricts.map((district) => (
                    <tr key={district.id_quan}>
                      <td className="py-4 px-6 whitespace-nowrap text-sm font-medium text-gray-900">
                        {district.id_quan}
                      </td>
                      <td className="py-4 px-6 whitespace-nowrap text-sm text-gray-700">
                        {district.ten}
                      </td>
                      <td className="py-4 px-6 whitespace-nowrap text-center text-sm">
                        <button
                          onClick={() => handleViewCommunes(district)}
                          className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                        >
                          Xem Xã
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-gray-600 mt-4">
              {districtSearchQuery
                ? "Không tìm thấy Quận/Huyện phù hợp."
                : "Không có dữ liệu Quận/Huyện cho tỉnh này."}
            </p>
          )}
        </div>
      )}

      {viewedProvince && viewedDistrict && (
        // Display Communes Table
        <div className="mt-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-medium text-gray-700">
              Phường/Xã của:{" "}
              <span className="font-semibold text-green-600">
                {viewedDistrict.ten}, {viewedProvince.ten}
              </span>
            </h3>
            <button
              onClick={handleBackToDistricts}
              className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-2"
            >
              &larr; Quay lại Quận/Huyện
            </button>
          </div>
          {/* Commune Search Input */}
          <div className="mb-4">
            <input
              type="text"
              placeholder="Tìm kiếm Phường/Xã..."
              value={communeSearchQuery}
              onChange={(e) => setCommuneSearchQuery(e.target.value)}
              className="p-2 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {loadingCommunes ? (
            <p className="py-4 px-6 text-blue-500">
              Đang tải dữ liệu Phường/Xã...
            </p>
          ) : errorCommunes ? (
            <p className="py-4 px-6 text-red-500">Lỗi: {errorCommunes}</p>
          ) : filteredCommunes.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-sm">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="py-3 px-6 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                      Mã Xã
                    </th>
                    <th className="py-3 px-6 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                      Tên Phường/Xã
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredCommunes.map((commune) => (
                    <tr key={commune.id_phuong}>
                      <td className="py-4 px-6 whitespace-nowrap text-sm font-medium text-gray-900">
                        {commune.id_phuong}
                      </td>
                      <td className="py-4 px-6 whitespace-nowrap text-sm text-gray-700">
                        {commune.ten}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-gray-600 mt-4">
              {communeSearchQuery
                ? "Không tìm thấy Phường/Xã phù hợp."
                : "Không có dữ liệu Phường/Xã cho huyện này."}
            </p>
          )}
        </div>
      )}
    </div>
  );
}

export default OldInfoTab;
