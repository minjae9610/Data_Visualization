const express = require("express");
const app = express();
const cors = require("cors");
const morgan = require("morgan");
const axios = require("axios");
const dotenv = require("dotenv");
const fs = require("fs");

dotenv.config();

const PORT = 8081;

app.use(cors());
app.use(morgan("dev"));
// body 데이터 파싱
app.use(express.json());

app.get("/", (req, res) => {
  return res.json({
    test: "HELLO",
  });
});

app.post("/data", async (req, res) => {
  try {
    const url = "https://openapi.naver.com/v1/datalab/search";
    // axios에 보낼 header
    const headers = {
      "X-Naver-Client-Id": process.env.CLIENT_ID,
      "X-Naver-Client-Secret": process.env.CLIENT_SECRET,
      "Content-Type": "application/json",
    };

    // axios에 보낼 body
    const request_body = {
      startDate: "2017-01-01",
      endDate: "2017-04-30",
      timeUnit: "month",
      keywordGroups: [
        {
          groupName: "한글",
          keywords: ["한글", "korean"],
        },
        {
          groupName: "영어",
          keywords: ["영어", "english"],
        },
      ],
    };

    const response = await axios.post(url, request_body, {
      headers,
    });

    return res.json(response.data);
  } catch (error) {
    console.log(error);
    return res.json(error);
  }
});

app.listen(PORT, () => console.log(`${PORT} 서버 기동중`));
