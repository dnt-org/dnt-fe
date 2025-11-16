import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { createMovie } from "../services/movieService";
import { createLive } from "../services/liveService";
import { createVideo } from "../services/videoService";
import {
  Home as HomeIcon,
  KeyboardIcon as KeyboardIcon,
  Eye as EyeIcon,
  EyeOff as EyeOffIcon,
} from "lucide-react";
import PostTypeMenu from "../components/PostTypeMenu";
import PageHeaderWithOutColorPicker from "../components/PageHeaderWithOutColorPicker.jsx";
import GoodsAccount from "../components/GoodsAccount.jsx";


export default function NewAiLivePostPage() {
  const { t } = useTranslation();
  const [color, setColor] = useState(
    localStorage.getItem("selectedColor") || "#ffffff"
  );
  const [user, setUser] = useState(null);
  const [videoFile, setVideoFile] = useState(null);
  const [movieFile, setMovieFile] = useState(null);
  const [movieOwnershipFile, setMovieOwnershipFile] = useState(null);
  const [movieAdFile, setMovieAdFile] = useState(null);
  const [liveTime, setLiveTime] = useState("");
  const [liveTimeStartHour, setLiveTimeStartHour] = useState("");
  const [liveTimeStartDate, setLiveTimeStartDate] = useState("");
  const [liveTimeEndHour, setLiveTimeEndHour] = useState("");
  const [liveTimeEndDate, setLiveTimeEndDate] = useState("");
  const [videoName, setVideoName] = useState("");
  const [movieName, setMovieName] = useState("");
  const [liveName, setLiveName] = useState("");
  const [activeTab, setActiveTab] = useState("video"); // Thêm state tab


  // Advertising toggles per tab
  const [allowAdVideo, setAllowAdVideo] = useState(false);
  const [allowAdMovie, setAllowAdMovie] = useState(false);
  const [allowAdLive, setAllowAdLive] = useState(false);

  const [videoData, setVideoData] = useState({
    name: "Product Intro",
    savelocation: "/videos/product-intro.mp4",
    allowAdvertising: true,
    showAd: 15,
    insertAd: 45,
    startFromTime: 5,
    startFromView: 250,
    source: "https://www.youtube.com/watch?v=1234567890", // Will be a file url
    confirmCopyright: true,
  });

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
  });

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
    rightsDocument: [
      "https://example.com/live/launch",
      "https://example.com/live/launch",
    ], // media IDs returned from /upload
    adContent: [
      "https://example.com/live/launch",
      "https://example.com/live/launch",
    ], // media IDs returned from /upload
  });
  const [liveOwnershipFile, setLiveOwnershipFile] = useState(null);
  const [liveAdFile, setLiveAdFile] = useState(null);

  const handleSubmitMovie = async (e) => {
    e.preventDefault();
    try {
      const response = await createMovie("token", movieData);
      console.log("Movie uploaded successfully:", response.data);
      // Handle success (e.g., redirect to movie list page)
    } catch (error) {
      console.error("Error uploading movie:", error.message);
      // Handle error (e.g., show error message to user)
    }
  };

  const handleVideoChange = (e) => {
    setVideoFile(e.target.files[0]);
  };

  const handleSubmitVideo = async (e) => {
    e.preventDefault();
    try {
      const response = await createVideo("token", videoData);
      console.log("Video uploaded successfully:", response.data);
      // Handle success (e.g., redirect to video list page)
    } catch (error) {
      console.error("Error uploading video:", error.message);
      // Handle error (e.g., show error message to user)
    }
  };

  const handleSubmitLive = async (e) => {
    e.preventDefault();
    try {
      const response = await createLive("token", liveData);
      console.log("Live uploaded successfully:", response.data);
      // Handle success (e.g., redirect to live list page)
    } catch (error) {
      console.error("Error uploading live:", error.message);
      // Handle error (e.g., show error message to user)
    }
  };

  const navigate = useNavigate();

  useEffect(() => {
    document.getElementById("root").style.backgroundColor = color;
    const token = localStorage.getItem("authToken");
    setUser(token);
  }, [color]);

  const handleColorChange = (e) => {
    const newColor = e.target.value;
    setColor(newColor);
    localStorage.setItem("selectedColor", newColor);
  };

  return (
    <div className="flex justify-center items-center ">
      <div className="bg-transparent backdrop-blur-md p-1 rounded-lg shadow-lg w-full mx-auto">
        <PageHeaderWithOutColorPicker
          color={color}
          onColorChange={handleColorChange}
          titlePrefix="4"
          leftButton={
            <button
              className="text-red-600 hover:text-red-800 relative"
              onClick={() => navigate("/")}
            >
              <HomeIcon size={28} />
            </button>
          }
          rightButton={
            <button
              className="text-red-600 hover:text-red-800"
              onClick={() => navigate("/admin-control")}
            >
              <KeyboardIcon size={28} />
            </button>
          }
          title={t("aiLive.newPost")}
        />

        {/* Tabs */}
        <div className="">
          <PostTypeMenu activeType="ailive" />
        </div>

        <GoodsAccount title={t("aiLive.accountOfAiLive")} onTransfer={{}} />



        {/* Categories: VIDEO - PHIM - TRỰC TIẾP */}
        <div className="grid grid-cols-3 text-center mt-4">
          <div
            className={`p-3 font-bold cursor-pointer ${activeTab === "video" ? "bg-blue-600 text-white" : "bg-blue-100 text-black"
              }`}
            onClick={() => setActiveTab("video")}
          >
            {t("aiLive.video")}
          </div>
          <div
            className={`p-3 font-bold cursor-pointer ${activeTab === "movie" ? "bg-blue-600 text-white" : "bg-blue-100 text-black"
              }`}
            onClick={() => setActiveTab("movie")}
          >
            {t("aiLive.movie")}
          </div>
          <div
            className={`p-3 font-bold cursor-pointer ${activeTab === "live" ? "bg-blue-600 text-white" : "bg-blue-100 text-black"
              }`}
            onClick={() => setActiveTab("live")}
          >
            {t("aiLive.live")}
          </div>
        </div>

        {/* Input Zones */}
        {activeTab === "video" && (
          <div className="text-black text-sm mt-1">
            {/* VIDEO COLUMN */}
            <div className="bg-blue-100 p-2">
              <span className="sr-only">* {t("aiLive.uploadVideo")}</span>
              <div className="flex items-center">
                <div className="relative w-full border rounded">
                  <span className="pointer-events-none absolute inset-y-0 left-2 flex items-center text-gray-400">
                    {t("aiLive.choose")}
                  </span>
                  <input
                    type="file"
                    onChange={(e) => setVideoFile(e.target.files[0])}
                    className="w-full p-1 border-gray-300 rounded bg-transparent pl-70 text-right"
                  />
                </div>
              </div>


              <input
                type="text"
                value={videoName}
                onChange={(e) => setVideoName(e.target.value)}
                className="w-full border rounded px-2 py-1 mt-1"
                placeholder={t("aiLiveVideo.videoName")}
              />
              <select className="w-full border rounded p-1 mt-1">
                <option value="" disabled selected>
                  -- {t("aiLive.saveLocation")} --
                </option>
                <option>{t("aiLive.introduceYourself")}</option>
                <option>{t("aiLive.economySociety")}</option>
                <option>{t("aiLive.sport")}</option>
                <option>{t("aiLive.entertainment")}</option>
                <option>{t("aiLive.creative")}</option>
                <option>{t("aiLive.campaignsEvents")}</option>
                <option>{t("aiLive.children")}</option>
                <option>{t("aiLive.memory")}</option>
                <option>{t("aiLive.lifeExperience")}</option>
                <option>{t("aiLive.startupIdeas")}</option>
              </select>

              <label className="inline-flex items-center mt-1">
                <input
                  type="checkbox"
                  className="mr-2"
                  checked={allowAdVideo}
                  onChange={(e) => setAllowAdVideo(e.target.checked)}
                />
                <span>{t("aiLive.allowAdvertising")}</span>
              </label>
              {allowAdVideo ? (
                <>
                  <div className="flex flex-wrap mx-2 justify-between">
                    <div className=" flex-1 flex justify-start items-center border border-gray-300 rounded w-1/3 m-2">
                      <span className="flex-1 text-gray-500 border-r">
                        {t("aiLive.showAd")}
                      </span>
                      <input
                        type="number"
                        className="flex-1 px-2 py-1 text-right"
                      // placeholder={t("aiLive.showAd")}
                      />
                      <span className="flex-1 text-gray-500 border-l pl-1">
                        {t("aiLive.seconds")}
                      </span>
                    </div>
                    <div className="flex-1 flex justify-start items-center border border-gray-300 rounded w-1/3 m-2">

                      <span className="flex-1 text-gray-500 border-r">
                        {t("aiLive.insertAd")}
                      </span>
                      <input
                        type="number"
                        className="flex-1 px-2 py-1 text-right"
                      // placeholder={t("aiLive.showAd")}
                      />
                      <span className="flex-1 text-gray-500 border-l pl-1">
                        {t("aiLive.seconds")}
                      </span>



                    </div>
                  </div>
                </>
              ) : null}

              <div className="">
                <label className="inline-flex items-center">
                  <input
                    type="checkbox"
                    className="mr-2"
                  />
                  <span>{t("aiLive.confirmCopyright")}</span>
                </label>

              </div>

            </div>


            {/* {allowAdVideo && (
              <>
                <div className="bg-blue-100 p-4">

                </div>
                <div className="bg-blue-100 p-4">
                  {false && (
                    <>
                      <div className="flex items-center">
                        <input
                          type="number"
                          className="w-full border px-2 py-1"
                          placeholder={t("aiLive.startAdvertisingFromSeconds")}
                        />

                      </div>

                      <div>
                        <input
                          type="number"
                          className="w-full border px-2 py-1 mt-4"
                          placeholder={t("aiLive.startAdvertisingFromViews")}
                        />
                      </div>

                    </>
                  )}
                </div>
              </>
            )} */}

          </div>
        )}
        {activeTab === "movie" && (
          <div className="text-black text-sm mt-1">
            {/* MOVIE COLUMN */}
            <div className="bg-cyan-100 p-4">
              <span className="sr-only">* {t("aiLive.uploadMovie")}</span>
              <div className="relative w-full">
                {!movieFile && (
                  <span className="pointer-events-none absolute inset-y-0 left-2 flex items-center text-gray-400">
                    {t("aiLive.choose")}
                  </span>
                )}
                <input
                  type="file"
                  onChange={(e) => setMovieFile(e.target.files[0])}
                  className="w-full border rounded px-2 py-1 bg-transparent pl-16"
                />
              </div>
              <input
                type="text"
                value={movieName}
                onChange={(e) => setMovieName(e.target.value)}
                className="w-full border rounded px-2 py-1 mt-1"
                placeholder={t("aiLive.movieName")}
              />
            </div>

            <div className="bg-cyan-100 p-4">
              <span className="sr-only">* {t("aiLive.productOwnership")}</span>
              <div className="relative w-full">
                {!movieOwnershipFile && (
                  <span className="pointer-events-none absolute inset-y-0 left-2 flex items-center text-gray-400">
                    {t("aiLive.choose")}
                  </span>
                )}
                <input
                  type="file"
                  className="w-full border rounded px-2 py-1 bg-transparent pl-16"
                  onChange={(e) => setMovieOwnershipFile(e.target.files?.[0] || null)}
                />
              </div>
            </div>
            <div className="bg-cyan-100 p-4">
              <input
                type="number"
                className="w-full border px-2 py-1"
                placeholder={t("aiLive.watchPrice")}
              />
              <input
                type="number"
                className="w-full border px-2 py-1"
                placeholder={t("aiLive.movieOwnerReceive")}
              />
            </div>
            <div className="bg-cyan-100 p-4">
              <label className="inline-flex items-center mb-2">
                <input
                  type="checkbox"
                  className="mr-2"
                  checked={allowAdMovie}
                  onChange={(e) => setAllowAdMovie(e.target.checked)}
                />
                {t("aiLive.allowAdvertisingOnMovie")}
              </label>
            </div>
            {allowAdMovie && (
              <>
                <div className="bg-cyan-100 p-4">
                  <span className="sr-only">{t("aiLive.advertisingOnMainpage")}</span>
                  <input
                    type="number"
                    className="w-full border px-2 py-1"
                    placeholder={t("aiLive.deposit")}
                  />
                </div>
                <div className="bg-cyan-100 p-4">
                  <div className="flex flex-wrap -mx-2">
                    <div className="w-1/2 px-2">
                      <input
                        type="number"
                        className="w-full border px-2 py-1"
                        placeholder={t("aiLive.unitPrice")}
                      />
                    </div>
                    <div className="w-1/2 px-2">
                      <span className="sr-only">{t("aiLive.adContent")}</span>
                      <div className="relative w-full">
                        {!movieAdFile && (
                          <span className="pointer-events-none absolute inset-y-0 left-2 flex items-center text-gray-400">
                            {t("aiLive.choose")}
                          </span>
                        )}
                        <input
                          type="file"
                          className="w-full border rounded px-2 py-1 bg-transparent pl-16"
                          onChange={(e) => setMovieAdFile(e.target.files?.[0] || null)}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}
            <div className="bg-cyan-100 p-4"></div>
          </div>
        )}
        {activeTab === "live" && (
          <div className="text-black text-sm mt-1">
            {/* LIVE COLUMN */}
            <div className="bg-green-100 p-4">
              <span className="sr-only">* {t("aiLive.expectedAiringTime")}</span>

              <div className="flex flex-wrap -mx-2 mb-4">
                <div className="w-1/2 px-2">
                  <span className="sr-only">{t("aiLive.from")}</span>
                  <div className="flex space-x-2 mb-2">
                    <div className="relative w-full">
                      {!liveTimeStartHour && (
                        <span className="pointer-events-none absolute inset-y-0 left-2 flex items-center text-gray-400">
                          {t("aiLive.from")}
                        </span>
                      )}
                      <input
                        type="time"
                        value={liveTimeStartHour || ""}
                        onChange={(e) => setLiveTimeStartHour(e.target.value)}
                        className="w-full border rounded px-2 py-1 pl-24"
                      />
                    </div>
                  </div>
                  <div className="relative w-full">
                    {!liveTimeStartDate && (
                      <span className="pointer-events-none absolute inset-y-0 left-2 flex items-center text-gray-400">
                        {t("aiLive.from")}
                      </span>
                    )}
                    <input
                      type="date"
                      value={liveTimeStartDate || ""}
                      onChange={(e) => setLiveTimeStartDate(e.target.value)}
                      className="w-full border rounded px-2 py-1 pl-24"
                    />
                  </div>
                </div>

                <div className="w-1/2 px-2">
                  <span className="sr-only">{t("aiLive.to")}</span>
                  <div className="flex space-x-2 mb-2">
                    <div className="relative w-full">
                      {!liveTimeEndHour && (
                        <span className="pointer-events-none absolute inset-y-0 left-2 flex items-center text-gray-400">
                          {t("aiLive.to")}
                        </span>
                      )}
                      <input
                        type="time"
                        value={liveTimeEndHour || ""}
                        onChange={(e) => setLiveTimeEndHour(e.target.value)}
                        className="w-full border rounded px-2 py-1 pl-24"
                      />
                    </div>
                  </div>
                  <div className="relative w-full">
                    {!liveTimeEndDate && (
                      <span className="pointer-events-none absolute inset-y-0 left-2 flex items-center text-gray-400">
                        {t("aiLive.to")}
                      </span>
                    )}
                    <input
                      type="date"
                      value={liveTimeEndDate || ""}
                      onChange={(e) => setLiveTimeEndDate(e.target.value)}
                      className="w-full border rounded px-2 py-1 pl-24"
                    />
                  </div>
                </div>
              </div>
              <input
                type="text"
                value={liveName}
                onChange={(e) => setLiveName(e.target.value)}
                className="w-full border rounded px-2 py-1 mt-1"
                placeholder={t("aiLive.liveName")}
              />
            </div>

            <div className="bg-green-100 p-4">
              <span className="sr-only">{t("aiLive.productOwnership")}</span>
              <div className="relative w-full">
                {!liveOwnershipFile && (
                  <span className="pointer-events-none absolute inset-y-0 left-2 flex items-center text-gray-400">
                    {t("aiLive.choose")}
                  </span>
                )}
                <input
                  type="file"
                  className="w-full border rounded px-2 py-1 bg-transparent pl-16"
                  onChange={(e) => setLiveOwnershipFile(e.target.files?.[0] || null)}
                />
              </div>
            </div>
            <div className="bg-green-100 p-4">
              <div className="flex flex-wrap -mx-2">
                <div className="w-1/3 px-2">
                  <input
                    type="number"
                    className="w-full border px-2 py-1"
                    placeholder="VNĐ / LIVE"
                  />
                </div>

                <div className="w-1/3 px-2">
                  <input
                    type="number"
                    className="w-full border px-2 py-1"
                    placeholder={t("aiLive.messagePrice")}
                  />
                </div>

                <div className="w-1/3 px-2">
                  <input
                    type="number"
                    className="w-full border px-2 py-1"
                    placeholder={t("aiLive.vipMessagePrice")}
                  />
                </div>
              </div>
            </div>
            <div className="bg-green-100 p-4">
              <div className="flex flex-wrap -mx-2">
                <div className="w-1/3 px-2 flex items-center">
                  <input type="checkbox" className="mr-2" />
                  <span className="">{t("aiLive.advertisingOnMainpage")}</span>
                </div>

                <div className="w-2/3 px-2">
                  <div className="mb-4">
                    <input
                      type="number"
                      className="w-full border px-2 py-1"
                      placeholder={t("aiLive.deposit")}
                    />
                  </div>

                  <div className="mb-4">
                    <input
                      type="number"
                      className="w-full border px-2 py-1"
                      placeholder="VNĐ / GIÂY (S) / LƯỢT XEM (View)"
                    />
                  </div>

                  <div>
                    <span className="sr-only">{t("aiLive.adContent")}</span>
                    <div className="relative w-full">
                      {!liveAdFile && (
                        <span className="pointer-events-none absolute inset-y-0 left-2 flex items-center text-gray-400">
                          {t("aiLive.choose")}
                        </span>
                      )}
                      <input
                        type="file"
                        className="w-full border rounded px-2 py-1 bg-transparent pl-16"
                        onChange={(e) => setLiveAdFile(e.target.files?.[0] || null)}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-green-100 p-4 space-y-4">
              <label className="inline-flex items-center">
                <input
                  type="checkbox"
                  className="mr-2"
                  checked={allowAdLive}
                  onChange={(e) => setAllowAdLive(e.target.checked)}
                />
                {t("aiLive.allowAdvertisingOnLive")}
              </label>
              {allowAdLive && (
                <div>
                  <input
                    type="number"
                    className="w-full border px-2 py-1"
                    placeholder={t("aiLive.showAd")}
                  />
                </div>
              )}

              {allowAdLive && (
                <>
                  <div className="bg-green-100 p-0">
                    <div className="flex flex-wrap -mx-2">
                      <div className="w-full px-0">
                        <div className="mb-4">
                          <input
                            type="number"
                            className="w-full border px-2 py-1"
                            placeholder={t("aiLive.deposit")}
                          />
                        </div>
                        <div className="mb-4">
                          <input
                            type="number"
                            className="w-full border px-2 py-1"
                            placeholder="VNĐ / GIÂY (S) / LƯỢT XEM (View)"
                          />
                        </div>
                        <div>
                          <span className="sr-only">{t("aiLive.adContent")}</span>
                          <div className="relative w-full">
                            {!liveAdFile && (
                              <span className="pointer-events-none absolute inset-y-0 left-2 flex items-center text-gray-400">
                                {t("aiLive.choose")}
                              </span>
                            )}
                            <input
                              type="file"
                              className="w-full border rounded px-2 py-1 bg-transparent pl-16"
                              onChange={(e) => setLiveAdFile(e.target.files?.[0] || null)}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div>
                    <input
                      type="number"
                      className="w-full border px-2 py-1"
                      placeholder={t("aiLive.startAdvertisingFromSecondsLive")}
                    />
                  </div>
                  <div>
                    <input
                      type="number"
                      className="w-full border px-2 py-1"
                      placeholder={t("aiLive.startAdvertisingFromViewsLive")}
                    />
                  </div>
                </>
              )}

              <div className="">
                <div className="flex items-center">
                  <div className="w-1/15 flex justify-start pl-2">
                    <input type="checkbox" className="w-6 h-6" />
                  </div>
                  <div className="w-14/15">
                    <span className="ml-2">{t("aiLive.confirmCopyright")}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        {/* DÒNG CAM KẾT CUỐI CÙNG */}
        <div className="border border-black p-2 bg-white">
          <label className="flex items-center gap-2 mb-2">
            <input type="checkbox" className="w-4 h-4 text-red-500" />
            <span className="font-semibold text-black">Tick</span>
          </label>
          <p className="text-sm text-black leading-relaxed">
            {t("aiLive.termsAgreement")}
          </p>
        </div>

        {/* NÚT ĐĂNG */}
        <div className="flex justify-center mt-3">
          <button
            type="submit"
            className="px-8 border py-3 font-bold rounded hover:bg-gray-100 transition-all cursor-pointer"
          >
            {t("aiLive.post")}
          </button>
        </div>
      </div>
    </div>
  );
}
