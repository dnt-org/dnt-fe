import { useState, useEffect } from "react"
import { useTranslation } from "react-i18next"
import AiLiveVideoList from "../AiLiveVideoList.jsx"

export default function AiLiveStreamGoods() {
    const { t } = useTranslation()
    const [video, setVideo] = useState([])
    
    useEffect(() => {
        setVideo(Array.from({ length: 12 }, (_, i) => ({
            id: i + 1,
            name: `${t("aiLiveVideo.video", "VIDEO")} ${i + 1}`,
            productId: `PRD-${String(i + 1).padStart(3, "0")}`,
            viewers: 2112,
        })))
    }, [t])
    return (
        <AiLiveVideoList videos={video} />
    )
}