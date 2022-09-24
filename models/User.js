const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    name: {
        type: String,
        maxlength: 50
    },
    email: {
        type: String,
        trim: true, // 스페이스 없애주는 역할
        unique: 1 // 똑같은 이메일 쓰지 못하게
    },
    password: {
        type: String,
        minlength: 5
    },
    lastname: {
        type: String,
        maxlength: 50
    },
    role: {
        type: Number, // 0이면 일반 유저, 1이면 관리자
        default: 0 // 임의로 role을 지정하지 않으면 0을 주겠다
    },
    image: String,
    token: {
        type: String
    },
    tokenExp: { // 토큰의 유효기간
        type: String
    }
})

const User = mongoose.model('User', userSchema) // 모델을 감싸주는

module.exports = {User}
