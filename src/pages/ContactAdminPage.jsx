import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  Search, 
  Users, 
  UserPlus, 
  Settings, 
  Phone, 
  Video, 
  User, 
  Image as ImageIcon,
  Smile,
  Mic,
  Camera,
  MessageSquare,
  Building2,
  Bell,
  CheckSquare,
  Bookmark,
  QrCode
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function ContactAdminPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  // Mock data for contacts
  const contacts = [
    { id: 1, name: "TÊN ĐÃ LƯU", lastActive: "Người nt mới nhất ở trên cùng, cũ nhất ở dưới cùng (kể cả nội dung tn đã được xóa)", unread: 2, isNew: true },
    { id: 2, name: "TÊN ĐÃ LƯU", lastActive: "Tự động xóa tn sau 24h đã được đọc", unread: 0 },
    { id: 3, name: "TÊN ĐÃ LƯU", lastActive: "Chuột phải TÊN:", unread: 0 },
    { id: 4, name: "TÊN ĐÃ LƯU", lastActive: "", unread: 0 },
    { id: 5, name: "TÊN ĐÃ LƯU", lastActive: "mã hóa đầu cuối. Đẩy hết tn cho 2 bên nhận - gửi. Máy chủ không lưu trữ.", unread: 0 },
    { id: 6, name: "TÊN ĐÃ LƯU", lastActive: "", unread: 0 }
  ];

  return (
    <div className="flex h-screen w-full bg-white overflow-hidden text-sm">
      
      {/* Left-most narrow icon bar */}
      <div className="w-[64px] min-w-[64px] bg-[#E8EAED] flex flex-col items-center py-4 border-r border-gray-300">
        <div className="w-12 h-12 rounded-full border-2 border-blue-500 overflow-hidden mb-6 flex items-center justify-center bg-gray-300 cursor-pointer">
           <span className="text-xs">Avatar</span> {/* Placeholder for user avatar */}
        </div>
        
        <div className="flex flex-col gap-6 items-center flex-1">
          <MessageSquare className="text-blue-500 cursor-pointer" size={24} />
          <Users className="text-gray-600 cursor-pointer hover:text-blue-500" size={24} />
          <CheckSquare className="text-gray-600 cursor-pointer hover:text-blue-500" size={24} />
          <div className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold text-xs cursor-pointer shadow-md">
            Zalo
          </div>
          <Bookmark className="text-gray-600 cursor-pointer hover:text-blue-500" size={24} />
          <Bell className="text-gray-600 cursor-pointer hover:text-blue-500" size={24} />
        </div>
        
        <div className="mt-auto flex flex-col gap-6 items-center">
          <Settings className="text-gray-600 cursor-pointer hover:text-blue-500" size={24} />
        </div>
      </div>

      {/* Middle Contacts Column */}
      <div className="w-[320px] min-w-[320px] bg-white flex flex-col border-r border-gray-300">
        
        {/* Top specific stats showing total friends etc */}
        <div className="p-2 border-b border-gray-200">
             <div className="flex justify-between px-2 text-xs font-semibold mb-2">
                <div className="flex flex-col items-center">
                    <span>54321</span>
                    <span className="text-yellow-600">(số bạn)</span>
                </div>
                <div className="flex items-center gap-4">
                    <div className="flex flex-col items-center border border-blue-700 p-1 text-blue-700">
                        <Building2 size={16} />
                        <span>6 (cty)</span>
                    </div>
                    <div className="flex flex-col items-center border border-blue-700 p-1 text-blue-700">
                        <Users size={16} />
                        <span>5 (tổ chức)</span>
                    </div>
                </div>
             </div>
             <div className="flex gap-4 text-xs font-semibold px-2">
                 <span>2 (tn chưa đọc)</span>
                 <span>2 (cv)</span>
                 <span>3 (CV cần hoàn thành)</span>
             </div>
        </div>

        {/* Search Bar */}
        <div className="p-3 flex items-center gap-2 border-b border-gray-200">
          <div className="flex-1 bg-gray-100 flex items-center px-3 py-1.5 rounded-md">
            <Search className="text-gray-500 z-10" size={16} />
            <input 
              type="text" 
              placeholder={t('contact.search', 'Tìm kiếm')}
              className="bg-transparent border-none outline-none w-full ml-2 text-sm"
            />
          </div>
          <UserPlus className="text-gray-600 cursor-pointer" size={20} />
          <QrCode className="text-gray-600 cursor-pointer" size={20} />
          <div className="flex flex-col items-center text-[10px] text-red-600 font-bold leading-tight">
             <span>ds kb</span>
             <span>QR kết bạn</span>
          </div>
        </div>
        
        {/* Filter/Tabs */}
        <div className="flex border-b border-gray-200 text-sm font-semibold text-gray-600">
          <div className="flex-1 py-2 text-center text-red-600 border-b-2 border-red-600 cursor-pointer uppercase">GỌI NHÓM</div>
          <div className="flex-1 py-2 text-center cursor-pointer relative">
             bài đăng Ai LIVE
             <span className="absolute -top-1 right-2 text-red-600 text-xs">3 mới chưa xem</span>
          </div>
        </div>

        {/* Contact List */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden">
          {contacts.map((contact, index) => (
            <div key={contact.id} className={`flex items-start p-3 hover:bg-gray-100 cursor-pointer border-b border-gray-100 ${index === 0 ? 'bg-blue-50' : ''}`}>
              <div className="relative">
                <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-300 flex-shrink-0">
                  <img src="https://via.placeholder.com/48" alt="avatar" className="w-full h-full object-cover" />
                </div>
                {contact.id === 1 && (
                    <div className="absolute -bottom-1 -right-1 text-[10px] bg-white text-red-600 font-bold w-[40px] text-center rounded shadow-sm border border-gray-200">
                        ẩn avt đến Ai LIVE của họ
                    </div>
                )}
              </div>
              <div className="ml-3 flex-1 overflow-hidden">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-gray-800 uppercase">{contact.name}</span>
                  {contact.unread > 0 && (
                    <div className="flex flex-col items-end">
                      <span className="bg-red-500 text-white rounded-full w-4 h-4 flex items-center justify-center text-[10px] font-bold">
                        {contact.unread}
                      </span>
                      {contact.isNew && <span className="text-[10px] text-red-600 mt-1">tn mới chưa đọc</span>}
                    </div>
                  )}
                </div>
                <div className={`text-xs mt-1 truncate ${contact.id === 1 ? 'text-red-600 font-semibold whitespace-normal' : 'text-orange-600 whitespace-normal'}`}>
                  {contact.lastActive}
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Bottom Banner */}
        <div className="p-4 border-t border-gray-200 text-center">
            <div className="text-orange-500 font-bold mb-1">(quảng cáo che 5 s)</div>
            <div className="text-blue-700 font-bold uppercase">CÔNG TY TNHH ĐẠI NGHĨA TÍN</div>
            <div className="text-orange-500 font-bold">(cố định ở dưới cùng)</div>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col bg-[#F4F5F7]">
        {/* Header */}
        <div className="h-[60px] bg-white border-b border-gray-300 flex items-center justify-between px-4 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center overflow-hidden">
                <img src="/src/assets/logo.png" alt="logo" className="w-8" onError={(e) => { e.target.style.display = 'none'; }} />
            </div>
            <div className="font-bold text-blue-700 uppercase">
              CÔNG TY TNHH ĐẠI NGHĨA TÍN
            </div>
          </div>
          <div className="flex items-center gap-2 bg-blue-400 p-1 rounded">
            <div className="w-8 h-8 rounded border border-blue-600 flex items-center justify-center cursor-pointer text-white hover:bg-blue-500">
              <Phone size={18} />
            </div>
            <div className="w-8 h-8 rounded border border-blue-600 flex items-center justify-center cursor-pointer text-white hover:bg-blue-500">
              <Video size={18} />
            </div>
            <div className="w-8 h-8 rounded border border-blue-600 bg-purple-700 flex items-center justify-center cursor-pointer text-white">
              <User size={18} />
            </div>
          </div>
        </div>

        {/* Chat Content */}
        <div className="flex-1 overflow-y-auto p-6 flex flex-col bg-white">
            
            <div className="max-w-3xl w-full mx-auto space-y-6">
                
                {/* Form fields */}
                <div className="space-y-4 font-bold">
                    <div className="flex items-center justify-between border-b pb-2">
                        <span className="text-red-600 uppercase">{t('contact.enterAccountNumber', 'NHẬP SỐ TÀI KHOẢN')}</span>
                        <span className="text-blue-700">123456789</span>
                    </div>
                    <div className="text-center text-blue-500 text-sm">
                        (kiểm tra và chỉ dành cho stk đang bị khóa vĩnh viễn)
                    </div>
                    
                    <div className="flex items-center justify-between border-b pb-2">
                        <span className="text-red-600 uppercase">{t('contact.enterRecoveryChar', 'NHẬP KÝ TỰ KHÔI PHỤC TÀI KHOẢN')}</span>
                        <span className="text-blue-700">Abcd@123</span>
                    </div>
                    
                    <div className="flex items-center justify-between border-b pb-2">
                        <span className="text-red-600 uppercase">{t('contact.enterOtp', 'NHẬP MẬT MÃ OTP')}</span>
                        <span className="text-blue-700">12345678</span>
                    </div>
                    
                    <div className="flex items-center justify-between border-b pb-2">
                        <span className="text-red-600 uppercase">{t('contact.enterWalletId', 'NHẬP SỐ D CÓ TRONG VÍ')}</span>
                        <span className="text-blue-700">123</span>
                    </div>
                </div>

                {/* Instructions */}
                <div className="space-y-3 mt-10 font-bold text-[13px]">
                    <div className="text-red-600 uppercase">
                        - <span className="text-orange-500 normal-case">(đúng cả)</span> MẬT KHẨU MỚI CỦA BẠN LÀ "............" CÓ HIỆU LỰC TRONG 30 PHÚT. VUI LÒNG ĐĂNG NHẬP VÀ ĐỔI MẬT KHẨU CỦA BẠN.
                    </div>
                    
                    <div className="text-red-600 uppercase">
                        - <span className="text-orange-500 normal-case">(sai ít nhất 1 yêu cầu)</span> THÔNG TIN KHÔNG CHÍNH XÁC, VUI LÒNG THỬ LẠI SAU 30 PHÚT.
                    </div>
                    
                    <div className="text-red-600 uppercase">
                        - <span className="text-orange-500 normal-case">(sau 30 phút nếu vẫn nhập sai số D)</span> SỐ D CHƯA CHÍNH XÁC, VUI LÒNG XÁC MINH CĂN CƯỚC CÔNG DÂN / MÃ SỐ THUẾ. <span className="text-blue-500 normal-case">(đúng thì mở, sai thì khóa)</span>
                    </div>

                    <div className="flex justify-center my-4">
                        <div className="flex flex-col items-center">
                            <div className="border-4 border-black rounded-md p-2 hover:bg-gray-100 cursor-pointer">
                                <Camera size={32} />
                            </div>
                            <span className="text-orange-500 font-bold text-center mt-1">(ấn để<br/>xác minh)</span>
                        </div>
                    </div>

                    <div className="text-red-600 uppercase">
                        - <span className="text-orange-500 normal-case">(sau 30 phút nếu vẫn nhập sai ký tự khôi phục tài khoản hoặc mật mã OTP)</span> TÀI KHOẢN CỦA BẠN ĐÃ BỊ KHÓA, VUI LÒNG LIÊN HỆ TRỰC TIẾP HOẶC TRỰC TUYẾN VỚI CHỦ NỀN TẢNG ĐỂ ĐƯỢC XỬ LÝ.
                    </div>
                    <div className="text-blue-500 lowercase">
                        (nút gọi video call được mở)
                    </div>
                </div>

            </div>
        </div>

        {/* Bottom Input Area */}
        <div className="h-auto bg-white border-t border-gray-300">
            {/* Toolbar */}
            <div className="flex items-center gap-4 px-4 py-2 border-b border-gray-100">
                <div className="font-bold text-gray-500 cursor-pointer hover:text-gray-800">A<span className="text-xs ml-1">v</span></div>
                <div className="w-5 h-5 bg-red-600 rounded-sm cursor-pointer"></div>
                <ImageIcon className="text-gray-500 cursor-pointer hover:text-gray-800" size={20} />
            </div>
            
            {/* Input field */}
            <div className="flex items-end px-4 py-3 min-h-[60px]">
                <textarea 
                    placeholder={t('contact.typeMessage', 'Nhập tin nhắn tới A')}
                    className="flex-1 max-h-32 min-h-[40px] resize-none border-none outline-none text-[15px] bg-transparent pb-1"
                    rows={1}
                ></textarea>
                <div className="flex items-center gap-3 ml-2 mb-1">
                    <Smile className="text-gray-500 cursor-pointer hover:text-gray-800" size={22} />
                    <Mic className="text-gray-500 cursor-pointer hover:text-gray-800" size={22} />
                </div>
            </div>
        </div>
      </div>
    </div>
  );
}
