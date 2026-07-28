const express = require("express");

const app = express();

app.use(express.json());


app.post("/", async (req, res) => {

  const response = await fetch(
    "https://script.google.com/macros/s/AKfycby54zIFGT_kloMWWQvuoAnTdRLHqVex-m3P1q7p-dDo3EbS_ctGYhnj7XlIGKbYiiq1/exec"
  );

  const data = await response.json();

  const outputs = [];

  data.story.forEach(item => {

    if (item.type === "bot") {
      outputs.push({
        simpleText: {
          text: item.content
        }
      });
    }


    if (item.type === "image") {
      outputs.push({
        simpleImage: {
          imageUrl: item.asset,
          altText: "핀도리 이미지"
        }
      });
    }


    if (item.type === "quiz") {

      outputs.push({
        simpleText: {
          text: item.question
        }
      });

      outputs.push({
        simpleText: {
          text:
          `1️⃣ ${item.choice1}\n2️⃣ ${item.choice2}`
        }
      });

    }


  });


  res.json({
    version: "2.0",
    template: {
      outputs: outputs
    }
  });

});


app.listen(3000, () => {
  console.log("Findoory server running");
});
