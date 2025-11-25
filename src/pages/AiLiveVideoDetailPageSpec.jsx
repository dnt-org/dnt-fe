import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { useTranslation } from "react-i18next"
import { Eye, Flag, Handshake, UserCheck,Forward , Save, Clock } from "lucide-react"
import ContactListModal from "../components/molecules/ContactListModal.jsx"
import ViolationReportModal from "../components/molecules/ViolationReportModal.jsx"
import LiveGoodsTable from "../components/organisms/LiveGoodsTable.jsx"
import MoneyInputModal from "../components/molecules/MoneyInputModal.jsx"
export default function AiLiveVideoDetailPageSpec() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { t } = useTranslation()
  const [showShare, setShowShare] = useState(false)
  const [showReport, setShowReport] = useState(false)
  const [isFollowed, setIsFollowed] = useState(false)
  const [isSaved, setIsSaved] = useState(false)
  const [confirmSeconds, setConfirmSeconds] = useState(300)
  const [locked, setLocked] = useState(false)
  const [blink, setBlink] = useState(false)
  const [audioOn, setAudioOn] = useState(false)
  const formatTime = (s) => `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`
  const [ownerDecision, setOwnerDecision] = useState("none")

  const beep = () => {
    
  }

  useEffect(() => {
    if (locked) return
    const id = setInterval(() => setConfirmSeconds((s) => Math.max(0, s - 1)), 1000)
    return () => clearInterval(id)
  }, [locked])

  useEffect(() => {
    if (confirmSeconds <= 0) {
      setLocked(true)
      return
    }
    setBlink(confirmSeconds <= 240)
    if (confirmSeconds <= 120 && !audioOn) setAudioOn(true)
  }, [confirmSeconds])

  useEffect(() => {
    if (!audioOn) return
    const id = setInterval(() => beep(), 10000)
    return () => clearInterval(id)
  }, [audioOn])

  const viewers = 2112
  const reactions = 12
  const name = `${t("aiLiveVideo.video", "VIDEO")} ${id}`
  const productId = `PRD-${String(id).padStart(3, "0")}`
  const contacts = [
    { id: 1, name: "Nguyễn Văn A" },
    { id: 2, name: "Trần Thị B" },
    { id: 3, name: "Lê C" },
    { id: 4, name: "Phạm D" },
    { id: 5, name: "Hoàng E" },
  ]

  const onFollowHandle = () => {
    console.log("Follow")
    setIsFollowed(!isFollowed)
  }

  const onSaveHandle = () => {
    console.log("Save")
    setIsSaved(!isSaved)
  }

  const onDisableAd = () => {
    console.log("Disable Ad")
    setShowMoneyInput(true)
  }
  const [showMoneyInput, setShowMoneyInput] = useState(false)

  return (
    <div className="p-2">
      {/* <div className="mb-4 flex items-center justify-between">
        <button className="text-blue-600 underline" onClick={() => navigate(-1)}>{t("common.back", "Quay lại")}</button>
        <div className="text-sm">{t("aiLiveVideo.detail", "Chi tiết video")}</div>
      </div> */}

      <div className="grid grid-cols-1 gap-6">
        <div 
        onDoubleClick={() => onDisableAd()}

        className="relative border border-black h-screen">
          <div className="text-xs flex  items-start justify-start">
            <img className="w-8 h-8 rounded-full" src={{}} />
            <div className="font-bold ml-2">{name}</div>
            <div className="font-bold ml-2">{productId}</div>

          </div>  
          <div className="absolute left-2 top-10 space-y-2 text-xs">
            <div className="flex items-center gap-1"><Eye size={24} /><span>{viewers} đang xem</span></div>
            <div className="flex items-center gap-1"><Clock size={24} /><span className="font-semibold">25/12/2025 13:02 VNT</span></div>
            <div className="flex items-center gap-1"><Handshake size={24} /><span className="font-semibold">{reactions}</span></div>
          </div>
          <div className="absolute right-3 bottom-3 flex flex-col items-center gap-2 z-10">
            <button onClick={() => onFollowHandle()} className={`border border-black p-2 rounded  text-sm font-bold ${isFollowed ? "bg-blue-300" : "bg-white"}`}><UserCheck size={18} /></button>
            <button onClick={() => onSaveHandle()} className={`border border-black p-2 rounded  text-sm font-bold ${isSaved ? "bg-blue-300" : "bg-white"}`}><Save size={18} /></button>
            <button className="border border-black bg-white p-2 rounded" onClick={() => setShowShare(true)}><Forward size={18} /></button>
            <button className="border border-black bg-white p-2 rounded" onClick={() => setShowReport(true)}><Flag size={18} /></button>
          </div>
          <div className="absolute bg-gray-200 bottom-3 p-3 w-full text-center">
          Quảng cáo
          </div>
        </div>
      </div>
      
      <ContactListModal
        contacts={contacts}
        open={showShare}
        onClose={() => setShowShare(false)}
        onSend={() => setShowShare(false)}
      />
      <ViolationReportModal
        open={showReport}
        onClose={() => setShowReport(false)}
        onSubmit={() => setShowReport(false)}
      />
      <MoneyInputModal
        open={showMoneyInput}
        onClose={() => setShowMoneyInput(false)}
        onSubmit={() => setShowMoneyInput(false)}
      />
    </div>
  )
}