import { useEffect, useState } from "react"
import { createMovie } from "../services/movieService"
import { createLive } from "../services/liveService"
import { createVideo } from "../services/videoService"

export default function useAiLivePost() {
  const [user, setUser] = useState(null)
  const [activeTab, setActiveTab] = useState("video")
  const [videoFile, setVideoFile] = useState(null)
  const [movieFile, setMovieFile] = useState(null)
  const [liveOwnershipFile, setLiveOwnershipFile] = useState(null)
  const [liveAdFile, setLiveAdFile] = useState(null)
  const [liveTimeStartHour, setLiveTimeStartHour] = useState("")
  const [liveTimeEndHour, setLiveTimeEndHour] = useState("")
  const [videoName, setVideoName] = useState("")
  const [movieName, setMovieName] = useState("")
  const [liveName, setLiveName] = useState("")
  const [allowAdVideo, setAllowAdVideo] = useState(false)
  const [allowAdMovie, setAllowAdMovie] = useState(false)
  const [allowAdLive, setAllowAdLive] = useState(false)

  const [videoData, setVideoData] = useState({
    name: "Product Intro",
    savelocation: "/videos/product-intro.mp4",
    allowAdvertising: true,
    showAd: 15,
    insertAd: 45,
    startFromTime: 5,
    startFromView: 250,
    source: "https://www.youtube.com/watch?v=1234567890",
    confirmCopyright: true,
  })

  const [movieData, setMovieData] = useState({
    name: "",
    filename: "",
    watchPrice: 0,
    ownerPercentage: 0,
    deposit: 0,
    unitPrice: 0,
    adOnMainPageFee: 0,
    source: "https://example.com/live/launch",
    rightsDocument: ["https://example.com/live/launch"],
    adContent: "https://example.com/live/launch",
  })

  const [liveData, setLiveData] = useState({
    name: "Live Tech Talk: Future of AI",
    expectedAiringTime: "2025-08-10T20:00:00.000Z",
    filename: "ai_tech_talk_2025.mp4",
    watchPrice: 14.99,
    messagePrice: 2.5,
    ownerPercentage: 80,
    deposit: 300.0,
    priceBaseLocal: 12.0,
    unitPrice: 15.0,
    allowAdvertising: true,
    showAd: 20.0,
    startAdvertisingFromSeconds: 60,
    startAdvertisingFromViews: 500,
    rightsDocument: ["https://example.com/live/launch", "https://example.com/live/launch"],
    adContent: ["https://example.com/live/launch", "https://example.com/live/launch"],
  })

  useEffect(() => {
    const token = localStorage.getItem("authToken")
    setUser(token)
  }, [])

  const handleSubmitMovie = async (t) => {
    try {
      const response = await createMovie("token", movieData)
      console.log("Movie uploaded successfully:", response.data)
    } catch (error) {
      console.error("Error uploading movie:", error.message)
    }
  }

  const handleSubmitVideo = async (t) => {
    try {
      const response = await createVideo("token", videoData)
      console.log("Video uploaded successfully:", response.data)
    } catch (error) {
      console.error("Error uploading video:", error.message)
    }
  }

  const handleSubmitLive = async (t) => {
    try {
      const response = await createLive("token", liveData)
      console.log("Live uploaded successfully:", response.data)
    } catch (error) {
      console.error("Error uploading live:", error.message)
    }
  }

  return {
    user,
    activeTab,
    setActiveTab,
    videoFile,
    setVideoFile,
    movieFile,
    setMovieFile,
    liveOwnershipFile,
    setLiveOwnershipFile,
    liveAdFile,
    setLiveAdFile,
    liveTimeStartHour,
    setLiveTimeStartHour,
    liveTimeEndHour,
    setLiveTimeEndHour,
    videoName,
    setVideoName,
    movieName,
    setMovieName,
    liveName,
    setLiveName,
    allowAdVideo,
    setAllowAdVideo,
    allowAdMovie,
    setAllowAdMovie,
    allowAdLive,
    setAllowAdLive,
    handleSubmitMovie,
    handleSubmitVideo,
    handleSubmitLive,
  }
}