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
      soGphd: '',
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

  const handleDownloadContract = async () => {
    setDlLoading((prev) => ({ ...prev, contract: true }));
    try {
      const authToken = localStorage.getItem('authToken');
      const response = await getMe(authToken);
      const user = response.data;
      await downloadContract({
        benAIdentityNumber: user?.identityNumber || user?.cccd || '',
        benAName: user?.full_name || user?.username || '',
        benAAddress: user?.address_no || '',
      });
    } catch (err) {
      alert('Lỗi tải hợp đồng: ' + err.message);
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

  const bankName = userData?.bank_name || '';
  const bankLabel = currentLang === 'vi'
    ? `TÀI KHOẢN ĐỊNH DANH TẠI NGÂN HÀNG${bankName ? ` ${bankName}` : ''}:`
    : `IDENTITY ACCOUNT AT BANK${bankName ? ` ${bankName}` : ''}:`;

  // Company logo = the globe/planet image (fallback to the bundled planet asset)
  const companyLogo = userData?.company_logo?.url || planetImage;

  return (
    <div className="w-full h-full px-1">
      {/* Two-column layout: left = company logo + personal avatar (stacked), right = name + table + status */}
      <div className="flex flex-row gap-2 items-start">

        {/* LEFT column: company logo (large) on top, personal avatar (small) directly below — same column */}
        <div className="flex flex-col items-center flex-shrink-0 w-16 sm:w-20">
          {/* Company logo — large, round */}
          <img
            src={companyLogo}
            alt="Company Logo"
            className="w-14 h-14 sm:w-16 sm:h-16 rounded-full object-cover border-2 border-gray-800"
          />
          {/* Personal avatar — small, round, aligned in the same column below the company logo */}
          <img
            src={userData?.avt?.url || DEFAULT_AVATAR}
            alt="avatar"
            className="w-9 h-9 sm:w-10 sm:h-10 rounded-full object-cover border-2 border-gray-800 mt-2"
          />
          <button onClick={fetchUserData} className="text-[9px] text-blue-600 underline mt-0.5">
            {currentLang === 'vi' ? 'Kiểm tra lại ảnh' : 'Recheck photo'}
          </button>
          <div className="font-bold text-[10px] sm:text-xs text-center break-words leading-tight mt-0.5">
            {userData?.full_name || 'NGUYEN VAN A'}
          </div>
        </div>

        {/* RIGHT column: company name header + info table + status text */}
        <div className="flex-1 min-w-0">
          {/* Company name header — above the table */}
          <div className="text-center mb-1">
            <h2 className="font-bold text-xs sm:text-sm md:text-base break-words leading-tight">
              {userData?.company_name || fallback.companyName}
            </h2>
          </div>

          {/* Info table */}
          <div className="border-2 border-black">
            <div className="w-full min-w-full company-info-table">
              <div className="text-[10px] flex flex-col">

                {/* Row 1: Số ĐKKD */}
                <div className="border-b border-black grid grid-cols-6 gap-0">
                  <div className="col-span-2 sm:p-2 border-r border-black font-bold bg-gray-100 text-[10px] break-words flex items-center">
                    <div className="break-words leading-tight pt-2 pb-2">
                      {currentLang === 'vi' ? 'Số ĐKKD:' : 'Business Reg. No.:'}
                    </div>
                  </div>
                  <div className="col-span-3 sm:p-2 border-r border-black text-[10px] flex items-center justify-center text-center">
                    <div className="break-all leading-tight">{userData?.cccd || fallback.mst}</div>
                  </div>
                  <div className="col-span-1 sm:p-2 flex items-center justify-center">
                    <button
                      type="button"
                      onClick={() => openDoc(userData?.tax_code_certificate?.url)}
                      disabled={!userData?.tax_code_certificate?.url}
                      className="text-[10px] py-1 px-1 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed leading-tight"
                    >
                      {currentLang === 'vi' ? 'Xem' : 'View'}
                    </button>
                  </div>
                </div>

                {/* Row 2: Số GPHD */}
                <div className="border-b border-black grid grid-cols-6 gap-0">
                  <div className="col-span-2 sm:p-2 border-r border-black font-bold bg-gray-100 text-[10px] break-words flex items-center">
                    <div className="break-words leading-tight pt-2 pb-2">
                      {currentLang === 'vi' ? 'Số GPHD:' : 'License No.:'}
                    </div>
                  </div>
                  <div className="col-span-3 sm:p-2 border-r border-black text-[10px] flex items-center justify-center text-center">
                    <div className="break-all leading-tight">{fallback.soGphd || '-'}</div>
                  </div>
                  <div className="col-span-1 sm:p-2 flex items-center justify-center">
                    <button
                      type="button"
                      onClick={() => openDoc(userData?.business_registration?.url)}
                      disabled={!userData?.business_registration?.url}
                      className="text-[10px] py-1 px-1 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed leading-tight"
                    >
                      {currentLang === 'vi' ? 'Xem' : 'View'}
                    </button>
                  </div>
                </div>

                {/* Row 3: Tài khoản định danh tại ngân hàng */}
                <div className="grid grid-cols-6 gap-0">
                  <div className="col-span-2 sm:p-2 border-r border-black font-bold bg-gray-100 text-[10px] break-words flex items-center">
                    <div className="break-words leading-tight pt-2 pb-2 uppercase">
                      {bankLabel}
                    </div>
                  </div>
                  <div className="col-span-3 sm:p-2 border-r border-black text-[10px] flex items-center justify-center text-center">
                    <div className="break-all leading-tight">{userData?.bank_number || '-'}</div>
                  </div>
                  <div className="col-span-1 sm:p-2 flex items-center justify-center">
                    <button
                      type="button"
                      onClick={() => openDoc(userData?.bank_certificate?.url)}
                      disabled={!userData?.bank_certificate?.url}
                      className="text-[10px] py-1 px-1 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed leading-tight"
                    >
                      {currentLang === 'vi' ? 'Xem' : 'View'}
                    </button>
                  </div>
                </div>

              </div>
            </div>
          </div>

          {/* Status text — registered for operation (in-panel text line, not a separate banner) */}
          <button
            onClick={handleDownloadContract}
            disabled={dlLoading.contract}
            className="mt-1 w-full flex items-center justify-center gap-1 text-[10px] font-bold text-orange-600 hover:text-orange-700 disabled:opacity-50 leading-tight"
          >
            {userData?.company_logo?.url ? (
              <img src={userData.company_logo.url} alt="" className="w-3 h-3 rounded-full object-cover flex-shrink-0" />
            ) : (
              <Building2 size={10} className="flex-shrink-0" />
            )}
            {dlLoading.contract
              ? '...'
              : (currentLang === 'vi'
                ? 'ĐÃ ĐĂNG KÝ HOẠT ĐỘNG (làm theo quy định pháp luật)'
                : 'REGISTERED FOR OPERATION (in accordance with the law)')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CompanyInfoTable;
