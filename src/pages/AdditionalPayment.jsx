import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from 'react-i18next';
import { Home as HomeIcon, KeyboardIcon as KeyboardIconIcon } from 'lucide-react';

const AdditionalPaymentPage = () => {
  const { t } = useTranslation();
  const [color, setColor] = useState(localStorage.getItem("selectedColor"));
  const [expanded, setExpanded] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  
  const handleChangeColor = (e) => {
    const newColor = e.target.value;
    setColor(newColor);
    localStorage.setItem("selectedColor", newColor);
  };

  useEffect(() => {
    document.getElementById("root").style.backgroundColor = color;
    const token = localStorage.getItem("authToken");
    setUser(token);
  }, [color]);
  return (
    <div className="rounded max-w-2xl mx-auto p-4   ">
      <div className="flex items-center justify-between relative">
        <button 
          className="text-red-600 hover:text-red-800 relative"
          onClick={() => navigate("/")}
        >
          <HomeIcon size={28} />
        </button>
        {/* Tiêu đề ở giữa */}
        <div className="text-center mb-4 relative flex-1">
          <h1 className="text-3xl font-bold text-black relative inline-block">
            <span className="relative">
              9.1{/* input màu ngay dưới số 9.1 */}
              <input
                type="color"
                value={color}
                onChange={handleChangeColor}
                className="absolute left-1/2 transform -translate-x-1/2 top-full mt-1 w-10 h-8 cursor-pointer"
              />
            </span>
            &nbsp;- {t('additionalPayment.title')}
          </h1>
        </div>
        <button 
          className="text-red-600 hover:text-red-800"
          onClick={() => navigate("/admin-control")}
        >
          <KeyboardIconIcon size={28} />
        </button>
      </div>

      {/* Mã QR */}
      <div className=" p-2 mt-2 flex items-center">
        <span className="ml-2 font-bold">{t('payment.qr')}</span>
      </div>

      {/* Bảng thông tin */}
      <div className=" mt-2">
        <div className="grid grid-cols-2  p-2">
          <span className="font-bold">{t('additionalPayment.sendMore')}</span>
        </div>

        <div className="grid grid-cols-2  p-2">
          <span className="font-bold">
            {t('additionalPayment.accountHolder')}:
          </span>
          <span className="text-center">{t('additionalPayment.companyName')}</span>
        </div>

        <div className="grid grid-cols-2  p-2">
          <span className="font-bold">
            {t('additionalPayment.accountNumber')}:
          </span>
          <span className="text-center">({t('payment.command')})</span>
        </div>

        <div className="grid grid-cols-2  p-2">
          <span className="font-bold">
            {t('additionalPayment.bankName')}:
          </span>
          <span className="text-center">({t('payment.command')})</span>
        </div>

        <div className="grid grid-cols-2  p-2">
          <span className="font-bold">
            {t('additionalPayment.transferContent')}:
          </span>
          <span className="text-center">({t('payment.command')})</span>
        </div>

        <div className="grid grid-cols-2 p-2">
          <span className="font-bold">
            {t('additionalPayment.amount')}:
          </span>
          <span className="text-center">
            <input type="number" className="border" placeholder={t('additionalPayment.enterPlaceholder')} />
          </span>
        </div>
      </div>

      {/* Tải biên lai */}
      <div className="border border-black p-3 mt-2 text-center font-bold rounded">
        {t('additionalPayment.uploadReceipt')}
      </div>

      {/* Chấp nhận */}
      <div className="border border-black p-3 mt-2 text-center font-bold rounded">
        {t('additionalPayment.accept')}
      </div>
    </div>
  );
};

export default AdditionalPaymentPage;
