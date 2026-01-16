import React, { useState, useEffect } from "react";
import "../styles/Login.css";
import { useNavigate, useLocation } from "react-router-dom";
import { Eye, EyeOff, ArrowLeft, KeyRound, ShieldCheck, Lock } from "lucide-react";
import { verifyRecoveryString, resetPasswordWithToken } from "../services/authService";
import { useTranslation } from 'react-i18next';
import PageHeaderWithOutColorPicker from '../components/PageHeaderWithOutColorPicker';

export default function ForgotPasswordPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  
  const [color, setColor] = useState(localStorage.getItem("selectedColor"));
  
  // Step management: 'VERIFY' or 'RESET'
  const [step, setStep] = useState('VERIFY');
  
  // Form states
  const [bankAccountId, setBankAccountId] = useState(location.state?.bankAccountId || "");
  const [recoveryString, setRecoveryString] = useState("");
  const [resetToken, setResetToken] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  // UI states
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  
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

  const handleChangeColor = (e) => {
    const newColor = e.target.value;
    setColor(newColor);
    localStorage.setItem("selectedColor", newColor);
  };

  useEffect(() => {
    document.getElementById("root").style.backgroundColor = color;
  }, [color]);

  // Password validation function
  const validatePassword = (password) => {
    const minLength = password.length >= 8;
    const hasUppercase = /[A-Z]/.test(password);
    const hasLowercase = /[a-z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
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

  // Handle password input change
  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setNewPassword(value);
    setPasswordValidation(validatePassword(value));
  };

  // Handle verify recovery string
  const handleVerifyRecoveryString = async () => {
    setErrorMessage("");
    setSuccessMessage("");

    if (!bankAccountId.trim()) {
      setErrorMessage(t('forgotPassword.errors.bankAccountRequired', 'Vui lòng nhập số tài khoản ngân hàng'));
      return;
    }

    if (!recoveryString.trim()) {
      setErrorMessage(t('forgotPassword.errors.recoveryStringRequired', 'Vui lòng nhập chuỗi khôi phục'));
      return;
    }

    setIsLoading(true);

    try {
      const response = await verifyRecoveryString(bankAccountId, recoveryString);
      
      if (response.data?.verificationResult === 'PASS' && response.data?.resetToken) {
        setResetToken(response.data.resetToken);
        setSuccessMessage(t('forgotPassword.verifySuccess', 'Xác thực thành công! Vui lòng đặt mật khẩu mới.'));
        setStep('RESET');
        setErrorMessage("");
      } else {
        setErrorMessage(t('forgotPassword.errors.verifyFailed', 'Xác thực thất bại. Vui lòng thử lại.'));
      }
    } catch (error) {
      console.error('Verify recovery string error:', error);
      
      const errorCode = error.response?.data?.error?.code || error.response?.data?.code;
      const httpStatus = error.response?.status || error.response?.data?.error?.status;
      
      switch (errorCode) {
        case 'INVALID_RECOVERY_STRING':
          setErrorMessage(t('forgotPassword.errors.invalidRecoveryString', 'Số tài khoản hoặc chuỗi khôi phục không chính xác'));
          break;
        case 'RECOVERY_NOT_CONFIGURED':
          setErrorMessage(t('forgotPassword.errors.recoveryNotConfigured', 'Tài khoản chưa thiết lập chuỗi khôi phục'));
          break;
        case 'ACCOUNT_TEMPORARILY_LOCKED':
          setErrorMessage(t('forgotPassword.errors.accountLocked', 'Tài khoản tạm thời bị khóa do nhiều lần thử thất bại. Vui lòng thử lại sau 30 phút.'));
          break;
        default:
          // If HTTP status is 400, show invalid recovery string error (most common case)
          if (httpStatus === 400) {
            setErrorMessage(t('forgotPassword.errors.invalidRecoveryString', 'Số tài khoản hoặc chuỗi khôi phục không chính xác'));
          } else {
            setErrorMessage(t('forgotPassword.errors.verifyFailed', 'Xác thực thất bại. Vui lòng thử lại.'));
          }
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

    setIsLoading(true);

    try {
      const response = await resetPasswordWithToken(resetToken, newPassword);
      
      if (response.data?.success) {
        setSuccessMessage(t('forgotPassword.resetSuccess', 'Đổi mật khẩu thành công! Đang chuyển đến trang đăng nhập...'));
        
        // Clear login failure attempts counter
        localStorage.removeItem('loginFailedAttempts');
        
        // Redirect to login after 2 seconds
        setTimeout(() => {
          navigate('/login', { 
            state: { 
              message: t('forgotPassword.redirectMessage', 'Mật khẩu đã được đổi thành công. Vui lòng đăng nhập.') 
            } 
          });
        }, 2000);
      }
    } catch (error) {
      console.error('Reset password error:', error);
      
      const errorCode = error.response?.data?.error?.code || error.response?.data?.code;
      
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
        case 'PASSWORD_SAME_AS_PREVIOUS':
          setErrorMessage(t('forgotPassword.errors.passwordSameAsPrevious', 'Mật khẩu mới phải khác mật khẩu cũ'));
          break;
        default:
          setErrorMessage(error.response?.data?.error?.message || error.response?.data?.message || t('forgotPassword.errors.resetFailed', 'Đổi mật khẩu thất bại. Vui lòng thử lại.'));
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="bg-transparent backdrop-blur-md p-6 rounded-lg shadow-lg w-full max-w-4xl mx-auto">
        <PageHeaderWithOutColorPicker
          color={color}
          onColorChange={handleChangeColor}
          titlePrefix=""
          title={step === 'VERIFY' 
            ? t('forgotPassword.title', 'KHÔI PHỤC MẬT KHẨU') 
            : t('forgotPassword.resetTitle', 'ĐẶT MẬT KHẨU MỚI')}
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
          {/* Warning message for login failure trigger */}
          {triggeredByLoginFailure && step === 'VERIFY' && (
            <div className="bg-orange-50 border border-orange-200 text-orange-700 px-4 py-3 rounded mb-4 flex items-center gap-2">
              <ShieldCheck size={20} />
              <span>{t('forgotPassword.loginFailureWarning', 'Bạn đã đăng nhập sai quá 5 lần. Vui lòng xác thực để khôi phục tài khoản.')}</span>
            </div>
          )}

          {/* Step indicator */}
          <div className="flex items-center justify-center mb-6">
            <div className={`flex items-center justify-center w-10 h-10 rounded-full ${step === 'VERIFY' ? 'bg-blue-500 text-white' : 'bg-green-500 text-white'}`}>
              <KeyRound size={20} />
            </div>
            <div className={`w-20 h-1 ${step === 'RESET' ? 'bg-green-500' : 'bg-gray-300'}`}></div>
            <div className={`flex items-center justify-center w-10 h-10 rounded-full ${step === 'RESET' ? 'bg-blue-500 text-white' : 'bg-gray-300 text-gray-500'}`}>
              <Lock size={20} />
            </div>
          </div>

          <div className="space-y-4">
            {/* STEP 1: Verify Recovery String */}
            {step === 'VERIFY' && (
              <>
                <div className="text-center mb-4">
                  <p className="text-gray-600 text-sm">
                    {t('forgotPassword.verifyDescription', 'Nhập số tài khoản ngân hàng và chuỗi khôi phục để xác thực tài khoản của bạn.')}
                  </p>
                </div>

                <div className="grid grid-cols-1 items-center gap-4">
                  <input
                    type="text"
                    className="border p-3 rounded w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    placeholder={t('forgotPassword.bankAccountPlaceholder', 'Số tài khoản ngân hàng (Bank Account ID)')}
                    value={bankAccountId}
                    onChange={(e) => setBankAccountId(e.target.value)}
                    disabled={isLoading}
                  />
                </div>

                <div className="grid grid-cols-1 items-center gap-4">
                  <input
                    type="text"
                    className="border p-3 rounded w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    placeholder={t('forgotPassword.recoveryStringPlaceholder', 'Chuỗi khôi phục (Recovery String)')}
                    value={recoveryString}
                    onChange={(e) => setRecoveryString(e.target.value)}
                    disabled={isLoading}
                  />
                </div>

                <div className="text-center mt-6">
                  <button
                    className={`border-2 border-black font-bold px-6 py-3 rounded w-full transition-all ${
                      isLoading 
                        ? 'opacity-50 cursor-not-allowed bg-gray-100' 
                        : 'hover:bg-gray-100'
                    }`}
                    onClick={handleVerifyRecoveryString}
                    disabled={isLoading}
                  >
                    {isLoading 
                      ? t('common.loading', 'Đang xử lý...') 
                      : t('forgotPassword.verifyButton', 'XÁC THỰC')}
                  </button>
                </div>
              </>
            )}

            {/* STEP 2: Reset Password */}
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
                    className={`border p-3 rounded w-full pr-10 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all ${
                      newPassword && !passwordValidation.isValid ? 'border-red-500' :
                      newPassword && passwordValidation.isValid ? 'border-green-500' : 'border-gray-300'
                    }`}
                    placeholder={t('forgotPassword.newPasswordPlaceholder', 'Mật khẩu mới (New Password)')}
                    value={newPassword}
                    onChange={handlePasswordChange}
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

                {/* Password requirements */}
                {newPassword && (
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
                    className={`border p-3 rounded w-full pr-10 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all ${
                      confirmPassword && newPassword !== confirmPassword ? 'border-red-500' :
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
                  <div className={`text-xs ${
                    newPassword === confirmPassword ? 'text-green-600' : 'text-red-600'
                  }`}>
                    <span className="mr-2">{newPassword === confirmPassword ? '✓' : '✗'}</span>
                    {newPassword === confirmPassword
                      ? t('forgotPassword.passwordMatch', 'Mật khẩu khớp')
                      : t('forgotPassword.passwordMismatch', 'Mật khẩu không khớp')
                    }
                  </div>
                )}

                <div className="text-center mt-6">
                  <button
                    className={`border-2 border-black font-bold px-6 py-3 rounded w-full transition-all ${
                      isLoading || !passwordValidation.isValid || newPassword !== confirmPassword
                        ? 'opacity-50 cursor-not-allowed bg-gray-100' 
                        : 'hover:bg-gray-100'
                    }`}
                    onClick={handleResetPassword}
                    disabled={isLoading || !passwordValidation.isValid || newPassword !== confirmPassword}
                  >
                    {isLoading 
                      ? t('common.loading', 'Đang xử lý...') 
                      : t('forgotPassword.resetButton', 'ĐỔI MẬT KHẨU')}
                  </button>
                </div>

                {/* Back to verify button */}
                <div className="text-center mt-2">
                  <button
                    className="text-blue-600 hover:text-blue-800 text-sm underline"
                    onClick={() => {
                      setStep('VERIFY');
                      setResetToken("");
                      setNewPassword("");
                      setConfirmPassword("");
                      setErrorMessage("");
                      setSuccessMessage("");
                    }}
                    disabled={isLoading}
                  >
                    {t('forgotPassword.backToVerify', '← Quay lại bước xác thực')}
                  </button>
                </div>
              </>
            )}

            {/* Error Message */}
            {errorMessage && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded text-center">
                {errorMessage}
              </div>
            )}

            {/* Success Message */}
            {successMessage && (
              <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded text-center">
                {successMessage}
              </div>
            )}

            {/* Back to login link */}
            <div className="text-center mt-4">
              <button
                className="text-gray-600 hover:text-gray-800 text-sm"
                onClick={() => navigate('/login')}
              >
                {t('forgotPassword.backToLogin', '← Quay lại đăng nhập')}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
