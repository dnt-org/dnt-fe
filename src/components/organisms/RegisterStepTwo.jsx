import React from "react"
import PropTypes from "prop-types"

export default function RegisterStepTwo({
  t,
  handleContractDownload,
  isReadContract,
  handleRegister,
  isContractModalOpen,
  contractFiles,
  contractActiveIndex,
  setContractActiveIndex,
  isContractLoading,
  contractError,
  handleCloseContractModal,
}) {
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
      {isContractModalOpen ? (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/60">
          <div className="bg-white rounded-lg shadow-xl w-[90vw] h-[90vh] flex flex-col">
            <div className="flex items-center justify-between px-4 py-2 border-b">
              <h2 className="font-semibold text-lg">{t("register.contractPreviewTitle", "Xem hợp đồng và tài liệu liên quan")}</h2>
              <button className="text-gray-600 hover:text-black" onClick={handleCloseContractModal}>
                ✕
              </button>
            </div>
            <div className="flex-1 flex flex-col">
              {isContractLoading ? (
                <div className="flex-1 flex items-center justify-center">
                  <span>{t("common.loading", "Đang tải...")}</span>
                </div>
              ) : contractFiles && contractFiles.length > 0 ? (
                <>
                  <div className="flex-1">
                    <iframe
                      key={contractFiles[contractActiveIndex]?.url}
                      src={contractFiles[contractActiveIndex]?.url}
                      className="w-full h-full"
                      title={contractFiles[contractActiveIndex]?.label || "contract-file"}
                    />
                  </div>
                  <div className="border-t px-4 py-2 flex items-center justify-between">
                    <button
                      type="button"
                      className="px-3 py-1 rounded border text-sm disabled:opacity-50"
                      disabled={contractFiles.length <= 1}
                      onClick={() => {
                        if (!contractFiles.length) return
                        const nextIndex = (contractActiveIndex - 1 + contractFiles.length) % contractFiles.length
                        setContractActiveIndex(nextIndex)
                      }}
                    >
                      {t("common.previous", "Trước")}
                    </button>
                    <div className="text-sm">
                      {contractFiles[contractActiveIndex]?.label || ""} ({contractActiveIndex + 1}/{contractFiles.length})
                    </div>
                    <div className="flex items-center gap-2">
                      <a
                        href={contractFiles[contractActiveIndex]?.url}
                        target="_blank"
                        rel="noreferrer"
                        className="px-3 py-1 rounded border bg-blue-600 text-white text-sm hover:bg-blue-700"
                      >
                        {t("detailOfGoods.downloadFile", "DOWNLOAD FILE")}
                      </a>
                      <button
                        type="button"
                        className="px-3 py-1 rounded border text-sm disabled:opacity-50"
                        disabled={contractFiles.length <= 1}
                        onClick={() => {
                          if (!contractFiles.length) return
                          const nextIndex = (contractActiveIndex + 1) % contractFiles.length
                          setContractActiveIndex(nextIndex)
                        }}
                      >
                        {t("common.next", "Sau")}
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center">
                  <span>{t("register.noContractFiles", "Không có file để hiển thị")}</span>
                </div>
              )}
              {contractError ? (
                <div className="px-4 py-2 text-red-600 text-sm border-t">{contractError}</div>
              ) : null}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  )
}

RegisterStepTwo.propTypes = {
  t: PropTypes.func.isRequired,
  handleContractDownload: PropTypes.func.isRequired,
  isReadContract: PropTypes.bool.isRequired,
  handleRegister: PropTypes.func.isRequired,
  isContractModalOpen: PropTypes.bool,
  contractFiles: PropTypes.array,
  contractActiveIndex: PropTypes.number,
  setContractActiveIndex: PropTypes.func,
  isContractLoading: PropTypes.bool,
  contractError: PropTypes.string,
  handleCloseContractModal: PropTypes.func,
}
