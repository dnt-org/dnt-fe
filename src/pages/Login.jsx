
import { useDispatch, useSelector } from 'react-redux';
import React, { useState, useEffect } from "react";
import "../styles/Login.css";
import { useNavigate, useLocation } from "react-router-dom";
import { login, recoverLogin } from "../services/authService";
import { loginAction, changePasswordAction } from '../context/action/authActions';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import { generateQrSession, checkQrStatus, verifyQrSession } from "../services/authService";
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
  const [qrSessionId, setQrSessionId] = useState(null);
  const [isShowRecover, setIsShowRecover] = useState(false);
  const [recaptchaReady, setRecaptchaReady] = useState(false);
  const [step, setStep] = useState('LOGIN'); // LOGIN, RECOVERY, OTP
  const [context, setContext] = useState(null); // wrong_password, post_login
  const [otp, setOtp] = useState("");

  const [recoveryCharacter, setRecoveryCharacter] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

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

  // Render reCAPTCHA widget khi component mount
  useEffect(() => {
    const siteKey = import.meta.env.VITE_RECAPTCHA_SITE_KEY;
    
    if (!siteKey) {
      console.error('reCAPTCHA site key is missing. Please set VITE_RECAPTCHA_SITE_KEY in .env file.');
      return;
    }

    const renderRecaptcha = () => {
      const container = document.getElementById('recaptcha-container');
      if (container && window.grecaptcha && window.grecaptcha.render) {
        // Clear any existing content
        if (!container.hasChildNodes()) {
          try {
            window.grecaptcha.render('recaptcha-container', {
              sitekey: siteKey,
              callback: () => setRecaptchaReady(true),
              'expired-callback': () => setRecaptchaReady(false)
            });
          } catch (error) {
            console.log('reCAPTCHA render error:', error.message);
          }
        }
      }
    };

    // Polling để đợi grecaptcha load
    const checkInterval = setInterval(() => {
      if (window.grecaptcha && window.grecaptcha.render) {
        clearInterval(checkInterval);
        renderRecaptcha();
      }
    }, 100);

    // Cleanup
    return () => clearInterval(checkInterval);
  }, []);

  // Check for sessionId in query params and verify QR login
  useEffect(() => {
    const checkSessionAndVerify = async () => {
      const searchParams = new URLSearchParams(location.search);
      const sessionId = searchParams.get('sessionId');

      if (sessionId) {
        const token = localStorage.getItem("authToken");
        if (token) {
          try {
            await verifyQrSession(sessionId);
            // After successful verification, we can optionally clear the query param
            // or show a success message. For now, we'll just log it.
            console.log("QR Session verified successfully");
            // Navigate to home or remove query param to prevent re-verification
            navigate('/', { replace: true });
          } catch (error) {
            console.error("QR Verification failed:", error);
            // Optionally show error to user
          }
        } else {
          // If no token, just show normal login screen (which is this page)
          // We might want to remove the sessionId from URL to avoid confusion?
          // For now, leaving it as per requirement "if authtoken not available, show screen login nomal"
        }
      }
    };

    checkSessionAndVerify();
  }, [location.search, navigate]);

  const handleLogin = async () => {
    try {
      // Lấy token từ reCAPTCHA widget
      const recaptchaToken = window.grecaptcha?.getResponse();
      
      if (!recaptchaToken) {
        alert(t('auth.captchaRequired', 'Vui lòng hoàn thành xác thực reCAPTCHA'));
        return;
      }

      const response = await login(cccd, password, recaptchaToken);
      console.log(response);

      // Reset reCAPTCHA sau khi gửi request
      window.grecaptcha?.reset();
      setRecaptchaReady(false);
      if (response.data?.blocked) {
        alert(response.data.message || t('auth.userBlocked', 'Tài khoản đã bị khóa. Vui lòng liên hệ hỗ trợ.'));
        return;
      }

      if (response.data?.require_recovery_character) {
        setStep('RECOVERY');
        setContext(response.data.context);
        return;
      }

      if (response.status == 200) {
        if (response.data?.error?.status === 401) {
           // Legacy error handling or unexpected 200 with error
           alert(t('auth.loginError', 'THÔNG TIN NHẬP CHƯA CHÍNH XÁC, VUI LÒNG NHẬP LẠI'));
           return;
        }

        if (response.data?.token) {
           // Standard login success (if applicable)
           localStorage.setItem("authToken", response.data.token);
           localStorage.setItem("user", JSON.stringify(response.data.user));
           dispatch(loginAction(response.data.user));
           navigate("/");
        } else if (response.data?.require_recovery_character) {
             // Redundant check but safe
             setStep('RECOVERY');
             setContext(response.data.context);
        } else {
            // Unexpected success without token or flow instructions
             alert(t('auth.loginError', 'THÔNG TIN NHẬP CHƯA CHÍNH XÁC, VUI LÒNG NHẬP LẠI'));
        }
      } 
    } catch (error) {
      // Reset reCAPTCHA khi có lỗi
      window.grecaptcha?.reset();
      setRecaptchaReady(false);
      setErrorMessage(t('auth.invalidCredentials', 'Thông tin đăng nhập không chính xác!'));
    }
  };

  const handleOpenQrModal = async () => {
    setIsQrModalOpen(true);
    setIsQrLoading(true);
    setQrError("");
    setQrDataUrl(null);
    setQrSessionId(null);
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
      const sessionId = response.data?.sessionId;

      if (qrCode) {
        setQrDataUrl(qrCode);
        if (sessionId) {
          setQrSessionId(sessionId);
        }
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
    setQrSessionId(null);
  };

  // Poll for QR login status
  useEffect(() => {
    let pollInterval;
    let startTime = Date.now();

    if (isQrModalOpen && qrSessionId && !isQrLoading) {
      pollInterval = setInterval(async () => {
        // Check timeout (60 seconds)
        if (Date.now() - startTime > 60000) {
          clearInterval(pollInterval);
          setQrError(t('auth.qrTimeout', 'Mã QR đã hết hạn. Vui lòng thử lại.'));
          return;
        }

        try {
          const response = await checkQrStatus(qrSessionId);
          if (response?.status === 200 && response.data?.token) {
            // Login success
            clearInterval(pollInterval);
            handleCloseQrModal();

            localStorage.setItem("authToken", response.data.token);
            localStorage.setItem("user", JSON.stringify(response.data.user));
            dispatch(loginAction(response.data.user));
            navigate("/");
          }
        } catch (error) {
          console.error("Polling error:", error);
        }
      }, 2000); // Poll every 2 seconds
    }

    return () => {
      if (pollInterval) clearInterval(pollInterval);
    };
  }, [isQrModalOpen, qrSessionId, isQrLoading, dispatch, navigate, t]);

  const handleRecoverLogin = async () => {
    if (!recoveryCharacter) {
      alert(t('auth.enterRecoveryChar', 'Vui lòng nhập ký tự khôi phục'));
      return;
    }

    try {
      const response = await recoverLogin(cccd, recoveryCharacter);
      const { data } = response || {};

      if (data?.blocked) {
        alert(data.message || t('auth.userBlocked', 'Tài khoản đã bị khóa. Vui lòng liên hệ hỗ trợ.'));
        return;
      }

      if (data?.require_change_password) {
        dispatch(changePasswordAction({ cccd }));
        navigate('/change-password', { state: { cccd, context: 'recovery_flow' } });
        return;
      }

      if (data?.require_otp) {
        setStep('OTP');
        return;
      }

      if (data?.success === false) {
         alert(data.message || t('auth.recoverError', 'Ký tự khôi phục không chính xác'));
      }

    } catch (error) {
      console.error('Recover login error:', error);
      const serverMessage = error?.response?.data?.message || t('auth.recoverError', 'Ký tự khôi phục không chính xác');
      alert(serverMessage);
    }
  };

  const handleVerifyOtp = async () => {
      if (!otp) {
          alert("Vui lòng nhập mã OTP");
          return;
      }
      try {
          // Import verifyOtp from services if not already imported, or use axios directly here if needed quickly
          // Assuming I added verifyOtp to authService in the previous step
          const { verifyOtp } = await import("../services/authService");
          const response = await verifyOtp(cccd, otp);
          const { data } = response || {};

          if (data?.blocked) {
              alert(data.message || t('auth.userBlocked', 'Tài khoản đã bị khóa. Vui lòng liên hệ hỗ trợ.'));
              return;
          }

          if (data?.require_change_password) {
              dispatch(changePasswordAction({ cccd }));
              navigate('/change-password', { state: { cccd, context: 'otp_flow' } });
              return;
          }
          
           if (data?.success === false) {
             alert(data.message || "OTP không chính xác");
           }

      } catch (error) {
          console.error("OTP verification error:", error);
          const serverMessage = error?.response?.data?.message || "OTP verification failed";
          alert(serverMessage);
      }
  }



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
            {/* Google reCAPTCHA Widget */}
            <div className="flex justify-center my-4">
              <div id="recaptcha-container"></div>
            </div>

            {step === 'LOGIN' && !isShowRecover && (
              <div className="text-center mt-4">
                <button
                  className={`border-2 border-black font-bold px-1 py-2 rounded flex-1`}
                  onClick={handleLogin}

                >
                  {t('auth.login', 'ĐĂNG NHẬP')} <br />
                </button>
              </div>
            )}
            
            {/* Show Recovery Input if explicitly shown OR if step is RECOVERY */}
            {(isShowRecover || step === 'RECOVERY') && (
              <div className="text-center mt-4 flex justify-center items-center gap-4">
                <div className="flex-1/2">
                  <input
                    type="text"
                    className='border p-2 rounded w-full'
                    placeholder={t('auth.enter', 'NHẬP KÝ TỰ KHÔI PHỤC TÀI KHOẢN ĐỂ MỞ KHOÁ')}
                    value={recoveryCharacter}
                    onChange={(e) => setRecoveryCharacter(e.target.value)}
                  />
                </div>
                <button
                  className={`border-2 border-black font-bold px-1 py-2 rounded flex-1`}
                  onClick={handleRecoverLogin}

                >
                  {t('common.confirm', 'MỞ KHOÁ TÀI KHOẢN')} <br />
                </button>
              </div>
            )}

            {step === 'OTP' && (
              <div className="text-center mt-4 flex justify-center items-center gap-4">
                <div className="flex-1/2">
                  <input
                    type="text"
                    className='border p-2 rounded w-full'
                    placeholder="Nhập mã OTP (Check your registered channel)"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                  />
                </div>
                <button
                  className={`border-2 border-black font-bold px-1 py-2 rounded flex-1`}
                  onClick={handleVerifyOtp}

                >
                  {t('common.confirm', 'XÁC NHẬN OTP')} <br />
                </button>
              </div>
            )}

            {errorMessage && (
              <h2 className="text-xl text-center text-red-500">
                {errorMessage} <br />

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
        isAuthenticated={true}
      />
    </div>
  );
}