const User = require('../models/User');
const bcrypt = require('bcrypt');

exports.register = async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = new User({ username, password });
    await user.save();
    req.session.user = user;
    res.redirect('/login.html');
  } catch (err) {
    res.status(400).send('User already exists or invalid data');
  }
};

exports.login = async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username });
    const valid = user && await bcrypt.compare(password, user.password);
    if (valid) {
  req.session.user = user;
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
      <title>Welcome</title>
      <style>
        body {
          margin: 0;
          padding: 0;
          font-family: 'Segoe UI', sans-serif;
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100vh;
          background: linear-gradient(to right, #00c6ff, #0072ff);
        }
        .message-box {
          background-color: white;
          padding: 40px;
          border-radius: 15px;
          box-shadow: 0 8px 20px rgba(0,0,0,0.2);
          text-align: center;
        }
        .message-box h1 {
          color: #0072ff;
          font-size: 28px;
          margin-bottom: 10px;
        }
        .message-box p {
          font-size: 16px;
          color: #333;
        }
      </style>
    </head>
    <body>
      <div class="message-box">
        <h1>Welcome, ${user.username}</h1>
        <p>You have successfully logged in.</p>
      </div>
    </body>
    </html>
  `);
}
 else {
      res.status(401).send('Invalid credentials');
    }
  } catch (err) {
    res.status(500).send('Something went wrong');
  }
};
