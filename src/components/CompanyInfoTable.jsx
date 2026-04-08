import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { getMe } from '../services/authService';

const CompanyInfoTable = ({ userCountry = 'vi' }) => {
  const { t, i18n } = useTranslation();
  const currentLang = i18n.language || 'vi';
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const authToken = localStorage.getItem('authToken');
        if (authToken) {
          const response = await getMe(authToken);
          setUserData(response.data);
        } else {
          // Fallback to localStorage user data if no token
          const storedUser = localStorage.getItem('user');
          if (storedUser) {
            setUserData(JSON.parse(storedUser));
          }
        }
      } catch (err) {
        console.error('Error fetching user data:', err);
        setError(err.message);
        // Fallback to localStorage user data on error
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          setUserData(JSON.parse(storedUser));
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  // Mock data for different countries as fallback
  const countryData = {
    vi: {
      companyName: 'CÔNG TY TNHH ĐẠI NGHĨA TÍN',
      companyNameEn: 'VIETNAM TECHNOLOGY CO., LTD',
      mst: '3702678200',
      stk: '',
      daiDien: 'VŨ VĂN NGHĨA',
      soGphd: '',
      nganHang: '',
      chucDanh: 'CEO',
      diaChi: 'TỔ 4, ẤP 5, AN PHƯỚC, ĐỒNG NAI, VIỆT NAM'
    },
    en: {
      companyName: 'US TECHNOLOGY CORPORATION',
      companyNameEn: 'US TECHNOLOGY CORPORATION',
      mst: '9876543210',
      stk: '0987654321',
      daiDien: 'John Smith',
      soGphd: 'GP987654321',
      nganHang: 'Bank of America',
      chucDanh: 'CE0',
      diaChi: '456 Main Street, New York, NY 10001, USA'
    }
  };

  // Create dynamic data based on user information
  const getDynamicData = () => {
    return countryData[userCountry] || countryData.vi;
  };

  const currentData = getDynamicData();

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
      <div className="w-full h-full flex flex-col">
        {/* Company Name Header */}
        <div className="text-center mb-1 sm:mb-1 md:mb-1">
          <h2 className="font-bold text-xs sm:text-sm md:text-lg break-words leading-tight">
            {currentData.companyName}
          </h2>
        </div>

        {/* Main Table */}
        <div className="flex-1 overflow-auto">
          <div className="border-2 border-black h-full min-h-0">
            <div className="overflow-auto h-full">
              <div className="w-full min-w-full company-info-table border-b border-black">
                <div className="text-[10px] flex flex-col">
                  {/* Row 1: STK / NGÂN HÀNG */}
                  <div className="border-b border-black grid grid-cols-6 gap-0">
                    {/* Col 1: STK Label */}
                    <div className="col-span-1 sm:p-2 border-r border-black font-bold bg-gray-100 text-[10px] break-words flex items-center">
                      <div className="break-words leading-tight pt-2 pb-2">
                        {currentLang === 'vi' ? 'STK:' : 'ACCOUNT:'}
                      </div>
                    </div>

                    {/* Col 2: STK Value */}
                    <div className="col-span-2 sm:p-2 border-r border-black text-[10px] flex items-center justify-center text-center">
                      <div className="break-all leading-tight">{currentData.stk}</div>
                    </div>

                    {/* Col 3: NGÂN HÀNG Label */}
                    <div className="col-span-1 sm:p-2 border-r border-black font-bold bg-gray-100 text-[10px] flex items-center">
                      <div className="leading-tight pt-2 pb-2">
                        {currentLang === 'vi' ? 'NGÂN HÀNG:' : 'Bank:'}
                      </div>
                    </div>

                    {/* Col 4: NGÂN HÀNG Value */}
                    <div className="col-span-2 sm:p-2 text-[10px] flex items-center justify-center text-center">
                      <div className="break-words leading-tight">{currentData.nganHang}</div>
                    </div>
                  </div>

                  {/* Row 2: ĐẠI DIỆN / CHỨC DANH */}
                  <div className="border-b border-black grid grid-cols-6 gap-0">
                    {/* Col 1: ĐẠI DIỆN Label */}
                    <div className="col-span-1 sm:p-2 border-r border-black font-bold bg-gray-100 text-[10px] break-words flex items-center">
                      <div className="break-words leading-tight pt-2 pb-2">
                        {currentLang === 'vi' ? 'ĐẠI DIỆN:' : 'REPRESENTATIVE:'}
                      </div>
                    </div>

                    {/* Col 2: ĐẠI DIỆN Value */}
                    <div className="col-span-2 sm:p-2 border-r border-black text-[10px] flex items-center justify-center text-center">
                      <div className="break-words leading-tight">{currentData.daiDien}</div>
                    </div>

                    {/* Col 3: CHỨC DANH Label */}
                    <div className="col-span-1 sm:p-2 border-r border-black font-bold bg-gray-100 text-[10px] break-words flex items-center">
                      <div className="break-words leading-tight pt-2 pb-2">
                        {currentLang === 'vi' ? 'CHỨC DANH:' : 'POSITION:'}
                      </div>
                    </div>

                    {/* Col 4: CHỨC DANH Value */}
                    <div className="col-span-2 sm:p-2 text-[10px] flex items-center justify-center text-center">
                      <div className="break-words leading-tight">{currentData.chucDanh}</div>
                    </div>
                  </div>

                  {/* Row 3: ĐỊA CHỈ (spans full width) */}
                  <div className="grid grid-cols-6 gap-0">
                    {/* Col 1: ĐỊA CHỈ Label */}
                    <div className="col-span-1 sm:p-2 border-r border-black font-bold bg-gray-100 text-[10px] break-words align-top flex items-center">
                      <div className="break-words leading-tight pt-2 pb-2">
                        {currentLang === 'vi' ? 'ĐỊA CHỈ:' : 'ADDRESS:'}
                      </div>
                    </div>

                    {/* Cols 2-4: ĐỊA CHỈ Value (spans 5 columns) */}
                    <div className="col-span-5 sm:p-2 text-[10px] align-top flex items-center justify-center text-center">
                      <div className="break-words leading-tight">{currentData.diaChi}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanyInfoTable;