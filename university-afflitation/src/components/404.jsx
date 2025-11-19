import React from "react";
import { useNavigate } from "react-router-dom";
import img404 from "../assets/404.png";

export default function NotVerified() {
  const navigate = useNavigate();

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        height: "100vh",
        overflow: "hidden",
      }}
    >

      <img
        src={img404}
        alt="404"
        style={{
          position: "absolute",
          top: "10%",
          left: "25%",
          width: "50%",
          height: "50%",
          objectFit: "cover",
          zIndex: 0,
          opacity: 1, 
        }}
      />
      <div
        style={{
          position: "relative",
          zIndex: 10,
          textAlign: "center",
          paddingTop: "160px",
          color: "#000",
        }}
      >
        <h1 style={{ fontSize: "38px", fontWeight: "bold",marginTop:"20%" }}>
          Oops! Page not found.
        </h1>

        <p style={{ marginTop: "15px", fontSize: "18px" }}>
          We can't find the page you're looking for.
        </p>

        <button
          onClick={() => navigate("/")}
          style={{
            marginTop: "20px",
            padding: "12px 24px",
            background: "#4b58f5",
            color: "white",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            fontSize: "16px",
          }}
        >
          GO BACK HOME
        </button>
      </div>
    </div>
  );
}
