// controllers/SettingControllers/ZoneController.js
const Zone = require('../../Models/SettingsModel/Zone');

exports.addZone = async (req, res) => {
  try {
    const { zoneName, zoneAddedBy } = req.body;

    if (!zoneName || !zoneAddedBy) {
      return res.status(400).json({ message: 'Zone name and zoneAddedBy are required' });
    }

    const newZone = new Zone({ zoneName, zoneAddedBy });
    await newZone.save();
    res.status(201).json({ message: 'Zone added' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error adding zone' });
  }
};

exports.getZones = async (req, res) => {
  try {
    const { search } = req.query;
    const baseCondition = { deleted: false };
    const searchCondition = search
      ? { zoneName: new RegExp(search, 'i') }
      : {};

    const zones = await Zone.find({ ...baseCondition, ...searchCondition })
      .populate('zoneAddedBy')
      .sort({ createdAt: -1 });

    res.json(zones);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching zones' });
  }
};

exports.updateZone = async (req, res) => {
  try {
    const { id } = req.params;
    const { zoneName } = req.body;

    const updated = await Zone.findByIdAndUpdate(id, { zoneName }, { new: true });
    if (!updated) return res.status(404).json({ message: 'Zone not found' });

    res.json({ message: 'Zone updated' });
  } catch (err) {
    res.status(500).json({ message: 'Update failed' });
  }
};

exports.deleteZone = async (req, res) => {
  try {
    const { id } = req.params;
    await Zone.findByIdAndUpdate(id, { deleted: true });
    res.json({ message: 'Zone deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Delete failed' });
  }
};
