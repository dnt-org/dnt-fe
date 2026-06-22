import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios"
import { useDispatch, useSelector } from "react-redux"
import { loginAction } from "../context/action/authActions"
import { getCountries } from "../services/countries"
import banksByCountry from "../constants/banksByCountry"
import { verifyBankNumber } from "../services/authService"
import { getBanks } from "../services/systemService"
import { getBankAccountName } from "../services/bankAccountService"
import useRecaptcha from "./useRecaptcha"

export default function useRegisterForm(t) {
  const dispatch = useDispatch()
  const { isAuthenticated } = useSelector((state) => state.auth)
  const navigate = useNavigate()

  // reCAPTCHA v2 Invisible for the register form
  const { getToken: getRegisterToken, reset: resetRegisterCaptcha } = useRecaptcha('recaptcha-register')
  const [color, setColor] = useState(localStorage.getItem("selectedColor"))
  const [signature, setSignature] = useState()
  const [isReadContract, setIsReadContract] = useState(false)
  const [countries, setCountries] = useState([])
  const [banks, setBanks] = useState([])
  const [allBanksByCountry, setAllBanksByCountry] = useState({})
  const [selectedCountry, setSelectedCountry] = useState(null)
  const [validationErrors, setValidationErrors] = useState({})
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:1337/api"
  const [error, setError] = useState("")
  const [page, setPage] = useState(1)
  const [isVerifying, setIsVerifying] = useState(false)
  const [isContractModalOpen, setIsContractModalOpen] = useState(false)
  const [contractFiles, setContractFiles] = useState([])
  const [contractActiveIndex, setContractActiveIndex] = useState(0)
  const [isContractLoading, setIsContractLoading] = useState(false)
  const [contractError, setContractError] = useState("")
  const [isFetchingAccountName, setIsFetchingAccountName] = useState(false)
  const [accountNameError, setAccountNameError] = useState("")
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
    account_type: "",
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
  }, [color])

  useEffect(() => {
    const fetchBanks = async () => {
      try {
        const data = await getBanks()
        setAllBanksByCountry(data || {})
      } catch (err) {
        console.error("Error fetching banks in useRegisterForm:", err)
      }
    }
    fetchBanks()
  }, [])

  useEffect(() => {
    if (selectedCountry && selectedCountry.cca2) {
      const list = allBanksByCountry[selectedCountry.cca2] || []
      setBanks(list)
    } else {
      setBanks([])
    }
  }, [selectedCountry, allBanksByCountry])

  useEffect(() => {
    if (!formData.bank_number || !formData.bank_name) {
      setAccountNameError("")
      return
    }
    let cancelled = false
    setIsFetchingAccountName(true)
    setAccountNameError("")
    getBankAccountName(formData.bank_name, formData.bank_number)
      .then((name) => {
        if (cancelled) return
        setFormData((prev) => ({ ...prev, full_name: name }))
      })
      .catch(() => {
        if (cancelled) return
        setFormData((prev) => ({ ...prev, full_name: "" }))
        setAccountNameError(t("auth.bankAccountNameNotFound", "Không tìm thấy tài khoản"))
      })
      .finally(() => {
        if (!cancelled) setIsFetchingAccountName(false)
      })
    return () => {
      cancelled = true
    }
  }, [formData.bank_number, formData.bank_name, t])

  const validateRecoveryCharacter = (recoveryChar) => {
    const hasUppercase = /[A-Z]/.test(recoveryChar)
    const hasLowercase = /[a-z]/.test(recoveryChar)
    const hasNumber = /\d/.test(recoveryChar)
    const hasSpecialChar = /[~!@#$%^&*()_]/.test(recoveryChar)
    const isValid = hasUppercase && hasLowercase && hasNumber && hasSpecialChar && recoveryChar.length >= 6
    return { hasUppercase, hasLowercase, hasNumber, hasSpecialChar, isValid }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    if (name === "bank_number") {
      const alphanumericValue = value.replace(/[^a-zA-Z0-9]/g, "")
      setFormData({ ...formData, [name]: alphanumericValue })
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
              "auth.invalidRecoveryCharacter",
              "Ký tự khôi phục tài khoản phải chứa ít nhất 1 chữ in hoa (A-Z), 1 chữ thường (a-z), 1 số (0-9) và 1 ký tự đặc biệt (~!@#$%^&*_)."
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
          repeat_recovery_character: t("auth.recoveryCharacterMismatch", "Ký tự khôi phục tài khoản không khớp"),
        }))
      } else if (repeatRecoveryChar && recoveryChar === repeatRecoveryChar) {
        setValidationErrors((prev) => ({ ...prev, repeat_recovery_character: "" }))
      }
    }
  }

  const validateForm = () => {
    const errors = {}
    if (!formData.account_type) errors.account_type = t("auth.accountTypeRequired", "Vui lòng chọn loại tài khoản")
    if (!formData.bank_name) errors.bank_name = t("auth.bankRequired", "Vui lòng chọn ngân hàng")
    if (formData.recovery_character && formData.repeat_recovery_character && formData.recovery_character !== formData.repeat_recovery_character) {
      errors.repeat_recovery_character = t("auth.recoveryCharacterMismatch", "Ký tự khôi phục tài khoản không khớp")
    }
    if (!formData.recovery_character) errors.recovery_character = t("auth.recoveryCharacterRequired", "Ký tự khôi phục tài khoản là bắt buộc")
    if (!formData.repeat_recovery_character) errors.repeat_recovery_character = t("auth.repeatRecoveryCharacterRequired", "Vui lòng nhập lại ký tự khôi phục tài khoản")
    if (!selectedCountry) errors.country = t("auth.countryRequired", "Vui lòng chọn quốc gia")
    if (formData.reference_id && formData.reference_id === formData.bank_number) {
      errors.reference_id = t("auth.referenceIdMatchesId", "ID thành viên nhận giảm giá không hợp lệ")
    }
    setValidationErrors(errors)
    return Object.keys(errors).length === 0
  }

  const isFormValid = () => {
    if (!formData.account_type) return false
    if (!formData.bank_name) return false
    if (!recoveryCharacterValidation.isValid && formData.recovery_character) return false
    if (formData.recovery_character && formData.repeat_recovery_character && formData.recovery_character !== formData.repeat_recovery_character) return false
    if (!formData.recovery_character) return false
    if (!formData.repeat_recovery_character) return false
    if (!selectedCountry) return false
    if (formData.reference_id && formData.reference_id === formData.bank_number) return false
    return true
  }

  const handleContractDownload = async () => {
    console.log(formData)
    setContractError("")
    setIsContractModalOpen(true)
    setIsContractLoading(true)
    try {
      const generateResponse = await axios.post(
        `${API_URL}/contract/generate`,
        {
          ...formData,
          benABankNumber: formData.bank_number,
          country: selectedCountry,
          benABankName: formData.bank_name,
          contractAddress: selectedCountry?.value,
          collateralCode: "CONTRACT_TEMPLATE"
        },
        {
          responseType: "blob",
          headers: {
            "Content-Type": "application/json",
          },
        }
      )

      const contentDisposition = generateResponse.headers?.["content-disposition"] || generateResponse.headers?.["Content-Disposition"]
      let generatedFileName = "contract.docx"
      if (contentDisposition) {
        const fileNameMatch = contentDisposition.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/i)
        if (fileNameMatch && fileNameMatch[1]) {
          generatedFileName = fileNameMatch[1].replace(/['"]/g, "").trim()
        }
      }

      const generatedBlob = new Blob([generateResponse.data], {
        type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      })
      const generatedUrl = window.URL.createObjectURL(generatedBlob)

      const collateralsResponse = await axios.get(`${API_URL}/collaterals/download/CONTRACT`)
      const collateralFilesRaw = collateralsResponse.data?.files || []
      const collateralFiles = await Promise.all(
        collateralFilesRaw.filter(Boolean).map(async (rawUrl, index) => {
          const clean = String(rawUrl).replace(/`/g, "").trim()
          const path = clean.split("?")[0]
          const downloadName = path.split("/").pop() || `file_${index + 1}.pdf`
          try {
            const fileResp = await axios.get(clean, { responseType: "blob" })
            const contentType =
              fileResp.headers?.["content-type"] || fileResp.data?.type || "application/pdf"
            const inlineBlob =
              fileResp.data instanceof Blob
                ? new Blob([fileResp.data], { type: contentType })
                : new Blob([fileResp.data], { type: contentType })
            return {
              type: "collateral",
              url: window.URL.createObjectURL(inlineBlob),
              label: `File ${index + 1}`,
              downloadName,
            }
          } catch (err) {
            console.error(`Lỗi khi tải file collateral ${index + 1}:`, err)
            return {
              type: "collateral",
              url: clean,
              label: `File ${index + 1}`,
              downloadName,
            }
          }
        })
      )

      const files = [
        {
          type: "generated",
          kind: "docx",
          blob: generatedBlob,
          url: generatedUrl,
          label: t("register.generatedContract", "Hợp đồng đã được sinh"),
          downloadName: generatedFileName,
        },
        ...collateralFiles,
      ]

      setContractFiles(files)
      setContractActiveIndex(0)
      setIsReadContract(true)
    } catch (error) {
      console.error("Lỗi khi tải hợp đồng hoặc tài liệu:", error)
      const message = t("auth.contractDownloadError", "Không thể tải file hợp đồng. Vui lòng thử lại.")
      setContractError(message)
      alert(message)
      setIsContractModalOpen(false)
    } finally {
      setIsContractLoading(false)
    }
  }

  const handleCloseContractModal = () => {
    try {
      contractFiles.forEach((file) => {
        if (file && file.url && file.url.startsWith("blob:")) {
          window.URL.revokeObjectURL(file.url)
        }
      })
    } catch {
      // ignore revoke errors
    }
    setIsContractModalOpen(false)
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
      // Verify user is human before registering
      const recaptchaToken = getRegisterToken()
      if (!recaptchaToken) {
        alert(t("auth.captchaRequired", "Vui lòng hoàn thành xác thực reCAPTCHA"))
        return
      }

      const uploadToCloudinaryResp = "https://res.cloudinary.com/demo/image/upload/v1692323522/sample.jpg"
      const randomPassword = generateRandomPassword()
      formData.id = formData.bank_number
      formData.cccd = formData.id
      const payload = { ...formData, password: randomPassword, signature: uploadToCloudinaryResp, recaptchaToken }
      const response = await axios.post(`${API_URL}/auth/register`, payload, { headers: { "Content-Type": "application/json" } })
      const authToken = response.data?.token || response.data?.jwt
      localStorage.setItem("authToken", authToken)
      localStorage.setItem("user", JSON.stringify(response.data?.user))
      dispatch(loginAction(response.data?.user))
      navigate("/")
    } catch (error) {
      console.error("Lỗi khi đăng ký:", error.response?.data || error.message)
      const errorMessage =
        error.response?.data?.error?.message || error.response?.data?.message || t("auth.registerError", "Đăng ký thất bại. Vui lòng thử lại.")
      setError(errorMessage)
      alert(errorMessage)
      resetRegisterCaptcha()
    }
  }

  const fetchCountries = async () => {
    try {
      const rs = await getCountries()
      setCountries(
        rs.map((country) => ({ value: country.vi, label: country.vi, cca2: country.cca2 }))
      )
    } catch (error) {
      console.error("Lỗi khi lấy danh sách quốc gia:", error)
    }
  }

  const handleBankNumberBlur = async () => {
    if (!formData.bank_number) return
    setIsVerifying(true)
    try {
      const response = await verifyBankNumber(formData.bank_number, formData.bank_name || "ABC", "ABC")
      if (response && response.data && response.data.exists) {
        setValidationErrors(prev => ({ ...prev, bank_number: t("auth.userExists", " ID thành viên đã tồn tại.") }))
      } else {
        setValidationErrors(prev => ({ ...prev, bank_number: "" }))
      }
    } catch (err) {
      console.error("Lỗi xác thực ngân hàng (blur):", err?.response?.data || err?.message)
      const errorMsg = err?.response?.data?.message || err?.message || ""
      if (err?.response?.status === 409 || errorMsg.toLowerCase().includes("exist")) {
        setValidationErrors(prev => ({ ...prev, bank_number: t("auth.userExists", " ID thành viên đã tồn tại.") }))
      }
    } finally {
      setIsVerifying(false)
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

      const errorMsg = err?.response?.data?.message || err?.message || "";
      if (err?.response?.status === 409 || errorMsg.toLowerCase().includes("exist")) {
        alert(t("auth.userExists", "Tài khoản đã tồn tại. Vui lòng đăng nhập."));
        navigate("/login");
        return;
      }

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
    isContractModalOpen,
    contractFiles,
    contractActiveIndex,
    setContractActiveIndex,
    isContractLoading,
    contractError,
    handleCloseContractModal,
    handleBankNumberBlur,
    isFetchingAccountName,
    accountNameError,
  }
}
