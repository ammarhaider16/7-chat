import axios from "axios";

const LOCAL_ADDRESS = "http://149.43.107.35:4000";
const AWS_ADDRESS =
  "http://7-chat-env2-env.eba-zpjcegve.us-east-2.elasticbeanstalk.com";

export const makeApiCall = async (method, route, params) => {
  const url = `${AWS_ADDRESS}${route}`;
  console.log("ROUTE", url);
  try {
    const response = await axios[method](url, params);
    return response;
  } catch (error) {
    console.error("Request error:", error.message);
  }
};
