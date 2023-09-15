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

app.get("/data", (req, res) => {
  fs.readFile("./uploads/chart.json", "utf8", (error, data) => {
    if (error) {
      console.log(error);
    }

    // 문자열 -> JSON
    return res.json(JSON.parse(data));
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

    console.log(req.body);

    // axios에 보낼 body
    const request_body = {
      // startDate: "2017-01-01",
      startDate: req.body.startDate,
      // endDate: "2017-04-30",
      endDate: req.body.endDate,
      // timeUnit: "month",
      timeUnit: req.body.timeUnit,
      keywordGroups: req.body.keywordGroups,
    };

    const response = await axios.post(url, request_body, {
      headers,
    });

    // 값을 파일로 저장
    // json은 바로 저장 X -> json을 문자열로 변환해서 저장
    // JSON -> String JSON.stringify()

    fs.writeFile(
      "./uploads/chart.json",
      JSON.stringify(response.data.results),
      (err) => {
        if (err) {
          console.log(err);
        }
        console.log("파일이 생성되었습니다.");
      }
    );

    return res.json(response.data);
  } catch (error) {
    console.log(error);
    return res.json(error);
  }
});

app.listen(PORT, () => console.log(`${PORT} 서버 기동중`));
