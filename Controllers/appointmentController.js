const express = require('express');
var router = express.Router();
const mongoose = require('mongoose');
const Appointment = mongoose.model('Appointment');

router.get('/', (req, res) => {
    res.render("appointment/addOrEdit", {
        viewTitle: "Insert Appointment"
    });
});

router.post('/', (req, res) => {
    if (req.body._id == '')
        insertRecord(req, res);
        else
        updateRecord(req, res);
});


function insertRecord(req, res) {
    var appointment = new Appointment();
    appointment.fullName = req.body.fullName;
    appointment.email = req.body.email;
    appointment.mobile = req.body.mobile;
    appointment.city = req.body.city;
    appointment.save((err, doc) => {
        if (!err)
            res.redirect('appointment/list');
        else {
            if (err.name == 'ValidationError') {
                handleValidationError(err, req.body);
                res.render("appointment/addOrEdit", {
                    viewTitle: "Insert Appointment",
                    appointment: req.body
                });
            }
            else
                console.log('Error during record insertion : ' + err);
        }
    });
}

function updateRecord(req, res) {
  Appointment.findOneAndUpdate({ _id: req.body._id }, req.body, { new: true }, (err, doc) => {
        if (!err) { res.redirect('appointment/list'); }
        else {
            if (err.name == 'ValidationError') {
                handleValidationError(err, req.body);
                res.render("appointment/addOrEdit", {
                    viewTitle: 'Update appointment',
                    appointment: req.body
                });
            }
            else
                console.log('Error during record update : ' + err);
        }
    });
}


router.get('/list', (req, res) => {
  Appointment.find((err, docs) => {
        if (!err) {
          res.render("appointment/list", {
            list: docs.map(doc => doc.toJSON())
    });
        }
        else {
            console.log('Error in retrieving appointment list :' + err);
        }
    });
});
router.get('/ResourceSchedules/ResourceView', (req, res) => {
  Appointment.find((err, docs) => {
        if (!err) {
          res.render("ResourceSchedules/Resourceview", {
            list: docs.map(doc => doc.toJSON())
    });
        }
        else {
            console.log('Error in retrieving appointment list :' + err);
        }
    });
});



function handleValidationError(err, body) {
    for (field in err.errors) {
        switch (err.errors[field].path) {
            case 'fullName':
                body['fullNameError'] = err.errors[field].message;
                break;
            case 'email':
                body['emailError'] = err.errors[field].message;
                break;
            default:
                break;
        }
    }
}

router.get('/:id', (req, res) => {
  Appointment.findById(req.params.id, (err, doc) => {
        if (!err) {
            res.render("appointment/addOrEdit", {
                viewTitle: "Update Appointment",
                appointment: doc.toJSON()
            });
        }
    });
});

router.get('/delete/:id', (req, res) => {
  Appointment.findByIdAndRemove(req.params.id, (err, doc) => {
        if (!err) {
            res.redirect('/appointment/list');
        }
        else { console.log('Error in appointment delete :' + err); }
    });
});

module.exports = router;