import React from "react"
import PropTypes from "prop-types"

export default function RegisterStepTwo({ t, handleContractDownload, isReadContract, handleRegister }) {
  return (
    <div className="mt-6">
      <button className="border-2 border-black text-black font-bold px-6 py-2 rounded text-center hover:bg-gray-200 mt-4 mb-4 flex w-full justify-center items-center" onClick={handleContractDownload}>
        <div className="flex flex-col items-center text-center">
          <p>
            {t("register.checkContract")} <em className="text-red-500">*</em>
          </p>
          <p>({t("register.clickToViewFile")})</p>
        </div>
      </button>
      <div className="flex items-start gap-2">
        <div className="flex flex-col items-center">
          <input type="checkbox" className="w-5 h-5" />
          <span className="text-red-500 text-lg">*</span>
        </div>
        <div className="text-left">
          {t("register.contractConfirmation", "Tôi xác nhận đã đọc, hiểu rõ và đồng ý, chấp nhận ký hợp đồng cũng như tuân thủ mọi điều khoản và điều kiện do website - app yêu cầu bao gồm thêm các nội dung sau:")} <br />
          <br />
          {/* <b>{t("register.term1", "1. Tự động đăng xuất sau 168 h đăng nhập.")}</b> <br />
          <br />
          <b>{t("register.term2", "2. Tự động khóa tài khoản sau 365 h (giờ) đăng xuất.")}</b>
          <br />
          <br />
          <b>{t("register.term3", "3. Tự động xóa tài khoản sau 365 ngày bị khóa.")}</b>
          <br />
          <br />
          <b>{t("register.term4", "4. Đăng nhập sai liên tiếp 05 lần sẽ bị khóa tài khoản.")}</b>
          <br />
          <br />
          <b>{t("register.term5", "5.Tự động xóa bài sau 365 ngày được đăng.")}</b>
          <br />
          <br />
          <b>{t("register.term6", "5.Tự động xóa bài sau 365 ngày được đăng.")}</b>
          <br />
          <br /> */}
        </div>
      </div>
      <div className="text-center mt-4">
        <button className="border-2 border-black text-black font-bold px-1 py-2 rounded hover:bg-gray-200 flex-1" onClick={() => handleRegister()} tooltip={!isReadContract ? "Vui lòng đọc và chấp nhận hợp đồng" : ""}>
          {t("register.registerTitle", "Đăng ký")}
        </button>
      </div>
    </div>
  )
}

RegisterStepTwo.propTypes = {
  t: PropTypes.func.isRequired,
  handleContractDownload: PropTypes.func.isRequired,
  isReadContract: PropTypes.bool.isRequired,
  handleRegister: PropTypes.func.isRequired,
}