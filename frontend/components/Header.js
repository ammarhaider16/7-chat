import React from "react";
import Image from "next/image";
import Link from "next/link";

const Header = () => {
  return (
    <header
      style={{
        backgroundColor: "#FFFFB0",
        padding: "10px 20px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}>
      <div>
        <Link href="/">
          <img
            src="/logo.svg"
            alt="Logo"
            style={{
              width: "20vw",
              height: "11.25vw",
              maxWidth: 140,
              maxHeight: 78.75,
            }}
          />
        </Link>
      </div>
      <div>
        <a href="mailto:ammarhaider1629@gmail.com">
          <button className="button">contact us</button>
        </a>
      </div>
    </header>
  );
};

export default Header;
