//express 모듈 구현
const express = require("express");
const app = express();

//dotenv 모듈
const dotenv = require("dotenv");
dotenv.config();

app.listen(process.env.PORT);
// 유의미한 포트 번호로 지정하는 것이 좋음

// app이 포트넘버로 9999를 받아서 들어오면은 우리는 뭘할꺼냐면
//user에 관한 라우터를하나 생성해가지구
const userRouter = require("./routes/users");
//공통ui를 하나 생성할 것이고
app.use("/users", userRouter); //쉽게 말해 routes에 있는 users.js를 불러오는 것

const bookRouter = require("./routes/books");
app.use("/books", bookRouter);

const likeRouter = require("./routes/likes");
app.use("/likes", likeRouter);

const cartRouter = require("./routes/carts");
app.use("/carts", cartRouter);

const orderRouter = require("./routes/orders");
app.use("/orders", orderRouter);

const categoryRouter = require("./routes/category");
app.use("/category", categoryRouter);
