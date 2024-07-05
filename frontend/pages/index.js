import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import FormComponent from "@/components/FormComponent";
import { useUser } from "@/context/userContext";
import { findOrCreateUserDetails } from "@/apiFunctions/Users";
import Spinner from "@/components/Spinner";

export default function Home() {
  // Hooks
  const { setUserID, setEmail } = useUser();
  const [localUserID, setLocalUserID] = useState("");
  const [localEmail, setLocalEmail] = useState("");
  const router = useRouter();

  const [showStartButton, setShowStartButton] = useState(true);
  const [showUserIDTakenError, setshowUserIDTakenError] = useState(false);
  const [showUserIDLengthError, setShowUserIDLengthError] = useState(false);
  const [showEmailError, setShowEmailError] = useState(false);
  const [showSpinner, setShowSpinner] = useState(false);

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const handleUserIDChange = (e) => {
    setLocalUserID(e.target.value);
  };

  const handleEmailChange = (e) => {
    setLocalEmail(e.target.value);
  };

  const goToChat = () => {
    setUserID(localUserID);
    setEmail(localEmail);
    router.push("/chat");
  };

  const handleStart = async () => {
    console.log(localEmail);
    console.log(localUserID);

    if (!emailRegex.test(localEmail)) {
      setShowEmailError(true);
      return;
    } else {
      setShowEmailError(false);
    }

    if (localUserID.length < 5 || localUserID.length > 10) {
      setShowUserIDLengthError(true);
      return;
    } else {
      setShowUserIDLengthError(false);
    }

    setShowStartButton(false);
    setShowSpinner(true);
    const userCheck = await findOrCreateUserDetails(localUserID, localEmail);
    setShowSpinner(false);
    setShowStartButton(true);
    if (userCheck !== "Error") {
      setshowUserIDTakenError(false);
      goToChat();
    } else {
      setshowUserIDTakenError(true);
      return;
    }
  };

  return (
    <main>
      <div className="intro-container">
        <div className="info-container-main" style={{ marginTop: "15vh" }}>
          <h1 className="heading-black">did you know?</h1>
          <h1 className="subheading-red">
            49 seconds is all you need to get to know a new friend
          </h1>
          <h1 className="subheading-black" style={{ marginTop: 10 }}>
            check out the live demo{" "}
            <Link href="https://youtu.be/OEDIiK80tI8?si=UgKvGz42NFoQY04F">
              <span
                className="subheading-red"
                style={{ textDecoration: "underline" }}>
                here
              </span>
              !
            </Link>
          </h1>
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

          {showUserIDTakenError && (
            <div>
              <h1 className="error-label">username is already taken</h1>
            </div>
          )}

          {showUserIDLengthError && (
            <div>
              <h1 className="error-label">
                username must be between 5-10 characters
              </h1>
            </div>
          )}

          {showEmailError && (
            <div>
              <h1 className="error-label">email is invalid</h1>
            </div>
          )}

          {showStartButton && (
            <button
              className="button"
              onClick={handleStart}
              style={{ marginTop: 20 }}>
              start chatting
            </button>
          )}

          {showSpinner && <Spinner />}
        </div>
      </div>
    </main>
  );
}
