const express = require("node-fetch");

const app = express();

app.use(express.json());

app.post("/", async (req, res) => {

  const response = await fetch(
    "https://script.google.com/macros/s/AKfycby-UjWELO1GhIUPd0RvrxG7DAfUCjkTtA0RDObRtzQp0n6B4Y1P1X43lOxD5Cvha4FR/exec"
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
