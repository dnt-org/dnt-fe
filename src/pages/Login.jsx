
import { useDispatch, useSelector } from 'react-redux';
import React, { useState, useEffect } from "react";
import "../styles/Login.css";
import { useNavigate } from "react-router-dom";
import { login } from "../services/authService";
import { loginAction, changePasswordAction } from '../context/action/authActions';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import { generateQrSession } from "../services/authService";
import QRModalComponent from '../components/QRModalComponent';
import PageHeaderWithOutColorPicker from '../components/PageHeaderWithOutColorPicker';


export default function LoginPage() {
  const { t } = useTranslation();
  const [color, setColor] = useState(localStorage.getItem("selectedColor"));
  const [cccd, setCccd] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isQrModalOpen, setIsQrModalOpen] = useState(false);
  const [isQrLoading, setIsQrLoading] = useState(false);
  const [qrError, setQrError] = useState("");
  const [qrDataUrl, setQrDataUrl] = useState(null);
  const [isShowRecover, setIsShowRecover] = useState(true);
  const navigate = useNavigate();

  const dispatch = useDispatch();
  const auth = useSelector(state => state.auth);

  const handleChangeColor = (e) => {
    const newColor = e.target.value;
    setColor(newColor);
    localStorage.setItem("selectedColor", newColor);
  };

  useEffect(() => {
    document.getElementById("root").style.backgroundColor = color;
  }, [color]);

  const handleLogin = async () => {
    try {
      const response = await login(cccd, password);
      console.log(response);


      if (response.status == 200) {
        if (!response.data?.user?.confirmed) {
          dispatch(changePasswordAction(response.data?.user))
          navigate("/change-password");
        } else {
          localStorage.setItem("authToken", response.data.token);
          // Store complete user data in localStorage for easy access
          localStorage.setItem("user", JSON.stringify(response.data.user));
          dispatch(loginAction(response.data?.user))
          console.log(auth);
          navigate("/"); // Chuyển hướng về trang chủ
        }

      } else {
        alert(t('auth.loginError', 'THÔNG TIN NHẬP CHƯA CHÍNH XÁC, VUI LÒNG NHẬP LẠI'));
      }
    } catch (error) {
      setErrorMessage(t('auth.invalidCredentials', 'Thông tin đăng nhập không chính xác!'));
    }
  };

  const handleOpenQrModal = async () => {
    setIsQrModalOpen(true);
    setIsQrLoading(true);
    setQrError("");
    setQrDataUrl(null);
    try {
      const deviceInfo = navigator.userAgent || 'Unknown Device';
      let ipAddress = null;
      try {
        const ipRes = await axios.get('https://api.ipify.org?format=json');
        ipAddress = ipRes.data?.ip || null;
      } catch (e) {
        ipAddress = null;
      }
      const response = await generateQrSession(deviceInfo, ipAddress);
      const qrCode = response.data?.qrCode;
      if (qrCode) {
        setQrDataUrl(qrCode);
      } else {
        setQrError(t('auth.qrError', 'Không lấy được mã QR, vui lòng thử lại'));
      }
    } catch (error) {
      setQrError(error.message || t('auth.qrError', 'Không lấy được mã QR, vui lòng thử lại'));
    } finally {
      setIsQrLoading(false);
    }
  };

  const handleCloseQrModal = () => {
    setIsQrModalOpen(false);
    setQrDataUrl(null);
    setQrError("");
    setIsQrLoading(false);
  };

  const handleScanResult = (result) => {
    console.log('QR Scan Result:', result);
    alert(`QR Code scanned: ${result}`);
    handleCloseQrModal();
  };

  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="bg-transparent backdrop-blur-md p-6 rounded-lg shadow-lg w-full max-w-4xl mx-auto">
        <PageHeaderWithOutColorPicker
          color={color}
          onColorChange={handleChangeColor}
          titlePrefix="2"
          title={t('auth.loginTitle', 'ĐĂNG NHẬP')}
        />

        {/* LOGIN */}
        <div className="mt-6">
          {/* MÃ QR Row */}
          <div className="grid grid-cols-8">
            <div className="col-span-7"></div>
            <div className="col-span-1 p-2 font-bold text-sm border text-center rounded-sm cursor-pointer hover:bg-gray-100" onClick={handleOpenQrModal}>
              QR
            </div>
          </div>
          <div className="space-y-4 mt-4">
            <div className="grid grid-cols-1 items-center gap-4">
              <input
                type="text"
                className="border p-2 rounded w-full"
                placeholder={t('auth.idPlaceholder', 'TK BANK (ID)')}
                value={cccd}
                onChange={(e) => setCccd(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-1 items-center gap-4">
              <input
                type="text"
                className="border p-2 rounded w-full"
                placeholder={t('auth.password', 'MẬT KHẨU (Password)')}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div className="grid grid-cols-1 items-center gap-4">
              <div className="flex gap-4 w-full">
                <input
                  type="text"
                  className="border p-2 rounded w-full"
                  placeholder={t('auth.captchaPlaceholder', 'NHẬP MÃ CAPCHA (Input CAPCHA code)')}
                />
                <img
                  src="https://www.tnc.com.vn/uploads/File/Image/c1_2.jpg"
                  className="w-60"
                  alt=""
                />
              </div>
            </div>

            {!isShowRecover && (
              <div className="text-center mt-4">
                <button
                  className={`border-2 border-black font-bold px-1 py-2 rounded flex-1`}
                  onClick={handleLogin}

                >
                  {t('auth.login', 'ĐĂNG NHẬP')} <br />
                </button>
              </div>
            )}
            {isShowRecover && (
              <div className="text-center mt-4 flex justify-center items-center gap-4">
                <div className="flex-1/2">
                <input type="text" className='border p-2 rounded w-full' placeholder={t('auth.enter', 'NHẬP KÝ TỰ KHÔI PHỤC TÀI KHOẢN ĐỂ MỞ KHOÁ')} />
                </div>
                <button
                  className={`border-2 border-black font-bold px-1 py-2 rounded flex-1`}
                  onClick={handleLogin}

                >
                  {t('common.confirm', 'MỞ KHOÁ TÀI KHOẢN')} <br />
                </button>
              </div>
            )}

            {errorMessage && (
              <h2 className="text-xl text-center text-red-500">
                {t('auth.loginError', 'THÔNG TIN NHẬP CHƯA CHÍNH XÁC, VUI LÒNG NHẬP LẠI')} <br />

              </h2>
            )}
          </div>
        </div>
      </div>

      {/* QR Modal */}
      <QRModalComponent
        isOpen={isQrModalOpen}
        onClose={handleCloseQrModal}
        isLoading={isQrLoading}
        error={qrError}
        qrDataUrl={qrDataUrl}
        onScanResult={handleScanResult}
      />
    </div>
  );
}