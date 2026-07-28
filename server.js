const express = require("express");

const app = express();

app.use(express.json());

app.post("/", (req, res) => {
  res.json({
    version: "2.0",
    template: {
      outputs: [
        {
          simpleText: {
            text: "핀도리 연결 성공"
          }
        }
      ]
    }
  });
});

app.listen(3000, () => {
  console.log("Findoory server running");
});