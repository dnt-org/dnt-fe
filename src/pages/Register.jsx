import React, { useState, useEffect } from "react";
import "../styles/Register.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { getCountries } from "../services/countries";
import Select from "react-select";
import { useDispatch, useSelector } from 'react-redux';
import { changePasswordAction } from "../context/action/authActions";
import { uploadImageToCloudinary } from "../services/cloudinary";
import { downloadContract } from "../services/contractService";
import { useTranslation } from 'react-i18next';
import { verifyBankNumber } from "../services/authService";
import PageHeaderWithOutColorPicker from '../components/PageHeaderWithOutColorPicker';
import useRegisterForm from "../hooks/useRegisterForm";
import RegisterStepOne from "../components/organisms/RegisterStepOne";
import RegisterStepTwo from "../components/organisms/RegisterStepTwo";



const generateRandomPassword = (length = 8) => {
  const upper = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const lower = "abcdefghijklmnopqrstuvwxyz";
  const numbers = "0123456789";
  const symbols = "!@#$%^&*()_+[]{}|;:,.<>?";

  const allChars = upper + lower + numbers + symbols;

  let password = "";
  password += upper[Math.floor(Math.random() * upper.length)];
  password += numbers[Math.floor(Math.random() * numbers.length)];
  password += symbols[Math.floor(Math.random() * symbols.length)];

  for (let i = 3; i < length; i++) {
    password += allChars[Math.floor(Math.random() * allChars.length)];
  }

  // Shuffle để tránh predictable vị trí
  return password
    .split("")
    .sort(() => 0.5 - Math.random())
    .join("");
};




function RegisterLegacyPage() {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((state) => state.auth);
  const [color, setColor] = useState(localStorage.getItem("selectedColor"));
  const [signature, setSignature] = useState();
  const navigate = useNavigate();
  const [isReadContract, setIsReadContract] = useState(false);
  const [countries, setCountries] = useState([]);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "123456",
    id: "",
    reference_id: "",
    full_name: "",
    mobile_number: "",
    bank_number: "",
    bank_name: "",
    address_no: "",
    address_on_map: "",
    signature: "",
    recovery_character: "",
    repeat_recovery_character: ""
  });

  const [selectedCountry, setSelectedCountry] = useState(null);
  const [validationErrors, setValidationErrors] = useState({});

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:1337/api";
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [isVerifying, setIsVerifying] = useState(false);
  const handleChangeColor = (e) => {
    const newColor = e.target.value;
    setColor(newColor);
    localStorage.setItem("selectedColor", newColor);
  };

  useEffect(() => {
    document.getElementById("root").style.backgroundColor = color;
    fetchCountries();
  }, [color]);

  // Add recovery character validation state
  const [recoveryCharacterValidation, setRecoveryCharacterValidation] = useState({
    hasUppercase: false,
    hasLowercase: false,
    hasNumber: false,
    hasSpecialChar: false,
    isValid: false
  });

  // Recovery character validation function
  const validateRecoveryCharacter = (recoveryChar) => {
    const hasUppercase = /[A-Z]/.test(recoveryChar);
    const hasLowercase = /[a-z]/.test(recoveryChar);
    const hasNumber = /\d/.test(recoveryChar);
    const hasSpecialChar = /[@$!%*?&]/.test(recoveryChar);
    const isValid = hasUppercase && hasLowercase && hasNumber && hasSpecialChar && recoveryChar.length >= 6;

    return {
      hasUppercase,
      hasLowercase,
      hasNumber,
      hasSpecialChar,
      isValid
    };
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    // For bank_number field, only allow numeric characters
    if (name === "bank_number") {
      const numericValue = value.replace(/[^0-9]/g, '');
      setFormData({ ...formData, [name]: numericValue });
    } else {
      setFormData({ ...formData, [name]: value });
    }

    // Clear validation errors when user starts typing
    if (validationErrors[name]) {
      setValidationErrors({ ...validationErrors, [name]: "" });
    }

    // Validate recovery character with password-like requirements
    if (name === "recovery_character") {
      const validation = validateRecoveryCharacter(value);
      setRecoveryCharacterValidation(validation);
      // Check if recovery character meets requirements
      if (!validation.isValid) {
        setValidationErrors(prev => ({
          ...prev,
          recovery_character: t('auth.recoveryCharacterValidation.invalidRecoveryCharacter', 'Ký tự khôi phục phải chứa ít nhất 1 chữ in hoa, 1 chữ thường, 1 số và 1 ký tự đặc biệt (@$!%*?&)')
        }));
      } else {
        setValidationErrors(prev => ({
          ...prev,
          recovery_character: ""
        }));
      }
    }

    // Validate recovery character matching
    if (name === "repeat_recovery_character" || name === "recovery_character") {
      const recoveryChar = name === "recovery_character" ? value : formData.recovery_character;
      const repeatRecoveryChar = name === "repeat_recovery_character" ? value : formData.repeat_recovery_character;

      if (repeatRecoveryChar && recoveryChar !== repeatRecoveryChar) {
        setValidationErrors(prev => ({
          ...prev,
          repeat_recovery_character: t('auth.recoveryCharacterMismatch', 'Ký tự khôi phục không khớp')
        }));
      } else if (repeatRecoveryChar && recoveryChar === repeatRecoveryChar) {
        setValidationErrors(prev => ({
          ...prev,
          repeat_recovery_character: ""
        }));
      }
    }
  };

  const validateForm = () => {
    const errors = {};

    // Check if bank is selected
    if (!formData.bank_name) {
      errors.bank_name = t('auth.bankRequired', 'Vui lòng chọn ngân hàng');
    }



    // Check if recovery characters match
    if (formData.recovery_character && formData.repeat_recovery_character &&
      formData.recovery_character !== formData.repeat_recovery_character) {
      errors.repeat_recovery_character = t('auth.recoveryCharacterMismatch', 'Ký tự khôi phục không khớp');
    }

    // Check required fields
    if (!formData.recovery_character) {
      errors.recovery_character = t('auth.recoveryCharacterRequired', 'Ký tự khôi phục là bắt buộc');
    }

    if (!formData.repeat_recovery_character) {
      errors.repeat_recovery_character = t('auth.repeatRecoveryCharacterRequired', 'Vui lòng nhập lại ký tự khôi phục');
    }

    if (!selectedCountry) {
      errors.country = t('auth.countryRequired', 'Vui lòng chọn quốc gia');
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Separate function to check form validity without triggering state updates
  const isFormValid = () => {
    // Check if bank is selected
    if (!formData.bank_name) return false;

    // Check if recovery character meets requirements

    // Check if recovery character meets requirements
    if (!recoveryCharacterValidation.isValid && formData.recovery_character) return false;

    // Check if recovery characters match
    if (formData.recovery_character && formData.repeat_recovery_character &&
      formData.recovery_character !== formData.repeat_recovery_character) return false;

    // Check required fields
    if (!formData.recovery_character) return false;
    if (!formData.repeat_recovery_character) return false;
    if (!selectedCountry) return false;

    return true;
  };

  const handleContractDownload = async () => {
    try {
      const response = await downloadContract();

      // Create blob URL and trigger download
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'hop-dong.docx'; // Contract file name
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      setIsReadContract(true);
    } catch (error) {
      console.error("Lỗi khi tải hợp đồng:", error);
      alert(t('auth.contractDownloadError', 'Không thể tải file hợp đồng. Vui lòng thử lại.'));
    }
  };

  const handleRegister = async () => {
    if (!isFormValid() || !isReadContract) {
      alert(t('auth.invalidForm', 'Vui lòng đọc và chấp nhận hợp đồng'));
      return;
    }

    try {
      const uploadToCloudinaryResp = "https://res.cloudinary.com/demo/image/upload/v1692323522/sample.jpg";
      // console.log(uploadToCloudinaryResp);

      const { username, cccd } = formData;
      // Sinh mật khẩu ngẫu nhiên
      const randomPassword = generateRandomPassword();
      formData.id = formData.bank_number;
      formData.cccd = formData.id;
      const payload = {
        ...formData,
        password: randomPassword,
        signature: uploadToCloudinaryResp,

      };

      const response = await axios.post(
        `${API_URL}/auth/register`,
        payload,
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      console.log("Đăng ký thành công:", response.data);
      dispatch(changePasswordAction(response.data?.user));
      alert(t('auth.registerSuccess', 'Đăng ký thành công!'));  
      if (response.status == 200) {
        await localStorage.setItem("authToken", response.data.token);
        // Store complete user data in localStorage for easy access
        await localStorage.setItem("user", JSON.stringify(response.data.user));
        navigate("/change-password");
      } else {
        alert(t('auth.loginError', 'THÔNG TIN NHẬP CHƯA CHÍNH XÁC, VUI LÒNG NHẬP LẠI'));
      }
    } catch (error) {
      console.error("Lỗi khi đăng ký:", error.response?.data || error.message);
      const errorMessage = error.response?.data?.error?.message ||
        error.response?.data?.message ||
        t('auth.registerError', 'Đăng ký thất bại. Vui lòng thử lại.');
      setError(errorMessage);
      alert(errorMessage); // Display error to user
    }
  };

  const fetchCountries = async () => {
    try {
      const rs = await getCountries()

      setCountries(
        rs.map((country) => ({
          value: country.vi,
          label: country.vi,
        }))
      );

    } catch (error) {
      console.error("Lỗi khi lấy danh sách quốc gia:", error);
    }
  }

  const handleNextClick = async () => {
    // Validate form fields first
    if (!validateForm()) return;

    setError("");
    setIsVerifying(true);

    try {
      const res = await verifyBankNumber(
        formData.bank_number,
        formData.bank_name,
        "ABC"
      );

      // If the API call succeeds, proceed to next page
      setPage(2);
    } catch (err) {
      console.error(
        "Lỗi xác thực tài khoản ngân hàng:",
        err?.response?.data || err?.message
      );
      const errorMessage = t(
        "auth.bankVerifyFailed",
        "VUI LÒNG NHẬP ĐÚNG CÁC THÔNG TIN ĐĂNG KÝ TÀI KHOẢN (Please enter the correct account registration information)"
      );
      setError(errorMessage);
      alert(errorMessage);
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="bg-transparent backdrop-blur-md p-6 rounded-lg shadow-lg w-full max-w-4xl mx-auto">
       <PageHeaderWithOutColorPicker
          color={color}
          onColorChange={handleChangeColor}
          titlePrefix="1"
          title={t('register.registerTitle', 'ĐĂNG KÝ')}
        />
        {page === 1 && (<div className="mt-6">
          {error && <p className="text-red-500">{error}</p>}
          <div className="space-y-4 mt-4">
            <div className="grid grid-cols-1 items-center gap-4">
              <div className="relative w-full flex items-center">
                <Select
                  options={countries} // mảng bạn đã set bằng setCountries
                  onChange={(option) => {
                    setSelectedCountry(option);
                    if (validationErrors.country) {
                      setValidationErrors({ ...validationErrors, country: "" });
                    }
                  }}
                  value={selectedCountry}
                  placeholder={t('register.countryPlaceholder', 'Quốc gia (Nation)')}
                  className="w-full"
                />
                <span className="text-red-500 ml-2">*</span>
              </div>
              {validationErrors.country && (
                <p className="text-red-500 text-sm mt-1">{validationErrors.country}</p>
              )}
            </div>
            {/* <span className="text-red-500 ml-2">*</span> */}
          </div>
          <div className="space-y-4 mt-4">


            {/* <div className="grid grid-cols-1 items-center gap-4">
              <div className="relative w-full flex items-center">
                <label
                  htmlFor="signature-upload"
                  className="w-full h-12 text-black border flex flex-col items-center justify-center cursor-pointer rounded"
                >
                  <span className="font-semibold">{t('auth.uploadSignature', 'TẢI CHỮ KÝ')}</span>
                  <span className="text-sm">({t('auth.uploadSignatureEn', 'Upload your signature')})</span>
                  <input id="signature-upload" type="file" className="hidden"
                   onChange={(e) => setSignature(e.target.files[0])} 
                   />

                  
                </label>
                <span className="text-red-500 ml-2">*</span>
              </div>
            </div> */}


            {/* <div className="grid grid-cols-1 items-center gap-4">
              <div className="relative w-full flex items-center">
                <input
                  type="text"
                  className="border p-2 rounded w-full"
                  placeholder={t('auth.idPlaceholder', 'CCCD/MST (ID)')}
                  name="id"
                  value={formData.id}
                  onChange={handleInputChange}
                />
                <span className="text-red-500 ml-2">*</span>
              </div>
            </div> */}
            <div className="grid grid-cols-1 items-center gap-4">
              <div className="relative w-full flex items-center">
                <input
                  type="text"
                  className="border p-2 rounded w-full"
                  placeholder={t('register.accountNumberPlaceholder', 'ID = SỐ TÀI KHOẢN NGÂN HÀNG')}
                  name="bank_number"
                  value={formData.bank_number}
                  onChange={handleInputChange}
                />
                <span className="text-red-500 ml-2">*</span>
              </div>
            </div>
            <div className="grid grid-cols-1 items-center gap-4">
              <div className="relative w-full flex items-center">
                <select
                  className="border p-2 rounded w-full"
                  name="bank_name"
                  value={formData.bank_name}
                  onChange={handleInputChange}
                >
                  <option value="">{t('register.selectBankPlaceholder', 'Chọn ngân hàng (With bank)')}</option>
                  <option value="GPBank">
                    Ngân hàng TNHH MTV Dầu khí toàn cầu (GPBank)
                  </option>
                  <option value="Agribank">
                    Ngân hàng Nông nghiệp và Phát triển Nông thôn Việt Nam
                    (Agribank)
                  </option>
                  <option value="OceanBank">
                    Ngân hàng TNHH MTV Đại Dương (OceanBank)
                  </option>
                  <option value="VietinBank">
                    Ngân hàng TMCP Công thương Việt Nam (VietinBank)
                  </option>
                  <option value="BIDV">
                    Ngân hàng TMCP Đầu tư và Phát triển Việt Nam (BIDV)
                  </option>
                  <option value="Vietcombank">
                    Ngân hàng TMCP Ngoại Thương Việt Nam (Vietcombank)
                  </option>
                </select>
                <span className="text-red-500 ml-2">*</span>
              </div>
              {validationErrors.bank_name && (
                <p className="text-red-500 text-sm mt-1">{validationErrors.bank_name}</p>
              )}
            </div>

            {/* <div className="grid grid-cols-1 items-center gap-4">

              <div className="flex w-full">
                <div className="relative w-full flex items-center">
                  <input
                    type="text"
                    className="border p-2 rounded flex-1"
                    placeholder={t('auth.addressPlaceholder', 'ĐỊA CHỈ NHẬN HÀNG - SỐ NHÀ (Number) * (Receive goods\'s address)')}
                    name="address_no"
                    value={formData.address_no}
                    onChange={handleInputChange}
                  />
                  <span className="text-red-500 ml-2">*</span>
                </div>
                <div className="text-center w-1/2">
                  <button className="border-2 border-black text-black font-bold px-6 py-2 rounded hover:bg-gray-200">
                    {t('auth.pinLocation', 'GHIM VỊ TRÍ')}{" "}
                    <span className="text-xs text-gray-600">({t('common.map', 'Map')})</span>
                  </button>
                </div>
              </div>
            </div> */}
            <div className="grid grid-cols-1 items-center gap-4">
              <div className="relative w-full flex items-center">
                <input
                  type="text"
                  className="border p-2 rounded w-full"
                  placeholder={t('register.recoveryCharacterPlaceholder', 'KÝ TỰ KHÔI PHỤC TÀI KHOẢN (Account recovery character)')}
                  name="recovery_character"
                  value={formData.recovery_character}
                  onChange={handleInputChange}
                />
                <span className="text-red-500 ml-2">*</span>
              </div>
              {validationErrors.recovery_character && (
                <p className="text-red-500 text-sm mt-1">{validationErrors.recovery_character}</p>
              )}
            </div>
            <div className="grid grid-cols-1 items-center gap-4">
              <div className="relative w-full flex items-center">
                <input
                  type="text"
                  className="border p-2 rounded w-full"
                  placeholder={t('register.repeatRecoveryCharacterPlaceholder', 'NHẬP LẠI KÝ TỰ KHÔI PHỤC TÀI KHOẢN (Repeat account recovery character)')}
                  name="repeat_recovery_character"
                  value={formData.repeat_recovery_character}
                  onChange={handleInputChange}
                />
                <span className="text-red-500 ml-2">*</span>
              </div>
              {validationErrors.repeat_recovery_character && (
                <p className="text-red-500 text-sm mt-1">{validationErrors.repeat_recovery_character}</p>
              )}
            </div>
            <div className="grid grid-cols-1 items-center gap-4">
              <div className="relative w-full flex items-center">
                <input
                  type="text"
                  className="border p-2 rounded w-full"
                  placeholder={t('register.referrerIdPlaceholder', 'ID NGƯỜI GIỚI THIỆU')}
                  name="reference_id"
                  value={formData.reference_id}
                  onChange={handleInputChange}
                />
                <span className="text-red-500 ml-2"></span>
                <span className="text-red-500 ml-2"> </span>
              </div>
            </div>
          </div>
          <div className="text-center mt-4">
            <button
              className={`border-2 border-black font-bold px-1 py-2 rounded flex-1  ${isFormValid() && !isVerifying
                ? 'text-black hover:bg-gray-200'
                : 'text-gray-400 bg-gray-100 cursor-not-allowed'
                }`}
              onClick={handleNextClick}
              disabled={!isFormValid() || isVerifying}
            >
              {t('register.next', 'Tiếp Theo')} <br />
            </button>
          </div>
        </div>)}
        {page === 2 && (
          <div className="mt-6">

            <button
              className="border-2 border-black text-black font-bold px-6 py-2 rounded text-center hover:bg-gray-200 mt-4 mb-4 flex w-full justify-center items-center"
              onClick={handleContractDownload}
            >
              <div className="flex flex-col items-center text-center">
                <p>{t('register.checkContract')} <em className="text-red-500">*</em></p>
                <p>({t('register.clickToViewFile')})</p>
              </div>
            </button>

            {/* New signature upload button */}
            {/* <div className="grid grid-cols-1 items-center gap-4 mb-4">
              <div className="relative w-full flex items-center">
                <label
                  htmlFor="contract-signature-upload"
                  className="w-full h-12 text-black border flex flex-col items-center justify-center cursor-pointer rounded hover:bg-gray-100"
                >
                  <span className="font-semibold">{t('auth.uploadContractSignature', 'TẢI LÊN CHỮ KÝ HỢP ĐỒNG')}</span>
                  <span className="text-sm">({t('auth.uploadContractSignatureEn', 'Upload your contract signature')})</span>
                  <input 
                    id="contract-signature-upload" 
                    type="file" 
                    className="hidden"
                    accept="image/*"
                    onChange={(e) => {
                      console.log("upload signature")
                      setSignature(e.target.files[0])} }
                  />
                </label>
                <span className="text-red-500 ml-2">*</span>
              </div>
            </div> */}

            <div className="flex items-start gap-2">
              <div className="flex flex-col items-center">
                <input type="checkbox" className="w-5 h-5" />
                <span className="text-red-500 text-lg">*</span>
              </div>
              <div className="text-left">
                {t('register.contractConfirmation', 'Tôi xác nhận đã đọc, hiểu rõ và đồng ý, chấp nhận ký hợp đồng cũng như tuân thủ mọi điều khoản và điều kiện do website - app yêu cầu bao gồm thêm các nội dung sau:')} <br />
                <br />
                <b>{t('register.term1', '1. Tự động đăng xuất sau 168 h đăng nhập.')}</b> <br />
                <br />
                <b>{t('register.term2', '2. Tự động khóa tài khoản sau 365 h (giờ) đăng xuất.')}</b>
                  <br/>
                <br />
                <b>{t('register.term3', '3. Tự động xóa tài khoản sau 365 ngày bị khóa.')}</b>
                <br />
                <br />
                <b>{t('register.term4', '4. Đăng nhập sai liên tiếp 05 lần sẽ bị khóa tài khoản.')}</b>
                <br />
                <br />
                <b>{t('register.term5', '5.Tự động xóa bài sau 365 ngày được đăng.')}</b>
                <br />
                <br />
                  <b>{t('register.term6', '5.Tự động xóa bài sau 365 ngày được đăng.')}</b>
                  <br />
                  <br />
              </div>
            </div>
            <div className="text-center mt-4">
              <button
                className="border-2 border-black text-black font-bold px-1 py-2 rounded hover:bg-gray-200 flex-1"
                onClick={() => handleRegister()}
                tooltip={!isReadContract ? 'Vui lòng đọc và chấp nhận hợp đồng' : ''}
              >
                {t('register.registerTitle', 'Đăng ký')}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );

}

export default function RegisterPage() {
  const { t } = useTranslation();
  const {
    color,
    handleChangeColor,
    countries,
    selectedCountry,
    setSelectedCountry,
    validationErrors,
    error,
    page,
    isVerifying,
    formData,
    handleInputChange,
    isFormValid,
    handleContractDownload,
    handleRegister,
    handleNextClick,
    isReadContract,
  } = useRegisterForm(t);
  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="bg-transparent backdrop-blur-md p-6 rounded-lg shadow-lg w-full max-w-4xl mx-auto">
        <PageHeaderWithOutColorPicker color={color} onColorChange={handleChangeColor} titlePrefix="1" title={t('register.registerTitle', 'ĐĂNG KÝ')} />
        {page === 1 && (
          <RegisterStepOne
            t={t}
            error={error}
            countries={countries}
            selectedCountry={selectedCountry}
            setSelectedCountry={setSelectedCountry}
            validationErrors={validationErrors}
            formData={formData}
            handleInputChange={handleInputChange}
            isFormValid={isFormValid}
            isVerifying={isVerifying}
            handleNextClick={handleNextClick}
          />
        )}
        {page === 2 && (
          <RegisterStepTwo t={t} handleContractDownload={handleContractDownload} isReadContract={isReadContract} handleRegister={handleRegister} />
        )}
      </div>
    </div>
  );
}
