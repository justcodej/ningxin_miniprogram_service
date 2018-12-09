const express = require('express')
const router = express.Router()
const sql = require('../module/mysql')
const upload = require('../module/multer')
const fs = require('fs')

router.get('/getNews', (req, res) => { // 查询新闻
  sql('select id,title,subtitle,date,poster from news order by id desc', (err, data) => {
    if (err) {
      res.json({
        code: 0,
        msg: '数据查询失败'
      });
      return
    }
    if (data) {
      res.json({
        code: 200,
        data: data
      })
    }
  })
});

router.get('/getNewsDetail', (req, res) => {
  let id = req.query.id
  sql('select * from news where id=?', [id], (err, data) => {
    if (err) {
      res.json({
        code: 0,
        msg: '数据查询失败'
      });
      return
    }
    if (data) {
      res.json({
        code: 200,
        data: data
      })
    }
  })
})

router.post('/news', (req, res) => { // 发布新闻
  const [id, title, subtitle, author, date, content, poster] = [req.body.id, req.body.title, req.body.subtitle, req.body.author, req.body.date, req.body.content, req.body.poster];
  if ((id * 1) + 1) {
    sql('update news set title=?,subtitle=?,author=?,date=?,content=?,poster=? where id=?',
      [title,subtitle,author,date,content,poster,id], (err, data) => {
      if (err) {
        res.json({
          code: 0,
          msg: '失败'
        });
        return
      }
      if (data.affectedRows) {
        res.json({
          code: 200,
          msg: '发布成功'
        })
      }
    })
  } else {
    sql('INSERT INTO news (id, title, subtitle, author, date, content, poster) VALUES (0,?,?,?,?,?,?)', [title, subtitle, author, date, content, poster], (err, data) => {
      if (err) {
        res.json({
          code: 0,
          msg: '失败'
        });
        return
      }
      if (data.affectedRows) {
        res.json({
          code: 200,
          msg: '发布成功'
        })
      }
    })
  }
});

router.post('/deleteNews', (req, res) => { //删除新闻
  const id = req.query.id;
  sql('DELETE FROM news WHERE id=?', [id], (err,data) => {
    if (err) {
      res.json({
        code: 0,
        msg: '失败'
      });
      return
    }
    if(data.affectedRows){
      res.json({
        code: 200,
        msg: '删除成功'
      })
    }
  });
});

router.get('/getProducts', (req, res) => { // 查询产品列表
  let sqlCode = ''
  let id = req.query.id
  id ? sqlCode = 'select * from products where id=?' : sqlCode = 'select id,date,title,spell,introduce from products order by id desc'
  sql(sqlCode,[id], (err, data) => {
    if (err) {
      res.json({
        code: 0,
        msg: '数据查询失败'
      });
      return
    }
    if (data) {
      res.json({
        code: 200,
        data: data
      })
    }
  })
});

router.get('/getProductDetail', (req, res) => { // 产品详情
  const id = req.query.id
  sql('select * from products where id=?', [id], (err, data) => {
    if (err) {
      res.json({
        code: 0,
        msg: '数据查询失败'
      });
      return
    }
    if (data) {
      res.json({
        code: 200,
        data: data
      })
    }
  })
})

router.post('/product', (req, res) => { // 发布产品
  const [id, title, subtitle, date, content, spell, introduce, poster] = [req.body.id, req.body.title, req.body.subtitle, req.body.date, req.body.content, req.body.spell, req.body.introduce, req.body.poster];
  if ((id * 1) + 1) {
    sql('update products set title=?,subtitle=?,date=?,content=?,spell=?,introduce=?,poster=? where id=?',
      [title,subtitle,date,content,spell,introduce,poster,id], (err, data) => {
      if (err) {
        res.json({
          code: 0,
          msg: '失败'
        });
        return
      }
      if (data.affectedRows) {
        res.json({
          code: 200,
          msg: '发布成功'
        })
      }
    })
  } else {
    sql('INSERT INTO products (id, title, subtitle, date, content, spell, introduce, poster) VALUES (0,?,?,?,?,?,?,?)', [title, subtitle, date, content, spell, introduce, poster], (err, data) => {
      if (err) {
        res.json({
          code: 0,
          msg: '失败'
        });
        return
      }
      if (data.affectedRows) {
        res.json({
          code: 200,
          msg: '发布成功'
        })
      }
    })
  }
});

router.post('/deleteProduct', (req, res) => { //删除产品
  const id = req.query.id;
  sql('DELETE FROM products WHERE id=?', [id], (err,data) => {
    if (err) {
      res.json({
        code: 0,
        msg: '失败'
      });
      return
    }
    if(data.affectedRows){
      res.json({
        code: 200,
        msg: '删除成功'
      })
    }
  });
});

router.get('/getPages', (req, res) => { // 获取页面
  const [level] = [req.query.level];
  if (level) {
    sql(`select * from pages where level=?`,[level], (err, data) => {
      if (err) {
        res.json({
          code: 0,
          msg: '失败'
        });
        return
      }
      if (data) {
        res.json({
          code: 200,
          data: data
        })
      }
    })
  } else {
    sql(`select id,date,title,level,parent,router from pages`, (err, data) => {
      if (err) {
        res.json({
          code: 0,
          msg: '失败'
        });
        return
      }
      if (data) {
        format();
        function format () {
          data.forEach((item, index)=> {
            if (item.parent != '无' && typeof item.parent === 'string') {
              var child = item;
              data.splice(index, 1)
              data.forEach(_item => {
                if (_item.title === child.parent) {
                  if (_item.parent === '无') {
                    _item.parent = [];
                  }
                  _item.parent.push(child)
                  format();
                }
              })
            }
          })
        }
        res.json({
          code: 200,
          data: data
        })
      }
    })
  }
});

router.post('/pages', (req, res) => {
  let [id, title, date, content, parent, level, router] = [req.body.id, req.body.title, req.body.date, req.body.content, req.body.parent, req.body.level, req.body.router]
  level = parent == '无' ? '1' : '2'
  if (id * 1 + 1) {
    sql('update pages set title=?,date=?,content=?,parent=?,level=?,router=? where id=?',
      [title,date,content,parent,level,router,id], (err, data) => {
      if (err) {
        res.json({
          code: 0,
          msg: '失败'
        });
        return
      }
      if (data.affectedRows) {
        res.json({
          code: 200,
          msg: '发布成功'
        })
      }
    })
  } else {
    sql('INSERT INTO pages (id, title, date, content, parent, level, router) VALUES (0,?,?,?,?,?,?)', [title, date, content, parent, level, router], (err, data) => {
      if (err) {
        res.json({
          code: 0,
          msg: '失败'
        });
        return
      }
      if (data.affectedRows) {
        res.json({
          code: 200,
          msg: '发布成功'
        })
      }
    })
  }
});

router.get('/getPageDetail', (req, res) => {
  const id = req.query.id;
  sql('select * from pages where id=?',[id], (err,data) =>{
    if (err) {
      res.json({
        code: 0,
        msg: '失败'
      });
      return
    }
    if (data) {
      sql('select * from pages', (allDataErr, allData) => {
        if (allDataErr) {
          res.json({
            code: 0,
            msg: '失败'
          });
          return
        }
        data = data[0]
        if (allData) {
          allData.forEach(item => {
            if (item.parent === data.title) {
              if (data.parent === '无') {
                data.parent = [];
              }
              data.parent.push(item)
            }
          })
          res.json({
            code: 200,
            data: data
          })
        }
      })
    }
  })
})

router.post('/deletePages', (req, res) => {
  const id = req.query.id
  sql('DELETE FROM pages WHERE id = ?', [id], (err, data) => {
    if (err) {
      res.json({
        code: 0,
        msg: '失败'
      });
      return
    }
    if(data.affectedRows){
      res.json({
        code: 200,
        msg: '删除成功'
      })
    }
  })
})

router.get('/getBannerList', (req, res) => { // 获取banner列表
  sql('select id, name, url from banner order by id desc', (err, data) => {
    if (err) {
      res.json({
        code: 0,
        msg: '失败'
      });
      return
    }
    if (data) {
      res.json({
        code: 200,
        data: data
      })
    }
  })
});

router.post('/banner/upload', upload.array('file',12), (req, res) => { // 上传banner图片
  req.files.forEach(function (item) {
    let url = 'http://' + req.headers.host.split(':')[0] + '/api/public/upload/' + item.filename, // https此处更换
      name = item.filename,
      date = new Date().toLocaleString().substring(0,10),
      type = item.mimetype;
    if (type != 'image/png' && type != 'image/jpeg' && type != 'image/jpg') return;
    sql('INSERT INTO banner (id, url, name, type, date) VALUES (0,?,?,?,?)',[url,name,type,date],(err,data)=>{
      if(err){
        res.json({
          code: 0,
          msg: '错误'
        });
        return
      }
      if (data.affectedRows) {
        res.json({
          code: 200,
          msg: '成功'
        })
      }
    });
  });
});

router.post('/poster/upload', upload.array('file',12), (req, res) => { // 封面上传
  const poster = `http://${req.headers.host.split(':')[0]}/api/public/upload/${req.files[0].filename}`
  if (!poster) return
  res.json({
    code: 200,
    img: poster
  })
});

router.post('/banner/delete', (req, res) => { // 删除banner
  const id = req.body.id;
  const fileName = req.body.fileName;
  sql('DELETE FROM banner WHERE id=?', [id], (err, data) => {
    if(err){
      res.json({
        code: 0,
        msg: '错误'
      });
      return
    }
    fs.unlink(process.cwd() + '/public/upload/' + fileName, function (err) {
      if (err){
        res.send('err');
        return
      }
    });
    if (data.affectedRows) {
      res.json({
        code: 200,
        msg: '成功'
      })
    }
  })
});

router.get('/getContact', (req, res) => {
  sql('select * from contact', (err, data) => {
    if(err){
      res.json({
        code: 0,
        msg: '错误'
      });
      return
    }
    if (data) {
      res.json({
        code: 200,
        data: data
      })
    }
  })
})

router.post('/setContact', (req, res) => { // 创建联系数据
  const date = new Date().toLocaleDateString()
  const [name,email,phone,message] = [req.body.name,req.body.email,req.body.phone,req.body.message]
  sql('INSERT INTO contact (id,name,email,phone,message,date) VALUES (0,?,?,?,?,?)', [name,email,phone,message,date], (err, data) =>{
    if(err){
      res.json({
        code: 0,
        msg: '错误'
      });
      return
    }
    if (data.affectedRows) {
      res.json({
        code: 200,
        msg: '成功'
      })
    }
  })
})

router.use("/checkUser",require('./checkUser'));
router.use("/login",require('./login'));
router.use("/register",require('./register'));
router.use("/logout",(req,res)=>{
  res.clearCookie('login');
});
module.exports = router
