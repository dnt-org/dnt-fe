import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Home as HomeIcon,
  KeyboardIcon as KeyboardIcon,
} from "lucide-react";
import "../styles/Login.css";
import AiLiveLiveStreamComponent from "../components/AiLiveLiveStreamComponent";
import AiLiveVideoComponent from "../components/AiLiveVideoComponent";
import AiLiveMovieComponent from "../components/AiLiveMovieComponent";
import AiLiveLiveComponent from "../components/AiLiveLiveComponent";
import { useTranslation } from 'react-i18next';
import PageHeaderWithOutColorPicker from "../components/PageHeaderWithOutColorPicker.jsx";
import NumericInput from "../components/NumericInput.jsx";
import AiLiveAccount from "../components/AiLiveAccount.jsx";
import AiLiveStreamGoods from "../components/organisms/AiLiveStreamGoods.jsx";
import AiLiveVideoList from "../components/AiLiveVideoList.jsx";


export default function AiLivePage() {
  const { t } = useTranslation();
  const [color, setColor] = useState(localStorage.getItem("selectedColor") || "#ffffff");
  const [inputValue, setInputValue] = useState("");
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const [selectedComponent, setSelectedComponent] = useState(null);

  // Using the shared NumericInput component for numeric-only input


  useEffect(() => {
    document.getElementById("root").style.backgroundColor = color;
    const token = localStorage.getItem("authToken");
    setUser(token);
  }, [color]);

  const handleChangeColor = (e) => {
    const newColor = e.target.value;
    setColor(newColor);
    localStorage.setItem("selectedColor", newColor);
  };

  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="bg-transparent backdrop-blur-md p-6 rounded-lg shadow-lg w-full  mx-auto">
        {/* Header */}
        <PageHeaderWithOutColorPicker
          color={color}
          onColorChange={handleChangeColor}
          titlePrefix="8"
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
          title={t('aiLive.pageTitle')}
        />
        <AiLiveAccount title={t('aiLive.accountOfAiLive')} />

        {/* 6 Buttons */}
        <div className="grid grid-cols-3 sm:grid-cols-6  gap-4 mt-6">
          {[
            { label: t('aiLive.livestream'), sub: t('aiLive.livestreamSub'), value: "LIVESTREAM" },
            { label: t('aiLive.video'), sub: "", value: "VIDEO" },
            { label: t('aiLive.movie'), sub: t('aiLive.movieSub'), value: "MOVIE" },
            { label: t('aiLive.live'), sub: t('aiLive.liveSub'), value: "LIVE" },
            { label: t('aiLive.equipment'), sub: t('aiLive.equipmentSub'), value: "EQUIPMENT" },
            { label: t('aiLive.game'), sub: t('aiLive.gameSub'), value: "GAME" },
          ].map((item, idx) => (
            <button
              key={idx}
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-4 px-6 rounded-lg text-center shadow-md transition-all"
              onClick={() => {setSelectedComponent(item.value);}}
            >
              {item.label}
            </button>
          ))}
        </div>
        {
          selectedComponent === null && (
            <AiLiveVideoList />
          )
        }
        {/* Hiển thị component tùy theo lựa chọn */}
        {selectedComponent === "LIVESTREAM" && (
        <AiLiveStreamGoods />
        )}
        {selectedComponent === "VIDEO" && (
        <AiLiveVideoComponent />
        )}
        {selectedComponent === "MOVIE" && (
        <AiLiveMovieComponent />
        )}
        {selectedComponent === "LIVE" && (
        <AiLiveLiveComponent />
        )}
      </div>
    </div>
  );
}
