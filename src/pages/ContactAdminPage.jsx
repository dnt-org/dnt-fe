import React, { useState, useEffect, useRef, useCallback } from 'react';
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
  Landmark,
  Bell,
  CheckSquare,
  Bookmark,
  QrCode,
  Send,
  ShieldAlert,
  CheckCircle,
  XCircle,
  KeyRound,
  CreditCard,
  Wallet,
  ScanFace,
  RefreshCw,
  UsersRound,
  MoreVertical,
  MapPin,
  Share2,
  Sun,
  Moon,
  Megaphone,
  Plus
} from 'lucide-react';

import { useNavigate } from 'react-router-dom';
import useBlinkIdScanner from '../components/MicrolinkIDScanner';
import {
  verifyRecoveryAccount,
  verifyRecoveryKey,
  verifyRecoveryOtpStep,
  verifyRecoveryBalance,
  verifyRecoveryCccd
} from '../services/authService';
import { initialFriends, initialGroups, initialFriendRequests, initialGroupInvites } from '../data/contactMockData';
import ConversationItemMenu from '../components/contact/ConversationItemMenu';
import PendingListModal from '../components/contact/PendingListModal';
import ContactQrModal from '../components/contact/ContactQrModal';
import CreateGroupPanel from '../components/contact/CreateGroupPanel';

// ─── Chat mode ────────────────────────────────────────────────────────────────
// mode = null    → no chat selected
// mode = 'user'  → normal user chat
// mode = 'bot'   → bot verification chat (company banner)

// ─── Bot step definitions ─────────────────────────────────────────────────────
const STEPS = {
  GREETING: 'GREETING',
  AWAIT_ACCOUNT: 'AWAIT_ACCOUNT',
  AWAIT_RECOVERY: 'AWAIT_RECOVERY',
  AWAIT_OTP: 'AWAIT_OTP',
  AWAIT_BALANCE: 'AWAIT_BALANCE',
  VERIFYING: 'VERIFYING',
  SUCCESS: 'SUCCESS',
  FAIL_WRONG_INFO: 'FAIL_WRONG_INFO',
  AWAIT_CCCD: 'AWAIT_CCCD',
  CCCD_VERIFIED: 'CCCD_VERIFIED',
  HARD_LOCKED: 'HARD_LOCKED',
};

// ─── Generate temp password ───────────────────────────────────────────────────
function genTempPw() {
  const chars = 'ABCDEFGHJKMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789@#!';
  return Array.from({ length: 10 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
}

// ─── Bot typing indicator ─────────────────────────────────────────────────────
function TypingIndicator() {
  return (
    <div className="flex items-end gap-2">
      <div className="w-7 h-7 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0 mb-1">
        <ShieldAlert size={13} className="text-white" />
      </div>
      <div className="bg-white border border-gray-200 px-3 py-2.5 rounded-2xl rounded-bl-sm flex items-center gap-1">
        <span className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
        <span className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
        <span className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
      </div>
    </div>
  );
}

// ─── Message bubble ───────────────────────────────────────────────────────────
function BotBubble({ msg }) {
  if (msg.sender === 'system') {
    return (
      <div className="flex justify-center my-1">
        <span className="text-[11px] text-gray-400 bg-gray-100 px-3 py-0.5 rounded-full">{msg.text}</span>
      </div>
    );
  }
  const isBot = msg.sender === 'bot';
  const colorMap = { error: 'bg-red-50 border-red-200 text-red-700', success: 'bg-green-50 border-green-300 text-green-800', warning: 'bg-orange-50 border-orange-200 text-orange-800', normal: isBot ? 'bg-white border-gray-200 text-gray-800' : '' };
  return (
    <div className={`flex items-end gap-2 ${isBot ? 'justify-start' : 'justify-end'}`}>
      {isBot && (
        <div className="w-7 h-7 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0 mb-1">
          <ShieldAlert size={13} className="text-white" />
        </div>
      )}
      <div className={`max-w-[75%] px-3 py-2 rounded-2xl text-[13px] leading-relaxed border ${isBot ? (colorMap[msg.type] || colorMap.normal) + ' rounded-bl-sm' : 'bg-blue-600 text-white border-blue-600 rounded-br-sm'}`}>
        <span style={{ whiteSpace: 'pre-line' }}>{msg.text}</span>
      </div>
    </div>
  );
}

// ─── Bot Chat Panel ───────────────────────────────────────────────────────────
function BotChatPanel({ onVideoCalls, onGoLogin }) {
  const [messages, setMessages] = useState([]);
  const [step, setStep] = useState(STEPS.GREETING);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [inputDisabled, setInputDisabled] = useState(true);
  const [isScanModalOpen, setIsScanModalOpen] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [cooldownUntil, setCooldownUntil] = useState(null);
  const [verificationAttempts, setVerificationAttempts] = useState(0);

  // ── Microblink scanning logic ──────────────────────────────────────────────
  const onScanResult = useCallback(async (result) => {
    if (result.state === 1 /* RecognizerResultState.Empty */) return;

    setIsScanModalOpen(false);
    setInputDisabled(true);

    // Result extraction based on BlinkIDCombinedRecognizer structure
    const fullName = result.fullName || "";
    const idNumber = result.personalNumber || result.documentNumber || "";

    if (idNumber) {
      push('system', `📄 Đã quét ID: ${idNumber}`);
      push('system', 'Đang xác minh CCCD với hệ thống...');

      try {
        const res = await verifyRecoveryCccd(dataRef.current.account, fullName, idNumber);
        const success = res?.data?.success || res?.status === 200;

        if (success) {
          const pw = res?.data?.tempPassword || res?.data?.temp_password || genTempPw();
          setStep(STEPS.CCCD_VERIFIED);
          await botSay(
            `✅ XÁC MINH CCCD THÀNH CÔNG!\n\nTên: ${fullName}\nID: ${idNumber}\n\nTài khoản đã được mở khóa.\nMật khẩu tạm thời:\n\n"${pw}"\n\n⏰ Có hiệu lực trong 30 phút.\nVui lòng đăng nhập và đổi mật khẩu ngay.`,
            'success', 1000
          );
        } else {
          // Manually throw to hit catch block if success is false but status was ok
          throw new Error("CCCD Verification Failed");
        }
      } catch (err) {
        setStep(STEPS.HARD_LOCKED);
        await botSay(
          '🔒 CCCD/Mã số thuế không hợp lệ hoặc không khớp với thông tin đã đăng ký.\n\nTài khoản của bạn đã bị khóa hoàn toàn.\nVui lòng liên hệ trực tiếp qua Video Call để được xử lý.',
          'error', 1000
        );
        await botSay('📞 Nhấn nút Video ở góc trên bên phải để kết nối nhân viên hỗ trợ.', 'warning', 600);
        if (onVideoCalls) onVideoCalls();
      }
    }
  }, [onVideoCalls]);

  const onScanError = useCallback((error) => {
    console.error("Scanning Error:", error);
    setIsScanModalOpen(false);
    alert("Lỗi quét ID. Vui lòng thử lại.");
  }, []);

  const { containerRef, initialize, destroy, isReady } = useBlinkIdScanner({
    onResult: onScanResult,
    onError: onScanError,
    scanningMode: "BlinkIdCombined", // Adjust if needed
  });

  const hasInitialized = useRef(false);
  const inputRef = useRef(null);
  const endRef = useRef(null);

  // Collected data refs (avoid stale closures)
  const dataRef = useRef({ account: '', recovery: '', otp: '', balance: '' });

  // Scroll to bottom
  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages, isTyping]);

  // Countdown timer
  useEffect(() => {
    if (!cooldownUntil) return;
    const iv = setInterval(() => {
      const rem = Math.max(0, Math.ceil((cooldownUntil - Date.now()) / 1000));
      setCountdown(rem);
      if (rem === 0) { clearInterval(iv); setCooldownUntil(null); }
    }, 1000);
    return () => clearInterval(iv);
  }, [cooldownUntil]);

  // ── Helpers ───────────────────────────────────────────────────────────────
  const push = (sender, text, type = 'normal') =>
    setMessages(prev => [...prev, { sender, text, type, id: Date.now() + Math.random() }]);

  const botSay = (text, type = 'normal', delayMs = 800) => {
    setIsTyping(true);
    return new Promise(res => setTimeout(() => {
      setIsTyping(false);
      push('bot', text, type);
      res();
    }, delayMs));
  };


  // ── Init greeting ─────────────────────────────────────────────────────────
  useEffect(() => {
    if (hasInitialized.current) return;
    hasInitialized.current = true;

    (async () => {
      await botSay('🔒 Xin chào! Tôi là hệ thống hỗ trợ tự động.\n\nTôi sẽ giúp bạn xác minh và mở khóa tài khoản bị khóa vĩnh viễn.', 'normal', 900);
      await botSay('Vui lòng nhập Số tài khoản ngân hàng (ID) của bạn để bắt đầu.', 'normal', 700);
      setStep(STEPS.AWAIT_ACCOUNT);
      setInputDisabled(false);
      setTimeout(() => inputRef.current?.focus(), 100);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Standard Failure Handler ──────────────────────────────────────────────
  const handleStandardFail = async () => {
    const attempts = verificationAttempts + 1;
    setVerificationAttempts(attempts);

    if (attempts >= 2) {
      setStep(STEPS.HARD_LOCKED);
      await botSay(
        '🔒 Bạn đã nhập sai quá số lần quy định.\n\nTài khoản của bạn đã bị khóa hoàn toàn.\nVui lòng liên hệ trực tiếp qua Video Call để được xử lý.',
        'error', 1000
      );
      await botSay('📞 Nhấn nút Video ở góc trên bên phải để kết nối nhân viên hỗ trợ.', 'warning', 600);
      if (onVideoCalls) onVideoCalls();
    } else {
      const until = Date.now() + 30 * 60 * 1000; // 30 mins
      setCooldownUntil(until);
      setStep(STEPS.FAIL_WRONG_INFO);

      await botSay(
        '❌ THÔNG TIN KHÔNG CHÍNH XÁC.\n\nVui lòng thử lại sau 30 phút.',
        'error', 800
      );

      // After 30 min, allow retry automatically
      setTimeout(async () => {
        await botSay(
          'Thời gian chờ đã hết. Vui lòng nhập lại số tài khoản để bắt đầu lại quá trình.',
          'warning', 700
        );
        dataRef.current = { account: '', recovery: '', otp: '', balance: '' };
        setStep(STEPS.AWAIT_ACCOUNT);
        setInputDisabled(false);
        setTimeout(() => inputRef.current?.focus(), 100);
      }, 30 * 60 * 1000);
    }
  };

  // ── send ──────────────────────────────────────────────────────────────────
  const handleSend = async () => {
    const val = input.trim();
    if (!val || inputDisabled) return;
    setInput('');
    setInputDisabled(true);
    push('user', val);

    if (cooldownUntil && Date.now() < cooldownUntil) {
      const rem = Math.ceil((cooldownUntil - Date.now()) / 1000);
      await botSay(`⏳ Vui lòng chờ ${Math.floor(rem / 60)}:${String(rem % 60).padStart(2, '0')} trước khi thử lại.`, 'warning', 500);
      setInputDisabled(false);
      return;
    }

    if (step === STEPS.AWAIT_ACCOUNT) {
      if (!/^\d{1,20}$/.test(val)) {
        await botSay('⚠️ Số tài khoản không hợp lệ (1-20 chữ số). Vui lòng nhập lại.', 'error', 600);
        setInputDisabled(false); return;
      }
      dataRef.current.account = val;
      push('system', 'Đang xác minh số tài khoản...');
      try {
        await verifyRecoveryAccount(val);
        await botSay('✅ Xác minh số tài khoản thành công.\n\nVui lòng nhập Ký tự khôi phục tài khoản của bạn.', 'success', 700);
        setStep(STEPS.AWAIT_RECOVERY);
        setInputDisabled(false);
      } catch (err) {
        await handleStandardFail();
      }
      return;
    }

    if (step === STEPS.AWAIT_RECOVERY) {
      if (val.length < 4) {
        await botSay('⚠️ Ký tự khôi phục phải có ít nhất 4 ký tự. Vui lòng nhập lại.', 'error', 600);
        setInputDisabled(false); return;
      }
      dataRef.current.recovery = val;
      push('system', 'Đang xác minh ký tự khôi phục...');
      try {
        await verifyRecoveryKey(dataRef.current.account, val);
        await botSay('✅ Xác minh ký tự khôi phục thành công.\n\nVui lòng nhập Mật mã OTP của bạn (4-8 chữ số).', 'success', 700);
        setStep(STEPS.AWAIT_OTP);
        setInputDisabled(false);
      } catch (err) {
        await handleStandardFail();
      }
      return;
    }

    if (step === STEPS.AWAIT_OTP) {
      if (!/^\d{4,8}$/.test(val)) {
        await botSay('⚠️ Mật mã OTP không hợp lệ (4-8 chữ số). Vui lòng nhập lại.', 'error', 600);
        setInputDisabled(false); return;
      }
      dataRef.current.otp = val;
      push('system', 'Đang xác minh mã OTP...');
      try {
        await verifyRecoveryOtpStep(dataRef.current.account, val);
        await botSay('✅ Xác minh OTP thành công.\n\nVui lòng nhập Số dư hiện có trong ví (VND, chỉ nhập số).', 'success', 700);
        setStep(STEPS.AWAIT_BALANCE);
        setInputDisabled(false);
      } catch (err) {
        await handleStandardFail();
      }
      return;
    }

    if (step === STEPS.AWAIT_BALANCE) {
      if (!/^\d+$/.test(val)) {
        await botSay('⚠️ Vui lòng nhập số dư dưới dạng số nguyên (VD: 1500000).', 'error', 600);
        setInputDisabled(false); return;
      }
      dataRef.current.balance = val;
      push('system', 'Đang xác minh số dư ví...');
      try {
        const res = await verifyRecoveryBalance(dataRef.current.account, val);
        const pw = res?.data?.tempPassword || res?.data?.temp_password || genTempPw();
        setStep(STEPS.SUCCESS);
        await botSay(
          `🎉 XÁC MINH THÀNH CÔNG!\n\nMật khẩu tạm thời của bạn là:\n\n"${pw}"\n\n⏰ Có hiệu lực trong 30 phút.\nVui lòng đăng nhập và đổi mật khẩu ngay.`,
          'success', 900
        );
      } catch (err) {
        // Balance mismatch triggers CCCD verification
        push('system', '⚠️ Số dư không khớp với hồ sơ.');
        setStep(STEPS.AWAIT_CCCD);
        await botSay(
          'Số dư bạn cung cấp không khớp với hệ thống. Để bảo mật, yêu cầu bổ sung Xác minh danh tính qua thẻ CCCD.',
          'warning', 800
        );
      }
      return;
    }

    setInputDisabled(false);
  };

  // runVerify logic is now integrated into each individual step, but keeping the comment placeholder

  // ── CCCD capture handler ──────────────────────────────────────────────────
  const handleCccdCapture = async () => {
    setIsScanModalOpen(true);
    // Use setTimeout to ensure the container is rendered before initialization
    setTimeout(() => {
      initialize();
    }, 100);
  };

  const onKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); }
  };

  const placeholder = {
    [STEPS.AWAIT_ACCOUNT]: 'Nhập số tài khoản ngân hàng (ID)...',
    [STEPS.AWAIT_RECOVERY]: 'Nhập ký tự khôi phục tài khoản...',
    [STEPS.AWAIT_OTP]: 'Nhập mật mã OTP (4-8 chữ số)...',
    [STEPS.AWAIT_BALANCE]: 'Nhập số dư trong ví (VND)...',
  }[step] || 'Nhập tin nhắn...';

  const stepsDone = {
    [STEPS.AWAIT_ACCOUNT]: 0,
    [STEPS.AWAIT_RECOVERY]: 1,
    [STEPS.AWAIT_OTP]: 2,
    [STEPS.AWAIT_BALANCE]: 3,
    [STEPS.VERIFYING]: 4,
  }[step] ?? -1;

  const showCccd = step === STEPS.AWAIT_CCCD;
  const showLogin = step === STEPS.SUCCESS || step === STEPS.CCCD_VERIFIED;
  const showVideoUnlock = step === STEPS.HARD_LOCKED;
  const showInput = !showCccd && !showLogin && step !== STEPS.HARD_LOCKED && step !== STEPS.FAIL_WRONG_INFO;

  return (
    <>
      {/* Progress steps — only during data collection */}
      {stepsDone >= 0 && stepsDone < 4 && (
        <div className="bg-white border-b border-gray-100 px-4 py-2 flex items-center gap-2 text-[11px]">
          {[
            { icon: CreditCard, label: 'Số TK' },
            { icon: KeyRound, label: 'Ký tự KP' },
            { icon: Wallet, label: 'OTP' },
            { icon: Wallet, label: 'Số dư' },
          ].map((s, i, arr) => (
            <React.Fragment key={i}>
              <div className="flex items-center gap-1">
                <div className={`w-5 h-5 rounded-full flex items-center justify-center ${i < stepsDone ? 'bg-green-500' : i === stepsDone ? 'bg-blue-500' : 'bg-gray-200'}`}>
                  {i < stepsDone
                    ? <CheckCircle size={11} className="text-white" />
                    : <s.icon size={10} className={i === stepsDone ? 'text-white' : 'text-gray-400'} />}
                </div>
                <span className={i < stepsDone ? 'text-green-600 font-medium' : i === stepsDone ? 'text-blue-600 font-medium' : 'text-gray-400'}>{s.label}</span>
              </div>
              {i < arr.length - 1 && <div className={`flex-1 h-px ${i < stepsDone ? 'bg-green-300' : 'bg-gray-200'}`} />}
            </React.Fragment>
          ))}
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3 bg-[#F4F5F7]">
        {messages.map(msg => <BotBubble key={msg.id} msg={msg} />)}
        {isTyping && <TypingIndicator />}
        <div ref={endRef} />
      </div>

      {/* CCCD action */}
      {showCccd && (
        <div className="bg-white border-t border-gray-200 px-4 py-3 flex flex-col items-center gap-2">
          <p className="text-xs text-gray-500">Chụp ảnh CCCD / Mã số thuế để xác minh danh tính:</p>
          <button
            onClick={handleCccdCapture}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-bold px-6 py-2.5 rounded-xl transition-all text-sm"
          >
            <ScanFace size={18} />
            Xác minh CCCD
          </button>
        </div>
      )}

      {/* Success: go to login */}
      {showLogin && (
        <div className="bg-white border-t border-gray-200 px-4 py-3 flex justify-center">
          <button
            onClick={onGoLogin}
            className="flex items-center gap-2 bg-green-600 hover:bg-green-700 active:scale-95 text-white font-bold px-6 py-2.5 rounded-xl transition-all text-sm"
          >
            <CheckCircle size={18} />
            Đến trang Đăng nhập
          </button>
        </div>
      )}

      {/* Hard locked footer */}
      {showVideoUnlock && (
        <div className="bg-red-50 border-t-2 border-red-300 px-4 py-3 flex items-center justify-center gap-3">
          <XCircle size={16} className="text-red-600 flex-shrink-0" />
          <span className="text-red-700 font-bold text-xs">Liên hệ hỗ trợ qua Video Call hoặc trực tiếp</span>
        </div>
      )}

      {/* Cooldown waiting bar */}
      {step === STEPS.FAIL_WRONG_INFO && countdown > 0 && (
        <div className="bg-orange-50 border-t border-orange-200 px-4 py-3 flex items-center justify-center gap-2">
          <RefreshCw size={14} className="text-orange-500 animate-spin" />
          <span className="text-orange-700 font-bold text-xs">
            Thử lại sau: {Math.floor(countdown / 60)}:{String(countdown % 60).padStart(2, '0')}
          </span>
        </div>
      )}

      {/* Normal input */}
      {showInput && (
        <div className="h-auto bg-white border-t border-gray-300">
          <div className="flex items-center gap-4 px-4 py-2 border-b border-gray-100">
            <div className="font-bold text-gray-500 cursor-pointer hover:text-gray-800">A<span className="text-xs ml-1">v</span></div>
            <ImageIcon className="text-gray-500 cursor-pointer hover:text-gray-800" size={20} />
          </div>
          <div className="flex items-end px-4 py-3 min-h-[60px]">
            <textarea
              ref={inputRef}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={onKeyDown}
              disabled={inputDisabled || countdown > 0}
              placeholder={countdown > 0 ? `Chờ ${Math.floor(countdown / 60)}:${String(countdown % 60).padStart(2, '0')}...` : placeholder}
              className="flex-1 max-h-32 min-h-[40px] resize-none border-none outline-none text-[15px] bg-transparent pb-1 disabled:opacity-40"
              rows={1}
            />
            <div className="flex items-center gap-3 ml-2 mb-1">
              <Smile className="text-gray-500 cursor-pointer hover:text-gray-800" size={22} />
              <Mic className="text-gray-500 cursor-pointer hover:text-gray-800" size={22} />
              <button
                onClick={handleSend}
                disabled={inputDisabled || !input.trim() || countdown > 0}
                className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center hover:bg-blue-700 active:scale-90 transition-all disabled:opacity-30 shadow"
              >
                <Send size={14} className="text-white" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ID Scanning Overlay using MicrolinkIDScanner hook */}
      {isScanModalOpen && (
        <div className="fixed inset-0 z-[9999] bg-black/90 flex flex-col items-center justify-center">
          <div className="absolute top-4 right-4 z-[10000]">
            <button
              onClick={() => {
                destroy();
                setIsScanModalOpen(false);
              }}
              className="p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
            >
              <X size={32} className="text-white" />
            </button>
          </div>
          <div className="text-white mb-6 text-center px-4">
            <h2 className="text-xl font-bold mb-2">Đang quét CCCD</h2>
            <p className="text-sm text-gray-400">Vui lòng đưa thẻ CCCD vào khung hình để hệ thống tự động xử lý</p>
          </div>

          {/* THE TARGET CONTAINER FOR MICROBLINK UI */}
          <div
            ref={containerRef}
            className="w-full max-w-2xl px-4 flex flex-col items-center"
          />

          {!isReady && (
            <div className="flex flex-col items-center gap-4 mt-8">
              <RefreshCw className="text-blue-500 animate-spin" size={40} />
              <p className="text-white text-sm">Đang khởi động Camera...</p>
            </div>
          )}
        </div>
      )}
    </>
  );
}

// ─── Normal Chat Panel (placeholder for regular contacts) ────────────────────
// ─── Normal Chat Panel (Zalo-like Chat Interface) ────────────────────────────
const BUBBLE_COLORS = ['#2563eb', '#16a34a', '#9333ea', '#db2777', '#ea580c'];

function NormalChatPanel({ contact, t, messages, onSendMessage }) {
  const [inputText, setInputText] = useState('');
  const scrollRef = useRef(null);

  // #C-11: own message bubble background color, default blue
  const [bubbleColor, setBubbleColor] = useState(BUBBLE_COLORS[0]);
  const [showColorPicker, setShowColorPicker] = useState(false);

  // #C-12: dark/light mode toggle, persisted
  const [theme, setTheme] = useState(() => localStorage.getItem('contactTheme') || 'light');
  useEffect(() => { localStorage.setItem('contactTheme', theme); }, [theme]);
  const isDark = theme === 'dark';

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = () => {
    if (inputText.trim()) {
      onSendMessage(inputText.trim());
      setInputText('');
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className={`flex-1 flex flex-col h-full ${isDark ? 'bg-gray-900' : 'bg-[#F4F5F7]'}`}>
      {/* Chat Area */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-4 space-y-4"
      >
        {messages && messages.length > 0 ? (
          messages.map((msg, idx) => {
            const isMe = msg.sender === 'me'; // #C-12: chủ tài khoản (me) = dark blue, khách hàng (them) = red
            return (
              <div
                key={msg.id || idx}
                className={`flex items-end gap-2 ${isMe ? 'justify-end' : 'justify-start'}`}
              >
                {!isMe && (
                  <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-300 flex-shrink-0 mb-1">
                    <img
                      src={contact?.avatar || "https://via.placeholder.com/32"}
                      alt="avatar"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <div className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                  <div
                    style={isMe ? { backgroundColor: bubbleColor } : undefined}
                    className={`max-w-[80%] px-3 py-2 rounded-2xl text-sm relative ${isMe
                      ? 'text-white rounded-br-none'
                      : `${isDark ? 'bg-gray-700 border-gray-600 text-red-400' : 'bg-white border-gray-100 text-red-600'} rounded-bl-none border`
                      }`}
                  >
                    {msg.text}
                  </div>
                  <span className={`text-[10px] mt-1 px-1 ${isDark ? 'text-gray-400' : 'text-gray-400'}`}>
                    {msg.timestamp || "Vừa xong"}
                  </span>
                </div>
              </div>
            );
          })
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-gray-400">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <MessageSquare size={32} />
            </div>
            <p className="text-sm italic">Hãy bắt đầu cuộc trò chuyện với {contact?.name || 'người này'}</p>
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className={isDark ? 'bg-gray-800 border-t border-gray-700' : 'bg-white border-t border-gray-200'}>
        <div className={`relative flex items-center gap-4 px-4 py-2 border-b ${isDark ? 'border-gray-700' : 'border-gray-50'}`}>
          <ImageIcon className="text-gray-500 cursor-pointer hover:text-blue-500" size={20} />
          <Smile className="text-gray-500 cursor-pointer hover:text-blue-500" size={20} />
          <Mic className="text-gray-500 cursor-pointer hover:text-blue-500" size={20} />

          {/* #C-11: bubble background color swatch, default blue */}
          <button
            type="button"
            onClick={() => setShowColorPicker((v) => !v)}
            title="Màu nền tin nhắn"
            className="w-5 h-5 rounded-full border-2 border-gray-300"
            style={{ backgroundColor: bubbleColor }}
          />
          {showColorPicker && (
            <div className="absolute bottom-full left-12 mb-2 z-30 flex gap-1.5 bg-white border border-gray-200 rounded-full shadow-lg px-2 py-1.5">
              {BUBBLE_COLORS.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => { setBubbleColor(c); setShowColorPicker(false); }}
                  className={`w-5 h-5 rounded-full ${bubbleColor === c ? 'ring-2 ring-offset-1 ring-gray-400' : ''}`}
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
          )}

          <div className="flex-1" />

          {/* #C-12: dark/light mode toggle, persisted via localStorage */}
          <button
            type="button"
            onClick={() => setTheme((cur) => (cur === 'dark' ? 'light' : 'dark'))}
            title="Chế độ Đen - Trắng"
            className={`flex items-center gap-1 ${isDark ? 'text-yellow-400' : 'text-gray-400'} hover:text-gray-600`}
          >
            {isDark ? <Sun size={18} /> : <Moon size={18} />}
            <Settings size={14} />
          </button>
        </div>

        <div className="flex items-end px-3 py-3 gap-2">
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={t('contact.typeMessage', `Nhập tin nhắn tới ${contact?.name || '...'}`)}
            className={`flex-1 max-h-32 min-h-[40px] resize-none border-none outline-none text-sm bg-transparent py-1.5 ${isDark ? 'text-white placeholder:text-gray-500' : ''}`}
            rows={1}
          />
          <button
            disabled={!inputText.trim()}
            onClick={handleSend}
            className={`w-9 h-9 rounded-full flex items-center justify-center transition-all ${inputText.trim()
              ? 'bg-blue-600 text-white cursor-pointer active:scale-90'
              : 'text-gray-300 cursor-default'
              }`}
          >
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Main page ─────────────────────────────────────────────────────────────────
export default function ContactAdminPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  // 'none' | 'user' | 'bot'
  const [chatMode, setChatMode] = useState('none');
  const [activeContactId, setActiveContactId] = useState(null);
  const [activeContactType, setActiveContactType] = useState(null); // 'friend' | 'group'
  const [videoUnlocked, setVideoUnlocked] = useState(false);
  const [contactMessages, setContactMessages] = useState({
    1: [{ id: 1, text: 'Chào bạn, công ty có thể giúp gì cho bạn?', sender: 'them', timestamp: '10:00' }],
    2: [{ id: 1, text: 'Xin chào!', sender: 'them', timestamp: '09:30' }],
  });

  // #C-01: Cá nhân vs Nhóm tabs
  const [activeTab, setActiveTab] = useState('personal'); // 'personal' | 'group'
  const [friends, setFriends] = useState(initialFriends);
  const [groups, setGroups] = useState(initialGroups);
  const [friendRequests, setFriendRequests] = useState(initialFriendRequests);
  const [groupInvites, setGroupInvites] = useState(initialGroupInvites);

  // #C-03: which item's right-tap quick-action menu is open
  const [openMenuId, setOpenMenuId] = useState(null);

  // #C-05 / #C-07: pending invite list modals
  const [isFriendRequestsOpen, setIsFriendRequestsOpen] = useState(false);
  const [isGroupInvitesOpen, setIsGroupInvitesOpen] = useState(false);

  // #C-06 / #C-09: QR add-friend / join-group flow
  const [isAddFriendQrOpen, setIsAddFriendQrOpen] = useState(false);
  const [isJoinGroupQrOpen, setIsJoinGroupQrOpen] = useState(false);
  const [scannedFriend, setScannedFriend] = useState(null);
  const [scannedGroup, setScannedGroup] = useState(null);

  // #C-08: create/edit group panel
  const [isCreateGroupOpen, setIsCreateGroupOpen] = useState(false);
  const [editingGroup, setEditingGroup] = useState(null);

  // #C-10: chat header "more actions" menu (Gửi vị trí / Chia sẻ trực tiếp)
  const [isHeaderMenuOpen, setIsHeaderMenuOpen] = useState(false);

  const handleSendMessage = (text) => {
    if (!activeContactId) return;
    const newMessage = {
      id: Date.now(),
      text,
      sender: 'me',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setContactMessages(prev => ({
      ...prev,
      [activeContactId]: [...(prev[activeContactId] || []), newMessage]
    }));
  };

  const isBotMode = chatMode === 'bot';
  const activeFriend = activeContactType === 'friend' ? friends.find(f => f.id === activeContactId) : null;
  const activeGroup = activeContactType === 'group' ? groups.find(g => g.id === activeContactId) : null;
  const activeContact = activeFriend || activeGroup;

  const handleSelectContact = (id, type) => {
    setActiveContactId(id);
    setActiveContactType(type);
    setChatMode('user');
    if (type === 'friend') {
      setFriends(prev => prev.map(f => f.id === id ? { ...f, hasUnseenAiLive: false } : f));
    }
  };

  const handleSelectCompany = () => {
    setChatMode('bot');
    setActiveContactId(null);
    setActiveContactType(null);
  };

  // #C-03: avatar tap -> the contact's Ai LIVE post (clears the unseen red dot)
  const handleAvatarTap = (e, friend) => {
    e.stopPropagation();
    setFriends(prev => prev.map(f => f.id === friend.id ? { ...f, hasUnseenAiLive: false } : f));
    navigate('/ai-live');
  };

  // #C-03: right-tap ("thả") quick-action menu
  const handleDeleteConversation = (id, type) => {
    if (type === 'friend') setFriends(prev => prev.filter(f => f.id !== id));
    else setGroups(prev => prev.filter(g => g.id !== id));
    if (activeContactId === id) { setChatMode('none'); setActiveContactId(null); setActiveContactType(null); }
  };

  const handleMuteConversation = (id, type) => {
    const setList = type === 'friend' ? setFriends : setGroups;
    setList(prev => prev.map(item => item.id === id ? { ...item, muted: !item.muted } : item));
  };

  const handleRenameConversation = (id, type) => {
    if (type === 'group') {
      // Groups get the full owner-only edit panel (#C-08), not a plain rename
      const group = groups.find(g => g.id === id);
      if (group) { setEditingGroup(group); setIsCreateGroupOpen(true); }
      return;
    }
    const current = friends.find(item => item.id === id);
    const next = window.prompt('Nhập tên hiển thị mới:', current?.displayName || current?.name || '');
    if (!next || !next.trim()) return;
    setFriends(prev => prev.map(item => item.id === id ? { ...item, displayName: next.trim() } : item));
  };

  // #C-08: create or update a group — only the owner reaches this panel, and
  // members can only be picked from the user's own friends list (enforced by
  // CreateGroupPanel only being given the `friends` array to choose from).
  const handleSaveGroup = ({ id, name, avatar, memberIds }) => {
    if (id) {
      setGroups(prev => prev.map(g => g.id === id ? { ...g, name, avatar, memberIds, updatedAt: new Date().toISOString() } : g));
    } else {
      setGroups(prev => [
        ...prev,
        { id: Date.now(), name, avatar, memberIds, ownerId: 'me', lastMessage: 'Nhóm đã được tạo.', updatedAt: new Date().toISOString(), unread: 0 },
      ]);
    }
    setEditingGroup(null);
  };

  const handleLeaveGroup = (id) => {
    setGroups(prev => prev.filter(g => g.id !== id));
    if (activeContactId === id) { setChatMode('none'); setActiveContactId(null); setActiveContactType(null); }
  };

  // #C-05: friend requests — accept moves the request into the friends list
  const handleAcceptFriendRequest = (id) => {
    const req = friendRequests.find(r => r.id === id);
    if (!req) return;
    setFriends(prev => [
      ...prev,
      {
        id: req.id,
        name: req.name,
        displayName: req.displayName || req.name,
        avatar: req.avatar,
        lastMessage: 'Các bạn đã trở thành bạn bè.',
        updatedAt: new Date().toISOString(),
        unread: 0,
        hasUnseenAiLive: false,
        otpPending: false,
      },
    ]);
    setFriendRequests(prev => prev.filter(r => r.id !== id));
  };

  const handleRejectFriendRequest = (id) => {
    setFriendRequests(prev => prev.filter(r => r.id !== id));
  };

  const handleRenameFriendRequest = (id, newName) => {
    setFriendRequests(prev => prev.map(r => r.id === id ? { ...r, displayName: newName } : r));
  };

  // #C-07: group invites — accept moves the invite into the groups list
  const handleAcceptGroupInvite = (id) => {
    const invite = groupInvites.find(i => i.id === id);
    if (!invite) return;
    setGroups(prev => [
      ...prev,
      {
        id: invite.id,
        name: invite.name,
        avatar: invite.avatar,
        memberIds: invite.memberIds || [],
        ownerId: invite.ownerId || 'other',
        lastMessage: 'Bạn đã tham gia nhóm.',
        updatedAt: new Date().toISOString(),
        unread: 0,
      },
    ]);
    setGroupInvites(prev => prev.filter(i => i.id !== id));
  };

  const handleRejectGroupInvite = (id) => {
    setGroupInvites(prev => prev.filter(i => i.id !== id));
  };

  // #C-06: QR add-friend — after a successful scan, show a single confirm row
  const handleAddFriendScanResult = (resultText) => {
    setIsAddFriendQrOpen(false);
    let name = resultText;
    try {
      const parsed = JSON.parse(resultText);
      name = parsed.name || parsed.fullName || resultText;
    } catch { /* raw text QR, use as-is */ }
    setScannedFriend({ id: `scan-friend-${Date.now()}`, name, avatar: `https://i.pravatar.cc/150?u=${Date.now()}` });
  };

  const handleConfirmScannedFriend = () => {
    if (!scannedFriend) return;
    setFriends(prev => [
      ...prev,
      {
        ...scannedFriend,
        displayName: scannedFriend.displayName || scannedFriend.name,
        lastMessage: 'Các bạn đã trở thành bạn bè.',
        updatedAt: new Date().toISOString(),
        unread: 0,
        hasUnseenAiLive: false,
        otpPending: false,
      },
    ]);
    setScannedFriend(null);
  };

  // #C-09: QR join-group — after a successful scan, show a single confirm row
  const handleJoinGroupScanResult = (resultText) => {
    setIsJoinGroupQrOpen(false);
    let name = resultText;
    try {
      const parsed = JSON.parse(resultText);
      name = parsed.name || parsed.groupName || resultText;
    } catch { /* raw text QR, use as-is */ }
    setScannedGroup({ id: `scan-group-${Date.now()}`, name, avatar: `https://i.pravatar.cc/150?u=g${Date.now()}` });
  };

  const handleConfirmScannedGroup = () => {
    if (!scannedGroup) return;
    setGroups(prev => [
      ...prev,
      {
        ...scannedGroup,
        memberIds: [],
        ownerId: 'other',
        lastMessage: 'Bạn đã tham gia nhóm.',
        updatedAt: new Date().toISOString(),
        unread: 0,
      },
    ]);
    setScannedGroup(null);
  };

  // The Search bar's "thêm bạn/thêm nhóm" and QR icons switch meaning with the active tab
  const handleAddIconClick = () => {
    if (activeTab === 'personal') setIsFriendRequestsOpen(true);
    else setIsGroupInvitesOpen(true);
  };

  const handleQrIconClick = () => {
    if (activeTab === 'personal') setIsAddFriendQrOpen(true);
    else setIsJoinGroupQrOpen(true);
  };

  // Most recently updated conversation first
  const sortedFriends = [...friends].sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
  const sortedGroups = [...groups].sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
  const listItems = activeTab === 'personal' ? sortedFriends : sortedGroups;

  // Chat header label
  const chatTitle = isBotMode
    ? 'CÔNG TY TNHH ĐẠI NGHĨA TÍN'
    : activeContact ? (activeContact.displayName || activeContact.name) : '';

  return (
    <div className="flex h-screen w-full bg-white overflow-hidden text-sm">

      {/* ── Left-most narrow icon bar (unchanged) ───────────────────────── */}


      {/* ── Middle Contacts Column ──────────────────────────────────────── */}
      <div className="w-[320px] min-w-[320px] bg-white flex flex-col border-r border-gray-300 text-blue-900">

        {/* Stats — #C-02: badges in dark blue */}
        <div className="p-2 border-b border-gray-200">
          <div className="flex justify-between px-2 text-xs font-semibold mb-2">
            <div className="w-12 h-12 rounded-full border-2  flex items-center justify-center bg-gray-100 cursor-pointer relative">
              <span className="text-xs">Avatar</span>
              <div style={{ top: 0, left: '100%' }} className="absolute z-10 text-blue-800 ml-1 text-left">{friends.length}</div>
              <div style={{ bottom: 0, left: '100%' }} className="absolute z-10 text-blue-800 ml-1 text-left">5</div>

            </div>
              <div className="w-12 h-12 border-2  flex items-center justify-center bg-gray-100 cursor-pointer relative">
                <Building2 size={30} />
              <div style={{ top: 0, left: '100%' }} className="absolute z-10 text-blue-800 ml-1 text-left">1000</div>
              <div style={{ bottom: 0, left: '100%' }} className="absolute z-10 text-blue-800 ml-1 text-left">10000</div>

            </div>
              <div className="w-12 h-12 border-2  flex items-center justify-center bg-gray-100 cursor-pointer relative">
              <Landmark size={30} />
              <div style={{ top: 0, left: '100%' }} className="absolute z-10 text-blue-800 ml-1 text-left">1</div>
              <div style={{ bottom: 0, left: '100%' }} className="absolute z-10 text-blue-800 ml-1 text-left">1</div>

            </div>
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
          <button type="button" onClick={handleAddIconClick} title={activeTab === 'personal' ? 'Lời mời kết bạn' : 'Lời mời vào nhóm'}>
            <UserPlus className="text-blue-800 cursor-pointer" size={20} />
          </button>
          <button type="button" onClick={handleQrIconClick} title="Quét QR">
            <QrCode className="text-blue-800 cursor-pointer" size={20} />
          </button>
          {activeTab === 'group' && (
            <button type="button" onClick={() => { setEditingGroup(null); setIsCreateGroupOpen(true); }} title="Tạo nhóm mới">
              <Plus className="text-blue-800 cursor-pointer" size={20} />
            </button>
          )}
        </div>

        {/* #C-01: Cá nhân / Nhóm tabs */}
        <div className="flex border-b border-gray-200 text-sm font-semibold">
          <button
            type="button"
            onClick={() => setActiveTab('personal')}
            className={`flex-1 py-2 flex items-center justify-center gap-1.5 ${activeTab === 'personal' ? 'bg-blue-800 text-white' : 'text-blue-900 hover:bg-blue-50'}`}
          >
            <User size={15} /> CÁ NHÂN
            <span className={`text-[10px] rounded-full w-5 h-5 flex items-center justify-center ${activeTab === 'personal' ? 'bg-white text-blue-800' : 'bg-blue-800 text-white'}`}>
              {friends.length}
            </span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('group')}
            className={`flex-1 py-2 flex items-center justify-center gap-1.5 ${activeTab === 'group' ? 'bg-blue-800 text-white' : 'text-blue-900 hover:bg-blue-50'}`}
          >
            <UsersRound size={15} /> NHÓM
            <span className={`text-[10px] rounded-full w-5 h-5 flex items-center justify-center ${activeTab === 'group' ? 'bg-white text-blue-800' : 'bg-blue-800 text-white'}`}>
              {groups.length}
            </span>
          </button>
        </div>

        {/* Conversation List — #C-03 */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden">
          {listItems.map((item) => {
            const isGroup = activeTab === 'group';
            const isActive = activeContactId === item.id && activeContactType === (isGroup ? 'group' : 'friend');
            return (
              <div
                key={item.id}
                className={`relative flex items-start p-3 hover:bg-blue-50 border-b border-gray-100 ${isActive ? 'bg-blue-50' : ''}`}
              >
                {/* Avatar tap -> Ai LIVE post (friends only); red dot if unseen */}
                <button
                  type="button"
                  onClick={isGroup ? () => handleSelectContact(item.id, 'group') : (e) => handleAvatarTap(e, item)}
                  className="relative flex-shrink-0"
                >
                  <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-300">
                    <img src={item.avatar} alt={item.name} className="w-full h-full object-cover" />
                  </div>
                  {!isGroup && item.hasUnseenAiLive && (
                    <span className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 bg-red-500 rounded-full border-2 border-white" />
                  )}
                </button>

                {/* Name / middle area tap -> open chat */}
                <button
                  type="button"
                  onClick={() => handleSelectContact(item.id, isGroup ? 'group' : 'friend')}
                  className="ml-3 flex-1 overflow-hidden text-left"
                >
                  <div className="flex justify-between items-center">
                    <span className="font-bold uppercase truncate">{item.displayName || item.name}</span>
                    {item.unread > 0 && (
                      <span className="bg-blue-800 text-white rounded-full w-4 h-4 flex items-center justify-center text-[10px] font-bold ml-1 flex-shrink-0">
                        {item.unread}
                      </span>
                    )}
                  </div>
                  <div className="text-xs mt-1 truncate text-blue-700">
                    {item.lastMessage}
                    {item.otpPending && <span className="text-orange-600 font-semibold"> (OTP xác nhận)</span>}
                  </div>
                </button>

                {/* Right side tap ("thả") -> quick-action dropdown */}
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); setOpenMenuId(openMenuId === item.id ? null : item.id); }}
                  className="ml-1 p-1 text-blue-400 hover:text-blue-800 flex-shrink-0"
                >
                  <MoreVertical size={16} />
                </button>

                {openMenuId === item.id && (
                  <ConversationItemMenu
                    isGroup={isGroup}
                    onDelete={() => handleDeleteConversation(item.id, isGroup ? 'group' : 'friend')}
                    onMute={() => handleMuteConversation(item.id, isGroup ? 'group' : 'friend')}
                    onRename={() => handleRenameConversation(item.id, isGroup ? 'group' : 'friend')}
                    onLeaveGroup={isGroup ? () => handleLeaveGroup(item.id) : undefined}
                    onCloseMenu={() => setOpenMenuId(null)}
                  />
                )}
              </div>
            );
          })}
        </div>

        {/* Bottom Banner — click to open bot */}
        <div
          onClick={handleSelectCompany}
          className={`p-4 border-t border-gray-200 text-center cursor-pointer transition-colors ${isBotMode ? 'bg-blue-50' : 'hover:bg-gray-50'}`}
        >
          <div className={`font-bold uppercase text-sm flex items-center justify-center gap-2 ${isBotMode ? 'text-blue-800' : 'text-blue-800 hover:text-blue-900'}`}>
            {isBotMode && <ShieldAlert size={14} className="text-blue-800" />}
            CÔNG TY TNHH ĐẠI NGHĨA TÍN
          </div>
          {!isBotMode && (
            <div className="text-[10px] text-gray-400 mt-0.5">Nhấn để xác minh tài khoản bị khóa</div>
          )}
        </div>
      </div>

      {/* ── Main Chat Area ───────────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col bg-[#F4F5F7]">

        {/* Header — unchanged structure */}
        <div className="h-[60px] bg-white border-b border-gray-300 flex items-center justify-between px-4 flex-shrink-0">
          {chatMode !== 'none' ? (
            <>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center overflow-hidden bg-gray-100">
                  {isBotMode
                    ? <ShieldAlert size={20} className="text-blue-600" />
                    : <img src={activeContact?.avatar || "https://via.placeholder.com/40"} alt="avatar" className="w-full h-full object-cover" />
                  }
                </div>
                <div className={`font-bold uppercase ${isBotMode ? 'text-blue-700' : 'text-gray-800'}`}>
                  {chatTitle}
                </div>
              </div>
              <div className={`relative flex items-center gap-2 bg-blue-400 p-1 rounded ${isBotMode && !videoUnlocked ? 'opacity-40' : ''}`}>
                <div className="w-8 h-8 rounded border border-blue-600 flex items-center justify-center cursor-pointer text-white hover:bg-blue-500">
                  <Phone size={18} />
                </div>
                <div className="w-8 h-8 rounded border border-blue-600 flex items-center justify-center cursor-pointer text-white hover:bg-blue-500">
                  <Video size={18} />
                </div>
                <div className="w-8 h-8 rounded border border-blue-600 bg-purple-700 flex items-center justify-center cursor-pointer text-white">
                  <User size={18} />
                </div>
                <button
                  type="button"
                  onClick={() => setIsHeaderMenuOpen((v) => !v)}
                  className="w-8 h-8 rounded border border-blue-600 flex items-center justify-center cursor-pointer text-white hover:bg-blue-500"
                >
                  <MoreVertical size={18} />
                </button>
                {isHeaderMenuOpen && (
                  <div className="absolute right-0 top-full mt-1 z-30 bg-white border border-gray-200 rounded-lg shadow-lg w-48 overflow-hidden">
                    <button
                      type="button"
                      onClick={() => setIsHeaderMenuOpen(false)}
                      className="w-full flex items-center gap-2 px-3 py-2 text-sm text-blue-900 hover:bg-blue-50 text-left"
                    >
                      <MapPin size={15} /> Gửi vị trí
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsHeaderMenuOpen(false)}
                      className="w-full flex items-center gap-2 px-3 py-2 text-sm text-blue-900 hover:bg-blue-50 text-left"
                    >
                      <Share2 size={15} /> Chia sẻ trực tiếp
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center overflow-hidden">
                <img src="/src/assets/logo.png" alt="logo" className="w-8" onError={e => { e.target.style.display = 'none'; }} />
              </div>
              <div className="font-bold text-blue-700 uppercase">
                CÔNG TY TNHH ĐẠI NGHĨA TÍN
              </div>
            </div>
          )}
        </div>

        {/* ── Conditional chat body ─────────────────────────────────────── */}
        {isBotMode ? (
          <BotChatPanel onVideoCalls={() => setVideoUnlocked(true)} onGoLogin={() => navigate('/login')} />
        ) : (
          <NormalChatPanel
            contact={activeContact}
            t={t}
            messages={contactMessages[activeContactId] || []}
            onSendMessage={handleSendMessage}
          />
        )}
      </div>

      {/* #C-05: pending friend requests */}
      <PendingListModal
        isOpen={isFriendRequestsOpen}
        onClose={() => setIsFriendRequestsOpen(false)}
        title="Lời mời kết bạn"
        items={friendRequests}
        onAccept={handleAcceptFriendRequest}
        onReject={handleRejectFriendRequest}
        allowRename
        onRename={handleRenameFriendRequest}
        emptyText="Không có lời mời kết bạn nào đang chờ."
      />

      {/* #C-07: pending group invites */}
      <PendingListModal
        isOpen={isGroupInvitesOpen}
        onClose={() => setIsGroupInvitesOpen(false)}
        title="Lời mời vào nhóm"
        items={groupInvites}
        onAccept={handleAcceptGroupInvite}
        onReject={handleRejectGroupInvite}
        emptyText="Không có lời mời vào nhóm nào đang chờ."
      />

      {/* #C-06: scan a friend's QR to add them */}
      <ContactQrModal
        isOpen={isAddFriendQrOpen}
        onClose={() => setIsAddFriendQrOpen(false)}
        onScanResult={handleAddFriendScanResult}
        myQrLabel="Mã QR của bạn — cho người khác quét để kết bạn"
      />
      <PendingListModal
        isOpen={!!scannedFriend}
        onClose={() => setScannedFriend(null)}
        title="Kết bạn"
        items={scannedFriend ? [scannedFriend] : []}
        onAccept={handleConfirmScannedFriend}
        acceptLabel="KẾT BẠN"
        allowRename
        onRename={(id, name) => setScannedFriend(prev => prev ? { ...prev, displayName: name } : prev)}
      />

      {/* #C-09: scan a group's QR to join it */}
      <ContactQrModal
        isOpen={isJoinGroupQrOpen}
        onClose={() => setIsJoinGroupQrOpen(false)}
        onScanResult={handleJoinGroupScanResult}
        myQrLabel="Mã QR nhóm của bạn — cho người khác quét để tham gia"
      />
      <PendingListModal
        isOpen={!!scannedGroup}
        onClose={() => setScannedGroup(null)}
        title="Tham gia nhóm"
        items={scannedGroup ? [scannedGroup] : []}
        onAccept={handleConfirmScannedGroup}
        acceptLabel="ĐỒNG Ý"
      />

      {/* #C-08: create/edit group — owner-only, members from own friends list only */}
      <CreateGroupPanel
        isOpen={isCreateGroupOpen}
        onClose={() => { setIsCreateGroupOpen(false); setEditingGroup(null); }}
        friends={friends}
        existingGroup={editingGroup}
        onSave={handleSaveGroup}
      />
    </div>
  );
}
