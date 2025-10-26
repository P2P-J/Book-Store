const express = require("express"); //express 모듈
const router = express.Router();
const connection = require("../mariadb"); // db모듈
const {
  join,
  login,
  passwordReset,
  passwordResetRequest,
} = require("../controller/UserController"); //컨트롤러 모듈 이렇게 불러와주면 돼! 쉽죠?

router.use(express.json());
//router쓸꺼면 use필요해 너 오브젝트 post형태로 값이 들어오는 거면 json 형태로 들어올텐데, 그러면 use추가해야해 라는 뜻

//회원가입
router.post("/join", join);

//이제 로그인 기능도 만들어보자

//로그인
router.post("/login", login);
//비밀번호 초기화 요청
router.post("/reset", passwordResetRequest);
//비밀번호 초기화
router.put("/reset", passwordReset);

//이걸 모듈로 쓴다고 했으니 export를 해줘야해!

module.exports = router;
