const connection = require("../mariadb"); // db모듈
const { StatusCodes } = require("http-status-codes");

//(카테고리 별 , 신간 여부) 전체 도서 목록 조회
const allBooks = (req, res) => {
  let { category_id, news, limit, currentPage } = req.query; //이거 req할때, 값을 가져오는 방법이 query, body, params 이렇게 가져올 수 있는건가?

  // limit는 page 당 도서 수 ex. 3이라면 한 페이지에 도서를 3개만 보여준다는 뜻. 그럼 0,1,2 값만 보여준다는거
  // cuurentPage : 현재 몇 페이지인지 ex. 1, 2, 3
  // offset : ex. 0, 3, 6, 9,

  let offset = limit * (currentPage - 1);

  let sql = "SELECT * FROM books";
  let values = [];

  if (category_id && news) {
    sql +=
      " WHERE category_id =? AND pub_date BETWEEN DATE_SUB(NOW(), INTERVAL 1 MONTH) AND NOW();";
    values = [category_id];
  } else if (category_id) {
    sql += " WHERE category_id =?";
    values = [category_id];
  } else if (news) {
    sql +=
      " WHERE pub_date BETWEEN DATE_SUB(NOW(), INTERVAL 1 MONTH) AND NOW()"; //이 sql에서 필요한 정보만 뽑아올 수도 있어 어떻게? WHERE절로 조건을 걸어서 내가 원하는 도서 정보만 뽑아오는 거지
  }

  sql += " LIMIT ? OFFSET ?";
  values.push(parseInt(limit), offset);

  connection.query(sql, values, (err, result) => {
    if (err) {
      console.log(err);
      return res.status(StatusCodes.BAD_REQUEST).end();
    }

    if (result.length) {
      return res.status(StatusCodes.OK).json(result);
    } else {
      return res.status(StatusCodes.NOT_FOUND).end();
    }
  });
};

const bookDetail = (req, res) => {
  let { id } = req.params;
  id = parseInt(id); //문자열로 들어오니까 숫자로 바꿔줘야해

  let sql = `SELECT * FROM books LEFT JOIN category 
            ON books.category_id = category.id WHERE books.id=?`;
  connection.query(sql, id, (err, result) => {
    if (err) {
      console.log(err);
      return res.status(StatusCodes.BAD_REQUEST).end();
    }
    if (result[0]) return res.status(StatusCodes.CREATED).json(result[0]);
    else return res.status(StatusCodes.NOT_FOUND).end();
  });
};

module.exports = {
  allBooks,
  bookDetail,
};
