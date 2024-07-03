import {
  getUserSocket,
  enterChat,
  leaveChat,
  showQuestion,
  answerQuestion,
} from "../socket/7ChatSockets.js";

const userID = "hamza";
const socket = getUserSocket(userID);
const defaultResponse = "";

let thisQuestionSetID = null;
let thisQuestionSetTopic = "";
let thisMatchID = null;
let currentQuestionNumber = 1;
let matchResponded = false;
let matchResponse = null;
let isSessionComplete = false;

enterChat(userID, socket);

setTimeout(() => {
  showQuestion(thisQuestionSetID, currentQuestionNumber, socket);
}, 5000);

setTimeout(() => {
  answerQuestion(
    thisQuestionSetID,
    currentQuestionNumber,
    userID,
    thisMatchID,
    defaultResponse,
    matchResponded,
    matchResponse,
    socket
  );
}, 10000);

setTimeout(() => {
  showQuestion(thisQuestionSetID, currentQuestionNumber, socket);
}, 15000);

setTimeout(() => {
  answerQuestion(
    thisQuestionSetID,
    currentQuestionNumber,
    userID,
    thisMatchID,
    defaultResponse,
    matchResponded,
    matchResponse,
    socket
  );
}, 20000);

setTimeout(() => {
  showQuestion(thisQuestionSetID, currentQuestionNumber, socket);
}, 25000);

setTimeout(() => {
  answerQuestion(
    thisQuestionSetID,
    currentQuestionNumber,
    userID,
    thisMatchID,
    defaultResponse,
    matchResponded,
    matchResponse,
    socket
  );
}, 30000);

setTimeout(() => {
  showQuestion(thisQuestionSetID, currentQuestionNumber, socket);
}, 35000);

setTimeout(() => {
  answerQuestion(
    thisQuestionSetID,
    currentQuestionNumber,
    userID,
    thisMatchID,
    defaultResponse,
    matchResponded,
    matchResponse,
    socket
  );
}, 40000);

setTimeout(() => {
  showQuestion(thisQuestionSetID, currentQuestionNumber, socket);
}, 45000);

setTimeout(() => {
  answerQuestion(
    thisQuestionSetID,
    currentQuestionNumber,
    userID,
    thisMatchID,
    defaultResponse,
    matchResponded,
    matchResponse,
    socket
  );
}, 50000);

setTimeout(() => {
  showQuestion(thisQuestionSetID, currentQuestionNumber, socket);
}, 55000);

setTimeout(() => {
  answerQuestion(
    thisQuestionSetID,
    currentQuestionNumber,
    userID,
    thisMatchID,
    defaultResponse,
    matchResponded,
    matchResponse,
    socket
  );
}, 60000);

setTimeout(() => {
  showQuestion(thisQuestionSetID, currentQuestionNumber, socket);
}, 65000);

setTimeout(() => {
  answerQuestion(
    thisQuestionSetID,
    currentQuestionNumber,
    userID,
    thisMatchID,
    defaultResponse,
    matchResponded,
    matchResponse,
    socket
  );
}, 70000);

setTimeout(() => {
  leaveChat(userID, thisMatchID, socket);
}, 75000);

socket.on("Server Found Random Chat Match", (params) => {
  const { matchID, questionSetID, questionSetTopic } = params;
  thisQuestionSetID = questionSetID;
  thisMatchID = matchID;
  thisQuestionSetTopic = questionSetTopic;
  console.log(`Found a match! => ${matchID}`);
  console.log(`Question Set Topic => ${thisQuestionSetTopic}`);
});

socket.on("Server Show Chat Question", (params) => {
  const { questionText, options } = params;
  matchResponded = false;
  matchResponse = null;
  console.log(`Question Text => "${questionText}"`);
  console.log("Options => ", options);
});

socket.on("Server Chat Waiting For User Response", (serverMatchResponse) => {
  matchResponded = true;
  matchResponse = serverMatchResponse;
  console.log("Match has responded");
});

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
  console.log("Your match left the Chat Session");
});

socket.on("Server Match Disconnected", (matchID) => {
  console.log(`Your match ${matchID} has disconnected!`);
  process.exit();
});
