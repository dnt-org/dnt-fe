import { useState, useEffect, useRef } from "react";
import { useTranslation } from 'react-i18next';
import useNotifications from "../custom-hooks/useNotifications";
import markAsRead from "../services/notificationService";
import { QrCode } from "lucide-react";

const HeaderComponent = ({
    color,
    onColorChange,
    onQrClick,
    selectedLang,
    onLanguageChange,
    isUserLoggedIn,
    className = ""
}) => {
    const { t, i18n } = useTranslation();
    const notifications = useNotifications(17);
    const [isNotificationOpen, setIsNotificationOpen] = useState(false);
    const dropdownRef = useRef();

    const colors = [
        { name: "VN", value: "vi" },
        { name: "EN", value: "en" },
    ];

    useEffect(() => {
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsNotificationOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleLanguageChange = (e) => {
        const newLang = e.target.value;
        onLanguageChange(newLang);
        i18n.changeLanguage(newLang);
        localStorage.setItem("selectedLang", newLang);
    };

    return (
        <>
            <div
                className={`flex flex-col text-sm text-center menu-left-top ${className}`}
                style={{ fontSize: "clamp(6px, 0.75vw, 14px)", paddingTop: !isUserLoggedIn ? 0 : '27px' }}
            >
                <div
                    onClick={onQrClick}
                    style={{ minHeight: !isUserLoggedIn ? 0 : '28px' }}
                    className="cursor-pointer flex border-b border-r border-t border-black justify-center items-center min-h-7"
                >
                    <div className="table-cell flex items-center font-bold py-1 px-1">
                        <QrCode size={20} />
                    </div>
                </div>

                <div
                    style={{ minHeight: !isUserLoggedIn ? 0 : '28px' }}
                    className="cursor-pointer flex border-b border-black border-r justify-center items-center min-h-7"
                >
                    <div className="table-cell items-center font-bold py-1 px-1 md:block text-center appicon">
                        APP
                    </div>
                    <div className="table-cell items-center font-bold py-1 px-1 md:hidden">
                        <i className="fa-solid fa-computer"></i>
                    </div>
                </div>

                <div
                    onClick={() => document.getElementById("colorPicker").click()}
                    style={{ width: "100%", minHeight: "3.3vh" }}
                    className="cursor-pointer flex border-b border-black border-r justify-center items-center min-h-6"
                >
                    <div className="table-cell flex items-center font-bold py-1 px-1 ">
                        <div
                            style={{
                                minHeight: "2vh",
                                width: "100%",
                                height: "100%",
                            }}
                            className="cursor-pointer"
                        ></div>

                        <input
                            id="colorPicker"
                            hidden
                            type="color"
                            value={color}
                            onChange={onColorChange}
                            className="cursor-pointer"
                        />
                    </div>
                </div>


                <div
                    style={{ minHeight: !isUserLoggedIn ? 0 : '28px' }}
                    className="cursor-pointer flex border-b border-black border-r justify-center items-center min-h-6"
                >
                    <select
                        className="table-cell flex items-center font-bold py-1 text-center"
                        value={selectedLang}
                        onChange={handleLanguageChange}
                    >
                        {colors.map((colorOption) => (
                            <option key={colorOption.value} value={colorOption.value}>
                                {colorOption.name}
                            </option>
                        ))}


                    </select>
                </div>

                <div
                    className="cursor-pointer flex border-b border-black border-r justify-center items-center min-h-6"
                >
                    <div className="table-cell flex items-center font-bold py-1 px-1 text-center">
                        <i
                            style={{ fontSize: "clamp(10px, 1vw, 20px)" }}
                            className="fa-solid fa-bell"
                        ></i>
                    </div>
                </div>

            </div>




            {isNotificationOpen && (
                <div ref={dropdownRef} className="absolute left w-50 bg-white shadow-lg rounded-md z-50 border border-gray-200">
                    <h6 className="text-sm px-1 font-bold">{t('common.notifications')}</h6>
                    <div className="px-1">
                        <ul className="max-h-50 overflow-y-auto">
                            {notifications.length > 0 ? (
                                notifications.slice(0, 5).map((note, idx) => (
                                    <li
                                        onMouseEnter={() => !note.read && markAsRead(17, note.id)}
                                        key={idx}
                                        className="text-sm px-1 hover:bg-gray-100 cursor-pointer"
                                    >
                                        {!note.read ? (
                                            <b className="font-bold">{note.message} (new)</b>
                                        ) : (
                                            <>{note.message}</>
                                        )}
                                    </li>
                                ))
                            ) : (
                                <li className="text-sm px-1 text-gray-500">
                                    {t('common.no_notifications')}
                                </li>
                            )}
                        </ul>
                    </div>
                </div>
            )}

        </>



    );
};

export default HeaderComponent;