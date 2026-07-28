const express = require("node-fetch");

const app = express();

app.use(express.json());

app.post("/", async (req, res) => {

  const response = await fetch(
    "여기에 Apps Script URL"
  );

  const data = await response.json();

  res.json({
    version: "2.0",
    template: {
      outputs: [
        {
          simpleText: {
            text: data[0].title
          }
        }
      ]
    }
  });

});

app.listen(3000, () => {
  console.log("Findoory server running");
});
