import { useEffect, useRef, useState } from "react"
import { useParams, useNavigate, useLocation } from "react-router-dom"
import { useTranslation } from "react-i18next"
import { Eye, Flag, Handshake, UserCheck, ArrowRight, Save } from "lucide-react"
import ContactListModal from "../components/molecules/ContactListModal.jsx"
import ViolationReportModal from "../components/molecules/ViolationReportModal.jsx"
import LiveGoodsTable from "../components/organisms/LiveGoodsTable.jsx"
import { getProductById } from "../services/productService"
    
export default function AiLiveVideoDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const { t } = useTranslation()
  const videoRef = useRef(null)
  const [showShare, setShowShare] = useState(false)
  const [showReport, setShowReport] = useState(false)
  const [isFollowed, setIsFollowed] = useState(false)
  const [confirmSeconds, setConfirmSeconds] = useState(300)
  const [locked, setLocked] = useState(false)
  const [blink, setBlink] = useState(false)
  const [isSaved, setIsSaved] = useState(false)
  const [audioOn, setAudioOn] = useState(false)
  const [product, setProduct] = useState(null)
  const [videoUrl, setVideoUrl] = useState("")
  const [videoError, setVideoError] = useState(false)
  const [loadingVideo, setLoadingVideo] = useState(true)
  const [loadingProduct, setLoadingProduct] = useState(true)
  const formatTime = (s) => `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`
  const [ownerDecision, setOwnerDecision] = useState("none")

  const beep = () => {
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)()
      const o = ctx.createOscillator()
      const g = ctx.createGain()
      o.type = "sine"
      o.frequency.value = 880
      o.connect(g)
      g.connect(ctx.destination)
      g.gain.setValueAtTime(0.001, ctx.currentTime)
      g.gain.exponentialRampToValueAtTime(0.2, ctx.currentTime + 0.01)
      o.start()
      setTimeout(() => {
        g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.25)
        o.stop(ctx.currentTime + 0.3)
      }, 250)
    } catch { }
  }

  const onSaveHandle = () => {
    console.log("Save")
    setIsSaved(!isSaved)
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

  useEffect(() => {
    let cancelled = false
    const run = async () => {
      try {
        setLoadingProduct(true)
        setVideoError(false)
        const stateUrl = location?.state?.videoUrl
        if (typeof stateUrl === "string" && stateUrl) setVideoUrl(stateUrl)

        const res = await getProductById(id)
        const data = res?.data?.data
        if (cancelled) return
        setProduct(data || null)

        const fromFileLinks = data?.fileLinks?.product?.livestreamVideoFile
        if (typeof fromFileLinks === "string") {
          setVideoUrl(fromFileLinks)
          return
        }
        if (Array.isArray(fromFileLinks) && typeof fromFileLinks[0] === "string") {
          setVideoUrl(fromFileLinks[0])
          return
        }

        const m = data?.livestreamVideoFile
        if (typeof m === "string") {
          setVideoUrl(m)
          return
        }
        if (m?.url) {
          setVideoUrl(m.url)
          return
        }
        if (m?.data?.attributes?.url) {
          setVideoUrl(m.data.attributes.url)
          return
        }

        setVideoUrl("")
      } catch (_) {
        if (cancelled) return
        setProduct(null)
        setVideoUrl("")
      } finally {
        if (!cancelled) setLoadingProduct(false)
      }
    }
    run()
    return () => {
      cancelled = true
    }
  }, [id, location?.state?.videoUrl])

  useEffect(() => {
    setVideoError(false)
    setLoadingVideo(Boolean(videoUrl))
    const el = videoRef.current
    if (!el || !videoUrl) return
    try {
      el.load()
      const p = el.play()
      if (p && typeof p.catch === "function") p.catch(() => { })
    } catch { }
  }, [videoUrl])

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

  return (
    <div className="p-2">
      {/* <div className="mb-4 flex items-center justify-between">
        <button className="text-blue-600 underline" onClick={() => navigate(-1)}>{t("common.back", "Quay lại")}</button>
        <div className="text-sm">{t("aiLiveVideo.detail", "Chi tiết video")}</div>
      </div> */}

      <div className="grid grid-cols-1 gap-6">
        <div className="relative border border-black min-h-[420px] bg-black">
          {videoUrl ? (
            <video
              key={videoUrl}
              ref={videoRef}
              className="absolute inset-0 w-full h-full object-contain"
              controls
              playsInline
              preload="auto"
              autoPlay
              muted
              loop
              onError={() => setVideoError(true)}
              onLoadedData={() => setLoadingVideo(false)}
              onCanPlay={() => {
                setLoadingVideo(false)
                const el = videoRef.current
                if (!el) return
                if (!el.paused) return
                const p = el.play()
                if (p && typeof p.catch === "function") p.catch(() => { })
              }}
            >
              <source
                src={videoUrl}
                type={(() => {
                  const clean = String(videoUrl).split("?")[0]
                  if (clean.endsWith(".webm")) return "video/webm"
                  if (clean.endsWith(".mov")) return "video/quicktime"
                  return "video/mp4"
                })()}
              />
            </video>
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-white text-sm">
              {loadingProduct ? t("common.loading", "Đang tải...") : t("common.noVideo", "Không có video")}
            </div>
          )}

          {(loadingProduct || loadingVideo) && (
            <div className="absolute inset-0 flex items-center justify-center text-white text-sm z-10 pointer-events-none">
              {t("common.loading", "Đang tải...")}
            </div>
          )}

          <div className="relative z-10 text-xs flex items-start justify-start">
            <div className="font-bold ml-2 text-white">{product?.productItems?.[0]?.name || name}</div>
            <div className="font-bold ml-2 text-white">{product?.custom_id || product?.documentId || productId}</div>

          </div>
          <div className="absolute left-2 top-10 space-y-2 text-xs z-10 text-white">
            <div className="flex items-center gap-1"><Eye size={24} /><span>{viewers} đang xem</span></div>
            <div className="flex items-center gap-1"><Handshake size={24} /><span className="font-semibold">{reactions}</span></div>
          </div>
          <div className="absolute right-3 bottom-3 flex flex-col items-center gap-2 z-10">
            <button onClick={() => onFollowHandle()} className={`border border-black p-2 rounded  text-sm font-bold ${isFollowed ? "bg-blue-300" : "bg-white"}`}><UserCheck size={18} /></button>
            <button onClick={() => onSaveHandle()} className={`border border-black p-2 rounded  text-sm font-bold ${isSaved ? "bg-blue-300" : "bg-white"}`}><Save size={18} /></button>
            <button className="border border-black bg-white p-2 rounded" onClick={() => setShowShare(true)}><ArrowRight size={18} /></button>
            <button className="border border-black bg-white p-2 rounded" onClick={() => setShowReport(true)}><Flag size={18} /></button>
          </div>
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 transform z-10">
            <button className="border border-black px-4 py-2 bg-yellow-100 text-sm font-bold">THAM GIA</button>
          </div>

          {videoError && videoUrl && (
            <div className="absolute bottom-14 left-2 right-2 z-10 bg-white/90 text-xs p-2 rounded">
              <div>{t("common.videoError", "Video không phát được trên trình duyệt.")}</div>
              <a className="underline" href={videoUrl} target="_blank" rel="noreferrer">
                {t("common.openVideo", "Mở video")}
              </a>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-3 mt-4 border border-black">
        <div className={`flex items-center justify-center p-4 text-center font-bold ${blink ? "animate-pulse" : ""}`} style={{ backgroundColor: "#1e3a8a", color: "#f59e0b" }} onClick={() => setOwnerDecision("accepted")}>
          {t("liveConfirm.agree", "ĐỒNG Ý")}
        </div>
        <div className=" text-center flex items-center justify-center text-5xl tracking-widest text-black">{formatTime(confirmSeconds)}</div>
        <div className="flex items-center justify-center p-4 text-center font-bold" style={{ backgroundColor: "#ef4444", color: "#111827" }} onClick={() => setOwnerDecision("rejected")}>
          {t("liveConfirm.reject", "TỪ CHỐI")}
        </div>
      </div>

      <LiveGoodsTable />
      <div className="flex items-center justify-center mt-2">
        {ownerDecision === "none" ? (
          <div className="p-4 text-center font-bold" style={{ backgroundColor: "#e0f2fe", color: "#1e3a8a" }}>
            <button>{t("customerConfirm.title", "XÁC NHẬN")}</button>
          </div>
        ) : ownerDecision === "accepted" ? (
          <div className="p-4 text-center font-bold" style={{ backgroundColor: "#0ea5e9", color: "#facc15" }}>{t("customerConfirm.approvedLeft", "ĐÃ DUYỆT (lệnh từ chủ bài đăng)")}</div>
        ) : (
          <div className="p-4 text-center font-bold" style={{ backgroundColor: "#ef4444", color: "#111827" }}>{t("customerConfirm.rejectedRight", "TỪ CHỐI (lệnh từ chủ bài đăng)")}</div>
        )}
      </div>

      <div className="grid grid-cols-3 mt-2">
        <div />
        <div className="p-2 text-center" style={{ backgroundColor: "#06b6d4", color: "#002855" }}>
          <button className="underline" onClick={() => navigate(`/list-of-goods/${id}`)}>{t("customerConfirm.goToDetail", "ĐẾN CHI TIẾT BÀI ĐĂNG")}</button>
        </div>
        <div />
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
    </div>
  )
}
