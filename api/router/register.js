const express = require('express'),
    router = express.Router(),
    sql = require('../module/mysql'),
    crypto = require('crypto');

router.post('/', (req,res)=>{
  const username = req.body.username,password = req.body.password,level = 0,
  md5 = crypto.createHash('md5'),
  newPass = md5.update(password).digest('hex');
  sql('SELECT * FROM user WHERE username = ?',[username],(err,data)=>{
    if(err){
      res.json({
        code: 0,
        msg:'用户查询失败'
      })
      return;
    }
    if(data == undefined || data.length == 0){
      sql('INSERT INTO user (id, username, password, level) VALUES (0,?,?,0)',[username,newPass],(err,data)=>{
        if(err){
          res.json({
            code: 0,
            msg: '注册失败'
          })
          return;
        }else{
          res.json({
            code: 200,
            msg: '注册成功'
          })
        }
      })
    }else{
        res.json({
          code: 201,
          msg: '用户名已存在'
        })
    }
  });
});

module.exports = router;