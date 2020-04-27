const controllers = require('./controllers');
const mid = require('./middleware');

const router = (app) => {
  app.get('/getToken', mid.requiresSecure, controllers.Account.getToken);
  app.get('/getChars', mid.requiresLogin, controllers.Char.getCharacters);
  app.get('/login', mid.requiresSecure, mid.requiresLogout, controllers.Account.loginPage);
  app.post('/login', mid.requiresSecure, mid.requiresLogout, controllers.Account.login);
  app.get('/account', mid.requiresLogin, controllers.Account.accountPage);
  app.post('/changePassword', mid.requiresLogin, controllers.Account.changePassword);
  app.get('/signup', mid.requiresSecure, mid.requiresLogout, controllers.Account.signupPage);
  app.post('/signup', mid.requiresSecure, mid.requiresLogout, controllers.Account.signup);
  app.get('/logout', mid.requiresLogin, controllers.Account.logout);
  app.get('/maker', mid.requiresLogin, controllers.Char.makerPage);
  app.get('/game', mid.requiresLogin, controllers.Char.gamePage);
  app.post('/maker', mid.requiresLogin, controllers.Char.make);
  app.post('/remove', mid.requiresLogin, controllers.Char.remove);
  app.post('/levelUp', mid.requiresLogin, controllers.Char.levelUp);
  app.get('/', mid.requiresSecure, mid.requiresLogout, controllers.Account.loginPage);
  app.get('/getNotFoundPage', controllers.Account.getNotFoundPage);
  app.get('/*', controllers.Account.getNotFound);
};

module.exports = router;
