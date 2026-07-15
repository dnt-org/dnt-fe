import React, { useState, useEffect } from "react";
import "../styles/Login.css";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch } from 'react-redux';
import { Eye, EyeOff, ArrowLeft, KeyRound, ShieldCheck, Lock, Smartphone } from "lucide-react";
import { verifyRecoveryString, resetPasswordWithToken, verifyRecoveryOtp, login } from "../services/authService";
import { loginAction } from "../context/action/authActions";
import { useTranslation } from 'react-i18next';
import PageHeaderWithOutColorPicker from '../components/PageHeaderWithOutColorPicker';
import useRecaptcha from '../hooks/useRecaptcha';

export default function ForgotPasswordPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const [color, setColor] = useState(localStorage.getItem("selectedColor"));

  // Step management: 'VERIFY', 'OTP', or 'RESET'
  const [step, setStep] = useState('VERIFY');

  // Form states
  const [bankAccountId, setBankAccountId] = useState(location.state?.bankAccountId || "");
  const [recoveryString, setRecoveryString] = useState("");
  const [resetToken, setResetToken] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showRecoveryString, setShowRecoveryString] = useState(false);

  // UI states
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isBlocked, setIsBlocked] = useState(false);
  const [tempBlockedUntil, setTempBlockedUntil] = useState(null); // Date or null — 10-minute lock after 5 wrong recovery attempts
  const [tempBlockRemainingSeconds, setTempBlockRemainingSeconds] = useState(0);
  const [otpSkipped, setOtpSkipped] = useState(false); // Track if OTP step was skipped
  const [newPasswordCrossError, setNewPasswordCrossError] = useState("");

  // Password validation
  const [passwordValidation, setPasswordValidation] = useState({
    minLength: false,
    hasUppercase: false,
    hasLowercase: false,
    hasNumber: false,
    hasSpecialChar: false,
    isValid: false
  });

  // Check if coming from login failure (5 attempts)
  const triggeredByLoginFailure = location.state?.triggeredByLoginFailure || false;
  // Check if coming from final chance security check (post-temp-block)
  const triggeredByFinalChance = location.state?.triggeredByFinalChance || false;

  // reCAPTCHA v2 Invisible — protects the recovery-string verify step
  const { getToken: getRecoveryToken, reset: resetRecoveryCaptcha } = useRecaptcha('recaptcha-forgot');
  // Separate widget for the auto-login call made right after a successful password reset
  const { getToken: getResetLoginToken, reset: resetResetLoginCaptcha } = useRecaptcha('recaptcha-forgot-reset');

  const handleChangeColor = (e) => {
    const newColor = e.target.value;
    setColor(newColor);
    localStorage.setItem("selectedColor", newColor);
  };

  useEffect(() => {
    document.getElementById("root").style.backgroundColor = color;
  }, [color]);

  // Tick the temp-block countdown every second; clear it once the 10 minutes are up
  // so the user gets their last chance to enter the recovery character again.
  useEffect(() => {
    if (!tempBlockedUntil) {
      setTempBlockRemainingSeconds(0);
      return;
    }
    const tick = () => {
      const seconds = Math.max(0, Math.round((tempBlockedUntil.getTime() - Date.now()) / 1000));
      setTempBlockRemainingSeconds(seconds);
      if (seconds <= 0) {
        setTempBlockedUntil(null);
        setErrorMessage("");
      }
    };
    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [tempBlockedUntil]);

  const formatCountdown = (totalSeconds) => {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  // Password validation function
  const validatePassword = (password) => {
    const minLength = password.length >= 8;
    const hasUppercase = /[A-Z]/.test(password);
    const hasLowercase = /[a-z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSpecialChar = /[~!@#$%^&*()_]/.test(password);
    const isValid = minLength && hasUppercase && hasLowercase && hasNumber && hasSpecialChar;

    return {
      minLength,
      hasUppercase,
      hasLowercase,
      hasNumber,
      hasSpecialChar,
      isValid
    };
  };

  // New password must differ from the recovery character and the OTP entered earlier in this flow
  const getNewPasswordCrossError = (password) => {
    if (!password) return "";
    if (recoveryString && password === recoveryString) {
      return t('forgotPassword.errors.passwordSameAsRecovery', 'Mật khẩu mới không được trùng với ký tự khôi phục tài khoản');
    }
    if (otp && password === otp) {
      return t('forgotPassword.errors.passwordSameAsOtp', 'Mật khẩu mới không được trùng với mã OTP');
    }
    return "";
  };

  // Handle password input change
  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setNewPassword(value);
    setPasswordValidation(validatePassword(value));
    setNewPasswordCrossError(getNewPasswordCrossError(value));
  };

  const handlePasswordBlur = () => {
    setNewPasswordCrossError(getNewPasswordCrossError(newPassword));
  };

  // Handle verify recovery string
  const handleVerifyRecoveryString = async () => {
    console.log(bankAccountId, recoveryString);
    if (tempBlockedUntil && tempBlockRemainingSeconds > 0) return;

    setErrorMessage("");
    setSuccessMessage("");

    if (isBlocked) {
      setErrorMessage(t('forgotPassword.errors.accountBlocked', 'Tài khoản đã bị khóa do nhập sai quá nhiều lần. Vui lòng liên hệ hỗ trợ.'));
      return;
    }

    if (!bankAccountId.trim()) {
      setErrorMessage(t('forgotPassword.errors.bankAccountRequired', 'Vui lòng nhập số tài khoản ngân hàng'));
      return;
    }

    if (!recoveryString.trim()) {
      setErrorMessage(t('forgotPassword.errors.recoveryStringRequired', 'Vui lòng nhập ký tự khôi phục tài khoản'));
      return;
    }

    setIsLoading(true);

    try {
      const recaptchaToken = getRecoveryToken();
      if (!recaptchaToken) {
        setIsLoading(false);
        setErrorMessage(t('auth.captchaRequired', 'Vui lòng hoàn thành xác thực reCAPTCHA'));
        return;
      }

      const response = await verifyRecoveryString(bankAccountId, recoveryString, recaptchaToken);
      console.log(response.data)
      if (response.data?.verificationResult === 'PASS' && response.data?.resetToken) {
        setResetToken(response.data.resetToken);

        // Check if OTP is required (is_in_final_chance = true means user was previously TEMP_BLOCKED)
        if (response.data?.requiresOtp) {
          // User is in final chance mode - requires OTP verification
          setOtpSkipped(false);
          setSuccessMessage(t('forgotPassword.otpSent', 'Xác thực thành công! Vui lòng nhập mã OTP được gửi đến bạn.'));
          setStep('OTP');
        } else {
          // User is NOT in final chance mode - skip OTP, go directly to reset password
          setOtpSkipped(true);
          setSuccessMessage(t('forgotPassword.verifySuccess', 'Xác thực thành công! Vui lòng đặt mật khẩu mới.'));
          setStep('RESET');
        }
        setErrorMessage("");
      } else {
        setErrorMessage(t('forgotPassword.errors.verifyFailed', 'Xác thực thất bại. Vui lòng thử lại.'));
      }
    } catch (error) {
      resetRecoveryCaptcha();
      console.error('Verify recovery string error:', error);
      console.log(error.response?.data)
      const errorData = error.response?.data;
      const errorCode = errorData?.error?.code || errorData?.code;

      // Handle TEMP_BLOCKED (5 wrong recovery-character attempts) — 10-minute lock, last chance after
      if (errorData?.tempBlockedUntil) {
        setTempBlockedUntil(new Date(errorData.tempBlockedUntil));
        setErrorMessage(t(
          'forgotPassword.blockedWarning',
          'Bạn đã đăng nhập sai quá 5 lần. Vui lòng xác thực để khôi phục tài khoản.'
        ));
        return;
      }

      // Handle permanent BLOCKED
      if (errorData?.blocked || errorData?.isBlocked || errorData?.error === 'PERMANENTLY_BLOCKED' || errorData?.verificationResult === 'FAIL') {
        if (errorData?.isBlocked || errorData?.error === 'PERMANENTLY_BLOCKED') {
          navigate('/account-blocked');
          return;
        }
        setIsBlocked(true);
        setErrorMessage(errorData.message || t('forgotPassword.errors.accountBlocked', 'Tài khoản đã bị khóa vĩnh viễn. Vui lòng liên hệ hỗ trợ.'));
        return;
      }

      switch (errorCode) {
        case 'INVALID_RECOVERY_STRING':
          setErrorMessage(t('forgotPassword.errors.invalidRecoveryString', 'Số tài khoản hoặc ký tự khôi phục tài khoản không chính xác'));
          break;
        case 'RECOVERY_NOT_CONFIGURED':
          setErrorMessage(t('forgotPassword.errors.recoveryNotConfigured', 'Tài khoản chưa thiết lập ký tự khôi phục tài khoản'));
          break;
        case 'ACCOUNT_TEMPORARILY_LOCKED':
        case 'TEMP_BLOCKED':
          setErrorMessage(t('forgotPassword.errors.accountLocked', 'Tài khoản tạm thời bị khóa. Vui lòng thử lại sau.'));
          break;
        case 'BLOCKED':
          setIsBlocked(true);
          setErrorMessage(t('forgotPassword.errors.accountBlocked', 'Tài khoản đã bị khóa vĩnh viễn. Vui lòng liên hệ hỗ trợ.'));
          break;
        case 'PERMANENTLY_BLOCKED':
          navigate('/account-blocked');
          break;
        default:
          setErrorMessage(t('forgotPassword.errors.verifyFailed', 'Xác thực thất bại. Vui lòng thử lại.'));
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Handle verify OTP
  const handleVerifyOtp = async () => {
    setErrorMessage("");
    setSuccessMessage("");

    if (!otp.trim()) {
      setErrorMessage(t('forgotPassword.errors.otpRequired', 'Vui lòng nhập mã OTP'));
      return;
    }

    setIsLoading(true);

    try {
      const response = await verifyRecoveryOtp(resetToken, otp);

      if (response.data?.verificationResult === 'PASS' && response.data?.resetToken) {
        // Update reset token with new one from OTP verification
        setResetToken(response.data.resetToken);
        setSuccessMessage(t('forgotPassword.verifySuccess', 'Xác thực OTP thành công! Vui lòng đặt mật khẩu mới.'));
        setStep('RESET');
        setErrorMessage("");
      } else {
        setErrorMessage(t('forgotPassword.errors.otpVerifyFailed', 'Xác thực OTP thất bại. Vui lòng thử lại.'));
      }
    } catch (error) {
      console.error('Verify OTP error:', error);

      const errorCode = error.response?.data?.error?.code || error.response?.data?.code;

      switch (errorCode) {
        case 'INVALID_OTP':
          setErrorMessage(t('forgotPassword.errors.invalidOtp', 'Mã OTP không chính xác'));
          break;
        case 'INVALID_RESET_TOKEN':
          setErrorMessage(t('forgotPassword.errors.invalidToken', 'Token không hợp lệ. Vui lòng thử lại từ đầu.'));
          // Go back to verify step
          setStep('VERIFY');
          setResetToken("");
          setOtp("");
          break;
        case 'RESET_TOKEN_EXPIRED':
          setErrorMessage(t('forgotPassword.errors.tokenExpired', 'Token đã hết hạn. Vui lòng xác thực lại.'));
          // Go back to verify step
          setStep('VERIFY');
          setResetToken("");
          setOtp("");
          break;
        case 'BLOCKED':
        case 'PERMANENTLY_BLOCKED':
          navigate('/account-blocked');
          break;
        default:
          setErrorMessage(t('forgotPassword.errors.otpVerifyFailed', 'Xác thực OTP thất bại. Vui lòng thử lại.'));
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Handle reset password
  const handleResetPassword = async () => {
    setErrorMessage("");
    setSuccessMessage("");

    if (!passwordValidation.isValid) {
      setErrorMessage(t('forgotPassword.errors.passwordPolicyFailed', 'Mật khẩu không đáp ứng yêu cầu bảo mật'));
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMessage(t('forgotPassword.errors.passwordMismatch', 'Mật khẩu xác nhận không khớp'));
      return;
    }

    const crossError = getNewPasswordCrossError(newPassword);
    if (crossError) {
      setNewPasswordCrossError(crossError);
      setErrorMessage(crossError);
      return;
    }

    // Captcha for the auto-login call below — checked up front so we don't change
    // the password and then strand the user on a captcha error.
    const loginRecaptchaToken = getResetLoginToken();
    if (!loginRecaptchaToken) {
      setErrorMessage(t('auth.captchaRequired', 'Vui lòng hoàn thành xác thực reCAPTCHA'));
      return;
    }

    setIsLoading(true);

    try {
      const response = await resetPasswordWithToken(resetToken, newPassword);

      if (response.data?.success) {
        // Auto-login with the new password instead of bouncing back to /login
        try {
          const loginResponse = await login(bankAccountId, newPassword, loginRecaptchaToken);
          const authToken = loginResponse.data?.token || loginResponse.data?.jwt;
          localStorage.setItem("authToken", authToken);
          localStorage.setItem("user", JSON.stringify(loginResponse.data?.user));
          dispatch(loginAction(loginResponse.data?.user));
          navigate('/');
        } catch (autoLoginError) {
          console.error('Auto-login after password reset failed:', autoLoginError);
          resetResetLoginCaptcha();
          // Password change itself succeeded — fall back to manual login instead of stranding the user
          navigate('/login', {
            state: {
              message: t('forgotPassword.redirectMessage', 'Mật khẩu đã được đổi thành công. Vui lòng đăng nhập.')
            }
          });
        }
      }
    } catch (error) {
      console.error('Reset password error:', error);

      const httpStatus = error.response?.status;
      // Handle different error response formats from backend
      const errorCode = error.response?.data?.error?.code || error.response?.data?.code || error.response?.data?.error;

      // Handle HTTP 409 - Password same as previous
      if (httpStatus === 409 || errorCode === 'PASSWORD_SAME_AS_PREVIOUS') {
        setErrorMessage(t('forgotPassword.errors.passwordSameAsPrevious', 'Mật khẩu mới phải khác mật khẩu cũ'));
        return;
      }

      switch (errorCode) {
        case 'INVALID_RESET_TOKEN':
          setErrorMessage(t('forgotPassword.errors.invalidToken', 'Token không hợp lệ hoặc đã được sử dụng'));
          // Go back to verify step
          setStep('VERIFY');
          setResetToken("");
          break;
        case 'RESET_TOKEN_EXPIRED':
          setErrorMessage(t('forgotPassword.errors.tokenExpired', 'Token đã hết hạn. Vui lòng xác thực lại.'));
          // Go back to verify step
          setStep('VERIFY');
          setResetToken("");
          break;
        case 'PASSWORD_POLICY_FAILED':
          setErrorMessage(t('forgotPassword.errors.passwordPolicyFailed', 'Mật khẩu không đáp ứng yêu cầu bảo mật'));
          break;
        default:
          setErrorMessage(error.response?.data?.error?.message || error.response?.data?.message || t('forgotPassword.errors.resetFailed', 'Đổi mật khẩu thất bại. Vui lòng thử lại.'));
      }
    } finally {
      setIsLoading(false);
    }
  };

  const isTempBlocked = !!tempBlockedUntil && tempBlockRemainingSeconds > 0;

  // Get step indicator state
  const getStepState = (stepName) => {
    const steps = ['VERIFY', 'OTP', 'RESET'];
    const currentIndex = steps.indexOf(step);
    const stepIndex = steps.indexOf(stepName);

    if (stepIndex < currentIndex) return 'completed';
    if (stepIndex === currentIndex) return 'active';
    return 'pending';
  };

  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="bg-transparent backdrop-blur-md p-6 rounded-lg w-full max-w-4xl mx-auto">
        <PageHeaderWithOutColorPicker
          color={color}
          onColorChange={handleChangeColor}
          titlePrefix=""
          title={
            step === 'VERIFY'
              ? t('forgotPassword.title', 'KHÔI PHỤC MẬT KHẨU')
              : step === 'OTP'
                ? t('forgotPassword.otpTitle', 'XÁC THỰC MẬT MÃ')
                : t('forgotPassword.resetTitle', 'ĐẶT MẬT KHẨU MỚI')
          }
          leftButton={
            <button
              className="text-gray-600 hover:text-gray-800"
              onClick={() => navigate('/login')}
            >
              <ArrowLeft size={28} />
            </button>
          }
        />

        <div className="mt-6">
          {/* Warning message for login failure trigger - hide when blocked */}
          {triggeredByLoginFailure && step === 'VERIFY' && !isBlocked && (
            <div className="bg-orange-50 border border-orange-200 text-orange-700 px-4 py-3 rounded mb-4 flex items-center gap-2">
              <ShieldCheck size={20} />
              <span>{t('forgotPassword.loginFailureWarning', 'Bạn đã đăng nhập sai quá 5 lần. Vui lòng xác thực để khôi phục tài khoản.')}</span>
            </div>
          )}

          {/* Message for final chance security check */}
          {triggeredByFinalChance && step === 'VERIFY' && !isBlocked && (
            <div className="bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded mb-4 flex items-center gap-2">
              <ShieldCheck size={20} />
              <span>{t('forgotPassword.recoveryRequiredMessage', 'Tài khoản của bạn đã được mở khóa. Vui lòng xác thực chuỗi khôi phục để tiếp tục.')}</span>
            </div>
          )}

          {/* Blocked account warning */}
          {isBlocked && (
            <div className="bg-red-50 text-red-700 px-4 py-3 rounded mb-4 flex items-center gap-2">
              <span>{t('forgotPassword.errors.accountBlocked', 'Tài khoản đã bị khóa vĩnh viễn. Vui lòng liên hệ hỗ trợ.')}</span>
            </div>
          )}

          {/* Step indicator - 3 steps (OTP step may be skipped) */}
          

          <div className="space-y-4">
            {/* STEP 1: Verify Recovery String */}
            {step === 'VERIFY' && (
              <>

                <div className="grid grid-cols-1 items-center gap-4">
                  <input
                    type="text"
                    className="border p-3 rounded w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    placeholder={t('forgotPassword.bankAccountPlaceholder', 'Số tài khoản ngân hàng (Bank Account ID)')}
                    value={bankAccountId}
                    onChange={(e) => setBankAccountId(e.target.value)}
                    disabled={isLoading || isBlocked || isTempBlocked}
                  />
                </div>

                <div className="relative">
                  <input
                    type={showRecoveryString ? "text" : "password"}
                    className="border p-3 rounded w-full pr-10 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    placeholder={t('forgotPassword.recoveryStringPlaceholder', 'ký tự khôi phục tài khoản')}
                    value={recoveryString}
                    onChange={(e) => setRecoveryString(e.target.value)}
                    disabled={isLoading || isBlocked || isTempBlocked}
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    onClick={() => setShowRecoveryString(!showRecoveryString)}
                    disabled={isLoading || isBlocked || isTempBlocked}
                  >
                    {showRecoveryString ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>

                {errorMessage && !isBlocked && (
                  <p className="text-red-500 text-sm text-center">{errorMessage}</p>
                )}

                <div className="text-center mt-6">
                  {/* reCAPTCHA v2 Checkbox — placed above the action button */}
                  <div className="flex justify-center my-2">
                    <div id="recaptcha-forgot"></div>
                  </div>
                  <button
                    className={`border-2 border-black font-bold px-6 py-3 rounded w-1/4 transition-all ${isLoading || isBlocked || isTempBlocked
                      ? 'opacity-50 cursor-not-allowed bg-gray-100'
                      : 'hover:bg-gray-100'
                      }`}
                    onClick={handleVerifyRecoveryString}
                    disabled={isLoading || isBlocked || isTempBlocked}
                  >
                    {isTempBlocked
                      ? `${t('forgotPassword.tempBlockedCountdown', 'Còn lại')} ${formatCountdown(tempBlockRemainingSeconds)}`
                      : isLoading
                        ? t('common.loading', 'Đang xử lý...')
                        : t('forgotPassword.verifyButton', 'XÁC THỰC')}
                  </button>
                </div>
              </>
            )}

            {/* STEP 2: OTP Verification */}
            {step === 'OTP' && (
              <>
                <div className="text-center mb-4">
                  <p className="text-gray-600 text-sm">
                    {t('forgotPassword.otpDescription', 'Vui lòng nhập mật mã của bạn.')}
                  </p>
                  <p className="text-gray-400 text-xs mt-1">
                    {t('forgotPassword.otpDescriptionHint', '(mật mã này do bạn tự đặt ở trang đăng ký, hệ thống không gửi tin nhắn)')}
                  </p>
                </div>

                <div className="grid grid-cols-1 items-center gap-4">
                  <input
                    type="text"
                    className="border p-3 rounded w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-center text-2xl tracking-widest"
                    value={otp}
                    placeholder={t('forgotPassword.otpPlaceholder', 'Nhập mật mã OTP')}
                    onChange={(e) => setOtp(e.target.value)}
                    disabled={isLoading}
                  />
                </div>

                {errorMessage && (
                  <p className="text-red-500 text-sm text-center">{errorMessage}</p>
                )}

                <div className="text-center mt-6">
                  <button
                    className={`border-2 border-black font-bold px-6 py-3 rounded w-1/4 transition-all ${isLoading || !otp.trim()
                      ? 'opacity-50 cursor-not-allowed bg-gray-100'
                      : 'hover:bg-gray-100'
                      }`}
                    onClick={handleVerifyOtp}
                    disabled={isLoading || !otp.trim()}
                  >
                    {isLoading
                      ? t('common.loading', 'Đang xử lý...')
                      : t('forgotPassword.verifyButton', 'XÁC NHẬN MẬT MÃ OTP')}
                  </button>
                </div>

                {/* Back to verify button */}
                {/* <div className="text-center mt-2">
                  <button
                    className="text-blue-600 hover:text-blue-800 text-sm underline"
                    onClick={() => {
                      setStep('VERIFY');
                      setResetToken("");
                      setOtp("");
                      setErrorMessage("");
                      setSuccessMessage("");
                    }}
                    disabled={isLoading}
                  >
                    {t('forgotPassword.backToVerify', '← Quay lại bước xác thực')}
                  </button>
                </div> */}
              </>
            )}

            {/* STEP 3: Reset Password */}
            {step === 'RESET' && (
              <>
                <div className="text-center mb-4">
                  <p className="text-gray-600 text-sm">
                    {t('forgotPassword.resetDescription', 'Nhập mật khẩu mới cho tài khoản của bạn.')}
                  </p>
                </div>

                {/* New Password */}
                <div className="grid grid-cols-1 items-center gap-4 relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    className={`border p-3 rounded w-full pr-10 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all ${newPassword && !passwordValidation.isValid ? 'border-red-500' :
                      newPassword && passwordValidation.isValid ? 'border-green-500' : 'border-gray-300'
                      }`}
                    placeholder={t('forgotPassword.newPasswordPlaceholder', 'Mật khẩu mới (New Password)')}
                    value={newPassword}
                    onChange={handlePasswordChange}
                    onBlur={handlePasswordBlur}
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>

                {newPasswordCrossError && (
                  <p className="text-red-500 text-sm">{newPasswordCrossError}</p>
                )}

                {/* Password requirements */}
                {newPassword && !passwordValidation.isValid && (
                  <div className="text-xs space-y-1 bg-gray-50 p-3 rounded">
                    <div className={`flex items-center ${passwordValidation.minLength ? 'text-green-600' : 'text-red-600'}`}>
                      <span className="mr-2">{passwordValidation.minLength ? '✓' : '✗'}</span>
                      {t('forgotPassword.passwordRequirements.minLength', 'Ít nhất 8 ký tự')}
                    </div>
                    <div className={`flex items-center ${passwordValidation.hasUppercase ? 'text-green-600' : 'text-red-600'}`}>
                      <span className="mr-2">{passwordValidation.hasUppercase ? '✓' : '✗'}</span>
                      {t('forgotPassword.passwordRequirements.hasUppercase', 'Ít nhất 1 chữ in hoa (A-Z)')}
                    </div>
                    <div className={`flex items-center ${passwordValidation.hasLowercase ? 'text-green-600' : 'text-red-600'}`}>
                      <span className="mr-2">{passwordValidation.hasLowercase ? '✓' : '✗'}</span>
                      {t('forgotPassword.passwordRequirements.hasLowercase', 'Ít nhất 1 chữ thường (a-z)')}
                    </div>
                    <div className={`flex items-center ${passwordValidation.hasNumber ? 'text-green-600' : 'text-red-600'}`}>
                      <span className="mr-2">{passwordValidation.hasNumber ? '✓' : '✗'}</span>
                      {t('forgotPassword.passwordRequirements.hasNumber', 'Ít nhất 1 số (0-9)')}
                    </div>
                    <div className={`flex items-center ${passwordValidation.hasSpecialChar ? 'text-green-600' : 'text-red-600'}`}>
                      <span className="mr-2">{passwordValidation.hasSpecialChar ? '✓' : '✗'}</span>
                      {t('forgotPassword.passwordRequirements.hasSpecialChar', 'Ít nhất 1 ký tự đặc biệt (!@#$%^&*(),.?":{}|<>)')}
                    </div>
                  </div>
                )}

                {/* Confirm Password */}
                <div className="grid grid-cols-1 items-center gap-4 relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    className={`border p-3 rounded w-full pr-10 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all ${confirmPassword && newPassword !== confirmPassword ? 'border-red-500' :
                      confirmPassword && newPassword === confirmPassword && passwordValidation.isValid ? 'border-green-500' : 'border-gray-300'
                      }`}
                    placeholder={t('forgotPassword.confirmPasswordPlaceholder', 'Xác nhận mật khẩu (Confirm Password)')}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>

                {/* Confirm password status */}
                {confirmPassword && (
                  <div className={`text-xs ${newPassword === confirmPassword ? 'text-green-600' : 'text-red-600'
                    }`}>
                    <span className="mr-2">{newPassword === confirmPassword ? '✓' : '✗'}</span>
                    {newPassword === confirmPassword
                      ? t('forgotPassword.passwordMatch', 'Mật khẩu khớp')
                      : t('forgotPassword.passwordMismatch', 'Mật khẩu không khớp')
                    }
                  </div>
                )}

                {errorMessage && (
                  <p className="text-red-500 text-sm text-center">{errorMessage}</p>
                )}

                <div className="text-center mt-6">
                  {/* reCAPTCHA for the auto-login call right after a successful reset — above the button */}
                  <div className="flex justify-center my-2">
                    <div id="recaptcha-forgot-reset"></div>
                  </div>
                  <button
                    className={`border-2 border-black font-bold px-6 py-3 rounded w-1/4 transition-all ${isLoading || !passwordValidation.isValid || newPassword !== confirmPassword || newPasswordCrossError
                      ? 'opacity-50 cursor-not-allowed bg-gray-100'
                      : 'hover:bg-gray-100'
                      }`}
                    onClick={handleResetPassword}
                    disabled={isLoading || !passwordValidation.isValid || newPassword !== confirmPassword || !!newPasswordCrossError}
                  >
                    {isLoading
                      ? t('common.loading', 'Đang xử lý...')
                      : t('forgotPassword.resetButton', 'ĐỔI MẬT KHẨU')}
                  </button>
                </div>

                
              </>
            )}

            {/* Success Message
            {successMessage && (
              <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded text-center">
                {successMessage}
              </div>
            )} */}
          </div>
        </div>
      </div>
    </div>
  );
}
