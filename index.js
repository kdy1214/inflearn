const express = require('express') // express 모드 가져오기
const app = express() // fun 을 이용해 새로운 express app을 만들고
const port = 5000 // 서버 포트

const mongoose = require('mongoose')
mongoose.connect('mongodb+srv://dayeon:1234@cluster0.korxugg.mongodb.net/?retryWrites=true&w=majority',)
  .then(() => console.log('MongoDB Connected...'))
  .catch(err => console.log(err))

  //useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false 연결이 잘 됐는지 확인


app.get('/', (req, res) => {
  res.send('Hello World! 안녕하세요~') // hello world 출력
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`) // 실행
})