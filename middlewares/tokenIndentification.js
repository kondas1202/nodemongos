const jwt = require('jsonwebtoken');

exports.tokenIdentification = async (req, res, next) => {
          let token;
          if (req.headers.client === 'not-browser') {
                    token = req.headers.authorization
          } else {
                    token = req.cookies['token'];
          }

          if (!token) {
                    return res.status(401).json({
                              success: false,
                              message: 'Unauthorized',
                    });
          }

          try {
                    const userToken = token
                    const decoded = jwt.verify(userToken, process.env.JWT_SECRET);
                    if (decoded) {
                              req.user = decoded
                              next()
                    } else {
                              return res.status(401).json({
                                        success: false,
                                        message: 'Error in token verification',
                              });
                    }
          } catch (error) {
                    return res.status(401).json({
                              success: false,
                              message: 'Unauthorized',
                    });
          }
}
