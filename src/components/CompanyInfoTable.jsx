import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Building2 } from 'lucide-react';
import { getMe } from '../services/authService';
import { downloadContract } from '../services/contractService';
import planetImage from '../assets/planet.jpg';

const DEFAULT_AVATAR = 'https://th.bing.com/th/id/OIP.aqzvZTh44zgk38UdpdE1KQHaHa?rs=1&pid=ImgDetMain';

const CompanyInfoTable = ({ userCountry = 'vi' }) => {
  const { i18n } = useTranslation();
  const currentLang = i18n.language || 'vi';
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [dlLoading, setDlLoading] = useState({ contract: false });

  const countryData = {
    vi: {
      companyName: 'CÔNG TY TNHH ĐẠI NGHĨA TÍN',
      mst: '3702678200',
      soGphd: '1234567890',
    },
    en: {
      companyName: 'US TECHNOLOGY CORPORATION',
      mst: '9876543210',
      soGphd: 'GP987654321',
    },
  };
  const fallback = countryData[userCountry] || countryData.vi;

  const fetchUserData = async () => {
    setLoading(true);
    try {
      const authToken = localStorage.getItem('authToken');
      if (authToken) {
        const response = await getMe(authToken);
        setUserData(response.data);
      } else {
        const storedUser = localStorage.getItem('user');
        if (storedUser) setUserData(JSON.parse(storedUser));
      }
    } catch (err) {
      console.error('Error fetching user data:', err);
      const storedUser = localStorage.getItem('user');
      if (storedUser) setUserData(JSON.parse(storedUser));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  const openDoc = (url) => {
    if (url) window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleViewContract = async () => {
    setDlLoading((prev) => ({ ...prev, contract: true }));
    try {
      const authToken = localStorage.getItem('authToken');
      const response = await getMe(authToken);
      const user = response.data;
      const blob = await downloadContract({
        benAIdentityNumber: user?.identityNumber || user?.cccd || '',
        benAName: user?.full_name || user?.username || '',
        benAAddress: user?.address_no || '',
        returnBlob: true,
      });
      if (blob instanceof Blob) {
        const url = window.URL.createObjectURL(blob);
        window.open(url, '_blank', 'noopener,noreferrer');
      }
    } catch (err) {
      alert('Lỗi xem hợp đồng: ' + err.message);
    } finally {
      setDlLoading((prev) => ({ ...prev, contract: false }));
    }
  };

  if (loading) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 mx-auto mb-2"></div>
          <p>Đang tải thông tin...</p>
        </div>
      </div>
    );
  }

  const bankName = userData?.bank_name || 'VIETINBANK';
  const bankLabel = currentLang === 'vi'
    ? `TÀI KHOẢN ĐỊNH DANH TẠI NGÂN HÀNG ${bankName}`
    : `IDENTITY ACCOUNT AT BANK ${bankName}`;

  const companyLogo = userData?.company_logo?.url || planetImage;

  return (
    <div className="w-full h-full px-4 py-4">
      {/* Main layout: 2 columns — left logo+avatar, right info box */}
      <div className="flex flex-row gap-6 items-start">

        {/* LEFT COLUMN: Company logo + user avatar (centered column) */}
        <div className="flex flex-col items-center flex-shrink-0 w-auto">
          {/* Company logo — LARGE, round, main focal point */}
          <img
            src={companyLogo}
            alt="Company Logo"
            className="w-32 h-32 sm:w-40 sm:h-40 rounded-full object-cover border-4 border-blue-700 shadow-lg"
          />

          {/* User avatar — small, round, centered below logo */}
          <img
            src={userData?.avt?.url || DEFAULT_AVATAR}
            alt="avatar"
            className="w-12 h-12 sm:w-14 sm:h-14 rounded-full object-cover border-2 border-blue-700 mt-4"
          />

          {/* User name — centered, uppercase */}
          <div className="font-bold text-sm sm:text-base text-center mt-2 break-words leading-tight">
            {(userData?.full_name || 'NGUYEN VAN A').toUpperCase()}
          </div>
        </div>

        {/* RIGHT COLUMN: Info box (framed with border) */}
        <div className="flex-1 min-w-0 border-2 border-black rounded">

          {/* Header — Company name (blue, centered, inside frame) */}
          <div className="border-b-2 border-black p-3 text-center">
            <h2 className="font-bold text-sm sm:text-base text-blue-700">
              {userData?.company_name || fallback.companyName}
            </h2>
          </div>

          {/* Info table rows */}
          <div className="divide-y divide-black text-xs sm:text-sm">

            {/* Row 1: Số ĐKKD */}
            <div className="flex items-center">
              <div className="flex-0 border-r-2 border-black bg-gray-100 p-2 font-bold min-w-max">
                {currentLang === 'vi' ? 'Số ĐKKD:' : 'Business Reg. No.:'}
              </div>
              <div className="flex-1 p-2 text-center">
                {userData?.cccd || fallback.mst}
              </div>
              <div className="flex-0 border-l-2 border-black p-2">
                <button
                  type="button"
                  onClick={() => openDoc(userData?.tax_code_certificate?.url)}
                  disabled={!userData?.tax_code_certificate?.url}
                  className="text-xs py-1 px-2 bg-blue-700 text-white rounded hover:bg-blue-800 disabled:opacity-40 disabled:cursor-not-allowed font-medium"
                >
                  {currentLang === 'vi' ? 'Xem' : 'View'}
                </button>
              </div>
            </div>

            {/* Row 2: Số GPHD */}
            <div className="flex items-center">
              <div className="flex-0 border-r-2 border-black bg-gray-100 p-2 font-bold min-w-max">
                {currentLang === 'vi' ? 'Số GPHĐ:' : 'License No.:'}
              </div>
              <div className="flex-1 p-2 text-center">
                {fallback.soGphd || '-'}
              </div>
              <div className="flex-0 border-l-2 border-black p-2">
                <button
                  type="button"
                  onClick={() => openDoc(userData?.business_registration?.url)}
                  disabled={!userData?.business_registration?.url}
                  className="text-xs py-1 px-2 bg-blue-700 text-white rounded hover:bg-blue-800 disabled:opacity-40 disabled:cursor-not-allowed font-medium"
                >
                  {currentLang === 'vi' ? 'Xem' : 'View'}
                </button>
              </div>
            </div>

            {/* Row 3: Tài khoản định danh tại ngân hàng (MERGED label + value) */}
            <div className="flex items-center">
              <div className="flex-1 border-r-2 border-black bg-gray-100 p-2 font-bold">
                {bankLabel}
              </div>
              <div className="flex-0 border-l-2 border-black p-2">
                <button
                  type="button"
                  onClick={() => openDoc(userData?.bank_certificate?.url)}
                  disabled={!userData?.bank_certificate?.url}
                  className="text-xs py-1 px-2 bg-blue-700 text-white rounded hover:bg-blue-800 disabled:opacity-40 disabled:cursor-not-allowed font-medium"
                >
                  {currentLang === 'vi' ? 'Xem' : 'View'}
                </button>
              </div>
            </div>

            {/* Row 4: Registered for operation (INSIDE frame, blue) */}
            <button
              onClick={handleViewContract}
              disabled={dlLoading.contract}
              className="w-full flex items-center justify-center gap-2 p-3 text-blue-700 font-bold text-sm hover:text-blue-800 disabled:opacity-50 leading-tight"
            >
              {userData?.company_logo?.url ? (
                <img src={userData.company_logo.url} alt="" className="w-4 h-4 rounded-full object-cover flex-shrink-0" />
              ) : (
                <Building2 size={12} className="flex-shrink-0" />
              )}
              <span>
                {dlLoading.contract
                  ? '...'
                  : (currentLang === 'vi'
                    ? '(LOGO) ĐÃ ĐĂNG KÝ HOẠT ĐỘNG'
                    : '(LOGO) REGISTERED FOR OPERATION')}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanyInfoTable;
