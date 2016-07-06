// app/routes.js
var passport = require('passport');
var mongoose = require('mongoose');
var Classified = mongoose.model('Classified');
var User = mongoose.model('User');
var jwt = require('express-jwt');

var auth = jwt({ secret: 'SECRET', userProperty: 'payload'});

module.exports = function(app, router) {

    // server routes ===========================================================
    // handle things like api calls
    // authentication routes

    // sample api route
    router.route('/')
        .get(function(req, res) {
            res.json({ message: 'hooray! welcome to our api!' });
        });

    router.route('/register')
        .post(function(req, res) {
            if (!req.body.username || !req.body.password || !req.body.email || !req.body.firstName || !req.body.lastName) {
                return res.status(400).json({message: 'Please fill all the fields!'});
            };

            var user = new User(req.body);

            // user.username = req.body.username;
            // user.email = req.body.email;
            // user.firstName = req.body.firstName;
            // user.lastName = req.body.lastName;
            // user.phone = req.body.phone;
            user.setPassword(req.body.password);

            user.save(function(err, user) {
                if (err)
                    res.send(err);
                res.json({ token: user.generateJWT()});
            });
        });

    router.route('/login')
        .post(function(req, res) {
            if (!req.body.username || !req.body.password) {
                return res.status(400).json({ message: 'Please fill all the fields!' });
            };

            passport.authenticate('local', function(err, user, info) {
                if (err)
                    res.send(err);
                if (user) {
                    return res.json({ token: user.generateJWT() });
                } else {
                    return res.status(401).json(info);
                };
            })(req, res);
        });

    router.route('/users')
        .get(function(req, res) {
            User.find(function(err, users) {
                if (err)
                    res.send(err);
                res.json(users);
            });
        });

    router.route('/classifieds')
        .post(function(req, res) {
            var classified = new Classified(req.body);

            classified.save(function(err, classified) {
                if (err)
                    res.send(err);
                res.json(classified);
            });
        })
        .get(function(req, res) {
            Classified.find(function(err, classifieds) {
                if (err)
                    res.send(err);
                res.json(classifieds);
            });
        });

    router.route('/classifieds/:id')
        .put(function(req, res) {
            Classified.findById(req.params.id, function(err, classified) {
                classified.title = req.body.title;
                classified.price = req.body.price;
                classified.description = req.body.description;
                classified.categories = req.body.categories;
                classified.image = req.body.image;
                classified.updated = Date.now();
                classified.save(function(err) {
                    if (err)
                        res.send(err);
                    res.json({message: "Classified updated!"});
                });
            });
        })
        .delete(function(req, res) {
            Classified.remove({
                _id: req.params.id
            }, function(err, classified) {
                if (err)
                    res.send(err);
                res.json({message: "Deleted successfully!"});
            });
        });

    // REGISTER OUR ROUTES -------------------------------
    // all of our routes will be prefixed with /api
    app.use('/api', router);

    // frontend routes =========================================================
    // route to handle all angular requests
    app.get('*', function(req, res) {
        res.sendfile('./public/views/index.html'); // load our public/index.html file
    });

};