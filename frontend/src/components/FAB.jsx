import React, { useState, useEffect } from "react";

const FAB = ({ sidebarOpen }) => {
  const [open, setOpen] = useState(false);
  const [visible, setVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(window.scrollY);

  // Scroll hide/show behavior
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > lastScrollY) {
        setVisible(false); // scroll down → hide
      } else {
        setVisible(true); // scroll up → show
      }
      setLastScrollY(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  const isMobile = window.innerWidth < 768;

  // Hide on mobile if sidebar is open
  if (isMobile && sidebarOpen) return null;

  if (!visible) return null;

  return (
    <div
      style={{
        position: "fixed",
        bottom: 20,
        right: 20,
        zIndex: 9999,
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-end",
      }}
    >
      {/* Menu */}
      {open && (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            marginBottom: 10,
            gap: "8px",
          }}
        >
          <button>Create Portfolio</button>
          <button>Upload Resume</button>
          <button>Search Jobs</button>
          <button>Start Interview</button>
        </div>
      )}

      {/* FAB Button */}
      <button
        onClick={() => setOpen(!open)}
        style={{
          width: 60,
          height: 60,
          borderRadius: "50%",
          background: "#6c5ce7",
          color: "white",
          fontSize: 28,
          border: "none",
          cursor: "pointer",
          transition: "0.3s ease",
          transform: open ? "rotate(45deg)" : "rotate(0deg)",
          boxShadow: "0 6px 15px rgba(0,0,0,0.2)",
        }}
      >
        +
      </button>
    </div>
  );
};

export default FAB;