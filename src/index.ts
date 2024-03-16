import { config } from "dotenv";
import connectDB from "./db/index.js";
import app from "./app.js";

config({
  path: "./.env",
});

connectDB()
  .then(() => {
    app.listen(process.env.PORT || 3000, () => {
      console.log(`Server is running on port ${process.env.PORT}`);
    });
  })
  .catch((error) => {
    console.log("ERROR connecting to the database!!!", error);
  });
