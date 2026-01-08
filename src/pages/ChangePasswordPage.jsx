import React, {useState, useEffect} from "react";
import "../styles/Register.css";
import {useNavigate, useLocation} from "react-router-dom";
import axios from "axios";
import {useDispatch, useSelector} from 'react-redux';
import {changePasswordAction} from "../context/action/authActions";
import {changePassword} from "../services/authService";
import {useTranslation} from 'react-i18next';
import {Home as HomeIcon, KeyboardIcon as KeyboardIcon} from 'lucide-react';
import PageHeaderWithOutColorPicker from '../components/PageHeaderWithOutColorPicker';


export default function ChangePasswordPage() {
    const {t} = useTranslation();
    const dispatch = useDispatch();
    const {user} = useSelector((state) => state.auth);
    const [color, setColor] = useState(localStorage.getItem("selectedColor"));
    const navigate = useNavigate();
    const location = useLocation();

    const [formData, setFormData] = useState({
        username: user?.username,
        email: user?.email,
        password: "123456",
        newPassword: "",
        confirmPassword: "",
        cccd: user?.cccd || location.state?.cccd || "",
        reference_id: user?.reference_id,
        full_name: user?.full_name,
        mobile_number: user?.mobile_number,
        bank_number: user?.bank_number,
        bank_name: user?.bank_name,
        address_no: user?.address_no,
        address_on_map: user?.address_on_map,
    });
    const [error, setError] = useState("");
    
    // Update formData if cccd is passed via location state (from recovery flow)
    useEffect(() => {
        if (location.state?.cccd) {
             setFormData(prev => ({ ...prev, cccd: location.state.cccd }));
        }
    }, [location.state]);

    const [passwordValidation, setPasswordValidation] = useState({
        hasUppercase: false,
        hasLowercase: false,
        hasNumber: false,
        hasSpecialChar: false,
        isValid: false
    });

    // Hàm kiểm tra yêu cầu mật khẩu
    const validatePassword = (password) => {
        const hasUppercase = /[A-Z]/.test(password);
        const hasLowercase = /[a-z]/.test(password);
        const hasNumber = /\d/.test(password);
        const hasSpecialChar = /[@$!%*?&]/.test(password);
        const isValid = hasUppercase && hasLowercase && hasNumber && hasSpecialChar && password.length >= 6;

        return {
            hasUppercase,
            hasLowercase,
            hasNumber,
            hasSpecialChar,
            isValid
        };
    };

    const handleChangeColor = (e) => {
        const newColor = e.target.value;
        setColor(newColor);
        localStorage.setItem("selectedColor", newColor);
    };

    useEffect(() => {
        document.getElementById("root").style.backgroundColor = color;
    }, [color]);

    const handleInputChange = (e) => {
        const {name, value} = e.target;
        setFormData({...formData, [name]: value});

        // Kiểm tra validation cho mật khẩu mới
        if (name === 'newPassword') {
            const validation = validatePassword(value);
            setPasswordValidation(validation);
        }
    };

    const handleRegister = async () => {
        const {username, cccd, newPassword, confirmPassword} = formData;

        // Kiểm tra các trường bắt buộc
        if (!cccd) {
            setError(t('auth.fillRequiredFields', 'Vui lòng điền đầy đủ thông tin cần thiết.'));
            return;
        }

        // Kiểm tra mật khẩu mới có đáp ứng yêu cầu không
        if (!passwordValidation.isValid) {
            setError(t('auth.passwordValidation.invalidPassword', 'Mật khẩu mới phải chứa ít nhất 1 chữ in hoa, 1 chữ thường, 1 số và 1 ký tự đặc biệt (@$!%*?&)'));
            return;
        }

        // Kiểm tra mật khẩu xác nhận
        if (newPassword !== confirmPassword) {
            setError(t('auth.passwordValidation.confirmPasswordMismatch', 'Mật khẩu xác nhận không khớp'));
            return;
        }

        try {
            console.log(formData);
            const response = await changePassword(formData.cccd, formData.newPassword, formData.confirmPassword)
            console.log(response.data);

            if (response.data?.blocked) {
                alert(response.data.message || t('auth.userBlocked', 'Tài khoản đã bị khóa. Vui lòng liên hệ hỗ trợ.'));
                return;
            }

            alert(t('auth.changePasswordSuccess', 'Đổi mật khẩu thành công!'));
            navigate("/login"); // Redirect to login as per spec
        } catch (error) {
            console.error("Lỗi khi đăng ký:", error.response?.data || error.message);
            setError(error.response?.data?.message || t('auth.changePasswordError', 'Đổi mật khẩu thất bại. Vui lòng thử lại.'));
            
            // Handle blocked status from error response if it comes as 200 with blocked=true or 400 with blocked=true
             if (error.response?.data?.blocked) {
                 alert(error.response.data.message || t('auth.userBlocked', 'Tài khoản đã bị khóa. Vui lòng liên hệ hỗ trợ.'));
             }
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen">
            <div className="bg-transparent backdrop-blur-md p-6 rounded-lg shadow-lg w-full max-w-4xl mx-auto">
                <PageHeaderWithOutColorPicker
                    color={color}
                    onColorChange={handleChangeColor}
                    titlePrefix=""
                    leftButton={
                        <button
                            className="text-red-600 hover:text-red-800 relative"
                            onClick={() => navigate("/")}
                        >
                            <HomeIcon size={28}/>
                        </button>
                    }
                    rightButton={
                        <button
                            className="text-red-600 hover:text-red-800"
                            onClick={() => navigate("/admin-control")}
                        >
                            <KeyboardIcon size={28}/>
                        </button>
                    }
                    title={t('register.changePasswordTitle')}
                />

                <div className="mt-6">
                    {/* <h2 className="text-2xl text-center font-semibold text-black">
            1.2: VUI LÒNG KIỂM TRA ZALO, WHATSAPP, SMS CỦA BẠN VÀ ĐỔI MẬT KHẨU
            ĐỂ ĐĂNG NHẬP
          </h2> */}
                    {/* <h4 className="text-1xl text-center font-semibold text-black mt-5">
            THAY ĐỔI MẬT KHẨU <br />
            <span className="text-xs text-gray-600">
              (CHANGE YOUR PASSWORD)
            </span>
          </h4> */}
                    <div className="grid gap-4 mt-5">
                        <input
                            type="text"
                            className="border p-2 rounded w-full"
                            placeholder={t('auth.idPlaceholder')}
                            name="cccd"
                            value={formData.cccd}
                            onChange={handleInputChange}

                        />
                        {/* <input
                            type="text"
                            className="border p-2 rounded w-full"
                            placeholder={t('auth.oldPasswordPlaceholder')}
                            value={user?.fullName?.replace(/\s+/g, '') || 'Tran Van A'.replace(/\s+/g, '')}
                            disabled
                        /> */}

                        <input
                            type="password"
                            className={`border p-2 rounded w-full text-sm min-h-[50px] ${
                                formData.newPassword && !passwordValidation.isValid ? 'border-red-500' :
                                    formData.newPassword && passwordValidation.isValid ? 'border-green-500' : 'border-gray-300'
                            }`}
                            placeholder={t('register.newPasswordPlaceholder')}
                            name="newPassword"
                            value={formData.newPassword}
                            onChange={handleInputChange}
                            required
                        />

                        {/* Hiển thị yêu cầu mật khẩu với trạng thái */}
                        {formData.newPassword && (
                            <div className="text-xs space-y-1">
                                <div
                                    className={`flex items-center ${passwordValidation.hasUppercase ? 'text-green-600' : 'text-red-600'}`}>
                                    <span className="mr-2">{passwordValidation.hasUppercase ? '✓' : '✗'}</span>
                                    {t('register.passwordValidation.hasUppercase')}
                                </div>
                                <div
                                    className={`flex items-center ${passwordValidation.hasLowercase ? 'text-green-600' : 'text-red-600'}`}>
                                    <span className="mr-2">{passwordValidation.hasLowercase ? '✓' : '✗'}</span>
                                    {t('register.passwordValidation.hasLowercase')}
                                </div>
                                <div
                                    className={`flex items-center ${passwordValidation.hasNumber ? 'text-green-600' : 'text-red-600'}`}>
                                    <span className="mr-2">{passwordValidation.hasNumber ? '✓' : '✗'}</span>
                                    {t('register.passwordValidation.hasNumber')}
                                </div>
                                <div
                                    className={`flex items-center ${passwordValidation.hasSpecialChar ? 'text-green-600' : 'text-red-600'}`}>
                                    <span className="mr-2">{passwordValidation.hasSpecialChar ? '✓' : '✗'}</span>
                                    {t('register.passwordValidation.hasSpecialChar')}
                                </div>
                                <div
                                    className={`flex items-center ${formData.newPassword.length >= 6 ? 'text-green-600' : 'text-red-600'}`}>
                                    <span className="mr-2">{formData.newPassword.length >= 6 ? '✓' : '✗'}</span>
                                    {t('register.passwordValidation.minLength')}
                                </div>
                            </div>
                        )}

                        {/* <label className="text-xs text-gray-500">
                            ({t('register.passwordHint')})
                        </label> */}

                        <input
                            type="password"
                            className={`border p-2 rounded w-full text-sm placeholder:text-xs min-h-[50px] ${
                                formData.confirmPassword && formData.newPassword !== formData.confirmPassword ? 'border-red-500' :
                                    formData.confirmPassword && formData.newPassword === formData.confirmPassword && passwordValidation.isValid ? 'border-green-500' : 'border-gray-300'
                            }`}
                            placeholder={t('register.confirmPasswordPlaceholder')}
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleInputChange}
                            required
                        />

                        {/* Hiển thị trạng thái xác nhận mật khẩu */}
                        {formData.confirmPassword && (
                            <div className={`text-xs ${
                                formData.newPassword === formData.confirmPassword ? 'text-green-600' : 'text-red-600'
                            }`}>
                                <span
                                    className="mr-2">{formData.newPassword === formData.confirmPassword ? '✓' : '✗'}</span>
                                {formData.newPassword === formData.confirmPassword
                                    ? t('register.passwordValidation.passwordMatch')
                                    : t('register.passwordValidation.passwordMismatch')
                                }
                            </div>
                        )}
{/* 
                        <label className="text-xs text-gray-500">
                            ({t('auth.passwordHint')})
                        </label> */}

                        {/* Hiển thị lỗi nếu có */}
                        {error && (
                            <div className="text-red-600 text-sm text-center bg-red-50 p-2 rounded">
                                {error}
                            </div>
                        )}
                    </div>

                    <div className="text-center mt-4">
                        <button
                            onClick={() => handleRegister()}
                            disabled={!passwordValidation.isValid || formData.newPassword !== formData.confirmPassword}
                            className={`border-2 border-black text-black font-bold px-6 py-2 rounded flex-1 ${
                                !passwordValidation.isValid || formData.newPassword !== formData.confirmPassword
                                    ? 'opacity-50 cursor-not-allowed bg-gray-100'
                                    : 'hover:bg-gray-200'
                            }`}>
                            {t('common.confirm')}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}