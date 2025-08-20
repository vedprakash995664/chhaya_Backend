const Lead = require('../Models/ContactsModel');
const ClientForm =require('../Models/ClientForm')

exports.uploadLeads = async (req, res) => {
  try {
    const { numbers, zone, uploadedBy, transferredTo, transferredDate } = req.body;

    if (!numbers || !Array.isArray(numbers) || numbers.length === 0) {
      return res.status(400).json({ message: 'Numbers are required' });
    }
    if (!zone || !uploadedBy || !transferredTo || !transferredDate) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Filter duplicates
    const existingLeads = await Lead.find({ number: { $in: numbers } }).select('number');
    const existingNumbers = existingLeads.map(lead => lead.number);

    const uniqueNumbers = numbers.filter(num => !existingNumbers.includes(num));

    const leadsToInsert = uniqueNumbers.map(num => ({
      number: num,
      zone,
      uploadedBy,
      transferredTo,
      transferredDate
    }));

    if (leadsToInsert.length > 0) {
      await Lead.insertMany(leadsToInsert);
    }

    return res.status(200).json({
      message: 'Leads uploaded successfully',
      inserted: leadsToInsert.length,
      duplicates: existingNumbers,
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
};



exports.getLeads = async (req, res) => {
  try {
    const { search } = req.query;

    let query = { };

    // Optional: basic search by mobile number
    if (search) {
      query.number = new RegExp(search, 'i'); // case-insensitive partial match
    }

    const leads = await Lead.find(query)
      .populate('zone')
      .populate('uploadedBy')
      .populate('transferredTo')
      .sort({ createdAt: -1 });

    res.status(200).json(leads);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch leads' });
  }
};

exports.getPassportHolderLeads = async (req, res) => {
  try {
    const { search } = req.query;
    const { assignedToId } = req.params; // get AssignedTO from URL params
    let query = {
      status: 'Passport Holder',          // only Client status
      AssignedTO: assignedToId   // match AssignedTO with given id
    };

    // Optional: search by mobile number
    if (search) {
      query.number = new RegExp(search, 'i');
    }

    const leads = await Lead.find(query)
      .populate('zone')
      .populate('uploadedBy')
      .populate('transferredTo')
      .populate('AssignedTO') // populate calling team details
      .sort({ createdAt: -1 });

    res.status(200).json(leads);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch leads' });
  }
};


  

// GET /api/contact/get-assigned-leads/:assignedToId
exports.getLeadsByAssignedTo = async (req, res) => {
  try {
    const { assignedToId } = req.params;
    const { page = 1, limit = 10, search = '' } = req.query;
    
    const skip = (page - 1) * limit;
    
    let query = { AssignedTO: assignedToId };
    
    // Add search functionality
    if (search) {
      query.$or = [
        { number: { $regex: search, $options: 'i' } },
        { 'zone.zoneName': { $regex: search, $options: 'i' } },
        { 'AssignedBy.name': { $regex: search, $options: 'i' } },
        { status: { $regex: search, $options: 'i' } }
      ];
    }
    
    const [leads, total] = await Promise.all([
      Lead.find(query)
        .populate('zone')
        .populate('uploadedBy')
        .populate('transferredTo')
        .populate('AssignedTO')
        .populate('AssignedBy')
        .sort({ AssignedDate: -1 })
        .skip(skip)
        .limit(limit),
        
      Lead.countDocuments(query)
    ]);
    
    res.status(200).json({
      leads,
      total,
      page: Number(page),
      pages: Math.ceil(total / limit)
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch assigned leads' });
  }
};


// POST /api/contact/assign-leads
exports.assignLeads = async (req, res) => {
  try {
    const { leadIds, callingTeamId, staffHeadId } = req.body;

    if (!leadIds || !Array.isArray(leadIds) || leadIds.length === 0) {
      return res.status(400).json({ message: 'leadIds are required' });
    }
    if (!callingTeamId || !staffHeadId) {
      return res.status(400).json({ message: 'CallingTeamId and StaffHeadId are required' });
    }

    const result = await Lead.updateMany(
      { _id: { $in: leadIds } },
      {
        AssignedTO: callingTeamId,
        AssignedBy: staffHeadId,
        AssignedDate: new Date(),
      }
    );

    res.status(200).json({
      message: `Assigned ${result.modifiedCount} leads successfully`,
    });
  } catch (err) {
    console.error('Assign error:', err);
    res.status(500).json({ message: 'Failed to assign leads' });
  }
};


exports.ApplyForInterview = async (req, res) => {
  const { leadId, callingTeamId, interviewManagerId } = req.body;

  try {
    // Basic validation
    if (!leadId) return res.status(400).json({ message: "Lead ID is required" });
    if (!callingTeamId) return res.status(400).json({ message: "Calling Team ID is required" });
    if (!interviewManagerId) return res.status(400).json({ message: "Interview Manager ID is required" });

    // Check lead
    const lead = await Lead.findById(leadId);
    if (!lead) return res.status(404).json({ message: "Lead not found" });

    // Must have passport
    if (!lead.passportNumber) {
      return res.status(400).json({ message: "Lead must have a passport number" });
    }

    // Only passport holders
    if (lead.status !== "Passport Holder") {
      return res.status(400).json({ message: "Only passport holders can apply for interview" });
    }

    // Already applied check
    if (lead.InterviewManager) {
      return res.status(400).json({ message: "Interview already applied for this lead" });
    }

    // Update lead directly
    const updatedLead = await Lead.findByIdAndUpdate(
      leadId,
      {
        InterviewManager: interviewManagerId,
        InterviewAppliedBy: callingTeamId,
        InterviewApplyDate: new Date(),
        InterviewStatus: "Applied",
      },
      { new: true }
    );

    const clientForm=await ClientForm.findOne({leadId:id})
    
    if(clientForm){
      clientForm.InterviewStatus='Applied'
      await clientForm.save();
    }

    res.status(200).json({
      message: "Interview applied successfully",
      lead: updatedLead,
    });

  } catch (err) {
    console.error("ApplyForInterview Error:", err);
    res.status(500).json({ message: "Internal server error", error: err.message });
  }
};


// GET Leads by Interview Manager with pagination & search
exports.getLeadsByInterviewManager = async (req, res) => {
  try {
    const { InterviewManagerId } = req.params;
    const { page = 1, limit = 10, search = "" } = req.query;

    const skip = (page - 1) * limit;

    let query = { InterviewManager: InterviewManagerId };

    // 🔍 Add search filter (number, passportNumber, zone, etc.)
    if (search) {
      query.$or = [
        { number: { $regex: search, $options: "i" } },
        { passportNumber: { $regex: search, $options: "i" } },
        { zone: { $regex: search, $options: "i" } },
      ];
    }

    const [leads, total] = await Promise.all([
      Lead.find(query)
        .populate("InterviewAppliedBy")
        .populate("zone")
        .skip(skip)
        .limit(Number(limit)),
      Lead.countDocuments(query),
    ]);

    res.status(200).json({
      leads,
      total,
      page: Number(page),
      pages: Math.ceil(total / limit),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch leads" });
  }
};


exports.markInterviewPass = async (req, res) => {
  try {
    const { id } = req.params;

    const contact = await Lead.findByIdAndUpdate(
      id,
      {
        InterviewStatus: "Pass",
      },
      { new: true }
    );
    
    if (!contact) {
      return res.status(404).json({ message: "Lead not found" });
    }

    const clientForm=await ClientForm.findOne({leadId:id})
    
    if(clientForm){
      clientForm.InterviewStatus='Pass'
      await clientForm.save();
    }


    res.json({ message: "Interview marked as Pass", contact });
  } catch (error) {
    res.status(500).json({ message: "Error updating interview status", error: error.message });
  }
};

exports.markInterviewFail = async (req, res) => {
  try {
    const { id } = req.params;

    const contact = await Lead.findByIdAndUpdate(
      id,
      {
        InterviewStatus: "Fail",
      },
      { new: true }
    );

    if (!contact) {
      return res.status(404).json({ message: "Lead not found" });
    }

    const clientForm=await ClientForm.findOne({leadId:id})
    
    if(clientForm){
      clientForm.InterviewStatus='Fail'
      await clientForm.save();
    }

    res.json({ message: "Interview marked as Fail", contact });
  } catch (error) {
    res.status(500).json({ message: "Error updating interview status", error: error.message });
  }
};




// POST /api/contact/deassign-leads
exports.deassignLeads = async (req, res) => {
  try {
    const { leadIds } = req.body;

    if (!leadIds || !Array.isArray(leadIds) || leadIds.length === 0) {
      return res.status(400).json({ message: 'leadIds are required' });
    }

    const result = await Lead.updateMany(
      { _id: { $in: leadIds } },
      {
        $unset: {
          AssignedTO: '',
          AssignedBy: '',
          AssignedDate: '',
        },
      }
    );

    res.status(200).json({
      message: `Deassigned ${result.modifiedCount} leads successfully`,
    });
  } catch (err) {
    console.error('Deassign error:', err);
    res.status(500).json({ message: 'Failed to deassign leads' });
  }
};

// GET /api/contact/get-leads/:transferredToId?search=xxxx
// exports.getLeadsByTransferredTo = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const leads = await Lead.find({ transferredTo: id })
//       .populate('zone')
//       .populate('uploadedBy')
//       .populate('transferredTo')
//       .sort({ createdAt: -1 });

//     res.status(200).json(leads);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: 'Failed to fetch leads' });
//   }
// };


exports.getLeadsByTransferredTo = async (req, res) => {
  try {
    const { id } = req.params;
    const { page = 1, limit = 10, search = '' } = req.query;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const query = {
      transferredTo: id,
      number: { $regex: search, $options: 'i' }
    };

    const [leads, total] = await Promise.all([
      Lead.find(query)
        .populate('zone')
        .populate('uploadedBy')
        .populate('transferredTo')
        .populate('AssignedTO')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit)),
      Lead.countDocuments(query)
    ]);

    res.status(200).json({
      data: leads,
      total,
      page: parseInt(page),
      limit: parseInt(limit)
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch leads' });
  }
};



// PUT /api/contact/update-lead-status/:id
exports.updateLeadStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, passportNumber } = req.body;

    if (!status) {
      return res.status(400).json({ message: 'Status is required' });
    }

    // Build update object dynamically
    const updateData = { status };

    if (passportNumber && passportNumber.trim() !== '') {
      updateData.passportNumber = passportNumber;
    }

    const updated = await Lead.findByIdAndUpdate(id, updateData, { new: true });

    if (!updated) {
      return res.status(404).json({ message: 'Lead not found' });
    }

    res.status(200).json({ message: 'Status updated', lead: updated });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to update status' });
  }
};

// PUT /api/contact/update-form-filled/:id
exports.updateFormFilled = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedLead = await Lead.findByIdAndUpdate(
      id,
      { isFormFilled:true },
      { new: true }
    );

    if (!updatedLead) {
      return res.status(404).json({ message: 'Lead not found' });
    }

    res.json({
      message: 'Lead form status updated successfully',
      lead: updatedLead
    });
  } catch (error) {
    console.error('Error updating form filled status:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};



//Get By Id

exports.getContactById = async (req, res) => {
  try {
    const registration = await Lead.findById(req.params.id);
    if (!registration) {
      return res.status(404).json({ message: 'Contact not found' });
    }
    res.status(200).json(registration);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};