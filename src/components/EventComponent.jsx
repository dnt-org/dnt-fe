import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function EventComponent() {
  const { t } = useTranslation();

  // Trang hiện tại cho desktop và mobile (mỗi swipe -> sang trang mới)
  const [pageDesktop, setPageDesktop] = useState(0);
  const [pageMobile, setPageMobile] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStartX, setDragStartX] = useState(null);
  const [dragLastX, setDragLastX] = useState(null);
  const navigate = useNavigate();

  // Desktop: hiển thị 6 cột x 2 dòng = 12 events
  // Mobile: hiển thị 2 cột x 2 dòng = 4 events
  // Thứ tự: dòng 1 (1,2,3,4,5,6), dòng 2 (7,8,9,10,11,12)
  const columnsDesktop = 6;
  const columnsMobile = 2;

  // Mock data cho events với translation keys
  const mockEvents = [
    { id: 1, titleKey: "events.event1", descriptionKey: "events.description1" },
    { id: 2, titleKey: "events.event2", descriptionKey: "events.description2" },
    { id: 3, titleKey: "events.event3", descriptionKey: "events.description3" },
    { id: 4, titleKey: "events.event4", descriptionKey: "events.description4" },
    { id: 5, titleKey: "events.event5", descriptionKey: "events.description5" },
    { id: 6, titleKey: "events.event6", descriptionKey: "events.description6" },
    { id: 7, titleKey: "events.event7", descriptionKey: "events.description7" },
    { id: 8, titleKey: "events.event8", descriptionKey: "events.description8" },
    { id: 9, titleKey: "events.event9", descriptionKey: "events.description9" },
    {
      id: 10,
      titleKey: "events.event10",
      descriptionKey: "events.description10",
    },
    {
      id: 11,
      titleKey: "events.event11",
      descriptionKey: "events.description11",
    },
    {
      id: 12,
      titleKey: "events.event12",
      descriptionKey: "events.description12",
    },
    {
      id: 13,
      titleKey: "events.event13",
      descriptionKey: "events.description13",
    },
    {
      id: 14,
      titleKey: "events.event14",
      descriptionKey: "events.description14",
    },
    {
      id: 15,
      titleKey: "events.event15",
      descriptionKey: "events.description15",
    },
    {
      id: 16,
      titleKey: "events.event16",
      descriptionKey: "events.description16",
    },
    {
      id: 17,
      titleKey: "events.event17",
      descriptionKey: "events.description17",
    },
    {
      id: 18,
      titleKey: "events.event18",
      descriptionKey: "events.description18",
    },
  ];

  const getCurrentEvents = (isMobile = false) => {
    const columns = isMobile ? columnsMobile : columnsDesktop;
    const page = isMobile ? pageMobile : pageDesktop;
    const eventsPerPage = columns * 2; // 2 rows per page

    // Sequential row-major order: row 1 = 1..columns, row 2 = columns+1..columns*2
    const startIndex = page * eventsPerPage;
    return mockEvents.slice(startIndex, startIndex + eventsPerPage);
  };

  const getMaxPages = (isMobile = false) => {
    const columns = isMobile ? columnsMobile : columnsDesktop;
    const eventsPerPage = columns * 2;
    return Math.max(1, Math.ceil(mockEvents.length / eventsPerPage));
  };

  const handlePrevious = (isMobile = false) => {
    if (isMobile) {
      setPageMobile((prev) => Math.max(0, prev - 1));
    } else {
      setPageDesktop((prev) => Math.max(0, prev - 1));
    }
  };

  const handleNext = (isMobile = false) => {
    const maxPages = getMaxPages(isMobile);
    if (isMobile) {
      setPageMobile((prev) => Math.min(maxPages - 1, prev + 1));
    } else {
      setPageDesktop((prev) => Math.min(maxPages - 1, prev + 1));
    }
  };

  const canGoPreviousDesktop = pageDesktop > 0;
  const canGoNextDesktop = pageDesktop < getMaxPages(false) - 1;
  const canGoPreviousMobile = pageMobile > 0;
  const canGoNextMobile = pageMobile < getMaxPages(true) - 1;

  const swipeThreshold = 50; // px

  const onPointerDown = (clientX) => {
    setIsDragging(true);
    setDragStartX(clientX);
    setDragLastX(clientX);
  };

  const onPointerMove = (clientX) => {
    if (!isDragging || dragStartX === null) return;
    setDragLastX(clientX);
  };

  const onPointerUp = (isMobile = false) => {
    if (!isDragging || dragStartX === null || dragLastX === null) {
      setIsDragging(false);
      setDragStartX(null);
      setDragLastX(null);
      return;
    }
    const deltaX = dragLastX - dragStartX;
    if (Math.abs(deltaX) > swipeThreshold) {
      if (deltaX < 0) {
        const canGoNext = isMobile ? canGoNextMobile : canGoNextDesktop;
        if (canGoNext) handleNext(isMobile);
      } else if (deltaX > 0) {
        const canGoPrevious = isMobile
          ? canGoPreviousMobile
          : canGoPreviousDesktop;
        if (canGoPrevious) handlePrevious(isMobile);
      }
    }
    setIsDragging(false);
    setDragStartX(null);
    setDragLastX(null);
  };

  const EventCard = ({ event }) => (
    <div
      onClick={() => navigate(`/list-of-goods/${event.id}`)}
      style={{
        backgroundColor: "white",
        aspectRatio: 3 / 4,
        padding: "10px",
        borderRadius: "8px",
        boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        alignItems: "center",
        textAlign: "center",
        border: "1px solid black",
        cursor: "pointer",
      }}
    >
      <h3 style={{ margin: "10px 0 0 0", fontSize: "14px", fontWeight: "bold" }}>
        {t("events.displayOnHome")} <br /> {event.id}
      </h3>
      <div style={{ alignSelf: "flex-start", textAlign: "left", fontSize: "12px", fontWeight: "bold", paddingLeft: "5px", paddingBottom: "10px" }}>
        <p style={{ margin: "2px 0" }}>- {t("events.category")}</p>
        <p style={{ margin: "2px 0" }}>- {t("events.classification")}</p>
        <p style={{ margin: "2px 0" }}>- {t("events.status")}</p>
        <p style={{ margin: "2px 0" }}>- {t("events.goodsAddress")}</p>
        <p style={{ margin: "2px 0" }}>- {t("events.quantity")}</p>
      </div>
    </div>
  );

  const NavigationButton = ({
    direction,
    onClick,
    disabled,
    isMobile = false,
  }) => (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        background: disabled ? "#ccc" : "#007bff",
        color: "white",
        border: "none",
        borderRadius: "50%",
        width: isMobile ? "40px" : "50px",
        height: isMobile ? "40px" : "50px",
        cursor: disabled ? "not-allowed" : "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: isMobile ? "16px" : "20px",
        zIndex: 10,
      }}
    >
      {direction === "prev" ? "←" : "→"}
    </button>
  );

  return (
    <section className="action-section " style={{ marginTop: "5px" }}>
      {/* Desktop Layout */}
      <div
        className="action-section-1"
        style={{
          alignItems: "center",
          gap: "2vw",
          position: "relative",
        }}
      >
        <NavigationButton
          direction="prev"
          onClick={() => handlePrevious(false)}
          disabled={!canGoPreviousDesktop}
        />

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(6, 1fr)",
            gridTemplateRows: "repeat(2, 1fr)",
            gap: "10px",
            flex: 1,
            padding: "0 10px",
            userSelect: "none",
          }}
          onMouseDown={(e) => onPointerDown(e.clientX)}
          onMouseMove={(e) => onPointerMove(e.clientX)}
          onMouseUp={() => onPointerUp(false)}
          onMouseLeave={() => onPointerUp(false)}
          onTouchStart={(e) => onPointerDown(e.touches[0].clientX)}
          onTouchMove={(e) => onPointerMove(e.touches[0].clientX)}
          onTouchEnd={() => onPointerUp(false)}
        >
          {getCurrentEvents(false).map((event, index) => (
            <EventCard key={`${event.id}-${index}`} event={event} />
          ))}
        </div>

        <NavigationButton
          direction="next"
          onClick={() => handleNext(false)}
          disabled={!canGoNextDesktop}
        />
      </div>

      {/* Mobile Layout */}
      <div
        className="action-section-1-mobile"
        style={{
          alignItems: "center",
          justifyContent: "space-between",
          gap: 10,
          position: "relative",
        }}
      >
        <NavigationButton
          direction="prev"
          onClick={() => handlePrevious(true)}
          disabled={!canGoPreviousMobile}
          isMobile={true}
        />

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(2, 1fr)",
            gridTemplateRows: "repeat(2, 1fr)",
            gap: "10px",
            flex: 1,
            padding: "0 10px",
            userSelect: "none",
          }}
          onTouchStart={(e) => onPointerDown(e.touches[0].clientX)}
          onTouchMove={(e) => onPointerMove(e.touches[0].clientX)}
          onTouchEnd={() => onPointerUp(true)}
        >
          {getCurrentEvents(true).map((event, index) => (
            <EventCard key={`${event.id}-${index}`} event={event} />
          ))}
        </div>

        <NavigationButton
          direction="next"
          onClick={() => handleNext(true)}
          disabled={!canGoNextMobile}
          isMobile={true}
        />
      </div>
    </section>
  );
}
