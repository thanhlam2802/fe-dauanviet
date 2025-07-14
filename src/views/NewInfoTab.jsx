import React, { useState, useEffect, useMemo } from "react";

import apiClient from "../api/apiClient";

function DistrictCommuneSelector({
  district,
  selectedCommuneIds,
  onCommuneChange,
  apiClient,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [communes, setCommunes] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchCommunesForDistrict = async () => {
    if (communes.length > 0 && !error) {
      setIsOpen(!isOpen);
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const response = await apiClient.get(`/xas?huyenId=${district.id_quan}`);
      if (Array.isArray(response.data)) {
        setCommunes(response.data);
      } else {
        setCommunes([]);
        setError("Dữ liệu không hợp lệ.");
      }
    } catch (err) {
      console.error(
        `Error fetching communes for district ${district.id_quan}:`,
        err
      );
      setError("Lỗi tải danh sách xã.");
    } finally {
      setIsLoading(false);
      setIsOpen(true); // Open after fetching/attempting to fetch
    }
  };

  const handleToggle = () => {
    if (isOpen) {
      setIsOpen(false);
    } else {
      fetchCommunesForDistrict();
    }
  };

  return (
    <li className="bg-white p-2 rounded-md border border-gray-200">
      <div
        onClick={handleToggle}
        className="flex justify-between items-center cursor-pointer hover:bg-gray-100 p-2 rounded-md"
      >
        <span className="font-semibold text-gray-800">{district.ten}</span>
        <span>
          {isLoading ? (
            <svg
              className="animate-spin h-5 w-5 text-indigo-600"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
          ) : (
            <svg
              className={`h-5 w-5 text-gray-500 transform transition-transform ${
                isOpen ? "rotate-180" : ""
              }`}
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          )}
        </span>
      </div>
      {isOpen && (
        <div className="mt-2 pl-4 border-l-2 border-indigo-200">
          {error && <p className="text-red-500 text-sm">{error}</p>}
          {communes.length > 0 ? (
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
              {communes.map((commune) => (
                <li key={commune.id_phuong} className="flex items-center">
                  <input
                    type="checkbox"
                    id={`commune-${commune.id_phuong}`}
                    value={commune.id_phuong}
                    checked={selectedCommuneIds.includes(commune.id_phuong)}
                    onChange={onCommuneChange}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  />
                  <label
                    htmlFor={`commune-${commune.id_phuong}`}
                    className="ml-2 block text-sm text-gray-900"
                  >
                    {commune.ten} ({commune.id_phuong})
                  </label>
                </li>
              ))}
            </ul>
          ) : (
            !isLoading &&
            !error && (
              <p className="text-gray-500 text-sm">
                Không có xã nào trong huyện này.
              </p>
            )
          )}
        </div>
      )}
    </li>
  );
}

function NewInfoTab() {
  // State for Merged Provinces (TinhThanhGop)
  const [mergedProvinces, setMergedProvinces] = useState([]);
  const [loadingMergedProvinces, setLoadingMergedProvinces] = useState(true);
  const [errorMergedProvinces, setErrorMergedProvinces] = useState(null);

  // State for Merged Communes (PhuongSapNhap)
  const [viewedMergedProvince, setViewedMergedProvince] = useState(null);
  const [mergedCommunes, setMergedCommunes] = useState([]);
  const [loadingMergedCommunes, setLoadingMergedCommunes] = useState(false);
  const [errorMergedCommunes, setErrorMergedCommunes] = useState(null);

  // State for Original Data (to resolve old IDs and populate select)
  const [originalProvinces, setOriginalProvinces] = useState([]);
  const [originalProvincesMap, setOriginalProvincesMap] = useState({});
  const [originalDistrictsMap, setOriginalDistrictsMap] = useState({});
  const [originalCommunesMap, setOriginalCommunesMap] = useState({});
  const [loadingOriginalData, setLoadingOriginalData] = useState(true);
  const [errorOriginalData, setErrorOriginalData] = useState(null);

  // State for Add/Edit New Merged Province Form
  const [showAddProvinceForm, setShowAddProvinceForm] = useState(false);
  const [editingProvince, setEditingProvince] = useState(null);

  const [newMaGop, setNewMaGop] = useState("");
  const [newTenGop, setNewTenGop] = useState("");
  const [newDsMaTinhCu, setNewDsMaTinhCu] = useState([]);
  const [newGhiChu, setNewGhiChu] = useState("");
  const [addingProvince, setAddingProvince] = useState(false);
  const [addProvinceError, setAddProvinceError] = useState(null);
  const [addProvinceSuccess, setAddProvinceSuccess] = useState(false);
  const [selectedProvinceToAdd, setSelectedProvinceToAdd] = useState("");

  // --- New States for Add/Edit Merged Commune Form ---
  const [showAddCommuneForm, setShowAddCommuneForm] = useState(false);
  const [editingCommune, setEditingCommune] = useState(null);

  const [newCommuneTenMoi, setNewCommuneTenMoi] = useState("");
  const [newCommuneGhiChu, setNewCommuneGhiChu] = useState("");
  const [newCommuneDsIdPhuongCu, setNewCommuneDsIdPhuongCu] = useState([]);

  const [
    selectedOldProvinceForCommuneAdd,
    setSelectedOldProvinceForCommuneAdd,
  ] = useState("");
  const [
    availableDistrictsForOldProvince,
    setAvailableDistrictsForOldProvince,
  ] = useState([]);

  const [addingCommune, setAddingCommune] = useState(false);
  const [addCommuneError, setAddCommuneError] = useState(null);
  const [addCommuneSuccess, setAddCommuneSuccess] = useState(false);

  // State for search queries
  const [mergedProvinceSearchQuery, setMergedProvinceSearchQuery] =
    useState("");
  const [mergedCommuneSearchQuery, setMergedCommuneSearchQuery] = useState("");

  // --- Effects for Data Fetching ---

  const fetchMergedProvinces = async () => {
    setLoadingMergedProvinces(true);
    setErrorMergedProvinces(null);
    try {
      const response = await apiClient.get("/tinh-thanh-gop");
      if (Array.isArray(response.data)) {
        setMergedProvinces(response.data);
      } else {
        console.error(
          "Backend did not return an array for /tinh-thanh-gop:",
          response.data
        );
        setErrorMergedProvinces("Dữ liệu Tỉnh/Thành phố gộp không hợp lệ.");
        setMergedProvinces([]);
      }
    } catch (error) {
      console.error("Error fetching merged provinces:", error);
      setErrorMergedProvinces(
        "Không thể tải dữ liệu Tỉnh/Thành phố gộp. Vui lòng kiểm tra server."
      );
      setMergedProvinces([]);
    } finally {
      setLoadingMergedProvinces(false);
    }
  };

  useEffect(() => {
    fetchMergedProvinces();
  }, []);

  const fetchMergedCommunes = async () => {
    if (viewedMergedProvince) {
      setLoadingMergedCommunes(true);
      setErrorMergedCommunes(null);
      try {
        const response = await apiClient.get(
          `/phuong-sap-nhap/by-tinh-gop/${viewedMergedProvince.ma_gop}`
        );
        if (Array.isArray(response.data)) {
          setMergedCommunes(response.data);
        } else {
          console.error(
            "Backend did not return an array for merged communes:",
            response.data
          );
          setErrorMergedCommunes("Dữ liệu Phường/Xã gộp không hợp lệ.");
          setMergedCommunes([]);
        }
      } catch (error) {
        console.error(
          `Error fetching merged communes for ${viewedMergedProvince.ma_gop}:`,
          error
        );
        setErrorMergedCommunes(
          `Không thể tải dữ liệu Phường/Xã gộp cho ${viewedMergedProvince.ten_gop}.`
        );
        setMergedCommunes([]);
      } finally {
        setLoadingMergedCommunes(false);
      }
    } else {
      setMergedCommunes([]);
      setErrorMergedCommunes(null);
      setLoadingMergedCommunes(false);
    }
  };

  useEffect(() => {
    fetchMergedCommunes();
  }, [viewedMergedProvince]);

  useEffect(() => {
    const fetchOriginalData = async () => {
      setLoadingOriginalData(true);
      setErrorOriginalData(null);
      try {
        const [provincesRes, districtsRes, communesRes] = await Promise.all([
          apiClient.get("/tinhs"),
          apiClient.get("/huyens"),
          apiClient.get("/xas"),
        ]);

        const provincesMap = {};
        if (Array.isArray(provincesRes.data)) {
          setOriginalProvinces(provincesRes.data);
          provincesRes.data.forEach((p) => (provincesMap[p.id_tinh] = p));
        }

        const districtsMap = {};
        if (Array.isArray(districtsRes.data)) {
          districtsRes.data.forEach((d) => (districtsMap[d.id_quan] = d));
        }

        const communesMap = {};
        if (Array.isArray(communesRes.data)) {
          communesRes.data.forEach((c) => (communesMap[c.id_phuong] = c));
        }

        setOriginalProvincesMap(provincesMap);
        setOriginalDistrictsMap(districtsMap);
        setOriginalCommunesMap(communesMap);
      } catch (error) {
        console.error("Error fetching original administrative data:", error);
        setErrorOriginalData(
          "Không thể tải dữ liệu hành chính gốc để hiển thị chi tiết."
        );
      } finally {
        setLoadingOriginalData(false);
      }
    };
    fetchOriginalData();
  }, []);

  useEffect(() => {
    const fetchDistrictsForSelectedOldProvince = async () => {
      if (selectedOldProvinceForCommuneAdd) {
        try {
          const response = await apiClient.get(
            `/huyens?tinhId=${selectedOldProvinceForCommuneAdd}`
          );
          if (Array.isArray(response.data)) {
            setAvailableDistrictsForOldProvince(response.data);
          } else {
            setAvailableDistrictsForOldProvince([]);
          }
        } catch (error) {
          console.error(
            `Error fetching districts for old province ${selectedOldProvinceForCommuneAdd}:`,
            error
          );
          setAvailableDistrictsForOldProvince([]);
        }
      } else {
        setAvailableDistrictsForOldProvince([]);
      }
    };
    fetchDistrictsForSelectedOldProvince();
  }, [selectedOldProvinceForCommuneAdd]);

  // --- Handlers for Merged Provinces ---

  const handleViewMergedCommunes = (mergedProvince) => {
    setViewedMergedProvince(mergedProvince);
    setMergedCommuneSearchQuery("");
    setShowAddCommuneForm(false);
    setEditingCommune(null);
  };

  const handleBackToMergedProvinces = () => {
    setViewedMergedProvince(null);
    setMergedProvinceSearchQuery("");
    setShowAddProvinceForm(false);
    setShowAddCommuneForm(false);
    setEditingCommune(null);
  };

  const resetProvinceFormStates = () => {
    setNewMaGop("");
    setNewTenGop("");
    setNewDsMaTinhCu([]);
    setNewGhiChu("");
    setAddProvinceError(null);
    setAddProvinceSuccess(false);
    setSelectedProvinceToAdd("");
  };

  const handleShowAddProvinceForm = () => {
    setShowAddProvinceForm(true);
    setEditingProvince(null);
    resetProvinceFormStates();
  };

  const handleEditProvince = (province) => {
    setShowAddProvinceForm(true);
    setEditingProvince(province);
    resetProvinceFormStates();

    setNewMaGop(province.ma_gop);
    setNewTenGop(province.ten_gop);
    setNewGhiChu(province.ghichu || "");
    setNewDsMaTinhCu(
      province.ds_ma_tinh_cu
        ? province.ds_ma_tinh_cu.split(",").map((id) => id.trim())
        : []
    );
  };

  const handleAddSelectedProvinceToMerged = () => {
    if (
      selectedProvinceToAdd &&
      !newDsMaTinhCu.includes(selectedProvinceToAdd)
    ) {
      setNewDsMaTinhCu((prev) => [...prev, selectedProvinceToAdd]);
      setSelectedProvinceToAdd("");
    }
  };

  const handleRemoveSelectedProvinceFromMerged = (provinceIdToRemove) => {
    setNewDsMaTinhCu((prev) => prev.filter((id) => id !== provinceIdToRemove));
  };

  const handleAddOrUpdateMergedProvinceSubmit = async (e) => {
    e.preventDefault();
    setAddingProvince(true);
    setAddProvinceError(null);
    setAddProvinceSuccess(false);

    const dsMaTinhCuString = newDsMaTinhCu.join(",");

    const provinceData = {
      maGop: newMaGop,
      tenGop: newTenGop,
      dsMaTinhCu: dsMaTinhCuString,
      ghiChu: newGhiChu,
    };

    try {
      if (editingProvince) {
        await apiClient.put(
          `/tinh-thanh-gop/${editingProvince.id}`,
          provinceData
        );
      } else {
        await apiClient.post("/tinh-thanh-gop/", provinceData);
      }
      setAddProvinceSuccess(true);
      setShowAddProvinceForm(false);
      setEditingProvince(null);
      fetchMergedProvinces();
    } catch (error) {
      console.error("Error adding/updating merged province:", error);
      if (error.response && error.response.status === 409) {
        setAddProvinceError("Mã gộp đã tồn tại. Vui lòng chọn mã khác.");
      } else {
        setAddProvinceError(
          `Không thể ${
            editingProvince ? "cập nhật" : "thêm"
          } Tỉnh/Thành phố gộp. Vui lòng thử lại.`
        );
      }
    } finally {
      setAddingProvince(false);
    }
  };

  const handleDeleteMergedProvince = async (id) => {
    if (
      window.confirm("Bạn có chắc chắn muốn xóa Tỉnh/Thành phố gộp này không?")
    ) {
      try {
        await apiClient.delete(`/tinh-thanh-gop/${id}`);
        fetchMergedProvinces();
      } catch (error) {
        console.error("Error deleting merged province:", error);
        alert("Không thể xóa Tỉnh/Thành phố gộp. Vui lòng thử lại.");
      }
    }
  };

  // --- Handlers for Merged Communes ---

  const resetCommuneFormStates = () => {
    setNewCommuneTenMoi("");
    setNewCommuneGhiChu("");
    setSelectedOldProvinceForCommuneAdd("");
    setAvailableDistrictsForOldProvince([]);
    setAddCommuneError(null);
    setAddCommuneSuccess(false);
  };

  const handleShowAddCommuneForm = () => {
    setShowAddCommuneForm(true);
    setEditingCommune(null);
    resetCommuneFormStates();
    setNewCommuneDsIdPhuongCu([]);
  };

  const handleEditCommune = async (commune) => {
    setShowAddCommuneForm(true);
    setEditingCommune(commune);
    setNewCommuneTenMoi(commune.ten_moi);
    setNewCommuneGhiChu(commune.ghichu || "");
    setAddCommuneError(null);
    setAddCommuneSuccess(false);

    const existingOldCommuneIds = commune.ds_id_phuong_cu
      ? commune.ds_id_phuong_cu.split(",").map((id) => id.trim())
      : [];
    setNewCommuneDsIdPhuongCu(existingOldCommuneIds);

    if (
      existingOldCommuneIds.length > 0 &&
      Object.keys(originalCommunesMap).length > 0
    ) {
      const firstOldCommuneId = existingOldCommuneIds[0];
      const firstOldCommune = originalCommunesMap[firstOldCommuneId];

      if (firstOldCommune) {
        const firstOldDistrict = originalDistrictsMap[firstOldCommune.id_quan];
        if (firstOldDistrict) {
          // Set the province to trigger fetching of its districts
          setSelectedOldProvinceForCommuneAdd(firstOldDistrict.id_tinh);
        }
      }
    }
  };

  const handleOldCommuneCheckboxChange = (e) => {
    const { value, checked } = e.target;
    setNewCommuneDsIdPhuongCu((prev) => {
      if (checked) {
        return [...prev, value];
      } else {
        return prev.filter((id) => id !== value);
      }
    });
  };

  const handleClearAllSelectedCommunes = () => {
    setNewCommuneDsIdPhuongCu([]);
  };

  const handleAddOrUpdateMergedCommuneSubmit = async (e) => {
    e.preventDefault();
    setAddingCommune(true);
    setAddCommuneError(null);
    setAddCommuneSuccess(false);

    // Thêm bước kiểm tra để ứng dụng chạy ổn định hơn
    if (!viewedMergedProvince) {
      setAddCommuneError(
        "Lỗi: Không xác định được Tỉnh gộp. Vui lòng quay lại và chọn lại tỉnh gộp."
      );
      setAddingCommune(false);
      return;
    }

    if (newCommuneDsIdPhuongCu.length === 0) {
      setAddCommuneError("Vui lòng chọn ít nhất một Phường/Xã cũ để gộp.");
      setAddingCommune(false);
      return;
    }
    if (!newCommuneTenMoi.trim()) {
      setAddCommuneError("Vui lòng nhập tên Phường/Xã gộp mới.");
      setAddingCommune(false);
      return;
    }

    const dsIdPhuongCuString = newCommuneDsIdPhuongCu.join(",");

    const communeData = {
      tenMoi: newCommuneTenMoi,
      dsIdPhuongCu: dsIdPhuongCuString,
      idTinhGop: viewedMergedProvince.ma_gop,
      ghiChu: newCommuneGhiChu,
    };

    try {
      console.log("LOG 5: Bắt đầu khối try...catch. Chuẩn bị gọi API.");
      if (editingCommune) {
        await apiClient.put(
          `/phuong-sap-nhap/${editingCommune.id}`,
          communeData
        );
      } else {
        await apiClient.post("/phuong-sap-nhap/", communeData);
      }

      setAddCommuneSuccess(true);
      setShowAddCommuneForm(false);
      setEditingCommune(null);
      fetchMergedCommunes();
    } catch (error) {
      if (error.response) {
      } else if (error.request) {
      } else {
        console.error("   - Lỗi khác khi thiết lập request:", error.message);
      }

      setAddCommuneError(
        `Không thể ${
          editingCommune ? "cập nhật" : "thêm"
        } Phường/Xã gộp. Vui lòng thử lại.`
      );
    } finally {
      setAddingCommune(false);
    }
  };

  const handleDeleteMergedCommune = async (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa Phường/Xã gộp này không?")) {
      try {
        await apiClient.delete(`/phuong-sap-nhap/${id}`);
        fetchMergedCommunes();
      } catch (error) {
        console.error("Error deleting merged commune:", error);
        alert("Không thể xóa Phường/Xã gộp. Vui lòng thử lại.");
      }
    }
  };

  const getOriginalCommuneFullPath = (communeId) => {
    const commune = originalCommunesMap[communeId];
    if (!commune) return `ID Xã cũ không tìm thấy: ${communeId}`;

    const district = originalDistrictsMap[commune.id_quan];
    const province = district ? originalProvincesMap[district.id_tinh] : null;

    const parts = [commune.ten];
    if (district) parts.push(district.ten);
    if (province) parts.push(province.ten);

    return parts.join(", ");
  };

  // --- Filtering Logic for Search ---
  const filteredMergedProvinces = useMemo(() => {
    if (!mergedProvinceSearchQuery) {
      return mergedProvinces;
    }
    const lowerCaseQuery = mergedProvinceSearchQuery.toLowerCase();
    return mergedProvinces.filter(
      (province) =>
        province.ten_gop.toLowerCase().includes(lowerCaseQuery) ||
        province.ma_gop.toLowerCase().includes(lowerCaseQuery) ||
        (province.ds_ma_tinh_cu &&
          province.ds_ma_tinh_cu.toLowerCase().includes(lowerCaseQuery))
    );
  }, [mergedProvinces, mergedProvinceSearchQuery]);

  const filteredMergedCommunes = useMemo(() => {
    if (!mergedCommuneSearchQuery) {
      return mergedCommunes;
    }
    const lowerCaseQuery = mergedCommuneSearchQuery.toLowerCase();
    return mergedCommunes.filter(
      (commune) =>
        commune.ten_moi.toLowerCase().includes(lowerCaseQuery) ||
        String(commune.id).includes(lowerCaseQuery) ||
        (commune.ds_id_phuong_cu &&
          commune.ds_id_phuong_cu.toLowerCase().includes(lowerCaseQuery))
    );
  }, [mergedCommunes, mergedCommuneSearchQuery]);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h2 className="text-3xl font-bold mb-6 text-gray-900">
        Quản lý Thông tin Địa chỉ Gộp
      </h2>

      {loadingOriginalData && (
        <p className="text-blue-500 mb-4">Đang tải dữ liệu hành chính gốc...</p>
      )}
      {errorOriginalData && (
        <p className="text-red-500 mb-4">
          Lỗi tải dữ liệu gốc: {errorOriginalData}
        </p>
      )}

      {/* Conditional rendering for Merged Provinces list or Merged Communes list */}
      {!viewedMergedProvince && !showAddProvinceForm && (
        // Display Merged Provinces Table
        <div>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold text-gray-800">
              Danh sách Tỉnh/Thành phố Gộp
            </h3>
            <button
              onClick={handleShowAddProvinceForm}
              className="px-6 py-2 bg-indigo-600 text-white rounded-lg shadow-md hover:bg-indigo-700 transition-transform transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              Thêm Tỉnh Gộp Mới
            </button>
          </div>

          {/* Search input for Merged Provinces */}
          <div className="mb-4">
            <input
              type="text"
              placeholder="Tìm kiếm Tỉnh/Thành phố Gộp..."
              value={mergedProvinceSearchQuery}
              onChange={(e) => setMergedProvinceSearchQuery(e.target.value)}
              className="p-3 border border-gray-300 rounded-lg w-full shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="overflow-x-auto bg-white rounded-lg shadow">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-100">
                <tr>
                  <th className="py-3 px-6 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                    Mã Gộp Mới
                  </th>
                  <th className="py-3 px-6 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                    Tên Tỉnh/Thành phố Gộp
                  </th>
                  <th className="py-3 px-6 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                    Các Tỉnh Cũ
                  </th>
                  <th className="py-3 px-6 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                    Ghi chú
                  </th>
                  <th className="py-3 px-6 text-center text-xs font-medium text-gray-600 uppercase tracking-wider">
                    Hành động
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {loadingMergedProvinces ? (
                  <tr>
                    <td
                      colSpan="5"
                      className="py-4 px-6 text-center text-blue-500"
                    >
                      Đang tải dữ liệu Tỉnh/Thành phố gộp...
                    </td>
                  </tr>
                ) : errorMergedProvinces ? (
                  <tr>
                    <td
                      colSpan="5"
                      className="py-4 px-6 text-center text-red-500"
                    >
                      Lỗi: {errorMergedProvinces}
                    </td>
                  </tr>
                ) : filteredMergedProvinces.length > 0 ? (
                  filteredMergedProvinces.map((province) => (
                    // FIX: Changed key from province.id_tinh (undefined) to province.id (correct unique key).
                    <tr
                      key={province.id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="py-4 px-6 whitespace-nowrap text-sm font-medium text-gray-900">
                        {province.ma_gop}
                      </td>
                      <td className="py-4 px-6 whitespace-nowrap text-sm text-gray-700">
                        {province.ten_gop}
                      </td>
                      <td className="py-4 px-6 text-sm text-gray-700">
                        {(province.ds_ma_tinh_cu &&
                          province.ds_ma_tinh_cu
                            .split(",")
                            .map((id) => id.trim())
                            .filter((id) => originalProvincesMap[id])
                            .map((id) => originalProvincesMap[id].ten)
                            .join(", ")) ||
                          province.ds_ma_tinh_cu}
                      </td>
                      <td className="py-4 px-6 text-sm text-gray-700">
                        {province.ghichu}
                      </td>
                      <td className="py-4 px-6 whitespace-nowrap text-center text-sm space-x-2">
                        <button
                          onClick={() => handleEditProvince(province)}
                          className="px-4 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 transition-colors focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-offset-2"
                        >
                          Sửa
                        </button>
                        <button
                          onClick={() => handleViewMergedCommunes(province)}
                          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                        >
                          Xem Phường Gộp
                        </button>
                        <button
                          onClick={() =>
                            handleDeleteMergedProvince(province.id)
                          }
                          className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                        >
                          Xóa
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="5"
                      className="py-4 px-6 text-center text-gray-500"
                    >
                      {mergedProvinceSearchQuery
                        ? "Không tìm thấy Tỉnh/Thành phố gộp phù hợp."
                        : "Không có dữ liệu Tỉnh/Thành phố gộp nào."}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
      {showAddProvinceForm && (
        <div className="mt-8 bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold mb-4 text-gray-800">
            {editingProvince ? "Sửa" : "Thêm"} Tỉnh/Thành phố Gộp
          </h3>
          <form
            onSubmit={handleAddOrUpdateMergedProvinceSubmit}
            className="space-y-4"
          >
            <div>
              <label
                htmlFor="maGop"
                className="block text-sm font-medium text-gray-700"
              >
                Mã Gộp Mới <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="maGop"
                value={newMaGop}
                onChange={(e) => setNewMaGop(e.target.value)}
                required
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                disabled={editingProvince !== null}
              />
              {editingProvince && (
                <p className="mt-1 text-sm text-gray-500">
                  Mã gộp không thể thay đổi khi sửa.
                </p>
              )}
            </div>
            <div>
              <label
                htmlFor="tenGop"
                className="block text-sm font-medium text-gray-700"
              >
                Tên Tỉnh/Thành phố Gộp <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="tenGop"
                value={newTenGop}
                onChange={(e) => setNewTenGop(e.target.value)}
                required
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
            <div>
              <label
                htmlFor="selectOldProvince"
                className="block text-sm font-medium text-gray-700"
              >
                Chọn Tỉnh Cũ để gộp
              </label>
              <div className="flex items-center space-x-2 mt-1">
                <select
                  id="selectOldProvince"
                  value={selectedProvinceToAdd}
                  onChange={(e) => setSelectedProvinceToAdd(e.target.value)}
                  className="flex-grow p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  disabled={
                    loadingOriginalData || originalProvinces.length === 0
                  }
                >
                  <option value="">-- Chọn tỉnh --</option>
                  {loadingOriginalData ? (
                    <option value="" disabled>
                      Đang tải danh sách tỉnh...
                    </option>
                  ) : errorOriginalData ? (
                    <option value="" disabled>
                      Lỗi tải danh sách tỉnh
                    </option>
                  ) : originalProvinces.length > 0 ? (
                    originalProvinces
                      // THAY ĐỔI 1: Lọc theo id_tinh thay vì id
                      .filter((p) => !newDsMaTinhCu.includes(p.id_tinh))
                      .map((province) => (
                        // THAY ĐỔI 2: Sử dụng province.id_tinh làm value
                        <option key={province.id} value={province.id_tinh}>
                          {province.ten} ({province.id_tinh})
                        </option>
                      ))
                  ) : (
                    <option value="" disabled>
                      Không có tỉnh cũ nào để chọn
                    </option>
                  )}
                </select>
                <button
                  type="button"
                  onClick={handleAddSelectedProvinceToMerged}
                  disabled={!selectedProvinceToAdd || addingProvince}
                  className="px-4 py-2 bg-green-600 text-white rounded-md shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Thêm
                </button>
              </div>
              <p className="mt-1 text-sm text-gray-500">
                Chọn một tỉnh từ danh sách và nhấp "Thêm" để thêm vào danh sách
                gộp.
              </p>

              {newDsMaTinhCu.length > 0 && (
                <div className="mt-4 p-3 border border-gray-200 rounded-md bg-gray-50">
                  <p className="text-sm font-medium text-gray-700 mb-2">
                    Các Tỉnh Cũ đã chọn:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {newDsMaTinhCu.map(
                      (
                        provinceId // provinceId bây giờ là '52TTT', '64TTT', v.v.
                      ) => (
                        <span
                          key={provinceId}
                          className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800"
                        >
                          {/* THAY ĐỔI 3: Hiển thị thẳng provinceId (chính là mã tỉnh) */}
                          {provinceId}
                          <button
                            type="button"
                            onClick={() =>
                              handleRemoveSelectedProvinceFromMerged(provinceId)
                            }
                            className="flex-shrink-0 ml-2 h-4 w-4 rounded-full inline-flex items-center justify-center text-indigo-500 hover:bg-indigo-200 hover:text-indigo-600 focus:outline-none focus:bg-indigo-200 focus:text-indigo-600"
                          >
                            <span className="sr-only">Remove {provinceId}</span>
                            <svg
                              className="h-2 w-2"
                              stroke="currentColor"
                              fill="none"
                              viewBox="0 0 8 8"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="1.5"
                                d="M1 1l6 6m0-6L1 7"
                              />
                            </svg>
                          </button>
                        </span>
                      )
                    )}
                  </div>
                </div>
              )}
            </div>
            <div>
              <label
                htmlFor="ghiChu"
                className="block text-sm font-medium text-gray-700"
              >
                Ghi chú
              </label>
              <textarea
                id="ghiChu"
                value={newGhiChu}
                onChange={(e) => setNewGhiChu(e.target.value)}
                rows="3"
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              ></textarea>
            </div>
            {addProvinceError && (
              <p className="text-red-600 text-sm mt-2">{addProvinceError}</p>
            )}
            {addProvinceSuccess && (
              <p className="text-green-600 text-sm mt-2">
                Thêm Tỉnh/Thành phố gộp thành công!
              </p>
            )}
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => {
                  setShowAddProvinceForm(false);
                  setEditingProvince(null);
                  resetProvinceFormStates();
                }}
                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              >
                Hủy
              </button>
              <button
                type="submit"
                disabled={addingProvince}
                className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {addingProvince
                  ? "Đang xử lý..."
                  : editingProvince
                  ? "Cập nhật Tỉnh/Thành phố Gộp"
                  : "Thêm Tỉnh/Thành phố Gộp"}
              </button>
            </div>
          </form>
        </div>
      )}

      {viewedMergedProvince && !showAddCommuneForm && (
        // Display Merged Communes Table
        <div className="mt-8">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold text-gray-800">
              Các Phường/Xã Gộp của:{" "}
              <span className="font-bold text-indigo-600">
                {viewedMergedProvince.ten_gop}
              </span>
            </h3>
            <div className="flex space-x-3">
              <button
                onClick={handleShowAddCommuneForm}
                className="px-6 py-2 bg-purple-600 text-white rounded-lg shadow-md hover:bg-purple-700 transition-transform transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
              >
                Thêm Phường Gộp Mới
              </button>
              <button
                onClick={handleBackToMergedProvinces}
                className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-2"
              >
                &larr; Quay lại Tỉnh/Thành phố Gộp
              </button>
            </div>
          </div>

          <div className="mb-4">
            <input
              type="text"
              placeholder="Tìm kiếm Phường/Xã Gộp..."
              value={mergedCommuneSearchQuery}
              onChange={(e) => setMergedCommuneSearchQuery(e.target.value)}
              className="p-3 border border-gray-300 rounded-lg w-full shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {loadingMergedCommunes ? (
            <p className="py-4 px-6 text-blue-500">
              Đang tải dữ liệu Phường/Xã gộp...
            </p>
          ) : errorMergedCommunes ? (
            <p className="py-4 px-6 text-red-500">Lỗi: {errorMergedCommunes}</p>
          ) : filteredMergedCommunes.length > 0 ? (
            <div className="overflow-x-auto bg-white rounded-lg shadow">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="py-3 px-6 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                      ID Phường Gộp
                    </th>
                    <th className="py-3 px-6 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                      Tên Phường/Xã Gộp Mới
                    </th>
                    <th className="py-3 px-6 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                      Các Phường/Xã Cũ Gộp Lại
                    </th>
                    <th className="py-3 px-6 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                      Ghi chú
                    </th>
                    <th className="py-3 px-6 text-center text-xs font-medium text-gray-600 uppercase tracking-wider">
                      Hành động
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredMergedCommunes.map((commune) => (
                    <tr
                      key={commune.id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="py-4 px-6 whitespace-nowrap text-sm font-medium text-gray-900">
                        {commune.id}
                      </td>
                      <td className="py-4 px-6 whitespace-nowrap text-sm text-gray-700">
                        {commune.ten_moi}
                      </td>
                      <td className="py-4 px-6 text-sm text-gray-700">
                        {commune.ds_id_phuong_cu &&
                          commune.ds_id_phuong_cu
                            .split(",")
                            .map((id) => id.trim())
                            .filter((id) => id && originalCommunesMap[id])
                            .map((id) => originalCommunesMap[id].ten)
                            .join("; ")}
                      </td>
                      <td className="py-4 px-6 text-sm text-gray-700">
                        {commune.ghichu}
                      </td>
                      <td className="py-4 px-6 whitespace-nowrap text-center text-sm space-x-2">
                        <button
                          onClick={() => handleEditCommune(commune)}
                          className="px-4 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 transition-colors focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-offset-2"
                        >
                          Sửa
                        </button>
                        <button
                          onClick={() => handleDeleteMergedCommune(commune.id)}
                          className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                        >
                          Xóa
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-gray-600 mt-4">
              {mergedCommuneSearchQuery
                ? "Không tìm thấy Phường/Xã gộp phù hợp."
                : "Không có dữ liệu Phường/Xã gộp nào cho tỉnh này."}
            </p>
          )}
        </div>
      )}

      {showAddCommuneForm && viewedMergedProvince && (
        <div className="mt-8 bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold mb-4 text-gray-800">
            {editingCommune ? "Sửa" : "Thêm"} Phường/Xã Gộp Mới
          </h3>
          <p className="mb-4 text-gray-600">
            Cho Tỉnh/Thành phố Gộp:{" "}
            <span className="font-bold text-indigo-600">
              {viewedMergedProvince.ten_gop}
            </span>
          </p>
          <form
            onSubmit={handleAddOrUpdateMergedCommuneSubmit}
            className="space-y-4"
          >
            <div>
              <label
                htmlFor="newCommuneTenMoi"
                className="block text-sm font-medium text-gray-700"
              >
                Tên Phường/Xã Gộp Mới <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="newCommuneTenMoi"
                value={newCommuneTenMoi}
                onChange={(e) => setNewCommuneTenMoi(e.target.value)}
                required
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>

            {/* Step 1: Select Old Province */}
            <div>
              <label
                htmlFor="selectOldProvinceForCommuneAdd"
                className="block text-sm font-medium text-gray-700"
              >
                Chọn Tỉnh Cũ
              </label>
              <select
                id="selectOldProvinceForCommuneAdd"
                value={selectedOldProvinceForCommuneAdd}
                onChange={(e) =>
                  setSelectedOldProvinceForCommuneAdd(e.target.value)
                }
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                disabled={loadingOriginalData}
              >
                <option value="">-- Chọn tỉnh cũ --</option>
                {viewedMergedProvince.ds_ma_tinh_cu
                  .split(",")
                  .map((id) => id.trim())
                  .filter((id) => originalProvincesMap[id])
                  .map((id) => originalProvincesMap[id])
                  .map((province) => (
                    <option key={province.id_tinh} value={province.id_tinh}>
                      {province.ten} ({province.id_tinh})
                    </option>
                  ))}
              </select>
            </div>

            {/* UPDATED: Step 2 & 3 Combined - District/Commune Accordion Selector */}
            {selectedOldProvinceForCommuneAdd && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tích chọn các Phường/Xã Cũ để gộp
                </label>
                <div className="p-3 border border-gray-300 rounded-md shadow-sm bg-gray-50 max-h-96 overflow-y-auto">
                  {availableDistrictsForOldProvince.length > 0 ? (
                    <div>
                      <div className="flex justify-end mb-2">
                        <button
                          type="button"
                          onClick={handleClearAllSelectedCommunes}
                          className="px-3 py-1 text-sm bg-red-100 text-red-700 rounded-md hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                        >
                          Xóa tất cả đã chọn
                        </button>
                      </div>
                      <ul className="space-y-2">
                        {availableDistrictsForOldProvince.map((district) => (
                          <DistrictCommuneSelector
                            key={district.id_quan}
                            district={district}
                            selectedCommuneIds={newCommuneDsIdPhuongCu}
                            onCommuneChange={handleOldCommuneCheckboxChange}
                            apiClient={apiClient}
                          />
                        ))}
                      </ul>
                    </div>
                  ) : (
                    <p className="text-gray-600">
                      Không có quận/huyện nào trong tỉnh này hoặc đang tải...
                    </p>
                  )}
                </div>
                <p className="mt-1 text-sm text-gray-500">
                  Nhấn vào tên Quận/Huyện để hiển thị danh sách các Phường/Xã.
                </p>

                {newCommuneDsIdPhuongCu.length > 0 && (
                  <div className="mt-4 p-3 border border-gray-200 rounded-md bg-gray-50">
                    <p className="text-sm font-medium text-gray-700 mb-2">
                      Các Phường/Xã Cũ đã chọn:
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {newCommuneDsIdPhuongCu.map((communeId) => (
                        <span
                          key={communeId}
                          className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800"
                        >
                          {originalCommunesMap[communeId]?.ten ||
                            `ID: ${communeId}`}
                          <button
                            type="button"
                            onClick={() =>
                              handleOldCommuneCheckboxChange({
                                target: { value: communeId, checked: false },
                              })
                            }
                            className="flex-shrink-0 ml-2 h-4 w-4 rounded-full inline-flex items-center justify-center text-purple-500 hover:bg-purple-200 hover:text-purple-600 focus:outline-none focus:bg-purple-200 focus:text-purple-600"
                          >
                            <span className="sr-only">Remove {communeId}</span>
                            <svg
                              className="h-2 w-2"
                              stroke="currentColor"
                              fill="none"
                              viewBox="0 0 8 8"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="1.5"
                                d="M1 1l6 6m0-6L1 7"
                              />
                            </svg>
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            <div>
              <label
                htmlFor="newCommuneGhiChu"
                className="block text-sm font-medium text-gray-700"
              >
                Ghi chú
              </label>
              <textarea
                id="newCommuneGhiChu"
                value={newCommuneGhiChu}
                onChange={(e) => setNewCommuneGhiChu(e.target.value)}
                rows="3"
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              ></textarea>
            </div>
            {addCommuneError && (
              <p className="text-red-600 text-sm mt-2">{addCommuneError}</p>
            )}
            {addCommuneSuccess && (
              <p className="text-green-600 text-sm mt-2">
                Phường/Xã gộp đã {editingCommune ? "cập nhật" : "thêm"} thành
                công!
              </p>
            )}
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => {
                  setShowAddCommuneForm(false);
                  setEditingCommune(null);
                  resetCommuneFormStates();
                }}
                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              >
                Hủy
              </button>
              <button
                type="submit"
                disabled={addingCommune}
                className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {addingCommune
                  ? "Đang xử lý..."
                  : editingCommune
                  ? "Cập nhật Phường/Xã Gộp"
                  : "Thêm Phường/Xã Gộp"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

export default NewInfoTab;
