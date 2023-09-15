const express = require("express");
const app = express();

const cors = require("cors");
const morgan = require("morgan");

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

app.listen(PORT, () => console.log(`${PORT} 서버 기동중`));
