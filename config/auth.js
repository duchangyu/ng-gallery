
var authLocal = {

  'facebookAuth' : {
    'clientID'      : '<replace with clientId>',
    'clientSecret'  : '<replace with clientSecret>',
    'callbackURL'   : 'http://localhost:3000/node/ng-gallery/api/auth/facebook/callback'
  },

  'googleAuth' : {
    'clientID'      : '<replace with clientId>',
    'clientSecret'  : '<replace with clientSecret>',
    'callbackURL'   : 'http://localhost:3000/node/ng-gallery/api/auth/google/callback'
  },

  'githubAuth' : {
    'clientID'      : '<replace with clientId>',
    'clientSecret'  : '<replace with clientSecret>',
    'callbackURL'   : 'http://localhost:3000/node/ng-gallery/api/auth/github/callback'
  },

  'linkedInAuth' : {
    'clientID'      : '<replace with clientId>',
    'clientSecret'  : '<replace with clientSecret>',
    'callbackURL'   : 'http://localhost:3000/node/ng-gallery/api/auth/linkedin/callback'
  }
};

var authProduction = {

  'facebookAuth' : {
    'clientID'      : '<replace with clientId>',
    'clientSecret'  : '<replace with clientSecret>',
    'callbackURL'   : 'http://viewer.autodesk.io/node/ng-gallery/api/auth/facebook/callback'
  },

  'googleAuth' : {
    'clientID'      : '<replace with clientId>',
    'clientSecret'  : '<replace with clientSecret>',
    'callbackURL'   : 'http://viewer.autodesk.io/node/ng-gallery/api/auth/google/callback'
  },

  'githubAuth' : {
    'clientID'      : '<replace with clientId>',
    'clientSecret'  : '<replace with clientSecret>',
    'callbackURL'   : 'http://viewer.autodesk.io/node/ng-gallery/api/auth/github/callback'
  },

  'linkedInAuth' : {
    'clientID'      : '<replace with clientId>',
    'clientSecret'  : '<replace with clientSecret>',
    'callbackURL'   : 'http://viewer.autodesk.io/node/ng-gallery/api/auth/linkedin/callback'
  }
};

module.exports = authLocal;
//module.exports = authProduction;