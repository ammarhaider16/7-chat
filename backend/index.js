import express from "express";
import cors from "cors";
import { createServer } from "http";
import { Server } from "socket.io";
import timeStampGenerator from "./utils/timeStampGenerator.js";
import removeRandomEntry from "./utils/removeAndReturnMapValue.js";
import { questionSets } from "./utils/questionSets.js";
import dotenv from "dotenv";
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    allowedHeaders: ["*"],
    credentials: true,
  },
});

app.use(cors());

app.use(express.json());
app.use(cors());
app.use(express.json({ limit: "500mb" }));
app.options("*", cors());

server.listen(PORT, () => {
  console.log(`Listening on PORT: ${PORT}`);
});

const userIDToSocketID = new Map();
const socketIDToUserID = new Map();

const availableUserIDToSocketID = new Map();
const inChatUserIDToSocketID = new Map();

const userIDtoMatchID = new Map();

// MUST BE CHANGED IF QUESTION SET MODIFIED
const questionSetsObjectSize = 25;

io.on("connection", (socket) => {
  console.log(`connect: ${socket.id}`, socket.request.headers);

  socket.on("New User", (userID) => {
    socketIDToUserID.set(socket.id, userID);
    userIDToSocketID.set(userID, socket.id);
    console.log(`User ${userID} has connected`);
    console.log("Maps have been updated");
    console.log("userIDToSocketID => ", userIDToSocketID);
    console.log("socketIDToUserID => ", socketIDToUserID);
  });

  socket.on("Client Enter Chat", (userID) => {
    availableUserIDToSocketID.set(userID, socket.id);
    console.log("Map updated");
    console.log("availableUserIDToSocketID => ", availableUserIDToSocketID);

    console.log("Matching Request Received!");

    if (availableUserIDToSocketID.size < 2) {
      io.to(socket.id).emit("Server Wait For Users");
    } else {
      console.log("Now matching");

      availableUserIDToSocketID.delete(userID);
      const userTwoID = removeRandomEntry(availableUserIDToSocketID);
      const userTwoSocketID = userIDToSocketID.get(userTwoID);

      inChatUserIDToSocketID.set(userID, socket.id);
      inChatUserIDToSocketID.set(userTwoID, userTwoSocketID);

      userIDtoMatchID.set(userID, userTwoID);
      userIDtoMatchID.set(userTwoID, userID);

      console.log("Maps updated");
      console.log("availableUserIDToSocketID => ", availableUserIDToSocketID);
      console.log("inChatUserIDToSocketID => ", inChatUserIDToSocketID);
      console.log("userIDtoMatchID => ", userIDtoMatchID);

      const questionSetID = Math.ceil(Math.random() * questionSetsObjectSize);

      const questionSetTopic = questionSets[questionSetID].topic;

      io.to(socket.id).emit("Server Found Random Chat Match", {
        matchID: userTwoID,
        questionSetID,
        questionSetTopic,
      });

      io.to(userTwoSocketID).emit("Server Found Random Chat Match", {
        matchID: userID,
        questionSetID,
        questionSetTopic,
      });

      console.log("Matching Request Completed!");
    }
  });

  socket.on("Client Leave Chat", (params) => {
    const { userID, matchID } = params;
    console.log(userID);
    console.log(matchID);

    const userSocketID = userIDToSocketID.get(userID);
    availableUserIDToSocketID.delete(userID);
    inChatUserIDToSocketID.delete(userID);
    io.to(userSocketID).emit("Server Client Left Chat");

    if (matchID != null) {
      console.log(matchID);
      const matchSocketID = userIDToSocketID.get(matchID);
      io.to(matchSocketID).emit("Server Match Left Chat");
      availableUserIDToSocketID.delete(matchID);
      inChatUserIDToSocketID.delete(matchID);
      userIDtoMatchID.delete(userID);
      userIDtoMatchID.delete(matchID);
    }

    console.log("Maps updated");
    console.log("availableUserIDToSocketID => ", availableUserIDToSocketID);
    console.log("inChatUserIDToSocketID => ", inChatUserIDToSocketID);
    console.log("userIDtoMatchID => ", userIDtoMatchID);
  });

  socket.on("Client Show Chat Question", (params) => {
    const { questionSetID, questionNumber } = params;

    const questionText =
      questionSets[questionSetID].questions[questionNumber - 1];
    const options = questionSets[questionSetID].options[questionNumber - 1];

    const emitParams = {
      questionText,
      options,
    };
    io.to(socket.id).emit("Server Show Chat Question", emitParams);
  });

  socket.on("Client Answer Chat Question", (params) => {
    const {
      questionSetID,
      questionNumber,
      userID,
      matchID,
      option,
      matchResponded,
      matchResponse,
    } = params;

    if (!matchResponded) {
      const matchSocketID = userIDToSocketID.get(matchID);
      console.log(matchID, "has not responded");

      let userResponse = "";

      if (option !== "") {
        userResponse =
          questionSets[questionSetID].options[questionNumber - 1][option];
      } else {
        userResponse = "did not respond on time";
      }

      io.to(matchSocketID).emit(
        "Server Chat Waiting For User Response",
        userResponse
      );
      io.to(socket.id).emit("Server Waiting For Match Chat Response");
    } else {
      const userOneID = userID;
      let userOneResponse = "";
      if (option !== "") {
        userOneResponse =
          questionSets[questionSetID].options[questionNumber - 1][option];
      } else {
        userOneResponse = "did not respond in time";
      }
      const userTwoID = matchID;
      const userTwoResponse = matchResponse;
      const questionSetSize = questionSets[questionSetID].questions.length;
      const sessionComplete = questionNumber == questionSetSize;

      console.log("userOneID => ", userOneID);
      console.log("userTwoID => ", userTwoID);

      console.log("userOneResponse => ", userOneResponse);
      console.log("userTwoResponse => ", userTwoResponse);
      console.log("Question Set Size => ", questionSetSize);
      console.log("Is session complete => ", sessionComplete);

      const emitParams = {
        questionText: questionSets[questionSetID].questions[questionNumber - 1],
        questionNumber,
        userOneID,
        userOneResponse,
        userTwoID,
        userTwoResponse,
        sessionComplete,
      };

      const userOneSocketID = userIDToSocketID.get(userOneID);
      const userTwoSocketID = userIDToSocketID.get(userTwoID);

      io.to(userOneSocketID).emit(
        "Both Users Responded To Chat Question",
        emitParams
      );

      io.to(userTwoSocketID).emit(
        "Both Users Responded To Chat Question",
        emitParams
      );
    }
  });

  socket.on("disconnect", () => {
    const userID = socketIDToUserID.get(socket.id);
    const matchID = userIDtoMatchID.get(userID);
    console.log(`User ${userID} disconnected`);
    socketIDToUserID.delete(socket.id);
    userIDToSocketID.delete(userID);
    availableUserIDToSocketID.delete(userID);
    inChatUserIDToSocketID.delete(userID);

    if (matchID != null) {
      const matchSocketID = userIDToSocketID.get(matchID);
      io.to(matchSocketID).emit("Server Match Disconnected", userID);
      availableUserIDToSocketID.delete(matchID);
      inChatUserIDToSocketID.delete(matchID);
      userIDtoMatchID.delete(userID);
      userIDtoMatchID.delete(matchID);
    }

    console.log("Maps updated");
    console.log("availableUserIDToSocketID => ", availableUserIDToSocketID);
    console.log("inChatUserIDToSocketID => ", inChatUserIDToSocketID);
    console.log("userIDtoMatchID => ", userIDtoMatchID);
    console.log("userIDToSocketID => ", userIDToSocketID);
    console.log("socketIDToUserID => ", socketIDToUserID);
  });
});

process.on("uncaughtException", (error) => {
  console.error("Uncaught Exception:", error);
  // Optional: Log the error, send to a monitoring service, etc.
});
