import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronDown, ChevronUp, RefreshCw, ScanLine, X } from "lucide-react";
import { extractSideDocumentImage, extractSideInputImage } from "@microblink/blinkid";
import PageHeaderWithOutColorPicker from "../components/PageHeaderWithOutColorPicker";
import useBlinkIdScanner from "../components/MicrolinkIDScanner";
import { useTranslation } from 'react-i18next';
import { getSessions, toggleSessionStatus } from "../services/authService";
import { createOrUpdateBusiness, getMyBusiness, uploadDocumentToStrapi, getMyDocuments, verifyMyBusiness } from "../services/businessService";
import TwoLineUnitInput from "../components/atoms/TwoLineUnitInput";
import useLocationSelection from "../hooks/useLocationSelection";

const MOCK_VERIFICATION = String(import.meta.env.VITE_MOCK_VERIFICATION || "false").toLowerCase() === "true";

const ADMIN_BLINK_SCANNING_SETTINGS = {
  returnInputImages: true,
  scanCroppedDocumentImage: true,
  croppedImageSettings: {
    returnDocumentImage: true,
    returnFaceImage: true,
    returnSignatureImage: true,
  },
};

const ADMIN_BLINK_FEEDBACK_OPTIONS = {
  showOnboardingGuide: false,
  showHelpButton: true,
};

const imageDataToDataUrl = (imageData) => {
  if (!imageData) return null;
  const canvas = document.createElement("canvas");
  canvas.width = imageData.width;
  canvas.height = imageData.height;
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;
  ctx.putImageData(imageData, 0, 0);
  return canvas.toDataURL("image/png");
};

const getBlinkStringValue = (field) => {
  if (!field) return "";
  if (typeof field === "string") return field;
  return field.latin?.value || field.cyrillic?.value || field.greek?.value || field.arabic?.value || "";
};

function DeviceRow({ item, actionLabel, onActionClick }) {
  const { t } = useTranslation();
  return (
    <div className="grid grid-cols-[1fr_auto] border-2 border-black border-t-0 first:border-t-2">
      <div className="p-1 text-[13px] leading-tight">
        <div>
          {t('adminControl.device')} <span className="font-bold text-red-700">{item.device_name}</span>
          <span className="ml-2">{item.is_familiar ? t('adminControl.familiarDevice') : t('adminControl.unfamiliarDevice')}</span>
        </div>
        <div>{t('adminControl.loginVia')} {item.login_type === 'password' ? t('adminControl.password') : t('adminControl.qr')}</div>
        <div>{item.location || t('adminControl.unknownLocation')}</div>
      </div>
      <button
        type="button"
        onClick={() => onActionClick(item)}
        className="min-w-16 border-l-2 border-black px-2 text-[12px] font-bold uppercase hover:bg-black hover:text-white"
      >
        {actionLabel}
      </button>
    </div>
  );
}

function InfoInputRow({ label, placeholder, value, onChange, inputs = [] }) {
  const { t } = useTranslation();
  const defaultPlaceholder = placeholder || t('adminControl.enter');

  if (inputs.length > 0) {
    const inputCols = inputs.map(input => input.width || '1fr').join(' ');
    return (
      <div className={`grid border-2 border-black border-t-0 text-[13px] leading-tight`} style={{ gridTemplateColumns: `180px ${inputCols}` }}>
        <div className="border-r-2 border-black px-2 py-1 uppercase">{label}</div>
        {inputs.map((input, idx) => (
          <div key={idx} className={idx > 0 ? "border-l-2 border-black" : ""}>
            {input.type === 'button' ? (
              <button type="button" onClick={input.onClick} className="w-full h-full px-2 py-1 text-yellow-700 hover:bg-black hover:text-white">
                {input.label}
              </button>
            ) : input.type === 'select' ? (
              <select
                value={input.value || ""}
                onChange={input.onChange}
                className="w-full h-full px-2 py-1 text-center text-yellow-700 bg-transparent focus:outline-none cursor-pointer hover:bg-black hover:text-white"
                style={{ textAlignLast: 'center' }}
              >
                <option value="" disabled hidden>{input.placeholder || defaultPlaceholder}</option>
                {input.options?.map((opt, i) => (
                  <option key={i} value={opt.value} className="text-black bg-white text-left">
                    {opt.label}
                  </option>
                ))}
              </select>
            ) : (
              <input
                type="text"
                value={input.value !== undefined ? input.value : undefined}
                onChange={input.onChange}
                placeholder={input.placeholder || defaultPlaceholder}
                className="w-full px-2 py-1 text-right bg-transparent focus:outline-none"
              />
            )}
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-[180px_1fr] border-2 border-black border-t-0 text-[13px] leading-tight">
      <div className="border-r-2 border-black px-2 py-1 uppercase">{label}</div>
      <input
        type="text"
        value={value !== undefined ? value : undefined}
        onChange={onChange}
        placeholder={defaultPlaceholder}
        className="px-2 py-1 text-right bg-transparent focus:outline-none"
      />
    </div>
  );
}

export default function AdminControlPage() {
  const { t } = useTranslation();

  const hqLocation = useLocationSelection();
  const currLocation = useLocationSelection();
  const hqCountryOptions = (hqLocation.countries || []).map((c) => ({ label: c.vi || c.en, value: c.en || c.vi }));
  const hqProvinceOptions = (hqLocation.provinces || []).map((p) => ({ label: p.vi || p.en, value: p.en || p.vi }));
  const currCountryOptions = (currLocation.countries || []).map((c) => ({ label: c.vi || c.en, value: c.en || c.vi }));
  const currProvinceOptions = (currLocation.provinces || []).map((p) => ({ label: p.vi || p.en, value: p.en || p.vi }));

  const [color, setColor] = useState(localStorage.getItem("selectedColor") || "#ffffff");
  const [showLoggedInDevices, setShowLoggedInDevices] = useState(true);
  const [showLoggedOutDevices, setShowLoggedOutDevices] = useState(true);
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otpInput, setOtpInput] = useState("");
  const [selectedSession, setSelectedSession] = useState(null);

  const navigate = useNavigate();

  // Camera state
  const videoRef = useRef(null);
  const [showCamera, setShowCamera] = useState(false);
  const [cameraStream, setCameraStream] = useState(null);
  const [previewBlocked, setPreviewBlocked] = useState(false);
  const [cameraMode, setCameraMode] = useState(null); // 'cccd_front' | 'cccd_back' | 'business_reg'

  // CCCD document state
  const [cccdFrontDataUrl, setCccdFrontDataUrl] = useState(null);
  const [cccdBackDataUrl, setCccdBackDataUrl] = useState(null);
  const [cccdFrontFileId, setCccdFrontFileId] = useState(null);
  const [cccdBackFileId, setCccdBackFileId] = useState(null);
  const [hasIdCaptured, setHasIdCaptured] = useState(false);
  const [showIdScanner, setShowIdScanner] = useState(false);
  const [scannerStarting, setScannerStarting] = useState(false);
  const [scannerError, setScannerError] = useState("");
  const [cccdScanInfo, setCccdScanInfo] = useState(null);

  // Business registration document state
  const [businessRegDataUrl, setBusinessRegDataUrl] = useState(null);
  const [businessRegFileId, setBusinessRegFileId] = useState(null);
  const [hasBusinessVideo, setHasBusinessVideo] = useState(false);

  // Verification state
  const [isVerified, setIsVerified] = useState(false);
  const [verifying, setVerifying] = useState(false);

  // Business form state
  const [businessForm, setBusinessForm] = useState({
    business_fullname: '',
    tax_code: '',
    headquarters_address: '',
    headquarters_address_province_code: '',
    headquarters_address_nation_code: '',
    current_address: '',
    current_address_province_code: '',
    current_address_nation_code: '',
  });
  const [businessLoading, setBusinessLoading] = useState(false);
  const [businessSaving, setBusinessSaving] = useState(false);

  const closeIdScanner = useCallback(async () => {
    await idScannerDestroyRef.current?.();
    setShowIdScanner(false);
    setScannerStarting(false);
  }, []);

  const handleBlinkIdResult = useCallback(async (result) => {
    const frontImage = extractSideDocumentImage(result, "first") || extractSideInputImage(result, "first");
    const backImage = extractSideDocumentImage(result, "second") || extractSideInputImage(result, "second");
    const frontDataUrl = imageDataToDataUrl(frontImage);
    const backDataUrl = imageDataToDataUrl(backImage);

    if (!frontDataUrl || !backDataUrl) {
      setScannerError("Chưa lấy được đủ ảnh CCCD hai mặt. Vui lòng quét lại và làm theo hướng dẫn lật thẻ.");
      return;
    }

    setCccdFrontDataUrl(frontDataUrl);
    setCccdBackDataUrl(backDataUrl);
    setCccdScanInfo({
      fullName: getBlinkStringValue(result.fullName),
      idNumber: getBlinkStringValue(result.personalIdNumber) || getBlinkStringValue(result.documentNumber),
    });

    const [frontOk, backOk] = await Promise.all([
      uploadCapturedPhoto(frontDataUrl, "cccd_front"),
      uploadCapturedPhoto(backDataUrl, "cccd_back"),
    ]);
    if (frontOk && backOk) setHasIdCaptured(true);
    await closeIdScanner();
  }, [closeIdScanner]);

  const handleBlinkIdError = useCallback((error) => {
    console.error("BlinkID scan error:", error);
    setScannerError("Không thể quét CCCD. Vui lòng thử lại hoặc kiểm tra quyền camera/license.");
    setScannerStarting(false);
  }, []);

  const {
    containerRef: idScannerContainerRef,
    initialize: initializeIdScanner,
    destroy: destroyIdScanner,
    isReady: isIdScannerReady,
  } = useBlinkIdScanner({
    onResult: handleBlinkIdResult,
    onError: handleBlinkIdError,
    scanningMode: "automatic",
    scanningSettings: ADMIN_BLINK_SCANNING_SETTINGS,
    feedbackUiOptions: ADMIN_BLINK_FEEDBACK_OPTIONS,
  });

  const idScannerDestroyRef = useRef(destroyIdScanner);

  useEffect(() => {
    idScannerDestroyRef.current = destroyIdScanner;
  }, [destroyIdScanner]);

  // Set video srcObject after camera modal mounts
  useEffect(() => {
    if (showCamera && cameraStream && videoRef.current) {
      videoRef.current.srcObject = cameraStream;
      videoRef.current.play().catch(() => setPreviewBlocked(true));
    }
  }, [showCamera, cameraStream]);

  const mockIdCapture = () => {
    const mockDataUrl = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==";
    setCccdFrontDataUrl(mockDataUrl);
    setCccdBackDataUrl(mockDataUrl);
    setCccdFrontFileId(1);
    setCccdBackFileId(2);
    setHasIdCaptured(true);
  };

  const openIdScanner = () => {
    setScannerError("");
    setShowIdScanner(true);
    setScannerStarting(true);
  };

  const mockBusinessRegCapture = () => {
    const mockDataUrl = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==";
    setBusinessRegDataUrl(mockDataUrl);
    setBusinessRegFileId(3);
    setHasBusinessVideo(true);
  };

  const openCamera = async (mode) => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      setCameraStream(stream);
      setCameraMode(mode);
      setPreviewBlocked(false);
      setShowCamera(true);
    } catch (error) {
      console.error("Error accessing camera:", error);
      alert(t("camera.error", "Lỗi truy cập máy ảnh"));
    }
  };

  const closeCamera = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach((track) => track.stop());
    }
    setCameraStream(null);
    setShowCamera(false);
    setCameraMode(null);
  };

  const tryStartPreview = async () => {
    const video = videoRef.current;
    if (!video) return;
    try {
      await video.play();
      setPreviewBlocked(false);
    } catch {
      setPreviewBlocked(true);
    }
  };

  const uploadCapturedPhoto = async (dataUrl, type) => {
    if (MOCK_VERIFICATION) return true;
    try {
      const uploaded = await uploadDocumentToStrapi(dataUrl, type);
      if (type === 'cccd_front') setCccdFrontFileId(uploaded.id);
      else if (type === 'cccd_back') setCccdBackFileId(uploaded.id);
      else if (type === 'business_reg') setBusinessRegFileId(uploaded.id);
      return true;
    } catch (error) {
      console.error(`Upload ${type} error:`, error);
      alert(t('adminControl.uploadError', 'Tải ảnh lên thất bại. Vui lòng thử lại.'));
      return false;
    }
  };

  useEffect(() => {
    if (!showIdScanner) return;
    const timeoutId = window.setTimeout(async () => {
      try {
        await initializeIdScanner();
      } catch (error) {
        handleBlinkIdError(error);
      } finally {
        setScannerStarting(false);
      }
    }, 100);
    return () => window.clearTimeout(timeoutId);
  }, [showIdScanner, initializeIdScanner, handleBlinkIdError]);

  const capturePhoto = async () => {
    if (!videoRef.current) return;
    const video = videoRef.current;
    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const dataUrl = canvas.toDataURL("image/png");

    if (cameraMode === 'cccd_front') {
      setCccdFrontDataUrl(dataUrl);
      await uploadCapturedPhoto(dataUrl, 'cccd_front');
      closeCamera();
    } else if (cameraMode === 'cccd_back') {
      setCccdBackDataUrl(dataUrl);
      const ok = await uploadCapturedPhoto(dataUrl, 'cccd_back');
      if (ok) setHasIdCaptured(true);
      closeCamera();
    } else if (cameraMode === 'business_reg') {
      setBusinessRegDataUrl(dataUrl);
      const ok = await uploadCapturedPhoto(dataUrl, 'business_reg');
      if (ok) setHasBusinessVideo(true);
      closeCamera();
    }
  };

  useEffect(() => {
    return () => {
      if (cameraStream) {
        cameraStream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [cameraStream]);

  useEffect(() => {
    document.getElementById("root").style.backgroundColor = color;
  }, [color]);

  const fetchBusiness = useCallback(async () => {
    try {
      setBusinessLoading(true);
      const response = await getMyBusiness();
      const biz = response.data?.data;
      if (biz) {
        setBusinessForm(prev => ({
          ...prev,
          business_fullname: biz.business_fullname || '',
          tax_code: biz.tax_code || '',
          headquarters_address: biz.headquarters_address || '',
          headquarters_address_province_code: biz.headquarters_address_province_code || '',
          headquarters_address_nation_code: biz.headquarters_address_nation_code || '',
          current_address: biz.current_address || '',
          current_address_province_code: biz.current_address_province_code || '',
          current_address_nation_code: biz.current_address_nation_code || '',
        }));
        if (biz.headquarters_address_nation_code) {
          await hqLocation.handleCountryChange({ target: { value: biz.headquarters_address_nation_code } });
          if (biz.headquarters_address_province_code) {
            await hqLocation.handleProvinceChange({ target: { value: biz.headquarters_address_province_code } });
          }
        }
        if (biz.current_address_nation_code) {
          await currLocation.handleCountryChange({ target: { value: biz.current_address_nation_code } });
          if (biz.current_address_province_code) {
            await currLocation.handleProvinceChange({ target: { value: biz.current_address_province_code } });
          }
        }
      }
    } catch (error) {
      console.error("Error fetching business:", error);
    } finally {
      setBusinessLoading(false);
    }
  }, []);

  useEffect(() => {
    if (hasIdCaptured && hasBusinessVideo) {
      fetchBusiness();
    }
  }, [hasIdCaptured, hasBusinessVideo, fetchBusiness]);

  const handleBusinessFieldChange = (field) => (e) => {
    setBusinessForm(prev => ({ ...prev, [field]: e.target.value }));
  };

  const handleSaveBusiness = async () => {
    try {
      setBusinessSaving(true);

      const documents = [];
      if (cccdFrontFileId || cccdBackFileId) {
        documents.push({
          type: 'cccd',
          file_ids: [cccdFrontFileId, cccdBackFileId].filter(Boolean),
        });
      }
      if (businessRegFileId) {
        documents.push({
          type: 'business_registration',
          file_ids: [businessRegFileId],
        });
      }

      const payload = {
        business_fullname: businessForm.business_fullname,
        tax_code: businessForm.tax_code,
        headquarters_address: businessForm.headquarters_address,
        headquarters_address_province_code: hqLocation.selectedProvince || businessForm.headquarters_address_province_code,
        headquarters_address_nation_code: hqLocation.selectedCountry || businessForm.headquarters_address_nation_code,
        current_address: businessForm.current_address,
        current_address_province_code: currLocation.selectedProvince || businessForm.current_address_province_code,
        current_address_nation_code: currLocation.selectedCountry || businessForm.current_address_nation_code,
        ...(documents.length > 0 ? { documents } : {}),
      };
      await createOrUpdateBusiness(payload);
      alert(t('adminControl.businessSaveSuccess', 'Đã lưu thông tin doanh nghiệp'));
    } catch (error) {
      console.error("Error saving business:", error);
      alert(t('adminControl.businessSaveError', 'Không thể lưu thông tin doanh nghiệp'));
    } finally {
      setBusinessSaving(false);
    }
  };

  const handleUpdateBusiness = async () => {
    await handleSaveBusiness();
    await fetchBusiness();
  };

  useEffect(() => {
    fetchSessions();
    loadExistingDocuments();
  }, []);

  const loadExistingDocuments = async () => {
    try {
      const response = await getMyDocuments();
      const docs = response.data?.data || [];

      let foundCccd = false;
      let foundBizReg = false;

      for (const doc of docs) {
        const files = doc.file || [];
        if (doc.type === 'cccd' && files.length > 0) {
          if (files[0]) { setCccdFrontDataUrl(files[0].url); setCccdFrontFileId(files[0].id); }
          if (files[1]) { setCccdBackDataUrl(files[1].url); setCccdBackFileId(files[1].id); }
          foundCccd = true;
        }
        if (doc.type === 'business_registration' && files.length > 0) {
          setBusinessRegDataUrl(files[0].url);
          setBusinessRegFileId(files[0].id);
          foundBizReg = true;
        }
      }

      if (foundCccd) setHasIdCaptured(true);
      if (foundBizReg) setHasBusinessVideo(true);

      if (docs.length > 0) {
        const verifyRes = await verifyMyBusiness();
        setIsVerified(verifyRes.data?.verified === true);
      }
    } catch (err) {
      console.error('Error loading existing documents:', err);
    }
  };

  const handleMarkVerified = async () => {
    try {
      setVerifying(true);
      const verifyRes = await verifyMyBusiness();
      setIsVerified(verifyRes.data?.verified === true);
    } catch (err) {
      console.error('Verify error:', err);
    } finally {
      setVerifying(false);
    }
  };

  const fetchSessions = async () => {
    try {
      setLoading(true);
      const response = await getSessions();
      setSessions(response.data?.data || []);
    } catch (error) {
      console.error("Error fetching sessions:", error);
      alert(t('adminControl.fetchError', 'Không thể tải danh sách phiên đăng nhập'));
    } finally {
      setLoading(false);
    }
  };

  const handleActionClick = (session) => {
    setSelectedSession(session);
    setShowOtpModal(true);
    setOtpInput("");
  };

  const handleOtpSubmit = async () => {
    if (!otpInput) {
      alert(t('adminControl.otpRequired', 'Vui lòng nhập mã OTP'));
      return;
    }
    try {
      const response = await toggleSessionStatus(selectedSession.id, otpInput);
      if (response.data?.success) {
        alert(t('adminControl.toggleSuccess', 'Đã thay đổi trạng thái phiên đăng nhập'));
        setShowOtpModal(false);
        setOtpInput("");
        setSelectedSession(null);
        fetchSessions();
      } else {
        alert(t('adminControl.toggleError', 'Không thể thay đổi trạng thái'));
      }
    } catch (error) {
      console.error("Error toggling session status:", error);
      const errorMessage = error.response?.data?.message || t('adminControl.otpError', 'Mã OTP không chính xác');
      alert(errorMessage);
    }
  };

  const handleCloseOtpModal = () => {
    setShowOtpModal(false);
    setOtpInput("");
    setSelectedSession(null);
  };

  const loggedInDevices = sessions.filter(s => s.status === 'login');
  const loggedOutDevices = sessions.filter(s => s.status === 'logout');

  const handleChangeColor = (e) => {
    const newColor = e.target.value;
    setColor(newColor);
    localStorage.setItem("selectedColor", newColor);
  };

  const getCameraTitle = () => {
    switch (cameraMode) {
      case 'cccd_front': return 'Chụp CCCD - Mặt trước';
      case 'cccd_back': return 'Chụp CCCD - Mặt sau';
      case 'business_reg': return 'Chụp giấy đăng ký kinh doanh';
      default: return t("camera.title", "Xác minh");
    }
  };

  const getCameraInstruction = () => {
    switch (cameraMode) {
      case 'cccd_front': return 'Đặt mặt trước CCCD vào khung hình, đảm bảo rõ nét và đủ ánh sáng';
      case 'cccd_back': return 'Đặt mặt sau CCCD vào khung hình, đảm bảo rõ nét và đủ ánh sáng';
      case 'business_reg': return 'Đặt giấy đăng ký kinh doanh vào khung hình, đảm bảo toàn bộ nội dung hiển thị rõ';
      default: return '';
    }
  };

  return (
    <>
    <div className="flex justify-center items-center min-h-screen p-1">
      <div className="bg-transparent backdrop-blur-md p-0 rounded-lg w-full mx-auto">
        {/* Header */}
        <PageHeaderWithOutColorPicker
          color={color}
          onColorChange={handleChangeColor}
          titlePrefix="3"
          title={t('adminControl.title')}
        />

        <section>
          <h2 className="mb-2 text-3xl font-extrabold uppercase">{t('adminControl.header3_1')}</h2>

          <button
            onClick={() => setShowLoggedInDevices(!showLoggedInDevices)}
            className="mb-2 flex items-center gap-2 text-xl font-extrabold uppercase hover:opacity-70"
          >
            {t('adminControl.loggedInDevicesHeader')}
            {showLoggedInDevices ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </button>
          {showLoggedInDevices && (
            <div className="max-w-[520px]">
              {loading ? (
                <div className="border-2 border-black p-4 text-center">{t('adminControl.loading')}</div>
              ) : loggedInDevices.length === 0 ? (
                <div className="border-2 border-black p-4 text-center">{t('adminControl.noLoggedInDevices')}</div>
              ) : (
                loggedInDevices.map((item) => (
                  <DeviceRow
                    key={item.id}
                    item={item}
                    actionLabel={t('adminControl.logout')}
                    onActionClick={handleActionClick}
                  />
                ))
              )}
            </div>
          )}

          <button
            onClick={() => setShowLoggedOutDevices(!showLoggedOutDevices)}
            className="mb-2 mt-4 flex items-center gap-2 text-xl font-extrabold uppercase hover:opacity-70"
          >
            {t('adminControl.loggedOutDevicesHeader')}
            {showLoggedOutDevices ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </button>
          {showLoggedOutDevices && (
            <div className="max-w-[520px]">
              {loading ? (
                <div className="border-2 border-black p-4 text-center">{t('adminControl.loading')}</div>
              ) : loggedOutDevices.length === 0 ? (
                <div className="border-2 border-black p-4 text-center">{t('adminControl.noLoggedOutDevices')}</div>
              ) : (
                loggedOutDevices.map((item) => (
                  <DeviceRow
                    key={item.id}
                    item={item}
                    actionLabel={t('adminControl.login')}
                    onActionClick={handleActionClick}
                  />
                ))
              )}
            </div>
          )}
        </section>

        <section className="mt-6 max-w-[650px]">
          <div className="grid grid-cols-[110px_1fr_130px] border-2 border-black text-sm font-bold">
            <div className="border-r-2 border-black p-2 uppercase">{t('adminControl.walletBalance')}</div>
            <div className="p-2 text-right">1,000,000,000.00</div>
            <div className="border-l-2 border-black p-2 text-center text-red-700">
              <TwoLineUnitInput isInput={false} />
            </div>
          </div>
        </section>

        <section className="mt-6 max-w-[820px] space-y-2">
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              className="border-2 border-black px-3 py-2 text-center text-lg font-extrabold uppercase hover:bg-black hover:text-white"
              onClick={() => navigate("/change-password")}
            >
              {t('adminControl.changePassword')}
            </button>
            <button
              type="button"
              onClick={() => navigate("/change-otp-code")}
              className="border-2 border-black px-3 py-2 text-center text-lg font-extrabold uppercase hover:bg-black hover:text-white"
            >
              {t('adminControl.changeOtpCode')}
            </button>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {/* CCCD Verification Button */}
            <button
              type="button"
              className={`border-2 border-black px-3 py-2 text-center text-lg font-extrabold uppercase leading-tight hover:bg-black hover:text-white ${
                hasIdCaptured ? 'bg-green-100' : cccdFrontDataUrl ? 'bg-yellow-50' : ''
              }`}
              onClick={() => {
                if (MOCK_VERIFICATION) {
                  mockIdCapture();
                } else if (!cccdFrontDataUrl) {
                  openIdScanner();
                } else if (!cccdBackDataUrl) {
                  openIdScanner();
                } else {
                  setCccdFrontDataUrl(null);
                  setCccdBackDataUrl(null);
                  setCccdFrontFileId(null);
                  setCccdBackFileId(null);
                  setHasIdCaptured(false);
                  setCccdScanInfo(null);
                  openIdScanner();
                }
              }}
            >
              <span className="inline-flex items-center justify-center gap-2">
                <ScanLine size={20} />
                {t('adminControl.idVerification')}
              </span>
              <br />
              {t('adminControl.forPersonalAccounts')}
              {cccdFrontDataUrl && !cccdBackDataUrl && (
                <div className="text-sm text-yellow-600 mt-1 normal-case font-normal">
                  Đã chụp mặt trước - Bấm để quét lại đủ hai mặt
                </div>
              )}
              {hasIdCaptured && (
                <div className="text-sm text-green-600 mt-1 normal-case font-normal">
                  {t("camera.captured", "Đã xác minh")}
                </div>
              )}
            </button>

            {/* Business Registration Verification Button */}
            <button
              type="button"
              className={`border-2 border-black px-3 py-2 text-center text-lg font-extrabold uppercase leading-tight hover:bg-black hover:text-white ${
                hasBusinessVideo ? 'bg-green-100' : ''
              }`}
              onClick={() => {
                if (MOCK_VERIFICATION) {
                  mockBusinessRegCapture();
                } else {
                  openCamera('business_reg');
                }
              }}
            >
              {t('adminControl.businessRegistrationVerification')}
              <br />
              {t('adminControl.forBusinessAccounts')}
              {hasBusinessVideo && (
                <div className="text-sm text-green-600 mt-1 normal-case font-normal">
                  {t("camera.captured", "Đã xác minh")}
                </div>
              )}
            </button>
          </div>

          {/* Verification status */}
          {isVerified ? (
            <div className="mt-3 flex items-center gap-2 border-2 border-green-600 bg-green-50 px-3 py-2 text-green-700 font-bold text-sm">
              <span>✓</span>
              <span>{t('adminControl.verifiedBadge', 'Tài khoản đã được xác minh')}</span>
            </div>
          ) : (hasIdCaptured || hasBusinessVideo) ? (
            <div className="mt-3 flex items-center gap-3">
              <div className="border-2 border-yellow-500 bg-yellow-50 px-3 py-2 text-yellow-700 font-bold text-sm">
                {t('adminControl.notVerified', 'Chưa xác minh')}
              </div>
              <button
                type="button"
                onClick={handleMarkVerified}
                disabled={verifying}
                className="border-2 border-black px-3 py-2 text-sm font-bold uppercase hover:bg-black hover:text-white disabled:opacity-50"
              >
                {verifying ? t('adminControl.verifying', 'Đang xác minh...') : t('adminControl.markVerified', 'Xác minh ngay')}
              </button>
            </div>
          ) : null}

          {/* Document photo previews */}
          {(cccdFrontDataUrl || cccdBackDataUrl || businessRegDataUrl) && (
            <div className="flex gap-3 mt-1">
              {cccdFrontDataUrl && (
                <div className="text-center">
                  <img
                    src={cccdFrontDataUrl}
                    alt="CCCD mặt trước"
                    className="h-16 w-24 object-cover border border-gray-400 rounded"
                  />
                  <div className="text-[10px] text-gray-500 mt-0.5">Mặt trước</div>
                </div>
              )}
              {cccdBackDataUrl && (
                <div className="text-center">
                  <img
                    src={cccdBackDataUrl}
                    alt="CCCD mặt sau"
                    className="h-16 w-24 object-cover border border-gray-400 rounded"
                  />
                  <div className="text-[10px] text-gray-500 mt-0.5">Mặt sau</div>
                </div>
              )}
              {businessRegDataUrl && (
                <div className="text-center">
                  <img
                    src={businessRegDataUrl}
                    alt="Giấy ĐKKD"
                    className="h-16 w-24 object-cover border border-gray-400 rounded"
                  />
                  <div className="text-[10px] text-gray-500 mt-0.5">Giấy ĐKKD</div>
                </div>
              )}
            </div>
          )}

          {cccdScanInfo && (
            <div className="mt-2 max-w-[520px] border-2 border-black bg-white/70 px-3 py-2 text-xs leading-tight">
              {cccdScanInfo.fullName && <div><span className="font-bold">Họ tên:</span> {cccdScanInfo.fullName}</div>}
              {cccdScanInfo.idNumber && <div><span className="font-bold">Số CCCD:</span> {cccdScanInfo.idNumber}</div>}
            </div>
          )}
        </section>

        {hasIdCaptured && hasBusinessVideo && (
            <section className="mt-2">
              {businessLoading ? (
                <div className="border-2 border-black p-4 text-center">{t('adminControl.loading')}</div>
              ) : (
                <>
                  <div className="border-t-2 border-black">
                    <InfoInputRow
                      label={t('adminControl.fullCompanyName')}
                      value={businessForm.business_fullname}
                      onChange={handleBusinessFieldChange('business_fullname')}
                    />
                    <InfoInputRow
                      label={t('adminControl.taxCode')}
                      value={businessForm.tax_code}
                      onChange={handleBusinessFieldChange('tax_code')}
                    />
                    <InfoInputRow
                      label={t('adminControl.headquartersAddress')}
                      inputs={[
                        { type: 'input', placeholder: t('adminControl.enter'), width: '1fr', value: businessForm.headquarters_address, onChange: handleBusinessFieldChange('headquarters_address') },
                        { type: 'select', placeholder: t('adminControl.selectProvince'), width: '600px', value: hqLocation.selectedProvince, onChange: hqLocation.handleProvinceChange, options: hqProvinceOptions },
                        { type: 'select', placeholder: t('adminControl.country'), width: '600px', value: hqLocation.selectedCountry, onChange: hqLocation.handleCountryChange, options: hqCountryOptions }
                      ]}
                    />
                  </div>

                  <InfoInputRow
                    label={t('adminControl.currentAddress')}
                    inputs={[
                      { type: 'input', placeholder: t('adminControl.enter'), width: '1fr', value: businessForm.current_address, onChange: handleBusinessFieldChange('current_address') },
                      { type: 'select', placeholder: t('adminControl.selectProvince'), width: '300px', value: currLocation.selectedProvince, onChange: currLocation.handleProvinceChange, options: currProvinceOptions },
                      { type: 'select', placeholder: t('adminControl.country'), width: '300px', value: currLocation.selectedCountry, onChange: currLocation.handleCountryChange, options: currCountryOptions },
                      { type: 'button', label: t('adminControl.map'), width: '300px' },
                      { type: 'button', label: t('adminControl.update'), width: '300px', onClick: handleUpdateBusiness }
                    ]}
                  />

                  <div className="grid grid-cols-[180px_265px_265px_300px] border-2 border-black border-t-0 text-[13px] leading-tight">
                    <div className="border-r-2 border-black px-2 py-1 uppercase">
                      {t('adminControl.ecommerceContract')}
                    </div>
                    <button type="button" className="border-r-2 border-black px-2 py-1 uppercase hover:bg-black hover:text-white">
                      {t('adminControl.normalSignature')}
                    </button>
                    <button type="button" className="border-r-2 border-black px-2 py-1 uppercase hover:bg-black hover:text-white">
                      {t('adminControl.digitalSignature')}
                    </button>
                    <button
                      type="button"
                      className="border-r-2 border-black px-2 py-1 uppercase hover:bg-black hover:text-white disabled:opacity-50"
                      onClick={handleSaveBusiness}
                      disabled={businessSaving}
                    >
                      {businessSaving ? t('adminControl.saving', 'Đang lưu...') : t('adminControl.confirmButton')}
                    </button>
                  </div>
                </>
              )}
            </section>
        )}

      </div>
    </div>

    {/* OTP Modal */}
    {showOtpModal && (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 bg-opacity-50">
        <div className="bg-white p-6 rounded-lg max-w-md w-full mx-4">
          <h3 className="text-xl font-bold mb-4">
            {selectedSession?.status === 'login' ? t('adminControl.logoutDevice') : t('adminControl.loginDevice')}
          </h3>
          <p className="mb-4 text-sm text-gray-600">
            {t('adminControl.device')} <span className="font-semibold">{selectedSession?.device_name}</span>
          </p>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">
              {t('adminControl.enterOtpConfirm')}
            </label>
            <input
              type="text"
              value={otpInput}
              onChange={(e) => setOtpInput(e.target.value)}
              placeholder={t('adminControl.enterOtp')}
              className="w-full border-2 border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-black"
              autoFocus
            />
          </div>
          <div className="flex gap-3">
            <button
              onClick={handleOtpSubmit}
              className="flex-1 bg-blue-500 text-white px-4 py-2 rounded font-bold hover:bg-gray-300"
            >
              {t('adminControl.confirm')}
            </button>
            <button
              onClick={handleCloseOtpModal}
              className="flex-1 border-2 border-black px-4 py-2 rounded font-bold hover:bg-gray-100"
            >
              {t('adminControl.cancel')}
            </button>
          </div>
        </div>
      </div>
    )}

    {/* Camera Modal */}
    {showCamera && (
      <div className="fixed inset-0 bg-black/75 flex items-center justify-center z-50">
        <div className="bg-white p-4 rounded-lg max-w-2xl w-full">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-xl font-bold">{getCameraTitle()}</h2>
            <button
              className="text-gray-700 hover:text-gray-900"
              onClick={closeCamera}
            >
              ✕
            </button>
          </div>
          {getCameraInstruction() && (
            <p className="text-sm text-gray-600 mb-3">{getCameraInstruction()}</p>
          )}
          <div className="relative">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-auto border border-gray-300 rounded"
            />
            {previewBlocked && (
              <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                <button
                  className="bg-white text-black px-3 py-2 rounded"
                  onClick={tryStartPreview}
                >
                  {t("camera.clickToPreview", "Nhấp để xem trước")}
                </button>
              </div>
            )}
          </div>
          <div className="mt-4 flex justify-center gap-2">
            <button
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
              onClick={capturePhoto}
            >
              {t("camera.capture", "Chụp ảnh")}
            </button>
            <button
              className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded"
              onClick={closeCamera}
            >
              {t("camera.cancel", "Hủy bỏ")}
            </button>
          </div>
        </div>
      </div>
    )}

    {/* BlinkID CCCD Scanner Modal */}
    {showIdScanner && (
      <div className="admin-id-scanner-modal fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-black/90 p-4">
        <button
          type="button"
          onClick={closeIdScanner}
          className="absolute right-4 top-4 z-10 rounded bg-white/10 p-2 text-white hover:bg-white/20"
          aria-label="Đóng quét CCCD"
        >
          <X size={28} />
        </button>
        <div className="mb-3 max-w-[900px] px-12 text-center text-white">
          <h2 className="text-2xl font-bold leading-tight">Quét CCCD hai mặt</h2>
          <p className="mt-1 text-base leading-snug text-gray-300">Đưa CCCD vào khung, giữ rõ nét, rồi lật mặt sau khi hệ thống yêu cầu.</p>
        </div>
        <div
          ref={idScannerContainerRef}
          className="admin-id-scanner-host flex w-full flex-col items-center"
        />
        {(scannerStarting || !isIdScannerReady) && !scannerError && (
          <div className="mt-4 flex items-center gap-3 text-sm text-white">
            <RefreshCw className="animate-spin" size={22} />
            Đang khởi động camera...
          </div>
        )}
        {scannerError && (
          <div className="mt-3 w-full max-w-[960px] border-2 border-red-500 bg-red-50 px-3 py-2 text-center text-sm font-bold text-red-700">
            {scannerError}
          </div>
        )}
      </div>
    )}
  </>
  );
}
