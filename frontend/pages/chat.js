import React, { useEffect, useState, useRef } from "react";
import { useUser } from "@/context/userContext";
import {
  getUserSocket,
  enterChat,
  leaveChat,
  showQuestion,
  answerQuestion,
  sendEmailToMatch,
} from "@/socket/7ChatSockets";
import Link from "next/link";
import Spinner from "@/components/Spinner";
import ProgressBar from "@/components/ProgressBar";

const Chat = () => {
  // CONNECTION AND CONTEXT HOOKS
  const { userID, email } = useUser();
  const socketRef = useRef(null);
  const [socketConnected, setSocketConnected] = useState(false);

  // CHAT DATA STATE HOOKS
  const [thisQuestionSetTopic, setThisQuestionSetTopic] = useState("");
  const [thisMatchID, setThisMatchID] = useState(null);
  const [currentQuestionText, setCurrentQuestionText] = useState("");
  const [currentOptionA, setCurrentOptionA] = useState("");
  const [currentOptionB, setCurrentOptionB] = useState("");
  const [currentOptionC, setCurrentOptionC] = useState("");
  const [matchEmail, setMatchEmail] = useState("");

  // CHAT DATA REF HOOKS
  const thisQuestionSetIDRef = useRef(null);
  const thisMatchIDRef = useRef(null);
  const currentQuestionNumberRef = useRef(1);
  const matchRespondedRef = useRef(false);
  const matchResponseRef = useRef(null);
  const isSessionCompleteRef = useRef(false);
  const respondedToCurrentQuestionRef = useRef(false);
  const timeoutsRef = useRef([]);

  // CHAT PROGRESS HOOKS
  const [showErrorInChat, setErrorInChat] = useState(false);
  const [showPreChat, setShowPreChat] = useState(true);
  const [showConnectingToChatRoom, setShowConnectingToChatRoom] =
    useState(false);
  const [showSearchingForMatch, setShowSearchingForMatch] = useState(false);
  const [showMatchFound, setShowMatchFound] = useState(false);
  const [showQuestionScreen, setShowQuestionScreen] = useState(false);
  const [showWaitingForMatchResponse, setShowWaitingForMatchResponse] =
    useState(false);
  const [showResponseScreen, setShowResponseScreen] = useState(false);
  const [showSessionCompleteScreen, setShowSessionCompleteScreen] =
    useState(false);
  const [showMatchDisconnected, setShowMatchDisconnected] = useState(false);
  const [showMatchEmail, setShowMatchEmail] = useState(false);
  const [emailSentToMatch, setEmailSentToMatch] = useState(false);

  // CHAT QUESTION RESPONSE HOOKS
  const [thisResponseQuestionText, setThisResponseQuestionText] = useState("");
  const [thisUserOneID, setThisUserOneID] = useState(null);
  const [thisUserOneResponse, setThisUserOneResponse] = useState("");
  const [thisUserTwoID, setThisUserTwoID] = useState(null);
  const [thisUserTwoResponse, setThisUserTwoResponse] = useState("");

  useEffect(() => {
    if (userID) {
      console.log("userID => ", userID);
      console.log("email => ", email);

      socketRef.current = getUserSocket(userID);

      socketRef.current.on("connect", () => {
        console.log(`Connected with userID: ${userID}`);
        setSocketConnected(true);
      });

      socketRef.current.on("Server Wait For Users", () => {
        handleSearchingForMatch();
      });

      socketRef.current.on("Server Found Random Chat Match", (params) => {
        handleMatchFound(params);
      });

      socketRef.current.on("Server Show Chat Question", (params) => {
        handleShowQuestionSuccessful(params);
      });

      socketRef.current.on("connect_error", (err) => {
        console.log(`connect_error due to ${err.message}`);
        console.log(err.req);
        console.log(err.code);
        console.log(err.context);
        setSocketConnected(false);
        handleDisplayError();
      });

      socketRef.current.on("disconnect", () => {
        setSocketConnected(false);
      });

      socketRef.current.on(
        "Server Chat Waiting For User Response",
        (serverMatchResponse) => {
          handleWaitForUserResponse(serverMatchResponse);
        }
      );

      socketRef.current.on("Server Waiting For Match Chat Response", () => {
        handleWaitForMatchResponse();
      });

      socketRef.current.on(
        "Both Users Responded To Chat Question",
        (params) => {
          handleBothUsersResponded(params);
        }
      );

      socketRef.current.on("Server Match Disconnected", (matchID) => {
        handleShowMatchDisconnected();
      });

      socketRef.current.on("Server Match Sent Email", (params) => {
        handleShowMatchEmail(params);
      });

      return () => {
        if (socketRef.current) {
          socketRef.current.disconnect();
        }
      };
    }
  }, [userID]);

  useEffect(() => {
    return () => {
      console.log("******************CLEARING TIMEOUTS*****************");
      timeoutsRef.current.forEach((timeoutID) => clearTimeout(timeoutID));
    };
  }, [currentQuestionNumberRef.current]);

  const handleEnterChat = () => {
    if (socketRef.current && socketConnected) {
      setShowPreChat(false);
      setShowSearchingForMatch(false);
      setShowMatchFound(false);
      setShowQuestionScreen(false);
      setShowWaitingForMatchResponse(false);
      setShowResponseScreen(false);
      setShowSessionCompleteScreen(false);
      setShowMatchDisconnected(false);
      setShowMatchEmail(false);
      setShowConnectingToChatRoom(true);
      enterChat(userID, socketRef.current);
    } else {
      handleDisplayError();
    }
  };

  const handleDisplayError = () => {
    setShowPreChat(false);
    setShowConnectingToChatRoom(false);
    setShowSearchingForMatch(false);
    setShowMatchFound(false);
    setShowQuestionScreen(false);
    setShowWaitingForMatchResponse(false);
    setShowResponseScreen(false);
    setShowSessionCompleteScreen(false);
    setShowMatchDisconnected(false);
    setShowMatchEmail(false);
    // ADD MORE CHAT STATES AS NEEDED
    setErrorInChat(true);
    resetChatDataStatesRefs();
  };

  const handleSearchingForMatch = () => {
    setShowPreChat(false);
    setShowConnectingToChatRoom(false);
    setShowMatchFound(false);
    setShowQuestionScreen(false);
    setShowWaitingForMatchResponse(false);
    setShowResponseScreen(false);
    setShowSessionCompleteScreen(false);
    setShowMatchDisconnected(false);
    setShowMatchEmail(false);
    setShowSearchingForMatch(true);
  };

  const handleMatchFound = (params) => {
    const { matchID, questionSetID, questionSetTopic } = params;
    setThisMatchID(matchID);
    setThisQuestionSetTopic(questionSetTopic);
    thisQuestionSetIDRef.current = questionSetID;
    thisMatchIDRef.current = matchID;
    setShowPreChat(false);
    setShowConnectingToChatRoom(false);
    setShowSearchingForMatch(false);
    setShowQuestionScreen(false);
    setShowWaitingForMatchResponse(false);
    setShowResponseScreen(false);
    setShowSessionCompleteScreen(false);
    setShowMatchDisconnected(false);
    setShowMatchEmail(false);
    setShowMatchFound(true);
    const timeoutID = setTimeout(handleShowQuestionRequest, 4000);
    timeoutsRef.current.push(timeoutID);
  };

  const handleShowQuestionRequest = () => {
    showQuestion(
      thisQuestionSetIDRef.current,
      currentQuestionNumberRef.current,
      socketRef.current
    );
  };

  const handleShowQuestionSuccessful = (params) => {
    const { questionText, options } = params;
    respondedToCurrentQuestionRef.current = false;
    matchRespondedRef.current = false;
    matchResponseRef.current = null;
    setCurrentQuestionText(questionText);
    setCurrentOptionA(options["A"]);
    setCurrentOptionB(options["B"]);
    setCurrentOptionC(options["C"]);
    console.log(`Question Text => "${questionText}"`);
    console.log("Options => ", options);
    setShowPreChat(false);
    setShowConnectingToChatRoom(false);
    setShowSearchingForMatch(false);
    setShowMatchFound(false);
    setShowWaitingForMatchResponse(false);
    setShowResponseScreen(false);
    setShowSessionCompleteScreen(false);
    setShowMatchDisconnected(false);
    setShowMatchEmail(false);
    setShowQuestionScreen(true);

    const timeoutID = setTimeout(() => {
      if (!respondedToCurrentQuestionRef.current) {
        handleAnswerRequest("");
      }
    }, 7000);
    timeoutsRef.current.push(timeoutID);
  };

  const handleAnswerRequest = (option) => {
    respondedToCurrentQuestionRef.current = true;
    answerQuestion(
      thisQuestionSetIDRef.current,
      currentQuestionNumberRef.current,
      userID,
      thisMatchIDRef.current,
      option,
      matchRespondedRef.current,
      matchResponseRef.current,
      socketRef.current
    );
  };

  const handleWaitForUserResponse = (serverMatchResponse) => {
    matchRespondedRef.current = true;
    matchResponseRef.current = serverMatchResponse;
  };

  const handleWaitForMatchResponse = () => {
    console.log("Waiting for match response!");
    setShowPreChat(false);
    setShowConnectingToChatRoom(false);
    setShowSearchingForMatch(false);
    setShowMatchFound(false);
    setShowQuestionScreen(false);
    setShowResponseScreen(false);
    setShowSessionCompleteScreen(false);
    setShowMatchDisconnected(false);
    setShowMatchEmail(false);
    setShowWaitingForMatchResponse(true);
  };

  const handleBothUsersResponded = (params) => {
    const {
      questionText,
      questionNumber,
      userOneID,
      userOneResponse,
      userTwoID,
      userTwoResponse,
      sessionComplete,
    } = params;
    isSessionCompleteRef.current = sessionComplete;
    setThisResponseQuestionText(questionText);
    setThisUserOneID(userOneID);
    setThisUserTwoID(userTwoID);
    setThisUserOneResponse(userOneResponse);
    setThisUserTwoResponse(userTwoResponse);

    console.log(`Response to question ${questionNumber}  => `, questionText);
    console.log(`Response by ${userOneID} => `, userOneResponse);
    console.log(`Response by ${userTwoID} => `, userTwoResponse);
    console.log("Is session complete => ", sessionComplete);

    setShowPreChat(false);
    setShowConnectingToChatRoom(false);
    setShowSearchingForMatch(false);
    setShowMatchFound(false);
    setShowQuestionScreen(false);
    setShowWaitingForMatchResponse(false);
    setShowSessionCompleteScreen(false);
    setShowMatchDisconnected(false);
    setShowMatchEmail(false);
    setShowResponseScreen(true);

    const timeoutID = setTimeout(() => {
      if (!isSessionCompleteRef.current) {
        handleShowNextQuestion();
      } else {
        handleShowSessionComplete();
      }
    }, 4000);
    timeoutsRef.current.push(timeoutID);
  };

  const handleShowNextQuestion = () => {
    currentQuestionNumberRef.current = currentQuestionNumberRef.current + 1;

    setCurrentQuestionText("");
    setCurrentOptionA("");
    setCurrentOptionB("");
    setCurrentOptionC("");

    matchRespondedRef.current = false;
    matchResponseRef.current = null;
    respondedToCurrentQuestionRef.current = false;

    console.log("**********SHOWING NEXT QUESTION****************");

    handleShowQuestionRequest();
  };

  const handleShowSessionComplete = () => {
    setShowPreChat(false);
    setShowConnectingToChatRoom(false);
    setShowSearchingForMatch(false);
    setShowMatchFound(false);
    setShowQuestionScreen(false);
    setShowWaitingForMatchResponse(false);
    setShowResponseScreen(false);
    setShowMatchDisconnected(false);
    setShowMatchEmail(false);
    setShowSessionCompleteScreen(true);
  };

  const resetChatDataStatesRefs = () => {
    timeoutsRef.current.forEach((timeoutID) => clearTimeout(timeoutID));

    setThisQuestionSetTopic("");
    setThisMatchID(null);
    setCurrentQuestionText("");
    setCurrentOptionA("");
    setCurrentOptionB("");
    setCurrentOptionC("");
    setMatchEmail("");
    setEmailSentToMatch(false);

    thisQuestionSetIDRef.current = null;
    thisMatchIDRef.current = null;
    currentQuestionNumberRef.current = 1;
    matchRespondedRef.current = false;
    matchResponseRef.current = null;
    isSessionCompleteRef.current = false;
    respondedToCurrentQuestionRef.current = false;
    timeoutsRef.current = [];
  };

  const handleShowMatchDisconnected = () => {
    if (!isSessionCompleteRef.current && thisMatchIDRef.current) {
      console.log(`Your match ${thisMatchIDRef.current} has disconnected!`);
      resetChatDataStatesRefs();
      setShowPreChat(false);
      setShowConnectingToChatRoom(false);
      setShowSearchingForMatch(false);
      setShowMatchFound(false);
      setShowQuestionScreen(false);
      setShowWaitingForMatchResponse(false);
      setShowResponseScreen(false);
      setShowSessionCompleteScreen(false);
      setShowMatchEmail(false);
      setShowMatchDisconnected(true);
    }
  };

  const handleRematchRequest = () => {
    resetChatDataStatesRefs();
    handleEnterChat();
  };

  const handleShowMatchEmail = (params) => {
    const { sendingUserID, sendingUserEmail } = params;
    if (sendingUserID == thisMatchIDRef.current) {
      console.log(`Your match sent you their email => ${sendingUserEmail}`);
      setMatchEmail(sendingUserEmail);
      setShowMatchEmail(true);
    }
  };

  const handleSendEmailToMatch = () => {
    setEmailSentToMatch(true);
    sendEmailToMatch(email, thisMatchIDRef.current, socketRef.current);
  };

  return (
    <main>
      <div className="intro-container">
        <div className="info-container-basic" style={{ width: "75vw" }}>
          <h1 className="heading-black">
            7Chat/
            <span style={{ color: "#FF6C5D" }}>@{userID}</span>
          </h1>
          <div style={{ marginTop: 20 }}>
            <h1 className="subheading-red">
              <span style={{ color: "black" }}>status: </span>{" "}
              {socketConnected ? "connected" : "waiting for connection"}
            </h1>
          </div>
        </div>
        {showErrorInChat && (
          <div className="info-container-main">
            <div>
              <h1 className="heading-black">oh no!</h1>
              <h1 style={{ marginTop: 20 }}>
                looks like there has been a connection error! please try again!
              </h1>
              <Link href="/">
                <button className="button" style={{ marginTop: 20 }}>
                  home page
                </button>
              </Link>
            </div>
          </div>
        )}

        {showPreChat && (
          <div className="info-container-main">
            <div>
              <h1 className="heading-black">how it works</h1>
              <h1 style={{ marginTop: 20 }} className="subheading-red">
                once you get randomly matched with someone, each of you answer 7
                questions. you only get 7 seconds to answer each question and
                you can only see how your match responded after you have
                responded! at the end, you guys can decide if you want to talk
                more and become friends!
              </h1>
              <button
                className="button"
                style={{ marginTop: 20 }}
                onClick={handleEnterChat}>
                {" "}
                start matching
              </button>
              <h1 className="subheading-black" style={{ marginTop: 20 }}>
                tip:{" "}
                <span className="subheading-red">
                  {" "}
                  for the best experience, avoid switching tabs!
                </span>
              </h1>
            </div>
          </div>
        )}
        {showConnectingToChatRoom && (
          <div className="info-container-main">
            <div>
              <Spinner />
              <h1 className="heading-black">connecting To 7Chat matchroom</h1>
            </div>
          </div>
        )}
        {showSearchingForMatch && (
          <div className="info-container-main">
            <div>
              <Spinner />
              <h1 className="heading-black">finding a match</h1>
            </div>
          </div>
        )}
        {showMatchFound && (
          <div className="info-container-main">
            <h1 className="heading-black">
              you matched with{" "}
              <span style={{ color: "#FF6C5D" }}>@{thisMatchID}</span>
            </h1>
            <h1 className="subheading-red">
              and you guys are going to talk about
              <span style={{ color: "black" }}>
                {" "}
                {thisQuestionSetTopic.toLowerCase()}!
              </span>
            </h1>
            <div style={{ marginTop: 20 }}>
              <h1 className="subheading-black">starting chat</h1>
              <ProgressBar duration={4} />
            </div>
          </div>
        )}
        {showQuestionScreen && (
          <div className="info-container-main">
            <h1 className="subheading-black">
              {" "}
              {currentQuestionText.toLowerCase()}?
            </h1>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                flexDirection: "column",
              }}>
              <button
                className="option-button"
                onClick={() => {
                  handleAnswerRequest("A");
                }}>
                {currentOptionA.toLowerCase()}
              </button>
              <button
                className="option-button"
                onClick={() => {
                  handleAnswerRequest("B");
                }}>
                {currentOptionB.toLowerCase()}
              </button>
              <button
                className="option-button"
                onClick={() => {
                  handleAnswerRequest("C");
                }}>
                {currentOptionC.toLowerCase()}
              </button>
            </div>
            <div style={{ marginTop: 20 }}>
              <ProgressBar duration={7} />
            </div>
          </div>
        )}
        {showWaitingForMatchResponse && (
          <div className="info-container-main">
            <Spinner />
            <h1 className="heading-black">waiting for your match to respond</h1>
          </div>
        )}
        {showResponseScreen && (
          <div className="info-container-main">
            <h1 className="heading-black">both of you have responded!</h1>
            <h1 className="subheading-red" style={{ marginTop: 20 }}>
              {thisResponseQuestionText.toLowerCase()}?
            </h1>
            {userID == thisUserOneID ? (
              <>
                <h1
                  className="subheading-red"
                  style={{ marginTop: 20, textAlign: "left", marginLeft: 20 }}>
                  @{thisUserTwoID}:{" "}
                  <span className="subheading-black">
                    {thisUserTwoResponse.toLowerCase()}
                  </span>
                </h1>
                <h1
                  className="subheading-red"
                  style={{
                    marginTop: 20,
                    textAlign: "right",
                    marginRight: 20,
                  }}>
                  @{thisUserOneID}:{" "}
                  <span className="subheading-black">
                    {thisUserOneResponse.toLowerCase()}
                  </span>
                </h1>
              </>
            ) : (
              <>
                <h1
                  className="subheading-red"
                  style={{
                    marginTop: 20,
                    textAlign: "right",
                    marginRight: 20,
                  }}>
                  @{thisUserTwoID}:{" "}
                  <span className="subheading-black">
                    {thisUserTwoResponse.toLowerCase()}
                  </span>
                </h1>
                <h1
                  className="subheading-red"
                  style={{
                    marginTop: 20,
                    textAlign: "left",
                    marginLeft: 20,
                  }}>
                  @{thisUserOneID}:{" "}
                  <span className="subheading-black">
                    {thisUserOneResponse.toLowerCase()}
                  </span>
                </h1>
              </>
            )}
            <div style={{ marginTop: 20 }}>
              <ProgressBar duration={4} />
            </div>
          </div>
        )}
        {showSessionCompleteScreen && (
          <div className="info-container-main">
            <h1 className="heading-red">and the chat is complete</h1>
            <h1 className="subheading-black" style={{ marginTop: 20 }}>
              hope you enjoyed talking to{" "}
              <span className="subheading-red">@{thisMatchID}!</span>
            </h1>
            {showMatchEmail && (
              <div style={{ marginTop: 20 }}>
                <h1 className="subheading-black">
                  <span className="subheading-red">@{thisMatchID}</span> sent
                  you their email! find them at{" "}
                  <span className="subheading-red">{matchEmail}</span>
                </h1>
              </div>
            )}
            <div
              style={{
                marginTop: 20,
                display: "flex",
                flexDirection: "column",
              }}>
              {!emailSentToMatch && (
                <button
                  className="button"
                  onClick={handleSendEmailToMatch}
                  style={{ marginBottom: 20 }}>
                  send your email to match?
                </button>
              )}
              <button className="button" onClick={handleRematchRequest}>
                match again?
              </button>
            </div>
          </div>
        )}
        {showMatchDisconnected && (
          <div className="info-container-main">
            <h1 className="heading-black">oops..</h1>
            <h1 className="subheading-red">
              looks like your match disconnected
            </h1>
            <div style={{ marginTop: 20 }}>
              <button className="button" onClick={handleRematchRequest}>
                match again?
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
};

export default Chat;
