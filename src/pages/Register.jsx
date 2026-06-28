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
import { renderAsync } from "docx-preview";
import PageHeaderWithOutColorPicker from '../components/PageHeaderWithOutColorPicker';
import useRegisterForm from "../hooks/useRegisterForm";
import RegisterStepOne from "../components/organisms/RegisterStepOne";
import RegisterStepTwo from "../components/organisms/RegisterStepTwo";


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
    banks,
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
  } = useRegisterForm(t);

  const docxContainerRef = React.useRef(null);
  const activeFile = contractFiles?.[contractActiveIndex];

  // Render docx preview whenever the active contract file changes
  React.useEffect(() => {
    if (!isContractModalOpen || isContractLoading) return;
    if (!activeFile || activeFile.kind !== "docx" || !activeFile.blob) return;
    const container = docxContainerRef.current;
    if (!container) return;
    container.innerHTML = "";
    renderAsync(activeFile.blob, container, null, { inWrapper: true }).catch((err) => {
      console.error("docx-preview render error:", err);
    });
  }, [isContractModalOpen, isContractLoading, activeFile]);

  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="bg-transparent backdrop-blur-md px-6 py-4 rounded-lg w-full max-w-4xl mx-auto">
        <PageHeaderWithOutColorPicker color={color} onColorChange={handleChangeColor} titlePrefix="1" title={t('register.registerTitle', 'ĐĂNG KÝ')} titleClassName="text-xl" />
        {page === 1 && (
          <RegisterStepOne
            t={t}
            error={error}
            countries={countries}
            banks={banks}
            selectedCountry={selectedCountry}
            setSelectedCountry={setSelectedCountry}
            validationErrors={validationErrors}
            formData={formData}
            handleInputChange={handleInputChange}
            isFormValid={isFormValid}
            isVerifying={isVerifying}
            handleNextClick={handleNextClick}
            handleBankNumberBlur={handleBankNumberBlur}
            isFetchingAccountName={isFetchingAccountName}
            accountNameError={accountNameError}
            handleContractDownload={handleContractDownload}
          />
        )}
        {page === 2 && (
          <RegisterStepTwo
            t={t}
            handleContractDownload={handleContractDownload}
            isReadContract={isReadContract}
            handleRegister={handleRegister}
          />
        )}
      </div>

      {/* Fix H: Contract preview modal — rendered at page level so it's available on both steps */}
      {isContractModalOpen ? (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/60">
          <div className="bg-white w-screen h-screen flex flex-col">
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
                  <div className="flex-1 overflow-auto bg-gray-100">
                    {activeFile?.kind === "docx" ? (
                      <div
                        ref={docxContainerRef}
                        className="w-full h-full overflow-auto p-4"
                      />
                    ) : (
                      <iframe
                        key={activeFile?.url}
                        src={activeFile?.url}
                        className="w-full h-full"
                        title={activeFile?.label || "contract-file"}
                      />
                    )}
                  </div>
                  <div className="border-t px-4 py-2 flex items-center justify-between">
                    <button
                      type="button"
                      className="px-3 py-1 rounded border text-sm disabled:opacity-50"
                      disabled={contractFiles.length <= 1}
                      onClick={() => {
                        if (!contractFiles.length) return;
                        const nextIndex = (contractActiveIndex - 1 + contractFiles.length) % contractFiles.length;
                        setContractActiveIndex(nextIndex);
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
                        download={contractFiles[contractActiveIndex]?.downloadName || true}
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
                          if (!contractFiles.length) return;
                          const nextIndex = (contractActiveIndex + 1) % contractFiles.length;
                          setContractActiveIndex(nextIndex);
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
  );
}
