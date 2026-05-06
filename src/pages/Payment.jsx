import React, { useState, useEffect } from "react";
import {
  getFavoriteWallets,
  getWalletFromToken,
} from "../services/walletService";
import { data, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Home as HomeIcon, KeyboardIcon as KeyboardIcon } from "lucide-react";

const GoodsPaymentPage = () => {
  const { t } = useTranslation();
  return (
    <>
      <div>
        <div className="grid grid-cols-10 border-blue-800">
          <div className="col-span-2  border-blue-800 p-2 font-bold text-sm">
            {t("payment.goodsAccount")}
          </div>
          <div className="col-span-1  border-blue-800 p-2 text-sm text-center">
            ({t("payment.money")})
          </div>
          <div className="col-span-1  border-blue-800 p-2 text-sm text-center">
            VNĐ
          </div>
          <div className="col-span-1"></div>
          <div className="col-span-2">
            <button className="border-1 px-6 py-2 font-bold rounded text-sm">
              {t("payment.transferToWallet")}
            </button>
          </div>
        </div>
        <div className="grid grid-cols-10 border-blue-800">
          <div className="col-span-4">
            <select name="" id="" className="border w-full">
              <option value="">{t("payment.posted")}</option>
              <option value="">{t("payment.joined")}</option>
            </select>
          </div>
        </div>
        <div className="grid grid-cols-10 border-blue-800">
          <div className="col-span-2  border-blue-800 p-2 font-bold text-sm">
            {t("payment.acceptingDeposit")}:
          </div>
          <div className="col-span-1  border-blue-800 p-2 text-sm text-center">
            ({t("payment.money")})
          </div>
          <div className="col-span-1  border-blue-800 p-2 text-sm text-center">
            VNĐ
          </div>
          <div className="col-span-5"></div>
        </div>
        <div className="grid grid-cols-10 border-blue-800">
          <div className="col-span-2  border-blue-800 p-2 font-bold text-sm">
            {t("payment.goodsId")}:
          </div>

          <div className="col-span-1  border-blue-800 p-2 text-sm text-center">
            <select name="" id="" className="border">
              <option value="">({t("payment.select")})</option>
              <option value="">1</option>
              <option value="">2</option>
              <option value="">3</option>
            </select>
          </div>
          <div className="col-span-1  border-blue-800 p-2 text-sm text-center">
            VNĐ
          </div>
          <div className="col-span-5"></div>
        </div>
        <div className="grid grid-cols-10 border-blue-800">
          <div className="col-span-2  border-blue-800 p-2 font-bold text-sm">
            {t("payment.status")}:
          </div>

          <div className="col-span-1  border-blue-800 p-2 text-sm text-center">
            ({t("payment.command")})
          </div>

          <div className="col-span-5"></div>
        </div>

        <div className="grid grid-cols-10 border-blue-800">
          <div className="col-span-2  border-blue-800 p-2 font-bold text-sm">
            {t("payment.initial")}:
          </div>
          <div className="col-span-1  border-blue-800 p-2 text-sm text-center">
            ({t("payment.money")})
          </div>
          <div className="col-span-1  border-blue-800 p-2 text-sm text-center">
            VNĐ
          </div>
          <div className="col-span-5"></div>
        </div>

        <div className="grid grid-cols-10 border-blue-800">
          <div className="col-span-2  border-blue-800 p-2 font-bold text-sm">
            {t("payment.actual")}:
          </div>
          <div className="col-span-1  border-blue-800 p-2 text-sm text-center">
            <input
              type="text"
              placeholder={t("payment.enterAmount")}
              className="w-10 h-10"
            />
          </div>
          <div className="col-span-1  border-blue-800 p-2 text-sm text-center">
            ({t("payment.handover")})
          </div>
          <div className="col-span-5"></div>
        </div>

        <div className="grid grid-cols-10 border-blue-800">
          <div className="col-span-2  border-blue-800 p-2 font-bold text-sm">
            {t("payment.deposit")}:
          </div>
          <div className="col-span-1  border-blue-800 p-2 text-sm text-center">
            ({t("payment.command")})
          </div>
          <div className="col-span-1  border-blue-800 p-2 text-sm text-center">
            VNĐ
          </div>
          <div className="col-span-5"></div>
        </div>

        <div className="grid grid-cols-10 border-blue-800">
          <div className="col-span-2  border-blue-800 p-2 font-bold text-sm">
            {t("payment.remainingAmount")}:
          </div>
          <div className="col-span-1  border-blue-800 p-2 text-sm text-center">
            ({t("payment.command")})
          </div>
          <div className="col-span-1  border-blue-800 p-2 text-sm text-center">
            VNĐ
          </div>
          <div className="col-span-5"></div>
        </div>

        <div className="grid grid-cols-8 border-blue-800">
          <div className="col-span-1"></div>
          <div className="col-span-2 flex justify-end my-4">
            <button className="border-3 px-6 py-2 font-bold rounded">
              {t("payment.confirm")}
            </button>
          </div>
        </div>

        {/* <div className="grid grid-cols-10 border-blue-800">
        <div className="col-span-2  border-blue-800 p-2 font-bold text-sm">
          SỐ TIỀN ĐANG KHÓA
          <div className="text-xs italic">(Pending)</div>
        </div>
        <div className="col-span-1  border-blue-800 p-2 text-sm text-center">
          ({t('payment.command')})
        </div>
        <div className="col-span-1  border-blue-800 p-2 text-sm text-center">
          VNĐ
        </div>
        <div className="col-span-5"></div>
      </div> */}
      </div>

      <div className="grid grid-cols-2 gap-2 p-2">
        <div className="grid gap-5 border-black-800 pr-2">
          <div className="border-3 p-3 font-bold text-center rounded-lg">
            {t("payment.deliveryAndReceivePayment")}
          </div>

          <div className="border-3 p-3 font-bold text-center rounded-lg">
            {t("payment.takeBackGoodsLose100")}
          </div>
          <div className="border-3 p-3 font-bold text-center rounded-lg">
            {t("payment.returnGoodsGet50")}
          </div>
        </div>

        <div className="grid gap-5 pl-2">
          <div className="border-3 p-3 font-bold text-center rounded-lg">
            {t("payment.receiveGoodsAndPayment")}
          </div>
          <div className="border-3 p-3 font-bold text-center rounded-lg">
            {t("payment.returnGoodsGet50")}
          </div>
          <div className="border-3 p-3 font-bold text-center rounded-lg">
            {t("payment.returnGoodsGet100")}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-8 border-t border-black-800">
        <div className="col-span-1 border-r border-black-800 p-2 font-bold text-sm">
          {t("payment.reason")}:
        </div>
        <div className="col-span-7">
          <input type="text" />
        </div>
      </div>
    </>
  );
};

const FreelancerPaymentPage = () => {
  const { t } = useTranslation();
  return (
    <>
      <div>
        <div className="grid grid-cols-10 border-blue-800">
          <div className="col-span-2  border-blue-800 p-2 font-bold text-sm">
            {t("payment.freelancerAccount")}:
          </div>
          <div className="col-span-1  border-blue-800 p-2 text-sm text-center">
            ({t("payment.money")})
          </div>
          <div className="col-span-1  border-blue-800 p-2 text-sm text-center">
            VNĐ
          </div>
          <div className="col-span-1"></div>
          <div className="col-span-2">
            <button className="border-1 px-6 py-2 font-bold rounded text-sm">
              {t("payment.transferToWallet")}
            </button>
          </div>
        </div>
        <div className="grid grid-cols-10 border-blue-800">
          <div className="col-span-4">
            <select name="" id="" className="border w-full">
              <option value="">{t("payment.posted")}</option>
              <option value="">{t("payment.joined")}</option>
            </select>
          </div>
        </div>
        <div className="grid grid-cols-10 border-blue-800">
          <div className="col-span-2  border-blue-800 p-2 font-bold text-sm">
            {t("payment.acceptingDeposit")}:
          </div>
          <div className="col-span-1  border-blue-800 p-2 text-sm text-center">
            ({t("payment.money")})
          </div>
          <div className="col-span-1  border-blue-800 p-2 text-sm text-center">
            VNĐ
          </div>
          <div className="col-span-5"></div>
        </div>
        <div className="grid grid-cols-10 border-blue-800">
          <div className="col-span-2  border-blue-800 p-2 font-bold text-sm">
            {t("payment.jobId")}:
          </div>

          <div className="col-span-1  border-blue-800 p-2 text-sm text-center">
            <select name="" id="" className="border">
              <option value="">({t("payment.select")})</option>
              <option value="">1</option>
              <option value="">2</option>
              <option value="">3</option>
            </select>
          </div>
          <div className="col-span-1  border-blue-800 p-2 text-sm text-center">
            VNĐ
          </div>
          <div className="col-span-5"></div>
        </div>
        <div className="grid grid-cols-10 border-blue-800">
          <div className="col-span-2  border-blue-800 p-2 font-bold text-sm">
            {t("payment.status")}:
          </div>

          <div className="col-span-1  border-blue-800 p-2 text-sm text-center">
            ({t("payment.command")})
          </div>

          <div className="col-span-5"></div>
        </div>

        <div className="grid grid-cols-10 border-blue-800">
          <div className="col-span-2  border-blue-800 p-2 font-bold text-sm">
            {t("payment.initial")}:
          </div>
          <div className="col-span-1  border-blue-800 p-2 text-sm text-center">
            ({t("payment.money")})
          </div>
          <div className="col-span-1  border-blue-800 p-2 text-sm text-center">
            VNĐ
          </div>
          <div className="col-span-5"></div>
        </div>

        <div className="grid grid-cols-10 border-blue-800">
          <div className="col-span-2  border-blue-800 p-2 font-bold text-sm">
            {t("payment.actual")}:
          </div>
          <div className="col-span-1  border-blue-800 p-2 text-sm text-center">
            <input
              type="text"
              placeholder={t("payment.enterAmount")}
              className="w-10 h-10"
            />
          </div>
          <div className="col-span-1  border-blue-800 p-2 text-sm text-center">
            ({t("payment.handover")})
          </div>
          <div className="col-span-5"></div>
        </div>

        <div className="grid grid-cols-10 border-blue-800">
          <div className="col-span-2  border-blue-800 p-2 font-bold text-sm">
            {t("payment.deposit")}:
          </div>
          <div className="col-span-1  border-blue-800 p-2 text-sm text-center">
            ({t("payment.command")})
          </div>
          <div className="col-span-1  border-blue-800 p-2 text-sm text-center">
            VNĐ
          </div>
          <div className="col-span-5"></div>
        </div>

        <div className="grid grid-cols-10 border-blue-800">
          <div className="col-span-2  border-blue-800 p-2 font-bold text-sm">
            {t("payment.remainingAmount")}:
          </div>
          <div className="col-span-1  border-blue-800 p-2 text-sm text-center">
            ({t("payment.command")})
          </div>
          <div className="col-span-1  border-blue-800 p-2 text-sm text-center">
            VNĐ
          </div>
          <div className="col-span-5"></div>
        </div>

        <div className="grid grid-cols-8 border-blue-800">
          <div className="col-span-1"></div>
          <div className="col-span-2 flex justify-end my-4">
            <button className="border-3 px-6 py-2 font-bold rounded">
              {t("payment.confirm")}
            </button>
          </div>
        </div>

        {/* <div className="grid grid-cols-10 border-blue-800">
        <div className="col-span-2  border-blue-800 p-2 font-bold text-sm">
          SỐ TIỀN ĐANG KHÓA
          <div className="text-xs italic">(Pending)</div>
        </div>
        <div className="col-span-1  border-blue-800 p-2 text-sm text-center">
          ({t('payment.command')})
        </div>
        <div className="col-span-1  border-blue-800 p-2 text-sm text-center">
          VNĐ
        </div>
        <div className="col-span-5"></div>
      </div> */}
      </div>

      <div className="grid grid-cols-2 gap-2 p-2">
        <div className="grid gap-5 border-black-800 pr-2">
          <div className="border-3 p-3 font-bold text-center rounded-lg">
            {t("payment.takeResultAndPayment")}
          </div>
          <div className="border-3 p-3 font-bold text-center rounded-lg">
            {t("payment.notTakeResultTake50")}
          </div>
          <div className="border-3 p-3 font-bold text-center rounded-lg">
            {t("payment.notDeliverWorkLost100")}
          </div>
        </div>

        <div className="grid gap-5 pl-2">
          <div className="border-3 p-3 font-bold text-center rounded-lg">
            {t("payment.completedWorkReceivePayment")}
          </div>
          <div className="border-3 p-3 font-bold text-center rounded-lg">
            {t("payment.notCompletedWorkLost100")}
          </div>
          <div className="border-3 p-3 font-bold text-center rounded-lg">
            {t("payment.notAcceptTake50")}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-8 border-t border-black-800">
        <div className="col-span-1 border-r border-black-800 p-2 font-bold text-sm">
          {t("payment.reason")}:
        </div>
        <div className="col-span-7">
          <input type="text" />
        </div>
      </div>
    </>
  );
};

const PaymentPage = () => {
  const { t } = useTranslation();
  const [color, setColor] = useState(localStorage.getItem("selectedColor"));
  const [expanded, setExpanded] = useState(false);
  const navigate = useNavigate();
  const [Page, setPage] = useState(null);
  const [user, setUser] = useState(null);

  const [wallet, setWallet] = useState({
    total: 0,
    account_of_goods: 0,
    account_of_freelancer: 0,
    account_of_ailive: 0,
    pending_amount: 0,
  });

  const [favorites, setFavorites] = useState([
    {
      id: 0,
      cccd: "(danh bạ)",
    },
  ]);

  const [favoriteWalletSelected, setFavoriteWalletSelected] = useState(
    favorites[0]
  );

  const handleChangeColor = (e) => {
    const newColor = e.target.value;
    setColor(newColor);
    localStorage.setItem("selectedColor", newColor);
  };

  useEffect(() => {
    document.getElementById("root").style.backgroundColor = color;
  }, [color]);

  function isNumberKey(evt) {
    var charCode = evt.which ? evt.which : evt.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) return false;
    return true;
  }

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    setUser(token);
    getWalletFromToken(token)
      .then((res) => {
        setWallet(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
    getFavoriteWallets(token)
      .then((res) => {
        setFavorites([...favorites, ...res.data?.wallets]);
        console.log(res.data?.wallets);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  return (
    <div className="flex justify-center py-8 px-4">
      <div className="w-full max-w-4xl rounded relative">
        {/* Header with Navigation */}
        <div className="flex items-center justify-between relative mb-6">
          <button
            className="text-red-600 hover:text-red-800"
            onClick={() => navigate("/")}
          >
            <HomeIcon size={28} />
          </button>

          <div className="flex-1 text-center">
            <h1 className="text-3xl font-bold inline-block relative">
              <span className="relative inline-block">
                9
                <input
                  type="color"
                  value={color}
                  onChange={handleChangeColor}
                  className="absolute left-1/2 transform -translate-x-1/2 top-full mt-1 w-10 h-8 cursor-pointer"
                />
              </span>
              &nbsp;- {t("payment.paymentTransaction")}
            </h1>
          </div>

          <button
            className="text-red-600 hover:text-red-800"
            onClick={() => navigate("/admin-control")}
          >
            <KeyboardIcon size={28} />
          </button>
        </div>

        {/* Main Content */}
        <div>
          {/* MÃ QR Row */}
          <div className="grid grid-cols-8">
            <div className="col-span-4 p-2 font-bold text-sm"></div>
            <div className="col-span-4 p-2 font-bold text-sm text-end">
              {t("payment.scanQr")}
            </div>
          </div>

          {/* Main Transaction Grid */}

          <div className="grid grid-cols-6 text-center text-sm">
            <div className="col-span-2 grid grid-cols-4 text-center text-sm">
              <div className="col-span-1 row-span-4 border p-2 font-bold flex flex-col items-start justify-center text-center">
                {t("payment.wallet")}
              </div>
              <div className="col-span-2 row-span-4 border p-2 flex flex-col items-center justify-center">
                {wallet?.total}
              </div>
              <div className="col-span-1 row-span-4 border p-2 flex flex-col items-center justify-center">
                VNĐ
              </div>
            </div>
            <div className="col-span-4 grid grid-cols-6 text-center text-sm">
              <div className="col-span-1 row-span-4 border p-2 font-bold flex flex-col items-center justify-center text-center">
                {t("payment.transfer")}
              </div>

              <div className="col-span-1 border p-2 font-bold">
                <label className="text-xl text-gray-500 mb-1 italic">
                  {t("payment.amount")}
                </label>
                <input
                  type="number"
                  min={0}
                  placeholder={t("payment.enterAmountPlaceholder")}
                  className="w-20 h-10 text-center"
                  pattern="[0-9]*"
                  onKeyDown={isNumberKey}
                />
                <span className="text-xs text-gray-500 mt-1 italic">
                  {t("payment.amountEn")}
                </span>
              </div>

              <div className="col-span-1 border p-2 font-bold">
                {t("payment.to")}
              </div>
              <div className="col-span-2 grid grid-cols-2 border">
                <div className="border p-2 flex justify-center items-center">
                  {t("payment.id")}
                </div>
                {/* <div className="border p-2">(danh bạ)</div> */}
                <select
                  className="border p-2"
                  value={favoriteWalletSelected.id}
                  defaultValue={0}
                  onChange={(e) => setFavoriteWalletSelected(e.target.value)}
                >
                  {favorites?.map((wallet) => (
                    <option key={wallet.id} value={wallet.id}>
                      {wallet.cccd}
                    </option>
                  ))}
                </select>
                {/* <div className="border p-2">(quét QR)</div> */}
              </div>

              <div className="col-span-1 row-span-4 border p-2 font-bold flex flex-col items-center justify-center text-center">
                {t("payment.accept")}
              </div>

              {/* Hàng 2: Tài khoản HÀNG HÓA */}
              <div className="col-span-1 border p-2 flex flex-col items-center">
                <label className="text-xl text-gray-500 mb-1 italic">
                  {t("payment.amount")}
                </label>
                <input
                  type="number"
                  min={0}
                  placeholder={t("payment.enterAmountPlaceholder")}
                  className="w-20 h-10 text-center"
                  pattern="[0-9]*"
                  onKeyDown={(e) => {
                    // allow control keys (backspace, delete, arrows, tab)
                    if (
                      [
                        "Backspace",
                        "Delete",
                        "ArrowLeft",
                        "ArrowRight",
                        "Tab",
                      ].includes(e.key)
                    ) {
                      return;
                    }
                    // block anything that is not a digit
                    if (!/^\d$/.test(e.key)) {
                      e.preventDefault();
                    }
                  }}
                  onPaste={(e) => {
                    const paste = e.clipboardData.getData("text");
                    if (!/^\d+$/.test(paste)) {
                      e.preventDefault(); // block if not digits only
                    }
                  }}
                />
                <span className="text-xs text-gray-500 mt-1 italic">
                  {t("payment.amountEn")}
                </span>
              </div>
              <div className="col-span-1 border p-2 font-bold">
                {t("payment.to")}
              </div>
              <div className="col-span-2 border p-2">
                {t("payment.accountOfGoods")}
              </div>

              {/* Hàng 3: Tài khoản CÔNG VIỆC TỰ DO */}
              <div className="col-span-1 border p-2 flex flex-col items-center">
                <label className="text-xl text-gray-500 mb-1 italic">
                  {t("payment.amount")}
                </label>
                <input
                  type="number"
                  min={0}
                  placeholder={t("payment.enterAmountPlaceholder")}
                  className="w-20 h-10 text-center"
                  onKeyDown={(e) => {
                    if (["e", "E", "+", "-", "."].includes(e.key)) {
                      e.preventDefault(); // block typing invalid chars
                    }
                  }}
                  onPaste={(e) => {
                    const paste = e.clipboardData.getData("text");
                    if (!/^\d+$/.test(paste)) {
                      e.preventDefault(); // block if not digits only
                    }
                  }}
                />
                <span className="text-xs text-gray-500 mt-1 italic">
                  {t("payment.amountEn")}
                </span>
              </div>
              <div className="col-span-1 border p-2 font-bold">
                {t("payment.to")}
              </div>
              <div className="col-span-2 border p-2">
                {t("payment.accountOfFreelancer")}
              </div>

              {/* Hàng 4: Tài khoản Ai LIVE */}
              <div className="col-span-1 border p-2 flex flex-col items-center">
                <label className="text-xl text-gray-500 mb-1 italic">
                  {t("payment.amount")}
                </label>
                <input
                  type="number"
                  min={0}
                  placeholder={t("payment.enterAmountPlaceholder")}
                  className="w-20 h-10 text-center"
                  onKeyDown={(e) => {
                    if (["e", "E", "+", "-", "."].includes(e.key)) {
                      e.preventDefault(); // block typing invalid chars
                    }
                  }}
                  onPaste={(e) => {
                    const paste = e.clipboardData.getData("text");
                    if (!/^\d+$/.test(paste)) {
                      e.preventDefault(); // block if not digits only
                    }
                  }}
                />
                <span className="text-xs text-gray-500 mt-1 italic">
                  {t("payment.amountEn")}
                </span>
              </div>
              <div className="col-span-1 border p-2 font-bold">
                {t("payment.to")}
              </div>
              <div className="col-span-2 border p-2">
                {t("payment.accountOfAiLive")}
              </div>
            </div>
          </div>

          <div>
            {/* First Row */}
            <div className="grid grid-cols-10 border-blue-800 mb-10 mt-5">
              <div className="col-span-2 border-blue-800 p-2 text-sm">
                {/* GỬI THÊM:
                <div>
                  <i>(INPUT ADDITION)</i>
                </div>
                RÚT RA:
                <div>
                  <i>(WITHDRAWNTH)</i>
                </div> */}
                <select name="" id="" className="h-full">
                  <option value="">{t("payment.inputAddition")}</option>
                  <option value="">{t("payment.withdrawnth")}</option>
                </select>
              </div>
              <div className="col-span-1 border-blue-800 p-2 text-sm text-center">
                <input
                  type="number"
                  min={0}
                  placeholder={t("payment.enterAmountPlaceholder")}
                  className="h-full"
                  pattern="[0-9]*"
                  onKeyDown={(e) => {
                    if (["e", "E", "+", "-", "."].includes(e.key)) {
                      e.preventDefault(); // block typing invalid chars
                    }
                  }}
                  onPaste={(e) => {
                    const paste = e.clipboardData.getData("text");
                    if (!/^\d+$/.test(paste)) {
                      e.preventDefault(); // block if not digits only
                    }
                  }}
                />
              </div>
              <div className="col-span-1 border-blue-800 p-2 text-sm text-center h-full flex items-center justify-center">
                VNĐ
              </div>
              <div className="col-span-1">
                <div className="border-3 border-black font-bold rounded cursor-pointer hover:bg-white-100 text-center">
                  {t("payment.accept")}
                </div>
              </div>
              <div className="col-span-2"></div>
              <div className="col-span-2">
                <div className="border-3 border-black font-bold rounded cursor-pointer hover:bg-white-100 text-center">
                  {t("payment.servicePayment")}
                </div>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2 p-2">
            <button
              onClick={() => {
                setPage(Page !== "goods" ? "goods" : null);
              }}
              className="grid gap-5 border-black-800 pr-2"
            >
              <div className="border-3 p-3 font-bold text-center rounded-lg">
                {t("payment.goods")}
              </div>
            </button>

            <button
              onClick={() => {
                setPage(Page !== "freelancer" ? "freelancer" : null);
              }}
              className="grid gap-5 pl-2"
            >
              <div className="border-3 p-3 font-bold text-center rounded-lg">
                {t("payment.freelancer")}
              </div>
            </button>
          </div>
          {/* Middle Section */}
          {/* <div>
           
            <div className="grid grid-cols-10 border-blue-800">
              <div className="col-span-2  border-blue-800 p-2 font-bold text-sm">
                TÀI KHOẢN HÀNG HÓA
                <div className="text-xs italic">(Goods account)</div>
              </div>
              <div className="col-span-1  border-blue-800 p-2 text-sm text-center">
                ({t('payment.money')})
              </div>
              <div className="col-span-1  border-blue-800 p-2 text-sm text-center">
                VNĐ
              </div>
              <div className="col-span-5"></div>
            </div>

            <div className="grid grid-cols-10 border-blue-800">
              <div className="col-span-2  border-blue-800 p-2 font-bold text-sm">
                ID HÀNG HÓA:
                <div className="text-xs italic">(ID of goods)</div>
              </div>
              <div className="col-span-1  border-blue-800 p-2 text-sm text-center">
                <select name="" id="" className="border">
                  <option value="">(Chọn)</option>
                  <option value="">1</option>
                  <option value="">2</option>
                  <option value="">3</option>
                </select>
              </div>
              <div className="col-span-1  border-blue-800 p-2 text-sm text-center">
                VNĐ
              </div>
              <div className="col-span-5"></div>
            </div>

            <div className="grid grid-cols-10 border-blue-800">
              <div className="col-span-2  border-blue-800 p-2 font-bold text-sm">
                BAN ĐẦU:
                <div className="text-xs italic">(Follow goods's ID)</div>
              </div>
              <div className="col-span-1  border-blue-800 p-2 text-sm text-center">
                ({t('payment.money')})
              </div>
              <div className="col-span-1  border-blue-800 p-2 text-sm text-center">
                VNĐ
              </div>
              <div className="col-span-5"></div>
            </div>

            <div className="grid grid-cols-10 border-blue-800">
              <div className="col-span-2  border-blue-800 p-2 font-bold text-sm">
                THỰC TẾ:
                <div className="text-xs italic">(Actual)</div>
              </div>
              <div className="col-span-1  border-blue-800 p-2 text-sm text-center text-center">
                <input
                  type="text"
                  placeholder={t('payment.enterAmount')}
                  className="w-10 h-10"
                />
              </div>
              <div className="col-span-1  border-blue-800 p-2 text-sm text-center">
                ({t('payment.handover')})
              </div>
              <div className="col-span-5"></div>
            </div>


            <div className="grid grid-cols-10 border-blue-800">
              <div className="col-span-2  border-blue-800 p-2 font-bold text-sm">
                ĐẶT CỌC:
                <div className="text-xs italic">(Deposit)</div>
              </div>
              <div className="col-span-1  border-blue-800 p-2 text-sm text-center">
                ({t('payment.command')})
              </div>
              <div className="col-span-1  border-blue-800 p-2 text-sm text-center">
                VNĐ
              </div>
              <div className="col-span-5"></div>
            </div>

            <div className="grid grid-cols-10 border-blue-800">
              <div className="col-span-2  border-blue-800 p-2 font-bold text-sm">
                CÒN LẠI
                <div className="text-xs italic">(Addition to pay)</div>
              </div>
              <div className="col-span-1  border-blue-800 p-2 text-sm text-center">
                ({t('payment.command')})
              </div>
              <div className="col-span-1  border-blue-800 p-2 text-sm text-center">
                VNĐ
              </div>
              <div className="col-span-5"></div>
            </div>

            <div className="grid grid-cols-8 border-blue-800">
              <div className="col-span-1"></div>
              <div className="col-span-2 flex justify-end my-4">
                <button className="border-3 px-6 py-2 font-bold rounded">
                  XÁC NHẬN
                  <div className="text-xs italic">(Accept)</div>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-10 border-blue-800">
              <div className="col-span-2  border-blue-800 p-2 font-bold text-sm">
                SỐ TIỀN ĐANG KHÓA
                <div className="text-xs italic">(Pending)</div>
              </div>
              <div className="col-span-1  border-blue-800 p-2 text-sm text-center">
                ({t('payment.command')})
              </div>
              <div className="col-span-1  border-blue-800 p-2 text-sm text-center">
                VNĐ
              </div>
              <div className="col-span-5"></div>
            </div>
          </div>


          <div className="grid grid-cols-2 gap-2 p-2">

            <div className="grid gap-5 border-black-800 pr-2">
              <div className="border-3 p-3 font-bold text-center rounded-lg">
                NHẬN HÀNG VÀ THANH TOÁN
                <div className="text-xs italic">
                  (Receive goods and payment)
                </div>
              </div>
              <div className="border-3 p-3 font-bold text-center rounded-lg">
                TRẢ LẠI HÀNG VÀ ĐƯỢC CỌC
                <div className="text-xs italic">
                  (Return goods and take deposit)
                </div>
              </div>
            </div>

            <div className="grid gap-5 pl-2">
              <div className="border-3 p-3 font-bold text-center rounded-lg">
                GIAO HÀNG VÀ NHẬN THANH TOÁN
                <div className="text-xs italic">
                  (Delivery goods and receive payment)
                </div>
              </div>
              <div className="border-3 p-3 font-bold text-center rounded-lg">
                NHẬN LẠI HÀNG VÀ BÙ CỌC
                <div className="text-xs italic">
                  (Return goods and lost deposit)
                </div>
              </div>
            </div>
          </div>

  
          <div className="grid grid-cols-8 border-t border-black-800">
            <div className="col-span-1 border-r border-black-800 p-2 font-bold text-sm">
              {t('payment.reason')}
            </div>
            <div className="col-span-7">
              <input type="text" />
            </div>
          </div> */}
          {Page === "goods" ? <GoodsPaymentPage /> : null}
          {Page === "freelancer" ? <FreelancerPaymentPage /> : null}
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;
