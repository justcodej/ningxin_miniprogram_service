const express = require('express'), router = express.Router(), jwt = require('jsonwebtoken');

router.post('/', (req, res) => {
  const token = req.body.accessToken
  const secretOrPrivateKey = 'set_user'
  jwt.verify(token, secretOrPrivateKey, (err, decode) => {
    if (err) {
      res.json({
        code: 0,
        msg: err.message,
        result: err
      })
    } else {
      res.json({
        code: 200,
        result: decode
      })
    }
  })
})

module.exports = router;
