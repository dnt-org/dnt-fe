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
          />
        )}
        {page === 2 && (
          <RegisterStepTwo
            t={t}
            handleContractDownload={handleContractDownload}
            isReadContract={isReadContract}
            handleRegister={handleRegister}
            isContractModalOpen={isContractModalOpen}
            contractFiles={contractFiles}
            contractActiveIndex={contractActiveIndex}
            setContractActiveIndex={setContractActiveIndex}
            isContractLoading={isContractLoading}
            contractError={contractError}
            handleCloseContractModal={handleCloseContractModal}
          />
        )}
      </div>
    </div>
  );
}
