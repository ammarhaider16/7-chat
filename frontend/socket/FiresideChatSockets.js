import { sendUserID } from "./user.js";

export const getUserSocket = (userID) => {
  return sendUserID(userID);
};

export const enterChat = (userID, socket) => {
  socket.emit("Client Enter Chat", userID);
};

export const leaveChat = (userID, matchID, socket) => {
  const params = { userID, matchID };
  socket.emit("Client Leave Chat", params);
};

export const showQuestion = (questionSetID, questionNumber, socket) => {
  const params = { questionSetID, questionNumber };
  socket.emit("Client Show Chat Question", params);
};

export const answerQuestion = (
  questionSetID,
  questionNumber,
  userID,
  matchID,
  userOption,
  matchResponded,
  matchResponse,
  socket
) => {
  const params = {
    questionSetID,
    questionNumber,
    userID,
    matchID,
    option: userOption,
    matchResponded,
    matchResponse,
  };
  socket.emit("Client Answer Chat Question", params);
};

/* 
let thisQuestionSetID = null;
let thisQuestionSetTopic = ""
let thisMatchID = null;
let currentQuestionNumber = 1;
let matchResponded = false;
let matchResponse = null;
let isSessionComplete = false;



socket.on("Server Found Random Chat Match", (params) => {
  const { matchID, questionSetID, questionSetTopic } = params;
  thisQuestionSetID = questionSetID;
  thisMatchID = matchID;
  thisQuestionSetTopic = questionSetTopic
  console.log(`Found a match! => ${matchID}`);
  console.log(`Question Set Topic => ${thisQuestionSetTopic}`)
});

socket.on("Server Show Chat Question", (params) => {
  const { questionText, options } = params;
  matchResponded = false;
  matchResponse = null;
  console.log(`Question Text => "${questionText}"`);
  console.log("Options => ", options);
});

socket.on(
  "Server Chat Waiting For User Response",
  (serverMatchResponse) => {
    matchResponded = true;
    matchResponse = serverMatchResponse;
    console.log("Match has responded");
  }
);

socket.on("Server Waiting For Match Chat Response", (params) => {
  console.log("Waiting for Match Response");
});

socket.on("Both Users Responded To Chat Question", (params) => {
  const {
    questionText,
    questionNumber,
    userOneID,
    userOneResponse,
    userTwoID,
    userTwoResponse,
    sessionComplete,
  } = params;

  currentQuestionNumber = questionNumber + 1;
  isSessionComplete = sessionComplete;

  console.log(`Response to question ${questionNumber}  => `, questionText);
  console.log(`Response by ${userOneID} => `, userOneResponse);
  console.log(`Response by ${userTwoID} => `, userTwoResponse);
  console.log("Is session complete => ", sessionComplete);

  if (isSessionComplete) {
    console.log("SESSION COMPLETE");
  } else {
  }
});

socket.on("Server Wait For Users", () => {
  console.log("Searching for users!");
});

socket.on("Server Client Left Chat", () => {
  console.log("You Left the Chat Session");
});

socket.on("Server Match Left Chat", () => {
  console.log("Your  left the Chat Session");
});

socket.on("Server Match Disconnected", (matchID) => {
  console.log(`Your match ${matchID} has disconnected!`);
  console.log("Your match has disconnected!");
});

socket.on("connect_error", (err) => {
  console.log(`connect_error due to ${err.message}`);
});

 */
