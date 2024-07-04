import client from "../db/client.js";

export const findOrCreateUserDetails = async (req, res) => {
  const { userID, email } = req.body;

  try {
    const Users = client.db("Users");
    const UserDetails = Users.collection("UserDetails");

    const findUserDetailsFilter = {
      userID: userID,
      email: { $ne: email },
    };

    const findResult = await UserDetails.findOne(findUserDetailsFilter);

    if (findResult == null) {
      const addUserDetailsDoc = { userID, email };
      const result = await UserDetails.insertOne(addUserDetailsDoc);
      console.log("created new user => ", result.insertedId);
      res.status(200).send("Sucesss");
    } else {
      res.status(200).send("Error");
    }
  } catch (err) {
    console.log(err);
    console.log("Error in Users.js controller");
    res.status(500).send("Server Error!");
  }
};
