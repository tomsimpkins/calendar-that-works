import express from "express";

const app = express();
app.listen(3000, () => {
  console.log("server running port 3000");
});

app.get("/foo", (x) => {
  console.log("foo!!");
});
