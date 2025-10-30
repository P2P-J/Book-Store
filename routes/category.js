const express = require("express");
const router = express.Router();

const { allCategory } = require("../controller/CategoryController"); //이게 라우터에서 쓸 컨트롤러들을 불러오는 명령어야.

router.use(express.json());

//카테고리 전체 목록 조회
router.get('/', allCategory);

module.exports = router;
