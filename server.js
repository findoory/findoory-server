const express = require("express");

const app = express();

app.use(express.json());


app.post("/", async (req, res) => {

  const response = await fetch(
    "https://script.google.com/macros/s/AKfycbxmW6z8CUV_Fpyl862l-qOfQWGgJrn1Avm9S5z5TM5qKB4OdneYX7-lKXQlpJmyYbHe/exec"
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
