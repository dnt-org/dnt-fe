import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from 'react-i18next';
import { Home as HomeIcon, KeyboardIcon as KeyboardIconIcon } from 'lucide-react';
import { createDeposit, getWalletFromToken } from "../services/walletService";

const AdditionalPaymentPage = () => {
  const { t } = useTranslation();
  const [color, setColor] = useState(localStorage.getItem("selectedColor"));
  const [user, setUser] = useState(null);
  const [wallet, setWallet] = useState(null);
  const [amount, setAmount] = useState("");
  const [bill, setBill] = useState(null);
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
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
    if (token) {
      getWalletFromToken(token)
        .then((res) => setWallet(res.data))
        .catch(() => setMessage("Không lấy được ví. Vui lòng đăng nhập lại."));
    }
  }, [color]);

  const handleSubmit = async () => {
    if (!user) {
      setMessage("Vui lòng đăng nhập lại.");
      return;
    }
    if (!amount || Number(amount) <= 0) {
      setMessage("Vui lòng nhập số tiền hợp lệ.");
      return;
    }
    if (!bill) {
      setMessage("Vui lòng tải biên lai.");
      return;
    }

    try {
      setIsSubmitting(true);
      setMessage("");
      await createDeposit({ authToken: user, wallet, amount: Number(amount), bill });
      setAmount("");
      setBill(null);
      setMessage("Đã gửi yêu cầu nạp tiền.");
    } catch (error) {
      setMessage(error.response?.data?.error?.message || error.message || "Không tạo được yêu cầu nạp tiền.");
    } finally {
      setIsSubmitting(false);
    }
  };
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
            <input
              type="number"
              min={0}
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="border"
              placeholder={t('additionalPayment.enterPlaceholder')}
            />
          </span>
        </div>
      </div>

      {/* Tải biên lai */}
      <label className="block border border-black p-3 mt-2 text-center font-bold rounded cursor-pointer">
        {t('additionalPayment.uploadReceipt')}
        <input
          type="file"
          accept="image/*,.pdf"
          className="hidden"
          onChange={(e) => setBill(e.target.files?.[0] || null)}
        />
        {bill && <div className="text-sm font-normal mt-2">{bill.name}</div>}
      </label>

      {/* Chấp nhận */}
      <button
        type="button"
        disabled={isSubmitting}
        onClick={handleSubmit}
        className="w-full border border-black p-3 mt-2 text-center font-bold rounded disabled:opacity-50"
      >
        {t('additionalPayment.accept')}
      </button>

      {message && <div className="border border-black p-2 mt-2 text-center font-bold">{message}</div>}
    </div>
  );
};

export default AdditionalPaymentPage;
