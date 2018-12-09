const express = require('express'),
    router = express.Router(),
    sql = require('../module/mysql'),
    crypto = require('crypto'),
    jwt = require('jsonwebtoken');

router.post('/', (req,res)=>{
  const username = req.body.username,password = req.body.password,
      md5 = crypto.createHash('md5'),
      newPass = md5.update(password).digest('hex');
  sql('select * from user where username = ?',[username],(err,data)=>{
    if (err) {
      res.json({
        code: 0,
        msg:'登录失败，请重试'
      })
      return
    }
    if (data.length == 0) {
      res.json({
        code: 0,
        msg: '用户不存在'
      })
      return
    }
    if (data[0]['password'] == newPass) {
      const token = jwt.sign({
        exp: Math.floor(Date.now() / 1000) + (60 * 60),
        username: username,
        level: data[0].level
      }, 'set_user');
      sql('update user set accessToken=? where id=?',[token, data[0].id])
      res.json({
        code: 200,
        msg: '登录成功',
        accessToken: token
      })
    }else{
      res.json({
        code: 0,
        msg: '密码错误'
      })
    }
  });
});

module.exports = router;
