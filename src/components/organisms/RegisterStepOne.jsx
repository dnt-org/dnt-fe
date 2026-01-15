import React, { useState } from "react"
import PropTypes from "prop-types"
import { Eye, EyeOff, QrCode } from "lucide-react"
import RegisterCountrySelect from "../molecules/RegisterCountrySelect"
import QRModalComponent from "../QRModalComponent"

export default function RegisterStepOne({
  t,
  error,
  countries,
  banks,
  selectedCountry,
  setSelectedCountry,
  validationErrors,
  formData,
  handleInputChange,
  isFormValid,
  isVerifying,
  handleNextClick,
}) {
  const [showRecovery, setShowRecovery] = useState(false)
  const [showRepeatRecovery, setShowRepeatRecovery] = useState(false)
  const [isQrModalOpen, setIsQrModalOpen] = useState(false)

  const handleSecureFieldEvent = (e) => {
    e.preventDefault()
  }

  const handleScanResult = (result) => {
    handleInputChange({ target: { name: "reference_id", value: result } })
    setIsQrModalOpen(false)
  }

  return (
    <div className="mt-6">
      {error ? <p className="text-red-500">{error}</p> : null}
      <div className="space-y-4 mt-4">
        <RegisterCountrySelect
          countries={countries}
          selectedCountry={selectedCountry}
          onChange={(option) => {
            setSelectedCountry(option)
            if (validationErrors.country) {
              // clear error outside
            }
          }}
          placeholder={t("register.countryPlaceholder", "Quốc gia (Nation)")}
          error={validationErrors.country}
        />
      </div>
      <div className="space-y-4 mt-4">
        <div className="grid grid-cols-1 items-center gap-4">
          <div className="relative w-full flex items-center">
            <input type="text" className="border p-2 rounded w-full" placeholder={t("register.accountNumberPlaceholder", "ID = SỐ TÀI KHOẢN NGÂN HÀNG")} name="bank_number" value={formData.bank_number} onChange={handleInputChange} />
            <span className="text-red-500 ml-2">*</span>
          </div>
        </div>
        <div className="grid grid-cols-1 items-center gap-4">
          <div className="relative w-full flex items-center">
            <select className="border p-2 rounded w-full" name="bank_name" value={formData.bank_name} onChange={handleInputChange}>
              <option value="">{t("register.selectBankPlaceholder", "Chọn ngân hàng (With bank)")}</option>
              {banks && banks.length > 0 ? (
                banks.map((bank) => (
                  <option key={bank.code} value={bank.shortName}>
                    {bank.name} ({bank.shortName})
                  </option>
                ))
              ) : (
                <option disabled>Loading banks...</option>
              )}
            </select>
            <span className="text-red-500 ml-2">*</span>
          </div>
          {validationErrors.bank_name ? <p className="text-red-500 text-sm mt-1">{validationErrors.bank_name}</p> : null}
        </div>
        <div className="grid grid-cols-1 items-center gap-4">
          <div className="relative w-full flex items-center">
            <div className="relative w-full">
              <input
                type={showRecovery ? "text" : "password"}
                className="border p-2 rounded w-full pr-10"
                placeholder={t("register.recoveryCharacterPlaceholder", "KÝ TỰ KHÔI PHỤC TÀI KHOẢN (Account recovery character)")}
                name="recovery_character"
                value={formData.recovery_character}
                onChange={handleInputChange}
                onCopy={handleSecureFieldEvent}
                onPaste={handleSecureFieldEvent}
                onCut={handleSecureFieldEvent}
                onContextMenu={handleSecureFieldEvent}
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                onClick={() => setShowRecovery(!showRecovery)}
              >
                {showRecovery ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            <span className="text-red-500 ml-2">*</span>
          </div>
          {validationErrors.recovery_character ? <p className="text-red-500 text-sm mt-1">{validationErrors.recovery_character}</p> : null}
        </div>
        <div className="grid grid-cols-1 items-center gap-4">
          <div className="relative w-full flex items-center">
            <div className="relative w-full">
              <input
                type={showRepeatRecovery ? "text" : "password"}
                className="border p-2 rounded w-full pr-10"
                placeholder={t("register.repeatRecoveryCharacterPlaceholder", "NHẬP LẠI KÝ TỰ KHÔI PHỤC TÀI KHOẢN (Repeat account recovery character)")}
                name="repeat_recovery_character"
                value={formData.repeat_recovery_character}
                onChange={handleInputChange}
                onCopy={handleSecureFieldEvent}
                onPaste={handleSecureFieldEvent}
                onCut={handleSecureFieldEvent}
                onContextMenu={handleSecureFieldEvent}
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                onClick={() => setShowRepeatRecovery(!showRepeatRecovery)}
              >
                {showRepeatRecovery ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            <span className="text-red-500 ml-2">*</span>
          </div>
          {validationErrors.repeat_recovery_character ? <p className="text-red-500 text-sm mt-1">{validationErrors.repeat_recovery_character}</p> : null}
        </div>
        <div className="grid grid-cols-1 items-center gap-4">
          <div className="relative w-full flex items-center">
            <button
              type="button"
              className="mr-2 p-2 bg-gray-200 rounded hover:bg-gray-300"
              onClick={() => setIsQrModalOpen(true)}
              title={t("register.scanQr", "Quét QR")}
            >
              <QrCode size={20} />
            </button>
            <input type="text" className="border p-2 rounded w-full" placeholder={t("register.referrerIdPlaceholder", "ID NGƯỜI GIỚI THIỆU")} name="reference_id" value={formData.reference_id} onChange={handleInputChange} />
            <span className="text-red-500 ml-2"></span>
            <span className="text-red-500 ml-2"> </span>
          </div>
          {validationErrors.reference_id ? <p className="text-red-500 text-sm mt-1">{validationErrors.reference_id}</p> : null}
        </div>
      </div>
      <div className="text-center mt-4">
        <button className={`border-2 border-black font-bold px-1 py-2 rounded flex-1  ${isFormValid() && !isVerifying ? "text-black hover:bg-gray-200" : "text-gray-400 bg-gray-100 cursor-not-allowed"}`} onClick={handleNextClick} disabled={!isFormValid() || isVerifying}>
          {t("register.next", "Tiếp Theo")} <br />
        </button>
      </div>
      {isQrModalOpen && <QRModalComponent isOpen={isQrModalOpen} onClose={() => setIsQrModalOpen(false)} onScanResult={handleScanResult} />}
    </div>
  )
}

RegisterStepOne.propTypes = {
  t: PropTypes.func.isRequired,
  error: PropTypes.string,
  countries: PropTypes.array.isRequired,
  banks: PropTypes.array,
  selectedCountry: PropTypes.object,
  setSelectedCountry: PropTypes.func.isRequired,
  validationErrors: PropTypes.object.isRequired,
  formData: PropTypes.object.isRequired,
  handleInputChange: PropTypes.func.isRequired,
  isFormValid: PropTypes.func.isRequired,
  isVerifying: PropTypes.bool.isRequired,
  handleNextClick: PropTypes.func.isRequired,
}
