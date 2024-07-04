import React, { useState } from "react";
import Link from "next/link";
import FormComponent from "@/components/FormComponent";
import { useUser } from "@/context/userContext";

export default function Home() {
  const { setUserID, setEmail } = useUser();
  const [localUserID, setLocalUserID] = useState("");
  const [localEmail, setLocalEmail] = useState("");

  const handleUserIDChange = (e) => {
    setLocalUserID(e.target.value);
  };

  const handleEmailChange = (e) => {
    setLocalEmail(e.target.value);
  };

  const goToChat = () => {
    setUserID(localUserID);
    setEmail(localEmail);
  };

  return (
    <main>
      <div className="intro-container">
        <div className="info-container-main" style={{marginTop:"15vh"}}>
          <h1 className="heading-black">did you know?</h1>
          <h1 className="subheading-red">49 seconds is all you need to get to know a new friend</h1>
        </div>
        <div className="info-container-basic">
          <div style={{ margin: 20, textAlign: "center" }}>
            <FormComponent
              id="userID"
              placeholder="this is public"
              value={localUserID}
              handleChange={handleUserIDChange}
              labelText="enter a username"
            />
          </div>

          <div style={{ margin: 20, textAlign: "center" }}>
            <FormComponent
              id="email"
              placeholder="sent to new friends"
              value={localEmail}
              handleChange={handleEmailChange}
              labelText="enter your email"
            />
          </div>

          <button className="button" onClick={goToChat}>
            <Link href="/chat">start chatting</Link>
          </button>
        </div>
      </div>
    </main>
  );
}
