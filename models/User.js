const mongoose = require('mongoose');
const bcypt = require('bcrypt');
const saltRounds = 10 // 10자리로 비밀번호 암호화
const jwt = require('jsonwebtoken');
//const cookieParser = require('cookie-parser');

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

userSchema.pre('save', function(next) {
    var user = this; // 위에 유저 스키마를 가리킴
    if(user.isModified('password')) {
        // 비밀번호를 암호화 시키기
        bcypt.genSalt(saltRounds, function(err, salt) {
            if(err) return next(err)

            bcypt.hash(user.password, salt, function(err, hash){
                if(err) return next(err)
                user.password = hash // hash 된 비밀번호로 바꿔주기
                next()
            })
        })
    } // password만 바뀔 때마다 암호화
    else {
        next()
    }
}) // 유저 정보를 저장하기 전에 할 일, 다 끝나면 next 함수로


userSchema.methods.comparePassword = function(plainPassword, cb) {
    // plainPassword 1234567 암호화된 비밀번호 같은지 체크
    bcypt.compare(plainPassword, this.password, function(err, isMatch) {
        if(err) return cb(err); cb(null, isMatch)
    })
}

userSchema.methods.generateToken = function(cb) {
    // jsonwebtoken을 이용해서 토큰 생성하기
    var user = this;

    var token = jwt.sign(user._id.toHexString(), 'secretToken')

    //user._id + 'secretToken' = token
    //->
    //'secretToken' -> user._id

    user.token = token
    user.save(function(err, user) {
        if(err) return cb(err)
        cb(null, user)
    })
}

userSchema.statics.findByToken = function(token, cb) {
    var user = this;
    // user._id + '' = token
    // 토큰을 decode 하기
    jwt.verify(token, 'secretToken', function(err, decoded) {
        // 유저 아이디를 이용해서 유저를 찾은 다음에
        // 클라이언트에서 가져온 token과 db에 보관된 토큰이 일치하는지 확인

        user.findOne({"_id": decoded, "token": token}, function(err, user){
            if(err) return cb(err);
            cb(null, user) // 에러 없으면 유저 정보
        })
    })
}

const User = mongoose.model('User', userSchema) // 모델을 감싸주는

module.exports = {User}
