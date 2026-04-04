import React, { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Home as HomeIcon, Keyboard as KeyboardIcon, ChevronDown, ChevronUp } from "lucide-react";
import PageHeaderWithOutColorPicker from "../components/PageHeaderWithOutColorPicker";
import { useTranslation } from 'react-i18next';
import { getSessions, toggleSessionStatus } from "../services/authService";
import { createOrUpdateBusiness, getMyBusiness } from "../services/businessService";
import TwoLineUnitInput from "../components/atoms/TwoLineUnitInput";
import useBlinkIdScanner from "../components/MicrolinkIDScanner";
import Tesseract from "tesseract.js";
import useLocationSelection from "../hooks/useLocationSelection";

const MOCK_VERIFICATION = String(import.meta.env.VITE_MOCK_VERIFICATION || "false").toLowerCase() === "true";

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

  const videoRef = useRef(null);
  const [showCamera, setShowCamera] = useState(false);
  const [cameraStream, setCameraStream] = useState(null);
  const [hasIdCaptured, setHasIdCaptured] = useState(false);
  const [idPhotoDataUrl, setIdPhotoDataUrl] = useState(null);
  const [hasBusinessVideo, setHasBusinessVideo] = useState(false);
  const [businessVideoUrl, setBusinessVideoUrl] = useState(null);
  const [isVideoMode, setIsVideoMode] = useState(false);
  const mediaRecorderRef = useRef(null);
  const recordedChunksRef = useRef([]);
  const [isOcrRunning, setIsOcrRunning] = useState(false);
  const [ocrHasText, setOcrHasText] = useState(null);
  const [ocrError, setOcrError] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recordSeconds, setRecordSeconds] = useState(0);
  const recordTimerRef = useRef(null);

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
  const [previewBlocked, setPreviewBlocked] = useState(false);

  const mockIdCapture = () => {
      const mockDataUrl = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==";
      setIdPhotoDataUrl(mockDataUrl);
      setHasIdCaptured(true);
  };

  const mockVideoRecord = () => {
      setBusinessVideoUrl("blob-mock");
      setHasBusinessVideo(true);
      setOcrHasText(true);
      setIsOcrRunning(false);
      setOcrError(null);
  };

  const {scanId, toggle} = useBlinkIdScanner({
      onSuccess: (result) => {
          setHasIdCaptured(true);
          setIdPhotoDataUrl(result.faceImage);
          closeCamera();
      },
      onError: (error) => {
          console.error("BlinkID Scan Error:", error);
          alert(t("scanner.error", "Lỗi máy quét"));
          closeCamera();
      },
  });

  const openCamera = async (e, mode) => {
      if (e && e.preventDefault) e.preventDefault();
      try {
          const stream = await navigator.mediaDevices.getUserMedia({video: true});
          setCameraStream(stream);
          setShowCamera(true);
          setIsVideoMode(mode === "video");

          if (videoRef.current) {
              const video = videoRef.current;
              video.srcObject = stream;
              video.muted = true;
              try {
                  await video.play();
                  setPreviewBlocked(false);
              } catch (_) {
                  setPreviewBlocked(true);
              }
          }
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
      setIsVideoMode(false);
      if (
          mediaRecorderRef.current &&
          mediaRecorderRef.current.state !== "inactive"
      ) {
          try {
              mediaRecorderRef.current.stop();
          } catch (_) {}
      }
      recordedChunksRef.current = [];
      if (recordTimerRef.current) {
          clearInterval(recordTimerRef.current);
          recordTimerRef.current = null;
      }
      setIsRecording(false);
      setRecordSeconds(0);
  };

  const tryStartPreview = async () => {
      const video = videoRef.current;
      if (!video) return;
      try {
          await video.play();
          setPreviewBlocked(false);
      } catch (_) {
          setPreviewBlocked(true);
      }
  };

  const capturePhoto = () => {
      if (!videoRef.current) return;
      const video = videoRef.current;
      const canvas = document.createElement("canvas");
      const width = video.videoWidth || 640;
      const height = video.videoHeight || 480;
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      ctx.drawImage(video, 0, 0, width, height);
      const dataUrl = canvas.toDataURL("image/png");
      setIdPhotoDataUrl(dataUrl);
      setHasIdCaptured(true);
      closeCamera();
  };

  const startRecording = () => {
      if (!cameraStream) return;
      recordedChunksRef.current = [];
      const mediaRecorder = new MediaRecorder(cameraStream, {
          mimeType: "video/webm",
      });
      mediaRecorderRef.current = mediaRecorder;
      mediaRecorder.ondataavailable = (event) => {
          if (event.data && event.data.size > 0) {
              recordedChunksRef.current.push(event.data);
          }
      };
      mediaRecorder.onstop = () => {
          const blob = new Blob(recordedChunksRef.current, {type: "video/webm"});
          const url = URL.createObjectURL(blob);
          if (businessVideoUrl) {
              try {
                  URL.revokeObjectURL(businessVideoUrl);
              } catch (_) {}
          }
          setBusinessVideoUrl(url);
          setHasBusinessVideo(true);
          runOcrOnVideo(url);
      };
      mediaRecorder.start();
      setIsRecording(true);
      setRecordSeconds(0);
      if (recordTimerRef.current) clearInterval(recordTimerRef.current);
      recordTimerRef.current = setInterval(() => {
          setRecordSeconds((s) => s + 1);
      }, 1000);
  };

  const stopRecording = () => {
      if (
          mediaRecorderRef.current &&
          mediaRecorderRef.current.state !== "inactive"
      ) {
          mediaRecorderRef.current.stop();
      }
      if (recordTimerRef.current) {
          clearInterval(recordTimerRef.current);
          recordTimerRef.current = null;
      }
      setIsRecording(false);
      closeCamera();
  };

  const runOcrOnVideo = async (videoUrl) => {
      try {
          setIsOcrRunning(true);
          setOcrHasText(null);
          setOcrError(null);

          const tempVideo = document.createElement("video");
          tempVideo.src = videoUrl;
          tempVideo.crossOrigin = "anonymous";
          tempVideo.preload = "auto";

          await new Promise((resolve, reject) => {
              const onLoaded = () => resolve();
              const onError = () =>
                  reject(new Error("Cannot load recorded video for OCR"));
              tempVideo.addEventListener("loadedmetadata", onLoaded, {once: true});
              tempVideo.addEventListener("error", onError, {once: true});
          });

          const targetTime = Math.min(
              5,
              tempVideo.duration ? tempVideo.duration - 0.1 : 5
          );

          await new Promise((resolve) => {
              const onSeeked = () => resolve();
              tempVideo.currentTime = targetTime > 0 ? targetTime : 0;
              tempVideo.addEventListener("seeked", onSeeked, {once: true});
          });

          const canvas = document.createElement("canvas");
          const width = tempVideo.videoWidth || 640;
          const height = tempVideo.videoHeight || 480;
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext("2d");
          if (!ctx) throw new Error("Canvas context not available");
          ctx.drawImage(tempVideo, 0, 0, width, height);

          const dataUrl = canvas.toDataURL("image/png");
          const {data} = await Tesseract.recognize(dataUrl, "eng+vie");
          const text = data && data.text ? data.text.trim() : "";
          setOcrHasText(Boolean(text));
      } catch (err) {
          console.error("OCR error:", err);
          setOcrError(err.message || "OCR failed");
          setOcrHasText(null);
      } finally {
          setIsOcrRunning(false);
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

  // Fetch business data when both verifications are complete
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
        // Sync location selectors sequentially to ensure provinces list is loaded before setting province
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
      const payload = {
        business_fullname: businessForm.business_fullname,
        tax_code: businessForm.tax_code,
        headquarters_address: businessForm.headquarters_address,
        headquarters_address_province_code: hqLocation.selectedProvince || businessForm.headquarters_address_province_code,
        headquarters_address_nation_code: hqLocation.selectedCountry || businessForm.headquarters_address_nation_code,
        current_address: businessForm.current_address,
        current_address_province_code: currLocation.selectedProvince || businessForm.current_address_province_code,
        current_address_nation_code: currLocation.selectedCountry || businessForm.current_address_nation_code,
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

  // Fetch sessions on component mount
  useEffect(() => {
    fetchSessions();
  }, []);

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
        // Refresh sessions list
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

  // Filter sessions by status
  const loggedInDevices = sessions.filter(s => s.status === 'login');
  const loggedOutDevices = sessions.filter(s => s.status === 'logout');

  const handleChangeColor = (e) => {
    const newColor = e.target.value;
    setColor(newColor);
    localStorage.setItem("selectedColor", newColor);
  };

  return (
    <>
    <div className="flex justify-center items-center min-h-screen p-1">
      <div className="bg-transparent backdrop-blur-md p-0 rounded-lg shadow-lg w-full mx-auto">
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

        {/* OTP Modal moved to root (outside backdrop-blur) */}

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
            <button
              type="button"
              className={`border-2 border-black px-3 py-2 text-center text-lg font-extrabold uppercase leading-tight hover:bg-black hover:text-white ${hasIdCaptured ? 'bg-green-100' : ''}`}
              onClick={(e) => {
                  if (MOCK_VERIFICATION) {
                      e.preventDefault();
                      mockIdCapture();
                  } else {
                      toggle(e);
                  }
              }}
            >
              {t('adminControl.idVerification')}
              <br />
              {t('adminControl.forPersonalAccounts')}
              {hasIdCaptured && <div className="text-sm text-green-600 mt-1">{t("camera.captured", "Đã xác minh")}</div>}
            </button>
            <button
              type="button"
              className={`border-2 border-black px-3 py-2 text-center text-lg font-extrabold uppercase leading-tight hover:bg-black hover:text-white ${hasBusinessVideo ? 'bg-green-100' : ''}`}
              onClick={(e) => {
                  if (MOCK_VERIFICATION) {
                      e.preventDefault();
                      mockVideoRecord();
                  } else {
                      openCamera(e, "video");
                  }
              }}
            >
              {t('adminControl.businessRegistrationVerification')}
              <br />
              {t('adminControl.forBusinessAccounts')}
              {hasBusinessVideo && <div className="text-sm text-green-600 mt-1">{t("camera.videoRecorded", "Đã ghi hình")}</div>}
            </button>
          </div>
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

        {/* Camera Modal moved to root (outside backdrop-blur) */}

      </div>
    </div>

    {/* OTP Modal */}
    {showOtpModal && (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 bg-opacity-50">
        <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full mx-4">
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
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold">{t("camera.title", "Xác minh")}</h2>
                    <button
                        className="text-gray-700 hover:text-gray-900"
                        onClick={closeCamera}
                    >
                        ✕
                    </button>
                </div>
                <div className="relative">
                    <video
                        ref={videoRef}
                        autoPlay
                        playsInline
                        muted
                        className="w-full h-auto border border-gray-300 rounded"
                    />
                    {previewBlocked && (
                        <div
                            className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                            <button
                                className="bg-white text-black px-3 py-2 rounded shadow"
                                onClick={tryStartPreview}
                            >
                                {t("camera.clickToPreview", "Nhấp để xem trước")}
                            </button>
                        </div>
                    )}
                    {isVideoMode && isRecording && (
                        <div
                            className="absolute top-2 left-2 bg-red-600 text-white text-sm px-2 py-1 rounded">
                            {t("camera.recording", "Đang ghi hình")}{" "}
                            {String(Math.floor(recordSeconds / 60)).padStart(2, "0")}:
                            {String(recordSeconds % 60).padStart(2, "0")}
                        </div>
                    )}
                </div>
                <div className="mt-4 flex justify-center">
                    {!isVideoMode ? (
                        <>
                            <button
                                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded mr-2"
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
                        </>
                    ) : (
                        <>
                            <button
                                className={`px-4 py-2 rounded mr-2 text-white ${
                                    isRecording
                                        ? "bg-red-300 cursor-not-allowed"
                                        : "bg-red-500 hover:bg-red-600"
                                }`}
                                onClick={startRecording}
                                disabled={isRecording}
                            >
                                {t("camera.startRecording", "Bắt đầu ghi hình")}
                            </button>
                            {isRecording && (
                                <button
                                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
                                    onClick={stopRecording}
                                >
                                    {t("camera.stopRecording", "Dừng ghi hình")}
                                </button>
                            )}
                            {!isRecording && (
                                <button
                                    className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded"
                                    onClick={closeCamera}
                                >
                                    {t("camera.cancel", "Hủy bỏ")}
                                </button>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    )}
  </>
  );
}