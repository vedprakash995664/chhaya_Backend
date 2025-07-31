const express = require('express');
const router = express.Router();
const {
  addCallingTeam,
  getCallingTeam,
  updateCallingTeam,
  deleteCallingTeam,
  loginCallingTeam,
  getCallingTeamByAddedBy
} = require('../Controller/callingTeamController');

router.post('/add', addCallingTeam);
router.get('/all', getCallingTeam);
router.put('/update/:id', updateCallingTeam);
router.delete('/delete/:id', deleteCallingTeam);
router.post('/login', loginCallingTeam);
router.get('/get-by-addedBy/:addedById',getCallingTeamByAddedBy);
module.exports = router;
