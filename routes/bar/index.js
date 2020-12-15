const express = require('express');
const router = express.Router();
const db = require('../../models')

router.get('/', function(req, res) {
    if (req.isAuthenticated()) {
        console.log("authenticated")
        var user = {
            user: req.session.passport.user,
            isLoggedIn: req.isAuthenticated()
        }
        res.render('bar', user);
    } else {
        console.log("boop")
    }
    });
router.get('/reichenbach', (function(req, res) {
    db.Color.find({'companyCode': "reichenbach", 'type': 'bar'}).lean()
        .then((data) => {
            const user = {
                user: req.session.passport.user,
                isLoggedIn: req.isAuthenticated(),
                bar:data
            };
            //console.log(user)
            res.render('bar', user);
        })
}))
router.get('/kugler', (function(req, res) {
    db.Color.find({'companyCode': "kugler", 'type': 'bar'}).lean()
        .then((data) => {
            const user = {
                user: req.user,
                isLoggedIn: req.isAuthenticated(),
                bar:data
            };
            //console.log(user)
            res.render('bar', user);
        })
}))
router.get('/gaffer', (function(req, res) {
    db.Color.find({'companyCode': "gaffer", 'type': 'bar'}).lean()
        .then((data) => {
            const user = {
                user: req.user,
                isLoggedIn: req.isAuthenticated(),
                bar:data
            };
            //console.log(user)
            res.render('bar', user);
        })
}))
router.get('/zimmerman', (function(req, res) {
    db.Color.find({'companyCode': "zimmerman", 'type': 'bar'}).lean()
        .then((data) => {
            const user = {
                user: req.user,
                isLoggedIn: req.isAuthenticated(),
                bar:data
            };
            //console.log(user)
            res.render('bar', user);
        })
}))
// route for updating existing R bar record using mongo CRUD ops
router.post('/:companyCode/:id/add', (req, res) => {
    //console.log('route clicked');
    console.log('input date ' + req.params.date);
    var date = new Date(req.params.date);
    console.log('date ' + date);
    const addTo = req.body.weightIn;
    //console.log(addTo);
    const id = req.params.id;
    //console.log(id);
    db.Color.find({'_id' : id}).lean()
        .then(data => {
            //console.log('starting weight ' + data);
            const adjustmentStarting = data[0].totalQuantityAdjusted;
            const adjustmentEnding = parseFloat(adjustmentStarting) + parseFloat(addTo);
            const startingWeight = data[0].weight
            const returnAddress = data[0].type;
            const companyCode = data[0].companyCode;
            const returnWeight = parseFloat(startingWeight) + parseFloat(addTo);
            //console.log(typeof returnWeight);
            db.Color.updateOne({"_id" : id}, {$set: {"weight":parseFloat(returnWeight), "lastUpdate": Date.now(), "totalQuantityAdjusted":adjustmentEnding}})
                .then(data => console.log(data))
                .catch(err => console.log('db update error' + err))
            res.redirect('/' + returnAddress + '/' + companyCode);
        }).catch(err => console.log('db find error ' + err))
})
// route for updating existing R bar record using mongo CRUD ops
router.post('/:companyCode/:id/subtract', (req, res) => {
    //console.log('route clicked');
    const subtractFrom = req.body.weightOut;
    //console.log(subtractFrom);
    const id = req.params.id;
    //console.log(id);
    db.Color.find({'_id' : id}).lean()
        .then(data => {
            //console.log('starting weight ' + data);
            const adjustmentStarting = data[0].totalQuantityAdjusted;
            const adjustmentEnding = parseFloat(adjustmentStarting) - parseFloat(subtractFrom);
            const companyCode = data[0].companyCode;
            const returnAddress = data[0].type;
            const startingWeight = parseFloat(data[0].weight);
            const returnWeight = parseFloat(startingWeight) - parseFloat(subtractFrom);
            db.Color.updateOne({"_id" : id}, {$set: {"weight":parseFloat(returnWeight), "lastUpdate":Date.now(), "totalQuantityAdjusted":adjustmentEnding}})
                .then(res => console.log(res))
                .catch(err => console.log('db update error' + err))
            res.redirect('/' + returnAddress + '/' + companyCode);
        }).catch(err => console.log('db find error ' + err))
})




module.exports = router;
