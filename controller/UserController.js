const connection = require("../mariadb"); // db모듈
const { StatusCodes } = require("http-status-codes");
//따로 컨트롤러로 빼주는거야 기능을. 왜냐면 route는 경로를 나타내주는 친구인데, 저렇게 기능이 많아지면 헷갈리잖아 그래서 기능별로 컨트롤러로 빼주는거지
//그래서 그걸 가지고 모듈을 만드는 건데 어떻게 만드냐면

const jwt = require("jsonwebtoken"); //jwt 모듈
const dotenv = require("dotenv"); //env 모듈 쓸려고 dot env한거야.
const crypto = require("crypto"); //암호화 모듈

dotenv.config(); //이거 해줘야지 .env 파일을 인식해

const join = (req, res) => {
  const { email, password } = req.body;

  let sql = `INSERT INTO users (email, password, salt) VALUES (?, ?, ?)`;
  //비밀번호 암호화
  const salt = crypto.randomBytes(10).toString("base64"); //솔트 생성
  const hashPassword = crypto
    .pbkdf2Sync(password, salt, 10000, 10, "sha512")
    .toString("base64"); //해시된 비밀번호  //randomBytes : 매개변수로 들어오는 숫자를 가지고 random한 바이트를 생성해주는 함수 여기서는 64바이트짜리 솔트를 생성해주는거지 //그리고 문자열로 바꿀 건데, base64형태로 바꿀거야(우리가 기본적으로 많이 쓰는 인코딩 방식 중 하나지)
  //pbkdf2Sync : 비밀번호 기반 키 도출 함수, 암호화 알고리즘 종류 중 하나 //매개변수로 들어오는 비밀번호와 솔트를 가지고 10000번 해싱을 해서 64바이트 길이의 해시된 비밀번호를 sha512알고리즘으로 만들어줘 라는 뜻

  let values = [email, hashPassword, salt]; // 회원가입 시 비밀번호를 암호화해서 암호화된 비밀번호와, salt 값을 같이 저장

  connection.query(sql, values, (err, results) => {
    if (err) {
      console.log(err);
      return res.status(StatusCodes.BAD_REQUEST).end();
    }

    return res.status(StatusCodes.CREATED).json(results);
  });
};

const login = (req, res) => {
  const { email, password } = req.body;
  let sql = "SELECT * FROM users WHERE email = ? ";

  connection.query(sql, email, (err, results) => {
    if (err) {
      console.log(err);
      return res.status(StatusCodes.BAD_REQUEST).end();
    }

    //여기가 로그인 성공 로직이면서 토큰 발급 로직이야
    const loginUser = results[0];

    //  salt값 꺼내서 날 것으로 들어온 비밀번호를 암호화 해보고
    const hashPassword = crypto
      .pbkdf2Sync(password, loginUser.salt, 10000, 10, "sha512")
      .toString("base64");

    // 디비 비밀번호랑 비교

    if (loginUser && loginUser.password == hashPassword) {
      const token = jwt.sign(
        {
          email: loginUser.email,
        },
        process.env.PRIVATE_KEY,
        {
          expiresIn: "1h", //1시간 유효
          issuer: "songa",
        }
      );

      res.cookie("token", token, {
        httpOnly: true, //너 이거 http에서만 쓸 수 있어
      });

      console.log(token);

      return res.status(StatusCodes.OK).json(results);
    } else {
      return res.status(StatusCodes.UNAUTHORIZED).end(); //401 이고 인증이 안되었어! 라는 뜻
    }
  });
};

const passwordResetRequest = (req, res) => {
  const { email } = req.body;

  let sql = "SELECT * FROM users WHERE email = ?";
  connection.query(sql, email, (err, results) => {
    if (err) {
      console.log(err);
      return res.status(StatusCodes.BAD_REQUEST).end();
    }

    // 이메일로 유저가 있는지 찾아봅니다!
    const user = results[0];
    if (user) {
      return res.status(StatusCodes.OK).json({
        email: email,
      });
    } else {
      return res.status(StatusCodes.UNAUTHORIZED).end();
    }
  });
};

const passwordReset = (req, res) => {
  //비밀번호를 바꿀려면 어떤 이메일의 비밀번호를 바꿀건지 알아야지 하니까 이전 페이지에서 입력했던 것을 받아와야해.
  const { email, password } = req.body;

  let sql = "UPDATE users SET password = ?, salt =? WHERE email = ?";

  //암호화된 비밀번호와 salt 값을 같이 저장
  const salt = crypto.randomBytes(10).toString("base64"); //솔트 생성
  const hashPassword = crypto
    .pbkdf2Sync(password, salt, 10000, 10, "sha512")
    .toString("base64");

  let values = [hashPassword, salt, email];
  connection.query(sql, values, (err, results) => {
    if (err) {
      console.log(err);
      return res.status(StatusCodes.BAD_REQUEST).end();
    }
    if (results.affectedRows == 0) {
      //데이터베이스 쿼리 실행 후 영향을 받은 행(row)의 개수를 나타내는 속성입니다.
      return res.status(StatusCodes.BAD_REQUEST).end();
    } else {
      return res.status(StatusCodes.OK).json(results);
    }
  });
};

module.exports = { join, login, passwordResetRequest, passwordReset };
//이렇게 기능별로 컨트롤러를 만들어서 route에서 불러다 쓰는거지
