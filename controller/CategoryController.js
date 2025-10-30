const connection = require("../mariadb");
const { StatusCodes } = require("http-status-codes");

const allCategory = (req, res) => {
  //카테고리 전체 목록 리스트
  let sql = `SELECT * FROM category`;

  connection.query(sql, (err, result) => {
    if (err) {
      console.log(err);
      return res.status(StatusCodes.BAD_REQUEST).end();
    }
    return res.status(StatusCodes.CREATED).json(result);
  });
};

module.exports = {
  allCategory,
};
