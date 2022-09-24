const express = require('express') // express 모드 가져오기
const app = express() // fun 을 이용해 새로운 express app을 만들고
const port = 5000 // 서버 포트

const bodyParser = require('body-parser');
const {User} = require("./models/User"); // 만든 유저 모델을 가져오기

const config = require('./config/key');

// application/x-www-form-urlencoded 이렇게 된 데이터를 분석해서 가져옴
app.use(bodyParser.urlencoded({extended: true}));
// application/json 타입을 분석해서 가져옴
app.use(bodyParser.json());

const mongoose = require('mongoose')
mongoose.connect(config.mongoURI,)
  .then(() => console.log('MongoDB Connected...'))
  .catch(err => console.log(err))

  //useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false 연결이 잘 됐는지 확인


app.get('/', (req, res) => {
  res.send('Hello World! 안녕하세요!') // hello world 출력
})

app.post('/register', (req, res) => {
  // 회원 가입 할 때 필요한 정보들을 client에서 가져오면
  // 그것들을 데이터 베이스에 넣어준다.
  const user = new User(req.body) // req.body로 클라이언트에 있는 정보를 받아옴
  user.save((err, userInfo) => {
    if(err) return res.json({success: false, err})
    return res.status(200).json({success: true}) // status(200) = 성공했다는 표시, json 파일로
  }) // 몽고DB 메소드
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`) // 실행
})