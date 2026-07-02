import { useState, useEffect, useMemo, useRef, useCallback } from "react"
import { useTranslation } from "react-i18next"
import { useNavigate } from "react-router-dom"
import {
    Users,
    X,
    ChevronRight,
    Bookmark,
    Flag,
    FileWarning,
    Trash2,
    Play,
    SearchIcon,
    Mic,
    FlagOff,
    Save,
    Package
} from "lucide-react"
import AiLiveVideoList from "../AiLiveVideoList.jsx";
import { filterProducts } from "../../services/productService";




export default function AiLiveStreamGoods() {
    const { t } = useTranslation()
    const navigate = useNavigate()

    const API_URL = import.meta.env.VITE_API_URL || "http://localhost:1337/api"
    const FILE_BASE_URL = API_URL.replace(/\/api\/?$/, "")

    const normalizeFileUrl = useCallback((url) => {
        if (!url) return null
        if (typeof url !== "string") return null
        if (/^https?:\/\//i.test(url)) return url
        if (url.startsWith("/")) return `${FILE_BASE_URL}${url}`
        return `${FILE_BASE_URL}/${url}`
    }, [FILE_BASE_URL])

    const getLivestreamVideoUrl = useCallback((product) => {
        const fromFileLinks = product?.fileLinks?.product?.livestreamVideoFile
        if (typeof fromFileLinks === "string") return normalizeFileUrl(fromFileLinks)
        if (Array.isArray(fromFileLinks) && typeof fromFileLinks[0] === "string") return normalizeFileUrl(fromFileLinks[0])

        const m = product?.livestreamVideoFile
        if (typeof m === "string") return normalizeFileUrl(m)
        if (m?.url) return normalizeFileUrl(m.url)
        if (m?.data?.attributes?.url) return normalizeFileUrl(m.data.attributes.url)
        return null
    }, [normalizeFileUrl])

    const getFirstItemName = useCallback((product) => {
        const items = product?.productItems || product?.items
        const first = Array.isArray(items) ? items[0] : null
        return first?.name || ""
    }, [])

    const getProductRouteId = useCallback((product) => {
        return product?.custom_id || product?.documentId || product?.id
    }, [])

    const [liveVideoProducts, setLiveVideoProducts] = useState([])
    const [liveVideoLoading, setLiveVideoLoading] = useState(false)
    const [liveVideoError, setLiveVideoError] = useState("")
    const [liveVideoPage, setLiveVideoPage] = useState(1)
    const [liveVideoTotalPages, setLiveVideoTotalPages] = useState(1)

    const fetchLiveVideos = useCallback(async () => {
        try {
            setLiveVideoLoading(true)
            setLiveVideoError("")
            const filters = {
                listingType: localStorage.getItem("category") || "",
                categoryType: localStorage.getItem("subcategory") || "",
                conditionType: localStorage.getItem("condition") || "",
                nation: localStorage.getItem("nation") || "",
                province: localStorage.getItem("province") || "",
                name: "",
            }
            if (filters.nation?.toLowerCase() === "all") filters.nation = ""
            if (filters.province?.toLowerCase() === "all") filters.province = ""

            const response = await filterProducts(filters, liveVideoPage, 12, null, false)
            const products = response.data?.data || []
            setLiveVideoProducts(products.filter((p) => Boolean(getLivestreamVideoUrl(p))))
            setLiveVideoTotalPages(response.data?.meta?.pagination?.pageCount || 1)
        } catch (err) {
            setLiveVideoProducts([])
            setLiveVideoTotalPages(1)
            setLiveVideoError(err?.message || "Failed to load livestream videos")
        } finally {
            setLiveVideoLoading(false)
        }
    }, [getLivestreamVideoUrl, liveVideoPage])

    useEffect(() => {
        fetchLiveVideos()
    }, [fetchLiveVideos])

    const [followedByCount] = useState(123456)
    const [followedUsers, setFollowedUsers] = useState([])
    const [activeUserId, setActiveUserId] = useState(null)
    const [activeStreamIndex, setActiveStreamIndex] = useState(0)
    const swipeStartY = useRef(null)

    const [productFolders, setProductFolders] = useState([])
    const [openFolderId, setOpenFolderId] = useState(null)
    const [completedFolders, setCompletedFolders] = useState([])
    const [violations, setViolations] = useState([])
    const [reports, setReports] = useState([])
    const [activeTab, setActiveTab] = useState(null)
    const [streams, setStreams] = useState([])
    const [isExpend, setIsExpend] = useState(false)
    useEffect(() => {
        const now = Date.now()
        const makeStreams = (u) => (
            Array.from({ length: u }, (_, i) => ({
                id: Number(`${u}${i}${i + 1}`),
                isGoods: true,
                viewers: 123456,
                title: `${t("aiLiveVideo.video", "VIDEO")} ${i + 1}`,
                productId: `PRD-${String(i + 1).padStart(3, "0")}`,
                startedAt: new Date(now - i * 3600_000).toISOString(),
            }))
        )

        setStreams(makeStreams(12))

        setFollowedUsers([
            { id: 1, name: "A", avatar: "https://i.pravatar.cc/100?u=1", streams: makeStreams(3) },
            { id: 2, name: "B", avatar: "https://i.pravatar.cc/100?u=2", streams: makeStreams(1) },
            { id: 3, name: "C", avatar: "https://i.pravatar.cc/100?u=3", streams: makeStreams(2) },
            { id: 4, name: "D", avatar: "https://i.pravatar.cc/100?u=4", streams: makeStreams(5) },
            { id: 5, name: "E", avatar: "https://i.pravatar.cc/100?u=5", streams: makeStreams(0) },
        ])

        setProductFolders([
            {
                id: "PRD-101",
                name: "Tên hàng hóa – ID hàng hóa 1",
                registeredAt: now - 86_400_000 * 2,
                videos: [
                    { id: 1001, title: "VIDEO LIVESTREAM 1" },
                    { id: 1002, title: "VIDEO LIVESTREAM 2" },
                ],
            },
            {
                id: "PRD-102",
                name: "Tên hàng hóa – ID hàng hóa 2",
                registeredAt: now - 86_400_000,
                videos: [
                    { id: 2001, title: "VIDEO LIVESTREAM 1" },
                ],
            },
        ])

        setCompletedFolders([
            {
                id: "PRD-090",
                name: "Đã hoàn thành – ID 90",
                movedAt: now - 86_400_000 * 4,
                videos: [{ id: 9001, title: "VIDEO LIVESTREAM 1" }],
            },
        ])

        setViolations([
            { id: "PRD-777", note: "Nội dung vi phạm mục 3", videos: [{ id: 77701, title: "Video" }] },
        ])
        setReports([
            { id: "PRD-888", note: "Báo cáo spam tại phút 1:23", videos: [{ id: 88801, title: "Video" }] },
        ])
    }, [t])

    const sortedFollowed = useMemo(() => {
        return [...followedUsers].sort((a, b) => {
            const ca = a.streams.length
            const cb = b.streams.length
            if (cb !== ca) return cb - ca
            const la = a.streams[0]?.startedAt ? new Date(a.streams[0].startedAt).getTime() : 0
            const lb = b.streams[0]?.startedAt ? new Date(b.streams[0].startedAt).getTime() : 0
            return lb - la
        })
    }, [followedUsers])

    const activeUser = useMemo(() => sortedFollowed.find(u => u.id === activeUserId) || null, [sortedFollowed, activeUserId])
    const activeStream = useMemo(() => activeUser?.streams?.[activeStreamIndex] || null, [activeUser, activeStreamIndex])

    useEffect(() => {
        const now = Date.now()
        setCompletedFolders(prev => prev.filter(f => now - f.movedAt < 86_400_000 * 3))
    }, [])

    const handleUnfollow = (id) => {
        setFollowedUsers(prev => prev.filter(u => u.id !== id))
        if (activeUserId === id) {
            setActiveUserId(null)
            setActiveStreamIndex(0)
        }
    }

    const openStream = (streamId) => {
        navigate(`/ai-live/video/${streamId}`)
    }

    const confirmAndOpen = (videoId) => {
        const ok = window.confirm("Xác nhận phát livestream?")
        if (ok) navigate(`/ai-live/video/${videoId}`)
    }

    const onTouchStart = (e) => {
        swipeStartY.current = e.touches[0].clientY
    }
    const onTouchEnd = (e) => {
        if (swipeStartY.current == null) return
        const dy = swipeStartY.current - e.changedTouches[0].clientY
        if (Math.abs(dy) > 30 && activeUser) {
            setActiveStreamIndex(prev => {
                const next = dy > 0 ? prev + 1 : prev - 1
                const total = activeUser.streams.length
                if (next < 0) return 0
                if (next >= total) return total - 1
                return next
            })
        }
        swipeStartY.current = null
    }

    const sortedFolders = useMemo(() => {
        return [...productFolders].sort((a, b) => a.registeredAt - b.registeredAt)
    }, [productFolders])

    const moveFolderToCompleted = (id) => {
        const f = productFolders.find(x => x.id === id)
        if (!f) return
        setProductFolders(prev => prev.filter(x => x.id !== id))
        setCompletedFolders(prev => [{ ...f, movedAt: Date.now() }, ...prev])
        if (openFolderId === id) setOpenFolderId(null)
    }

    const deleteCompleted = (id) => {
        setCompletedFolders(prev => prev.filter(x => x.id !== id))
    }

    return (
        <div className="space-y-1 ">
            <div className="border border-gray-300 bg-white rounded-md p-2">
                <div className="flex items-center justify-between gap-2">
                    <div className="font-bold text-sm">{t("aiLive.livestreamVideos", "VIDEO LIVESTREAM")}</div>
                    <div className="flex items-center gap-2">
                        <button
                            type="button"
                            className="border px-2 py-1 text-xs disabled:opacity-50"
                            disabled={liveVideoPage <= 1 || liveVideoLoading}
                            onClick={() => setLiveVideoPage((p) => Math.max(1, p - 1))}
                        >
                            {t("common.prev", "Trước")}
                        </button>
                        <div className="text-xs text-gray-600">
                            {liveVideoPage}/{liveVideoTotalPages}
                        </div>
                        <button
                            type="button"
                            className="border px-2 py-1 text-xs disabled:opacity-50"
                            disabled={liveVideoPage >= liveVideoTotalPages || liveVideoLoading}
                            onClick={() => setLiveVideoPage((p) => Math.min(liveVideoTotalPages, p + 1))}
                        >
                            {t("common.next", "Sau")}
                        </button>
                    </div>
                </div>

                {liveVideoLoading && (
                    <div className="text-center text-sm text-gray-600 py-4">{t("common.loading", "Đang tải...")}</div>
                )}

                {!liveVideoLoading && liveVideoError && (
                    <div className="text-center text-sm text-red-600 py-4">{liveVideoError}</div>
                )}

                {!liveVideoLoading && !liveVideoError && liveVideoProducts.length === 0 && (
                    <div className="text-center text-sm text-gray-600 py-4">{t("common.noData", "Không có dữ liệu")}</div>
                )}

                {!liveVideoLoading && !liveVideoError && liveVideoProducts.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 mt-2">
                        {liveVideoProducts.map((p) => {
                            const url = getLivestreamVideoUrl(p)
                            const pid = getProductRouteId(p)
                            const title = getFirstItemName(p) || pid
                            return (
                                <div key={pid} className="border border-gray-300 rounded p-2">
                                    <div className="flex items-center justify-between gap-2 mb-2">
                                        <div className="text-xs font-bold truncate">{title}</div>
                                        <button
                                            type="button"
                                            className="text-xs underline"
                                            onClick={() => pid && navigate(`/list-of-goods/${pid}`)}
                                        >
                                            {t("common.detail", "Chi tiết")}
                                        </button>
                                    </div>
                                    <video
                                        src={url || undefined}
                                        controls
                                        playsInline
                                        preload="metadata"
                                        className="w-full aspect-video bg-black rounded"
                                    />
                                </div>
                            )
                        })}
                    </div>
                )}
            </div>
            <div className="mt-1 border-1 border-gray-300">
                <div className="flex items-center">
                    <SearchIcon size={24} className="text-gray-400" />
                    <Mic size={24} className="text-gray-400 hover:text-gray-600" />
                    <input
                        type="text"
                        // placeholder={t('goods.searchPlaceholder')} 
                        className="flex-1 p-2 rounded"
                    />
                </div>
            </div>
            <div className="grid grid-cols-10">
                <div onClick={() => setIsExpend(!isExpend)} className=" col-span-1 flex items-start justify-start gap-2">
                    <div className="w-full flex  items-end gap-1">
                        <img
                            src={activeUser?.avatar}
                            className="w-12 h-12 ring-2 ring-blue-500"
                        />
                        2342958
                    </div>
                </div>
                <div className={`col-span-9 flex justify-between ${isExpend ? 'block' : 'hidden'}`} >
                    <div className=" rounded-lg p-3">
                        <button className={`border p-2 relative ${activeTab === 'follow' ? 'bg-gray-100 border-gray-400' : ''}`} onClick={() => setActiveTab(prev => prev === 'follow' ? null : 'follow')}>
                            <Users className="w-5 h-5" />
                            <span style={{ right: '-40px' }} className="absolute text-right top-0 text-xs bg-red-500 text-white px-1 rounded-full">24958</span>
                        </button>

                    </div>

                    <div className=" rounded-lg p-3">
                        <button className={`border p-2 ${activeTab === 'package' ? 'bg-gray-100 border-gray-400' : ''}`} onClick={() => setActiveTab(prev => prev === 'package' ? null : 'package')}>
                            <Package className="w-5 h-5" />
                        </button>
                    </div>

                    <div className=" rounded-lg p-3">
                        <button className={`border p-2 ${activeTab === 'products' ? 'bg-gray-100 border-gray-400' : ''}`} onClick={() => setActiveTab(prev => prev === 'products' ? null : 'products')}>
                            <Bookmark className="w-5 h-5" />
                        </button>

                    </div>

                    <div className=" rounded-lg p-3">
                        <button className={`border p-2 ${activeTab === 'completed' ? 'bg-gray-100 border-gray-400' : ''}`} onClick={() => setActiveTab(prev => prev === 'completed' ? null : 'completed')}>
                            <Save className="w-5 h-5" />
                        </button>

                    </div>

                    <div className=" rounded-lg p-3">
                        <button className={`border p-2 ${activeTab === 'violations' ? 'bg-gray-100 border-gray-400' : ''}`} onClick={() => setActiveTab(prev => prev === 'violations' ? null : 'violations')}>
                            <FlagOff className="w-5 h-5" />
                        </button>

                    </div>

                    <div className=" rounded-lg p-3">
                        <button className={`border p-2 ${activeTab === 'reports' ? 'bg-gray-100 border-gray-400' : ''}`} onClick={() => setActiveTab(prev => prev === 'reports' ? null : 'reports')}>
                            <Flag className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </div>

            {activeTab === 'follow' && (
                <div className="mt-3">
                    <div className="flex border items-center gap-3 text-gray-800">
                        <span className="font-semibold">{followedByCount} người theo dõi mình</span>
                    </div>
                    <div className="text-sm text-gray-600 mb-2 mt-2">98765 theo dõi ai</div>
                    <div className="flex items-center gap-2 overflow-x-auto pb-2">
                        {sortedFollowed.map(u => (
                            <div key={u.id} className="relative flex-shrink-0">
                                <img
                                    src={u.avatar}
                                    alt="avatar"
                                    className={`w-12 h-12 rounded-full ring-2 ${activeUserId === u.id ? "ring-blue-500" : "ring-gray-300"}`}
                                    onClick={() => { setActiveUserId(u.id); setActiveStreamIndex(0) }}
                                />
                                <button
                                    className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-1"
                                    onClick={() => handleUnfollow(u.id)}
                                    aria-label="Xóa"
                                >
                                    <X className="w-3 h-3" />
                                </button>
                                {u.streams.length > 0 && (
                                    <div className="absolute -top-2 left-1 text-xs bg-gray-800 text-white px-1 rounded">
                                        {u.streams.length}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                    {activeUser && (
                        <div
                            className="mt-3 border rounded p-3"
                            onTouchStart={onTouchStart}
                            onTouchEnd={onTouchEnd}
                        >
                            <div className="flex items-center justify-between">
                                <div className="font-medium">{activeUser.name}</div>
                                <div className="text-xs text-gray-500">{activeUser.streams.length} livestream</div>
                            </div>
                            <div className="mt-2">
                                {activeStream && (
                                    <button
                                        className="w-full flex items-center justify-between px-3 py-2 border rounded hover:bg-gray-50"
                                        onClick={() => openStream(activeStream.id)}
                                    >
                                        <span>{activeStream.title}</span>
                                        <ChevronRight className="w-4 h-4" />
                                    </button>
                                )}
                                <div className="mt-2 flex items-center gap-2 text-xs text-gray-500">
                                    <span>Gạt lên để đến livestream tiếp theo</span>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )}
            {activeTab === 'package' && (
                <div className="mt-3">
                    <div className="space-y-2">
                        {sortedFolders.map(f => (
                            <div key={f.id}>
                                <div className="flex items-center justify-between">
                                    <button className="text-left w-full flex items-center gap-2" onClick={() => setOpenFolderId(prev => prev === f.id ? null : f.id)}>
                                        <span>• {f.name}</span>
                                        <ChevronRight className={`w-4 h-4 ${openFolderId === f.id ? "rotate-90" : ""}`} />
                                    </button>
                                    <button className="text-xs text-blue-600" onClick={() => moveFolderToCompleted(f.id)}>Chuyển sang Hoàn thành</button>
                                </div>
                                {openFolderId === f.id && (
                                    <div className="pl-6 mt-1 space-y-1">
                                        {f.videos.map(v => (
                                            <div key={v.id} className="flex items-center justify-between">
                                                <span className="text-sm">{v.title}</span>
                                                <button className="flex items-center gap-1 text-blue-600 text-sm" onClick={() => confirmAndOpen(v.id)}>
                                                    <Play className="w-4 h-4" /> Phát
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}
            {activeTab === 'products' && (
                <div className="mt-3">
                    <div className="space-y-2">
                        {sortedFolders.map(f => (
                            <div key={f.id}>
                                <div className="flex items-center justify-between">
                                    <button className="text-left w-full flex items-center gap-2" onClick={() => setOpenFolderId(prev => prev === f.id ? null : f.id)}>
                                        <span>• {f.name}</span>
                                        <ChevronRight className={`w-4 h-4 ${openFolderId === f.id ? "rotate-90" : ""}`} />
                                    </button>
                                    <button className="text-xs text-blue-600" onClick={() => moveFolderToCompleted(f.id)}>Chuyển sang Hoàn thành</button>
                                </div>
                                {openFolderId === f.id && (
                                    <div className="pl-6 mt-1 space-y-1">
                                        {f.videos.map(v => (
                                            <div key={v.id} className="flex items-center justify-between">
                                                <span className="text-sm">{v.title}</span>
                                                <button className="flex items-center gap-1 text-blue-600 text-sm" onClick={() => confirmAndOpen(v.id)}>
                                                    <Play className="w-4 h-4" /> Phát
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}
            {activeTab === 'completed' && (
                <div className="mt-3">
                    <div className="space-y-2">
                        {completedFolders.map(f => (
                            <div key={f.id} className="flex items-center justify-between">
                                <span>• {f.name}</span>
                                <button className="flex items-center gap-1 text-red-600 text-sm" onClick={() => deleteCompleted(f.id)}>
                                    <Trash2 className="w-4 h-4" /> Xóa
                                </button>
                            </div>
                        ))}
                        {completedFolders.length === 0 && (
                            <div className="text-sm text-gray-500">Rỗng</div>
                        )}
                    </div>
                </div>
            )}
            {activeTab === 'violations' && (
                <div className="mt-3">
                    <div className="space-y-2">
                        {violations.map(v => (
                            <div key={v.id}>
                                <div className="flex items-center justify-between">
                                    <span>• {v.id}</span>
                                    <span className="text-xs text-gray-500">{v.note}</span>
                                </div>
                            </div>
                        ))}
                        {violations.length === 0 && (
                            <div className="text-sm text-gray-500">Rỗng</div>
                        )}
                    </div>
                </div>
            )}
            {activeTab === 'reports' && (
                <div className="mt-3">
                    <div className="space-y-2">
                        {reports.map(v => (
                            <div key={v.id}>
                                <div className="flex items-center justify-between">
                                    <span>• {v.id}</span>
                                    <span className="text-xs text-gray-500">{v.note}</span>
                                </div>
                            </div>
                        ))}
                        {reports.length === 0 && (
                            <div className="text-sm text-gray-500">Rỗng</div>
                        )}
                    </div>
                </div>
            )}
            <AiLiveVideoList videos={streams.filter(v => v.isGoods)} />
        </div>
    )
}
