var passport = require('passport');
var Account = require('./models/account');

module.exports = function(app) {

    app.get('/', function(req, res) {
        res.render('index', {
            user: req.user
        });
    });
    
    

    app.get('/users', function(req, res) {
        Account.find({}, 'username email', function(err, accounts) {
            if (err) {
                res.send(err);
            }
            res.send(accounts);
        });
    });

    app.get('/users/:username', function(req, res) {
        Account.findOne({
            username: req.params.username
        },  'username email', function(err, account) {
            if (err) {
                res.send(err);
            }
            res.send(account);
        });
    });

    app.post('/users', function(req, res) {
        //if user exists, 

        var account = new Account({
            username: req.body.username,
            email: req.body.email
        });
        Account.register(account, req.body.password, function(err, account) {
            if (err) {
                return res.send(err);
            }

            passport.authenticate('local')(req, res, function() {
                account.salt = null;
                account.hash = null;
                res.send(account);
            });
        });
    });

    app.delete('/users/:username', function(req, res) {
        Account.remove({
            username: req.params.username
        }, function(err) {
            if (err) {
                return res.send(err);
            }
            res.send('deleted');
        });
    });

    app.get('/login', function(req, res) {
        res.render('login', {
            user: req.user
        });
    });

    app.post('/login', passport.authenticate('local'), function(req, res) {
        res.redirect('/');
    });

    app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });

    app.get('/ping', function(req, res) {
        res.send("pong!", 200);
    });

};
