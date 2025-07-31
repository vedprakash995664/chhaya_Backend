const express = require('express');
const router = express.Router();
const { addSMM, getSMM, updateSMM, deleteSMM, SMMLogin } = require('../Controller/ssmController');

router.post('/add', addSMM);
router.get('/', getSMM);
router.post('/login', SMMLogin);
router.put('/:id', updateSMM);
router.delete('/:id', deleteSMM);


module.exports = router;
