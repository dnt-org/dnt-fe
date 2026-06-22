import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { getMe } from '../services/authService';
import { uploadDocumentToStrapi } from '../services/businessService';
import { downloadContract } from '../services/contractService';

const DEFAULT_AVATAR = 'https://th.bing.com/th/id/OIP.aqzvZTh44zgk38UdpdE1KQHaHa?rs=1&pid=ImgDetMain';

const fileToDataUrl = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

const CompanyInfoTable = ({ userCountry = 'vi' }) => {
  const { i18n } = useTranslation();
  const currentLang = i18n.language || 'vi';
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [dlLoading, setDlLoading] = useState({ contract: false });
  const [uploading, setUploading] = useState({ tax_code_certificate: false, business_registration: false });
  const taxFileInputRef = useRef(null);
  const licenseFileInputRef = useRef(null);

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

  // Mock data for different countries as fallback when a real field is missing
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

  const handleUploadDocument = async (file, type) => {
    if (!file) return;
    setUploading((prev) => ({ ...prev, [type]: true }));
    try {
      const dataUrl = await fileToDataUrl(file);
      await uploadDocumentToStrapi(dataUrl, type);
      alert(currentLang === 'vi' ? 'Tải lên thành công' : 'Upload successful');
    } catch (err) {
      alert((currentLang === 'vi' ? 'Lỗi tải file: ' : 'Upload failed: ') + err.message);
    } finally {
      setUploading((prev) => ({ ...prev, [type]: false }));
    }
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

  return (
    <div className="w-full h-full px-1">
      {/* TODO(dev): remove this marker once the new top-left position is confirmed */}
      <div className="text-center text-[9px] text-orange-500">(vị trí mới)</div>

      {/* Avatar */}
      <div className="flex flex-col items-center mb-1">
        <img
          src={userData?.avt?.url || DEFAULT_AVATAR}
          alt="avatar"
          className="w-12 h-12 rounded-full object-cover border-2 border-gray-800"
        />
        <button onClick={fetchUserData} className="text-[9px] text-blue-600 underline mt-0.5">
          {currentLang === 'vi' ? 'Kiểm tra lại ảnh' : 'Recheck photo'}
        </button>
      </div>

      {/* Company Name Header */}
      <div className="text-center mb-1 sm:mb-1 md:mb-1">
        <h2 className="font-bold text-xs sm:text-sm md:text-lg break-words leading-tight">
          {userData?.full_name || fallback.companyName}
        </h2>
      </div>

      {/* Main Table */}
      <div className="flex-1 overflow-auto">
        <div className="border-2 border-black h-full min-h-0">
          <div className="overflow-auto h-full">
            <div className="w-full min-w-full company-info-table border-b border-black">
              <div className="text-[10px] flex flex-col">
                {/* Row: Mã số kinh doanh (MSKD) + upload */}
                <div className="border-b border-black grid grid-cols-6 gap-0">
                  <div className="col-span-1 sm:p-2 border-r border-black font-bold bg-gray-100 text-[10px] break-words flex items-center">
                    <div className="break-words leading-tight pt-2 pb-2">
                      {currentLang === 'vi' ? 'MSKD:' : 'Tax code:'}
                    </div>
                  </div>
                  <div className="col-span-3 sm:p-2 border-r border-black text-[10px] flex items-center justify-center text-center">
                    <div className="break-all leading-tight">{userData?.cccd || fallback.mst}</div>
                  </div>
                  <div className="col-span-2 sm:p-2 flex items-center justify-center">
                    <input
                      ref={taxFileInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handleUploadDocument(e.target.files?.[0], 'tax_code_certificate')}
                    />
                    <button
                      type="button"
                      onClick={() => taxFileInputRef.current?.click()}
                      disabled={uploading.tax_code_certificate}
                      className="text-[10px] py-1 px-1 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 leading-tight"
                    >
                      {uploading.tax_code_certificate ? '...' : (currentLang === 'vi' ? 'Upload' : 'Upload')}
                    </button>
                  </div>
                </div>

                {/* Row: Giấy phép hoạt động (GPHĐ) + upload */}
                <div className="border-b border-black grid grid-cols-6 gap-0">
                  <div className="col-span-1 sm:p-2 border-r border-black font-bold bg-gray-100 text-[10px] break-words flex items-center">
                    <div className="break-words leading-tight pt-2 pb-2">
                      {currentLang === 'vi' ? 'GPHĐ:' : 'License:'}
                    </div>
                  </div>
                  <div className="col-span-3 sm:p-2 border-r border-black text-[10px] flex items-center justify-center text-center">
                    <div className="break-all leading-tight">{fallback.soGphd || '-'}</div>
                  </div>
                  <div className="col-span-2 sm:p-2 flex items-center justify-center">
                    <input
                      ref={licenseFileInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handleUploadDocument(e.target.files?.[0], 'business_registration')}
                    />
                    <button
                      type="button"
                      onClick={() => licenseFileInputRef.current?.click()}
                      disabled={uploading.business_registration}
                      className="text-[10px] py-1 px-1 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 leading-tight"
                    >
                      {uploading.business_registration ? '...' : (currentLang === 'vi' ? 'Upload' : 'Upload')}
                    </button>
                  </div>
                </div>

                {/* Row: Số tài khoản / Ngân hàng */}
                <div className="border-b border-black grid grid-cols-6 gap-0">
                  <div className="col-span-1 sm:p-2 border-r border-black font-bold bg-gray-100 text-[10px] break-words flex items-center">
                    <div className="break-words leading-tight pt-2 pb-2">
                      {currentLang === 'vi' ? 'STK:' : 'ACCOUNT:'}
                    </div>
                  </div>
                  <div className="col-span-2 sm:p-2 border-r border-black text-[10px] flex items-center justify-center text-center">
                    <div className="break-all leading-tight">{userData?.bank_number || '-'}</div>
                  </div>
                  <div className="col-span-1 sm:p-2 border-r border-black font-bold bg-gray-100 text-[10px] flex items-center">
                    <div className="leading-tight pt-2 pb-2">
                      {currentLang === 'vi' ? 'NGÂN HÀNG:' : 'Bank:'}
                    </div>
                  </div>
                  <div className="col-span-2 sm:p-2 text-[10px] flex items-center justify-center text-center">
                    <div className="break-words leading-tight">{userData?.bank_name || '-'}</div>
                  </div>
                </div>

                {/* Row: Email hóa đơn điện tử */}
                <div className="grid grid-cols-6 gap-0">
                  <div className="col-span-1 sm:p-2 border-r border-black font-bold bg-gray-100 text-[10px] break-words align-top flex items-center">
                    <div className="break-words leading-tight pt-2 pb-2">
                      {currentLang === 'vi' ? 'EMAIL HĐ:' : 'INVOICE EMAIL:'}
                    </div>
                  </div>
                  <div className="col-span-5 sm:p-2 text-[10px] align-top flex items-center justify-center text-center">
                    <div className="break-words leading-tight">{userData?.email || '-'}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Signed member registration contract */}
      <div className="flex gap-1 mt-1">
        <button
          onClick={handleDownloadContract}
          disabled={dlLoading.contract}
          className="flex-1 text-[10px] py-1 px-1 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50 leading-tight"
        >
          {dlLoading.contract
            ? '...'
            : (currentLang === 'vi' ? 'HỢP ĐỒNG ĐĂNG KÝ TÀI KHOẢN THÀNH VIÊN (đã ký)' : 'Signed member registration contract')}
        </button>
      </div>
    </div>
  );
};

export default CompanyInfoTable;
