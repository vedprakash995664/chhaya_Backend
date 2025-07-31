// routes/SettingRoutes/zoneRoutes.js
const express = require('express');
const router = express.Router();
const zoneController = require('../../Controller/SettingControllers/ZoneController');

// No auth middleware
router.post('/add', zoneController.addZone);
router.get('/', zoneController.getZones);
router.put('/:id', zoneController.updateZone);
router.delete('/:id', zoneController.deleteZone);

module.exports = router;
