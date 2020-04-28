const models = require('../models');

const {
  Account,
} = models;

//renders login page 
const loginPage = (req, res) => {
  res.render('login', {
    csrfToken: req.csrfToken(),
  });
};

//renders sign up page
const signupPage = (req, res) => {
  res.render('signup', {
    csrfToken: req.csrfToken(),
  });
};

//renders account settings page 
const accountPage = (req, res) => {
  res.render('account', {
    csrfToken: req.csrfToken(),
  });
};

//logs out user 
const logout = (req, res) => {
  req.session.destroy();
  res.redirect('/');
};

//validates login
const login = (request, response) => {
  const req = request;
  const res = response;

  // force cast to strings to cover some security flaws
  const username = `${req.body.username}`;
  const password = `${req.body.pass}`;

  if (!username || !password) {
    return res.status(400).json({
      error: 'All fields are required.',
    });
  }

  return Account.AccountModel.authenticate(username, password, (err, account) => {
    if (err || !account) {
      return res.status(401).json({
        error: 'Wrong username or password.',
      });
    }

    req.session.account = Account.AccountModel.toAPI(account);

    return res.json({
      redirect: '/maker',
    });
  });
};

//adds a new user account and auto logs them in 
const signup = (request, response) => {
  const req = request;
  const res = response;

  // cast to strings to cover some security flaws
  req.body.username = `${req.body.username}`;
  req.body.pass = `${req.body.pass}`;
  req.body.pass2 = `${req.body.pass2}`;

  if (!req.body.username || !req.body.pass || !req.body.pass2) {
    return res.status(400).json({
      error: 'All fields are required.',
    });
  }

  if (req.body.pass !== req.body.pass2) {
    return res.status(400).json({
      error: 'Passwords do not match.',
    });
  }

  return Account.AccountModel.generateHash(req.body.pass, (salt, hash) => {
    const accountData = {
      username: req.body.username,
      salt,
      password: hash,
    };

    const newAccount = new Account.AccountModel(accountData);
    const savePromise = newAccount.save();

    savePromise.then(() => {
      req.session.account = Account.AccountModel.toAPI(newAccount);
      return res.json({
        redirect: '/maker',
      });
    });

    savePromise.catch((err) => {
      console.log(err);

      if (err.code === 11000) {
        return res.status(400).json({
          error: 'Username already in use.',
        });
      }

      return res.status(400).json({
        error: 'An error occurred.',
      });
    });
  });
};

const getToken = (request, response) => {
  const req = request;
  const res = response;

  const csrfJSON = {
    csrfToken: req.csrfToken(),
  };

  res.json(csrfJSON);
};

// changes an account password
const changePassword = (request, response) => {
  const req = request;
  const res = response;

    console.log(req.body);
    
  if (!req.body.pass || !req.body.pass2) {
    return res.status(400).json({
      error: 'All fields are required.',
    });
  }

  if (req.body.pass !== req.body.pass2) {
    return res.status(400).json({
      error: 'Passwords do not match.',
    });
  }

  // encrypts the new password
  Account.AccountModel.generateHash(req.body.pass, (salt, hash) => {
    const accountData = {
      username: req.session.account.username,
      salt,
      password: hash,
    };

    // get the username for searching
    const search = {
      username: req.session.account.username,
    };
    // replaces the old password with the new one
    Account.AccountModel.collection.replaceOne(search, accountData);
  });
  return res.status(200).json({
    message: 'Password successfully changed.',
  });
};

// sets an account to premium
const goPremium = (req, res) => {
  const search = {
    _id: req.session.account._id,
  };

  Account.AccountModel.updateOne(search, { $set: { premium: true } }).then(() => {
    Account.AccountModel.find(search).then((data2) => {
      console.log(data2);
      return res.status(200).json({ message: 'Set account to premium.' });
    });
  });
};

// checks if the session user is premium
const checkPremium = (req, res) => {
  const search = {
    _id: req.session.account._id,
  };
  Account.AccountModel.find(search).then((data) => {
    console.log(data.premium);
    return res.status(200).json({ user: data });
  });
};


// redirects to the not found page
const getNotFound = (req, res) => {
  res.redirect('/getNotFoundPage');
};

// loads the not found page
const getNotFoundPage = (req, res) => {
  res.render('notFound', {
    csrfToken: req.csrfToken(),
  });
};

module.exports.getNotFound = getNotFound;
module.exports.getNotFoundPage = getNotFoundPage;
module.exports.loginPage = loginPage;
module.exports.login = login;
module.exports.logout = logout;
module.exports.signupPage = signupPage;
module.exports.signup = signup;
module.exports.getToken = getToken;
module.exports.accountPage = accountPage;
module.exports.changePassword = changePassword;
module.exports.goPremium = goPremium;
module.exports.checkPremium = checkPremium;
