const express = require("express");
const router = express.Router();

const { allBooks, bookDetail } = require("../controller/BookController"); //이게 라우터에서 쓸 컨트롤러들을 불러오는 명령어야.

router.use(express.json());

//카테고리별 조회 & 전체 도서 조회
router.get("/", allBooks);

//개별 도서 조회
router.get("/:id", bookDetail);
module.exports = router;
