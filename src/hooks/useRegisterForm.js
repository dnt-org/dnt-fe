import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios"
import { useDispatch, useSelector } from "react-redux"
import { changePasswordAction } from "../context/action/authActions"
import { getCountries } from "../services/countries"
import { getBanks } from "../services/systemService"
import { downloadContract } from "../services/contractService"
import { verifyBankNumber } from "../services/authService"

export default function useRegisterForm(t) {
  const dispatch = useDispatch()
  const { isAuthenticated } = useSelector((state) => state.auth)
  const navigate = useNavigate()
  const [color, setColor] = useState(localStorage.getItem("selectedColor"))
  const [signature, setSignature] = useState()
  const [isReadContract, setIsReadContract] = useState(false)
  const [countries, setCountries] = useState([])
  const [banks, setBanks] = useState([])
  const [selectedCountry, setSelectedCountry] = useState(null)
  const [validationErrors, setValidationErrors] = useState({})
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:1337/api"
  const [error, setError] = useState("")
  const [page, setPage] = useState(1)
  const [isVerifying, setIsVerifying] = useState(false)
  const [recoveryCharacterValidation, setRecoveryCharacterValidation] = useState({
    hasUppercase: false,
    hasLowercase: false,
    hasNumber: false,
    hasSpecialChar: false,
    isValid: false,
  })
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
    repeat_recovery_character: "",
  })

  const handleChangeColor = (e) => {
    const newColor = e.target.value
    setColor(newColor)
    localStorage.setItem("selectedColor", newColor)
  }

  useEffect(() => {
    const root = document.getElementById("root")
    if (root) root.style.backgroundColor = color
    fetchCountries()
    fetchBanks()
  }, [color])

  const validateRecoveryCharacter = (recoveryChar) => {
    const hasUppercase = /[A-Z]/.test(recoveryChar)
    const hasLowercase = /[a-z]/.test(recoveryChar)
    const hasNumber = /\d/.test(recoveryChar)
    const hasSpecialChar = /[@$!%*?&]/.test(recoveryChar)
    const isValid = hasUppercase && hasLowercase && hasNumber && hasSpecialChar && recoveryChar.length >= 6
    return { hasUppercase, hasLowercase, hasNumber, hasSpecialChar, isValid }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    if (name === "bank_number") {
      const numericValue = value.replace(/[^0-9]/g, "")
      setFormData({ ...formData, [name]: numericValue })
    } else {
      setFormData({ ...formData, [name]: value })
    }
    if (validationErrors[name]) setValidationErrors({ ...validationErrors, [name]: "" })
    if (name === "recovery_character") {
      const validation = validateRecoveryCharacter(value)
      setRecoveryCharacterValidation(validation)
      if (!validation.isValid) {
        setValidationErrors((prev) => ({
          ...prev,
          recovery_character:
            t(
              "auth.recoveryCharacterValidation.invalidRecoveryCharacter",
              "Ký tự khôi phục phải chứa ít nhất 1 chữ in hoa, 1 chữ thường, 1 số và 1 ký tự đặc biệt (@$!%*?&)"
            ),
        }))
      } else {
        setValidationErrors((prev) => ({ ...prev, recovery_character: "" }))
      }
    }
    if (name === "repeat_recovery_character" || name === "recovery_character") {
      const recoveryChar = name === "recovery_character" ? value : formData.recovery_character
      const repeatRecoveryChar = name === "repeat_recovery_character" ? value : formData.repeat_recovery_character
      if (repeatRecoveryChar && recoveryChar !== repeatRecoveryChar) {
        setValidationErrors((prev) => ({
          ...prev,
          repeat_recovery_character: t("auth.recoveryCharacterMismatch", "Ký tự khôi phục không khớp"),
        }))
      } else if (repeatRecoveryChar && recoveryChar === repeatRecoveryChar) {
        setValidationErrors((prev) => ({ ...prev, repeat_recovery_character: "" }))
      }
    }
  }

  const validateForm = () => {
    const errors = {}
    if (!formData.bank_name) errors.bank_name = t("auth.bankRequired", "Vui lòng chọn ngân hàng")
    if (formData.recovery_character && formData.repeat_recovery_character && formData.recovery_character !== formData.repeat_recovery_character) {
      errors.repeat_recovery_character = t("auth.recoveryCharacterMismatch", "Ký tự khôi phục không khớp")
    }
    if (!formData.recovery_character) errors.recovery_character = t("auth.recoveryCharacterRequired", "Ký tự khôi phục là bắt buộc")
    if (!formData.repeat_recovery_character) errors.repeat_recovery_character = t("auth.repeatRecoveryCharacterRequired", "Vui lòng nhập lại ký tự khôi phục")
    if (!selectedCountry) errors.country = t("auth.countryRequired", "Vui lòng chọn quốc gia")
    setValidationErrors(errors)
    return Object.keys(errors).length === 0
  }

  const isFormValid = () => {
    if (!formData.bank_name) return false
    if (!recoveryCharacterValidation.isValid && formData.recovery_character) return false
    if (formData.recovery_character && formData.repeat_recovery_character && formData.recovery_character !== formData.repeat_recovery_character) return false
    if (!formData.recovery_character) return false
    if (!formData.repeat_recovery_character) return false
    if (!selectedCountry) return false
    return true
  }

  const handleContractDownload = async () => {
    console.log(formData)
    try {
      await downloadContract({
        ...formData,
        benABankNumber: formData.bank_number,
        country: selectedCountry,
        benABankName: formData.bank_name,
        contractAddress: selectedCountry?.value,
      })
      setIsReadContract(true)
    } catch (error) {
      console.error("Lỗi khi tải hợp đồng:", error)
      alert(t("auth.contractDownloadError", "Không thể tải file hợp đồng. Vui lòng thử lại."))
    }
  }

  const generateRandomPassword = (length = 8) => {
    const upper = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
    const lower = "abcdefghijklmnopqrstuvwxyz"
    const numbers = "0123456789"
    const symbols = "!@#$%^&*()_+[]{}|;:,.<>?"
    const allChars = upper + lower + numbers + symbols
    let password = ""
    password += upper[Math.floor(Math.random() * upper.length)]
    password += numbers[Math.floor(Math.random() * numbers.length)]
    password += symbols[Math.floor(Math.random() * symbols.length)]
    for (let i = 3; i < length; i++) password += allChars[Math.floor(Math.random() * allChars.length)]
    return password.split("").sort(() => 0.5 - Math.random()).join("")
  }

  const handleRegister = async () => {
    if (!isFormValid() || !isReadContract) {
      alert(t("auth.invalidForm", "Vui lòng đọc và chấp nhận hợp đồng"))
      return
    }
    try {
      const uploadToCloudinaryResp = "https://res.cloudinary.com/demo/image/upload/v1692323522/sample.jpg"
      const randomPassword = generateRandomPassword()
      formData.id = formData.bank_number
      formData.cccd = formData.id
      const payload = { ...formData, password: randomPassword, signature: uploadToCloudinaryResp }
      const response = await axios.post(`${API_URL}/auth/register`, payload, { headers: { "Content-Type": "application/json" } })
      dispatch(changePasswordAction(response.data?.user))
      alert(t("auth.registerSuccess", "Đăng ký thành công!"))
      if (response.status == 200) {
        await localStorage.setItem("authToken", response.data.token)
        await localStorage.setItem("user", JSON.stringify(response.data.user))
        navigate("/change-password")
      } else {
        alert(t("auth.loginError", "THÔNG TIN NHẬP CHƯA CHÍNH XÁC, VUI LÒNG NHẬP LẠI"))
      }
    } catch (error) {
      console.error("Lỗi khi đăng ký:", error.response?.data || error.message)
      const errorMessage =
        error.response?.data?.error?.message || error.response?.data?.message || t("auth.registerError", "Đăng ký thất bại. Vui lòng thử lại.")
      setError(errorMessage)
      alert(errorMessage)
    }
  }

  const fetchCountries = async () => {
    try {
      const rs = await getCountries()
      setCountries(
        rs.map((country) => ({ value: country.vi, label: country.vi }))
      )
    } catch (error) {
      console.error("Lỗi khi lấy danh sách quốc gia:", error)
    }
  }

  const fetchBanks = async () => {
    try {
      const rs = await getBanks()
      setBanks(rs)
    } catch (error) {
      console.error("Lỗi khi lấy danh sách ngân hàng:", error)
    }
  }

  const handleNextClick = async () => {
    if (!validateForm()) return
    setError("")
    setIsVerifying(true)
    try {
      await verifyBankNumber(formData.bank_number, formData.bank_name, "ABC")
      setPage(2)
    } catch (err) {
      console.error("Lỗi xác thực tài khoản ngân hàng:", err?.response?.data || err?.message)
      const errorMessage = t(
        "auth.bankVerifyFailed",
        "VUI LÒNG NHẬP ĐÚNG CÁC THÔNG TIN ĐĂNG KÝ TÀI KHOẢN (Please enter the correct account registration information)"
      )
      setError(errorMessage)
      alert(errorMessage)
    } finally {
      setIsVerifying(false)
    }
  }

  return {
    color,
    handleChangeColor,
    signature,
    setSignature,
    isReadContract,
    setIsReadContract,
    countries,
    banks,
    selectedCountry,
    setSelectedCountry,
    validationErrors,
    setValidationErrors,
    error,
    setError,
    page,
    setPage,
    isVerifying,
    formData,
    setFormData,
    handleInputChange,
    validateForm,
    isFormValid,
    handleContractDownload,
    handleRegister,
    handleNextClick,
  }
}