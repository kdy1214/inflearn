const express = require('express') // express 모드 가져오기
const app = express() // fun 을 이용해 새로운 express app을 만들고
const port = 5000 // 서버 포트

const bodyParser = require('body-parser');
const {User} = require("./models/User"); // 만든 유저 모델을 가져오기

const config = require('./config/key');

const cookieParser = require('cookie-parser');

const {auth} = require('./middleware/auth');

// application/x-www-form-urlencoded 이렇게 된 데이터를 분석해서 가져옴
app.use(bodyParser.urlencoded({extended: true}));
// application/json 타입을 분석해서 가져옴
app.use(bodyParser.json());

app.use(cookieParser());

const mongoose = require('mongoose')
mongoose.connect(config.mongoURI,)
  .then(() => console.log('MongoDB Connected...'))
  .catch(err => console.log(err))

  //useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false 연결이 잘 됐는지 확인


app.get('/', (req, res) => {
  res.send('Hello World! 안녕하세요!') // hello world 출력
})

app.post('/api/users/register', (req, res) => {
  // 회원 가입 할 때 필요한 정보들을 client에서 가져오면
  // 그것들을 데이터 베이스에 넣어준다.
  const user = new User(req.body) // req.body로 클라이언트에 있는 정보를 받아옴
  user.save((err, userInfo) => {
    if(err) return res.json({success: false, err})
    return res.status(200).json({success: true}) // status(200) = 성공했다는 표시, json 파일로
  }) // 몽고DB 메소드
})

app.post('/api/users/login', (req, res) => { // 로그인 라우트

  // 요청된 이메일을 데이터베이스에 있는지 찾기
  User.findOne({email: req.body.email}, (err, user) => {
    if(!user) {
      return res.json({
        loginSuccess: false,
        message: "제공된 이메일에 해당하는 유저가 없습니다."
      })
    }

    // 요청된 이메일이 데이터 베이스에 있다면 비밀번호가 맞는 비밀번호인지 확인
    user.comparePassword(req.body.password, (err, isMatch) => {
      if(!isMatch)
        return res.json({loginSucess: false, message: "비밀번호가 틀렸습니다."
        })

      // 비밀번호가 맞다면 토큰 생성
      user.generateToken((err, user) => {
        if(err) return res.status(400).send(err);
        
        // 토큰을 저장한다
        res.cookie("x_auth", user.token)
           .status(200)
           .json({loginSucess: true, userId: user._id})
      })
    })
  }) 
})


app.get('/api/users/auth', auth, (req, res) => {

  // 여기까지 미들웨어를 통과해 왔다는 얘기는 authentication이 true
  res.status(200).json({
    _id: req.user._id,
    isAdmin: req.user.role === 0 ? false : true, // role이 0이면 일반유저, 0이 아니면 관리자
    isAuth: true,
    email: req.user.email,
    name: req.user.name,
    lastname: req.user.lastname,
    role: req.user.role,
    image: req.user.image
  })
})

app.get('/api/users/logout', auth, (req, res) => {
  User.findOneAndUpdate({_id: req.user._id}, {token: ""}, (err, user) => {
    if (err) return res.json({success: false, err});
    return res.status(200).send({
      success: true
    })
  })
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`) // 실행
})