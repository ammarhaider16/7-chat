import { makeApiCall } from "./makeApiCall.js";

export const findOrCreateUserDetails = async (userID, email) => {
  const method = "post";
  const route = "/findOrCreateUserDetails";
  const params = { userID, email };
  try {
    const response = await makeApiCall(method, route, params);
    return response ? response.data : "NoResponse";
  } catch (err) {
    console.log("Error in Users.js functions!");
  }
};
