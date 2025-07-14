import React, {
  useState,
  useEffect,
  useCallback,
  Fragment,
  useRef,
} from "react";
import axios from "axios";
import Select from "react-select";
import { Dialog, Transition } from "@headlessui/react";
import { TypeAnimation } from "react-type-animation";
import { gsap } from "gsap";
import {
  Search,
  List,
  CheckCircle2,
  X,
  BadgeHelp,
  LoaderCircle,
  ChevronsRight,
  Home,
} from "lucide-react";

// --- START: Cấu hình API ---
const API_BASE_URL = "https://tinhthanhpho.com/api/v1";
const API_KEY = "hvn_pDSvpqe2RQRojYAHwRiTyWlGQGqwjqov";

const axiosClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});
// --- END: Cấu hình API ---

const DONG_SON_BACKGROUND_URL = "./banner.jpg";
const BACKGROUND_URL_SVG_MAIN = "./Asset.svg";

const customSelectStyles = {
  control: (provided, state) => ({
    ...provided,
    backgroundColor: "var(--color-secondary)",
    border: state.isFocused
      ? "2px solid var(--color-secondary)"
      : "1px solid var(--color-secondary)",
    padding: "0.45rem",
    borderRadius: "0.375rem",
    boxShadow: state.isFocused ? "0 0 0 1px var(--color-secondary)" : "none",
    "&:hover": { borderColor: "var(--color-secondary)" },
  }),
  option: (provided, state) => ({
    ...provided,
    backgroundColor: state.isSelected
      ? "var(--color-red)"
      : state.isFocused
      ? "rgba(255, 0, 0, 0.1)"
      : "var(--color-secondary)",
    color: state.isSelected ? "var(--color-secondary)" : "var(--color-red)",
  }),
  singleValue: (provided) => ({ ...provided, color: "var(--color-red)" }),
  placeholder: (provided) => ({
    ...provided,
    color: "var(--color-red)",
    opacity: 0.6,
  }),
  input: (provided) => ({ ...provided, color: "var(--color-red)" }),
  menuPortal: (base) => ({ ...base, zIndex: 9997 }),
  dropdownIndicator: (provided) => ({
    ...provided,
    color: "var(--color-red)",
    "&:hover": { color: "var(--color-red)" },
  }),
  indicatorSeparator: (provided) => ({
    ...provided,
    backgroundColor: "var(--color-red)",
  }),
  clearIndicator: (provided) => ({
    ...provided,
    color: "var(--color-red)",
    "&:hover": { color: "var(--color-red)" },
  }),
};

// ✨ COMPONENT ĐÃ SỬA LỖI
function ResultModal({ isOpen, onClose, title, children }) {
  return (
    // Bỏ as={Fragment} ở đây
    <Transition appear show={isOpen}>
      <Dialog as="div" className="relative z-[9998]" onClose={onClose}>
        {/* Bỏ as={Fragment} ở đây */}
        <Transition.Child
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div
            className="fixed inset-0"
            style={{
              height: "100vh",
              backgroundImage: `url(${DONG_SON_BACKGROUND_URL})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              opacity: 1,
            }}
            aria-hidden="true"
          />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            {/* Bỏ as={Fragment} ở đây */}
            <Transition.Child
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-2xl transform overflow-hidden shadow-xl transition-all border-t-4 border-[var(--color-secondary)]">
                <div className="bg-[var(--color-red)] p-6 sm:p-8">
                  <Dialog.Title
                    as="h3"
                    className="text-lg sm:text-2xl font-bold leading-6 text-[var(--color-secondary)] flex items-center"
                  >
                    <span>{title}</span>
                  </Dialog.Title>
                  <div className="mt-4">{children}</div>
                  <div className="mt-6 text-right">
                    <button
                      type="button"
                      className="inline-flex justify-center border border-transparent bg-[var(--color-secondary)] px-6 py-2 text-sm font-medium text-[var(--color-red)] hover:bg-opacity-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-secondary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-red)]"
                      onClick={onClose}
                    >
                      Đã hiểu
                    </button>
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}

function AddressLookup() {
  const [activeTab, setActiveTab] = useState("oldToNew");
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);
  const [selectedProvince, setSelectedProvince] = useState(null);
  const [selectedDistrict, setSelectedDistrict] = useState(null);
  const [selectedWard, setSelectedWard] = useState(null);
  const [newProvinces, setNewProvinces] = useState([]);
  const [newWards, setNewWards] = useState([]);
  const [selectedNewProvince, setSelectedNewProvince] = useState(null);
  const [selectedNewWard, setSelectedNewWard] = useState(null);
  const [streetAddress, setStreetAddress] = useState("");
  const [currentStep, setCurrentStep] = useState("province");
  const [conversionResult, setConversionResult] = useState(null);
  const [mergedWardsList, setMergedWardsList] = useState(null);
  const [modalState, setModalState] = useState({
    isOpen: false,
    type: "",
    message: "",
    direction: "",
  });
  const [loadingSearch, setLoadingSearch] = useState(false);
  const [loadingInitialData, setLoadingInitialData] = useState(true);
  const tabContentRef = useRef(null);

  useEffect(() => {
    if (loadingInitialData || !tabContentRef.current) return;
    gsap.from(gsap.utils.toArray(tabContentRef.current.children), {
      opacity: 0,
      x: 50,
      duration: 0.5,
      ease: "power3.out",
      stagger: 0.1,
    });
  }, [currentStep, loadingInitialData, activeTab]);

  useEffect(() => {
    const fetchInitialData = async () => {
      setLoadingInitialData(true);
      try {
        const [oldProvincesRes, newProvincesRes] = await Promise.all([
          axiosClient.get("/provinces?limit=100"),
          axiosClient.get("/new-provinces?limit=100"),
        ]);
        if (oldProvincesRes.data.success)
          setProvinces(oldProvincesRes.data.data);
        if (newProvincesRes.data.success)
          setNewProvinces(newProvincesRes.data.data);
      } catch (error) {
        setModalState({
          isOpen: true,
          type: "error",
          message: `Lỗi tải dữ liệu ban đầu: ${error.message}`,
        });
      } finally {
        setLoadingInitialData(false);
      }
    };
    fetchInitialData();
  }, []);

  useEffect(() => {
    if (!selectedProvince) {
      setDistricts([]);
      setWards([]);
      return;
    }
    const fetchDistricts = async () => {
      const response = await axiosClient.get(
        `/provinces/${selectedProvince.value}/districts`
      );
      setDistricts(response.data.success ? response.data.data : []);
    };
    if (activeTab === "oldToNew") fetchDistricts();
  }, [selectedProvince, activeTab]);

  useEffect(() => {
    if (!selectedDistrict) {
      setWards([]);
      return;
    }
    const fetchWards = async () => {
      const response = await axiosClient.get(
        `/districts/${selectedDistrict.value}/wards`
      );
      setWards(response.data.success ? response.data.data : []);
    };
    if (activeTab === "oldToNew") fetchWards();
  }, [selectedDistrict, activeTab]);

  useEffect(() => {
    if (!selectedNewProvince) {
      setNewWards([]);
      return;
    }
    const fetchNewWards = async () => {
      const response = await axiosClient.get(
        `/new-provinces/${selectedNewProvince.value}/wards`
      );
      setNewWards(response.data.success ? response.data.data : []);
    };
    if (activeTab === "newToOld") fetchNewWards();
  }, [selectedNewProvince, activeTab]);

  const handleConvertOldToNew = async () => {
    if (!selectedWard) {
      setModalState({
        isOpen: true,
        type: "error",
        message: "Vui lòng chọn đầy đủ địa chỉ cũ.",
      });
      return;
    }
    setLoadingSearch(true);
    setConversionResult(null);
    setMergedWardsList(null);
    try {
      const payload = {
        provinceCode: selectedProvince.value,
        districtCode: selectedDistrict.value,
        wardCode: selectedWard.value,
        streetAddress: streetAddress,
      };
      const convertResponse = await axiosClient.post(
        "/convert/address",
        payload,
        { headers: { Authorization: `Bearer ${API_KEY}` } }
      );
      if (convertResponse.data.success) {
        const resultData = convertResponse.data.data;
        setConversionResult(resultData);
        const newWardCode = resultData.new?.ward?.code;
        if (newWardCode) {
          const historyResponse = await axiosClient.get(
            `/merge-history/ward/${newWardCode}`,
            { headers: { Authorization: `Bearer ${API_KEY}` } }
          );
          if (historyResponse.data.success)
            setMergedWardsList(historyResponse.data.data);
        }
        setModalState({ isOpen: true, type: "success", direction: "oldToNew" });
      } else {
        setModalState({
          isOpen: true,
          type: "info",
          message:
            convertResponse.data.message ||
            "Địa chỉ không có thông tin chuyển đổi.",
        });
      }
    } catch (error) {
      setModalState({
        isOpen: true,
        type: "error",
        message: error.response?.data?.message || "Đã có lỗi xảy ra.",
      });
    } finally {
      setLoadingSearch(false);
    }
  };

  const handleConvertNewToOld = async () => {
    if (!selectedNewWard) {
      setModalState({
        isOpen: true,
        type: "error",
        message: "Vui lòng chọn đầy đủ địa chỉ mới.",
      });
      return;
    }
    setLoadingSearch(true);
    setConversionResult(null);
    setMergedWardsList(null);
    try {
      const historyResponse = await axiosClient.get(
        `/merge-history/ward/${selectedNewWard.value}`,
        { headers: { Authorization: `Bearer ${API_KEY}` } }
      );
      if (
        historyResponse.data.success &&
        historyResponse.data.data.length > 0
      ) {
        setMergedWardsList(historyResponse.data.data);
        setConversionResult({
          new: {
            province: selectedNewProvince,
            ward: selectedNewWard,
            streetAddress: streetAddress,
          },
        });
        setModalState({ isOpen: true, type: "success", direction: "newToOld" });
      } else {
        setModalState({
          isOpen: true,
          type: "info",
          message:
            "Không tìm thấy lịch sử sáp nhập cho địa chỉ này, hoặc địa chỉ này không phải là đơn vị mới được sáp nhập.",
        });
      }
    } catch (error) {
      setModalState({
        isOpen: true,
        type: "error",
        message: error.response?.data?.message || "Đã có lỗi xảy ra.",
      });
    } finally {
      setLoadingSearch(false);
    }
  };

  const clearSelection = useCallback(() => {
    setSelectedProvince(null);
    setSelectedDistrict(null);
    setSelectedWard(null);
    setDistricts([]);
    setWards([]);
    setSelectedNewProvince(null);
    setSelectedNewWard(null);
    setNewWards([]);
    setStreetAddress("");
    setCurrentStep("province");
  }, []);

  const closeModal = () => setModalState({ ...modalState, isOpen: false });

  const provinceOptions = provinces.map((p) => ({
    value: p.code,
    label: p.name,
  }));
  const districtOptions = districts.map((d) => ({
    value: d.code,
    label: d.name,
  }));
  const wardOptions = wards.map((w) => ({ value: w.code, label: w.name }));
  const newProvinceOptions = newProvinces.map((p) => ({
    value: p.code,
    label: p.name,
  }));
  const newWardOptions = newWards.map((w) => ({
    value: w.code,
    label: w.name,
  }));

  const renderResultContent = () => {
    if (modalState.type !== "success") {
      return (
        <p className="text-[var(--color-secondary)] text-sm sm:text-base">
          {modalState.message}
        </p>
      );
    }
    if (modalState.direction === "oldToNew" && conversionResult) {
      return (
        <div className="space-y-6 text-left text-[var(--color-secondary)]">
          {" "}
          <div className="p-4 bg-black/20 rounded-md">
            {" "}
            <div className="flex items-center text-xs sm:text-sm font-semibold opacity-80 mb-3">
              {" "}
              <List className="h-4 w-4 mr-2 shrink-0" />{" "}
              <span>Chi tiết sáp nhập</span>{" "}
            </div>{" "}
            <div className="flex flex-col sm:flex-row items-center gap-2">
              {" "}
              <div className="text-center">
                {" "}
                {mergedWardsList && mergedWardsList.length > 0 ? (
                  mergedWardsList.map((item) => (
                    <p key={item.id} className="text-sm sm:text-base">
                      {item.old_ward.name}
                    </p>
                  ))
                ) : (
                  <p className="text-sm sm:text-base">
                    {conversionResult.old?.ward?.name || "Đơn vị cũ"}
                  </p>
                )}{" "}
              </div>{" "}
              <div className="text-yellow-300">
                {" "}
                <ChevronsRight
                  size={24}
                  className="transform sm:rotate-0 rotate-90"
                />{" "}
              </div>{" "}
              <div className="text-center bg-yellow-300/10 p-2 rounded-md">
                {" "}
                <p className="text-base sm:text-lg font-bold text-yellow-300">
                  {conversionResult.new?.ward?.name || "Đơn vị mới"}
                </p>{" "}
              </div>{" "}
            </div>{" "}
          </div>{" "}
          <div className="p-3 bg-black/20 rounded-md">
            {" "}
            <p className="text-xs sm:text-sm font-semibold opacity-80">
              Địa chỉ cũ
            </p>{" "}
            <p className="text-sm sm:text-base">
              {conversionResult.old.fullAddress || "N/A"}
            </p>{" "}
          </div>{" "}
          <div className="p-3 bg-black/20 rounded-md">
            {" "}
            <p className="text-xs sm:text-sm font-semibold opacity-80 text-yellow-300">
              Địa chỉ mới
            </p>{" "}
            <p className="text-sm sm:text-base text-yellow-300">
              {conversionResult.new.fullAddress || "N/A"}
            </p>{" "}
          </div>{" "}
        </div>
      );
    }
    if (modalState.direction === "newToOld" && conversionResult) {
      const fullNewAddress = [
        conversionResult.new.streetAddress,
        conversionResult.new.ward?.label,
        conversionResult.new.province?.label,
      ]
        .filter(Boolean)
        .join(", ");
      return (
        <div className="space-y-6 text-left text-[var(--color-secondary)]">
          {" "}
          <div className="p-4 bg-black/20 rounded-md">
            {" "}
            <div className="flex items-center text-xs sm:text-sm font-semibold opacity-80 mb-3">
              {" "}
              <List className="h-4 w-4 mr-2 shrink-0" />{" "}
              <span>Chi tiết sáp nhập</span>{" "}
            </div>{" "}
            <div className="flex flex-col sm:flex-row items-center gap-2">
              {" "}
              <div className="text-center bg-yellow-300/10 p-2 rounded-md">
                {" "}
                <p className="text-base sm:text-lg font-bold text-yellow-300">
                  {conversionResult.new?.ward?.label || "Đơn vị mới"}
                </p>{" "}
              </div>{" "}
              <div className="text-yellow-300">
                {" "}
                <ChevronsRight
                  size={24}
                  className="transform sm:rotate-0 rotate-90"
                />{" "}
              </div>{" "}
              <div className="text-center">
                {" "}
                {mergedWardsList && mergedWardsList.length > 0 ? (
                  mergedWardsList.map((item) => (
                    <p key={item.id} className="text-sm sm:text-base">
                      {item.old_ward.name}
                    </p>
                  ))
                ) : (
                  <p>Không có dữ liệu</p>
                )}{" "}
              </div>{" "}
            </div>{" "}
          </div>{" "}
          <div className="p-3 bg-black/20 rounded-md">
            {" "}
            <p className="text-xs sm:text-sm font-semibold opacity-80">
              Địa chỉ mới đã chọn
            </p>{" "}
            <p className="text-sm sm:text-base">{fullNewAddress}</p>{" "}
          </div>{" "}
          <div className="p-3 bg-black/20 rounded-md">
            {" "}
            <p className="text-xs sm:text-sm font-semibold opacity-80 text-yellow-300">
              Các địa chỉ cũ tương ứng
            </p>{" "}
            <ul className="list-disc list-inside mt-1 space-y-1 text-sm sm:text-base text-yellow-300">
              {" "}
              {mergedWardsList && mergedWardsList.length > 0 ? (
                mergedWardsList.map((item) => (
                  <li key={item.id}>{`${
                    streetAddress ? streetAddress + ", " : ""
                  }${item.old_ward.name}, ${item.old_ward.district.name}, ${
                    selectedNewProvince?.label
                  }`}</li>
                ))
              ) : (
                <li>Không có thông tin</li>
              )}{" "}
            </ul>{" "}
          </div>{" "}
        </div>
      );
    }
    return null;
  };

  const renderOldToNewForm = () => (
    <div id="old-to-new-tab">
      <div className="flex border-b border-[var(--color-secondary)]/30 mb-6">
        <button
          onClick={() => setCurrentStep("province")}
          disabled={loadingInitialData}
          className={`flex-1 py-3 px-1 text-center font-bold text-xs sm:text-sm transition-colors duration-300 focus:outline-none ${
            currentStep === "province"
              ? "text-[var(--color-secondary)] border-b-2 border-[var(--color-secondary)]"
              : "text-[var(--color-secondary)]/60 hover:text-[var(--color-secondary)]"
          }`}
        >
          Bước 1: Tỉnh/TP
        </button>
        <button
          onClick={() => setCurrentStep("district")}
          disabled={!selectedProvince}
          className={`flex-1 py-3 px-1 text-center font-bold text-xs sm:text-sm transition-colors duration-300 focus:outline-none ${
            currentStep === "district"
              ? "text-[var(--color-secondary)] border-b-2 border-[var(--color-secondary)]"
              : "text-[var(--color-secondary)]/60 hover:text-[var(--color-secondary)] disabled:text-[var(--color-secondary)]/30 disabled:cursor-not-allowed"
          }`}
        >
          Bước 2: Quận/Huyện
        </button>
        <button
          onClick={() => setCurrentStep("commune")}
          disabled={!selectedDistrict}
          className={`flex-1 py-3 px-1 text-center font-bold text-xs sm:text-sm transition-colors duration-300 focus:outline-none ${
            currentStep === "commune"
              ? "text-[var(--color-secondary)] border-b-2 border-[var(--color-secondary)]"
              : "text-[var(--color-secondary)]/60 hover:text-[var(--color-secondary)] disabled:text-[var(--color-secondary)]/30 disabled:cursor-not-allowed"
          }`}
        >
          Bước 3: Phường/Xã
        </button>
      </div>
      <div ref={tabContentRef} className="pt-2 min-h-[120px] overflow-hidden">
        {currentStep === "province" && (
          <div>
            <p className="text-[var(--color-secondary)] opacity-80 mb-3 text-sm sm:text-base">
              Chọn tỉnh/thành phố cũ.
            </p>
            <Select
              instanceId="province-select"
              options={provinceOptions}
              onChange={(o) => {
                setSelectedProvince(o);
                setSelectedDistrict(null);
                setSelectedWard(null);
                if (o) setCurrentStep("district");
              }}
              value={selectedProvince}
              placeholder="Chọn Tỉnh/Thành phố cũ..."
              styles={customSelectStyles}
              isClearable
              isLoading={loadingInitialData}
              isDisabled={loadingInitialData}
              menuPortalTarget={document.body}
            />
          </div>
        )}
        {currentStep === "district" && (
          <div>
            <p className="text-[var(--color-secondary)] opacity-80 mb-3 text-sm sm:text-base">
              Chọn quận/huyện cũ.
            </p>
            <Select
              instanceId="district-select"
              options={districtOptions}
              onChange={(o) => {
                setSelectedDistrict(o);
                setSelectedWard(null);
                if (o) setCurrentStep("commune");
              }}
              value={selectedDistrict}
              placeholder="Chọn Quận/Huyện cũ..."
              styles={customSelectStyles}
              isClearable
              isLoading={!!selectedProvince && districts.length === 0}
              isDisabled={!selectedProvince}
              menuPortalTarget={document.body}
            />
          </div>
        )}
        {currentStep === "commune" && (
          <div>
            <p className="text-[var(--color-secondary)] opacity-80 mb-3 text-sm sm:text-base">
              Chọn phường/xã cũ.
            </p>
            <Select
              instanceId="ward-select"
              options={wardOptions}
              onChange={setSelectedWard}
              value={selectedWard}
              placeholder="Chọn Phường/Xã cũ..."
              styles={customSelectStyles}
              isClearable
              isLoading={!!selectedDistrict && wards.length === 0}
              isDisabled={!selectedDistrict}
              menuPortalTarget={document.body}
            />
          </div>
        )}
      </div>
    </div>
  );

  const renderNewToOldForm = () => (
    <div id="new-to-old-tab">
      <div className="flex border-b border-[var(--color-secondary)]/30 mb-6">
        <button
          onClick={() => setCurrentStep("province")}
          disabled={loadingInitialData}
          className={`flex-1 py-3 px-1 text-center font-bold text-xs sm:text-sm transition-colors duration-300 focus:outline-none ${
            currentStep === "province"
              ? "text-[var(--color-secondary)] border-b-2 border-[var(--color-secondary)]"
              : "text-[var(--color-secondary)]/60 hover:text-[var(--color-secondary)]"
          }`}
        >
          Bước 1: Tỉnh/TP Mới
        </button>
        <button
          onClick={() => setCurrentStep("commune")}
          disabled={!selectedNewProvince}
          className={`flex-1 py-3 px-1 text-center font-bold text-xs sm:text-sm transition-colors duration-300 focus:outline-none ${
            currentStep === "commune"
              ? "text-[var(--color-secondary)] border-b-2 border-[var(--color-secondary)]"
              : "text-[var(--color-secondary)]/60 hover:text-[var(--color-secondary)] disabled:text-[var(--color-secondary)]/30 disabled:cursor-not-allowed"
          }`}
        >
          Bước 2: Phường/Xã Mới
        </button>
      </div>
      <div ref={tabContentRef} className="pt-2 min-h-[120px] overflow-hidden">
        {currentStep === "province" && (
          <div>
            <p className="text-[var(--color-secondary)] opacity-80 mb-3 text-sm sm:text-base">
              Chọn tỉnh/thành phố theo cấu trúc mới.
            </p>
            <Select
              instanceId="new-province-select"
              options={newProvinceOptions}
              onChange={(o) => {
                setSelectedNewProvince(o);
                setSelectedNewWard(null);
                if (o) setCurrentStep("commune");
              }}
              value={selectedNewProvince}
              placeholder="Chọn Tỉnh/Thành phố mới..."
              styles={customSelectStyles}
              isClearable
              isLoading={loadingInitialData}
              isDisabled={loadingInitialData}
              menuPortalTarget={document.body}
            />
          </div>
        )}
        {currentStep === "commune" && (
          <div>
            <p className="text-[var(--color-secondary)] opacity-80 mb-3 text-sm sm:text-base">
              Chọn phường/xã theo cấu trúc mới.
            </p>
            <Select
              instanceId="new-ward-select"
              options={newWardOptions}
              onChange={setSelectedNewWard}
              value={selectedNewWard}
              placeholder="Chọn Phường/Xã mới..."
              styles={customSelectStyles}
              isClearable
              isLoading={!!selectedNewProvince && newWards.length === 0}
              isDisabled={!selectedNewProvince}
              menuPortalTarget={document.body}
            />
          </div>
        )}
      </div>
    </div>
  );

  return (
    <>
      <section
        id="tra-cuu"
        className="relative py-16 sm:py-20 bg-[var(--color-secondary)] overflow-hidden"
      >
        <div
          className="absolute inset-0 z-0 opacity-20"
          style={{
            backgroundImage: `url(${BACKGROUND_URL_SVG_MAIN})`,
            backgroundPosition: "center",
            backgroundSize: "cover",
          }}
        ></div>
        <div className="relative z-20 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10 sm:mb-12">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[var(--color-red)] mb-3">
              <TypeAnimation
                sequence={["TRA CỨU ĐỊA CHỈ", 2000]}
                wrapper="span"
                speed={50}
                cursor={true}
                repeat={0}
              />
            </h2>
            <p className="mt-1 text-base sm:text-lg text-[var(--color-red)] max-w-2xl mx-auto">
              Tra cứu thông tin đơn vị hành chính mới và cũ sau sáp nhập.
            </p>
          </div>

          <div className="flex justify-center mb-6">
            <div
              className="inline-flex  shadow-sm bg-[var(--color-red)]/20 p-1"
              role="group"
            >
              <button
                type="button"
                onClick={() => {
                  setActiveTab("oldToNew");
                  clearSelection();
                }}
                className={`px-4 py-2 text-sm font-medium transition-all duration-200 ${
                  activeTab === "oldToNew"
                    ? "bg-[var(--color-red)] text-[var(--color-secondary)]"
                    : "text-[var(--color-red)] hover:bg-[var(--color-red)]/50"
                }`}
              >
                Tra từ Địa chỉ Cũ
              </button>
              <button
                type="button"
                onClick={() => {
                  setActiveTab("newToOld");
                  clearSelection();
                }}
                className={`px-4 py-2 text-sm font-medium transition-all duration-200 ${
                  activeTab === "newToOld"
                    ? "bg-[var(--color-red)] text-[var(--color-secondary)]"
                    : "text-[var(--color-red)] hover:bg-[var(--color-red)]/50"
                }`}
              >
                Tra từ Địa chỉ Mới
              </button>
            </div>
          </div>

          <div className="bg-[var(--color-red)] p-4 sm:p-6 md:p-8 shadow-2xl">
            {activeTab === "oldToNew"
              ? renderOldToNewForm()
              : renderNewToOldForm()}

            <div className="mt-6">
              <label
                htmlFor="street-address"
                className="block text-sm font-medium text-[var(--color-secondary)] mb-2"
              >
                Bước cuối: Nhập địa chỉ chi tiết (nếu có)
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <Home
                    className="h-5 w-5 text-[var(--color-red)] opacity-60"
                    aria-hidden="true"
                  />
                </div>
                <input
                  type="text"
                  id="street-address"
                  value={streetAddress}
                  onChange={(e) => setStreetAddress(e.target.value)}
                  className="block w-full bg-[var(--color-secondary)] border-none pl-10 pr-4 py-3 text-[var(--color-red)] placeholder:text-[var(--color-red)]/60 focus:ring-2 focus:ring-inset focus:ring-[var(--color-secondary)]"
                  placeholder="Số 123, đường ABC, Thôn XYZ,..."
                />
              </div>
            </div>
          </div>

          <div className="text-center my-6 sm:my-8">
            <button
              onClick={
                activeTab === "oldToNew"
                  ? handleConvertOldToNew
                  : handleConvertNewToOld
              }
              disabled={
                (activeTab === "oldToNew" && !selectedWard) ||
                (activeTab === "newToOld" && !selectedNewWard) ||
                loadingSearch ||
                loadingInitialData
              }
              className="inline-flex items-center justify-center gap-x-2 sm:gap-x-3 px-8 sm:px-10 py-3 sm:py-4 bg-[var(--color-red)] text-[var(--color-secondary)] font-bold hover:bg-opacity-100 transition-all transform hover:scale-105 focus:outline-none focus:ring-[var(--color-red)] focus:ring-offset-2 disabled:opacity-50 disabled:scale-100 disabled:cursor-not-allowed"
            >
              {loadingSearch ? (
                <LoaderCircle size={20} className="animate-spin" />
              ) : (
                <Search size={20} />
              )}
              <span className="text-base sm:text-lg">
                {loadingSearch ? "Đang tra cứu..." : "Xem Kết Quả"}
              </span>
            </button>
            {(selectedProvince || selectedNewProvince) && (
              <button
                onClick={clearSelection}
                className="mt-4 block w-full text-sm text-[var(--color-red)] hover:underline"
              >
                Xóa lựa chọn và làm lại từ đầu
              </button>
            )}
          </div>
        </div>

        <ResultModal
          isOpen={modalState.isOpen}
          onClose={closeModal}
          title={
            modalState.type === "success"
              ? "Kết Quả Tra Cứu"
              : modalState.type === "error"
              ? "Có lỗi xảy ra"
              : "Thông Báo"
          }
        >
          {renderResultContent()}
        </ResultModal>
      </section>
    </>
  );
}

export default AddressLookup;
