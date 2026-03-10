
const Incident = require("../models/Incident");
const ActivityLog = require("../models/ActivityLog");
const sseController = require("./sseController");

exports.createIncident = async (req,res)=>{
  try{
    const incident = await Incident.create({
      ...req.body,
      created_by:req.user.userId,
      team_id:req.user.team_id
    });

    await ActivityLog.create({
      incident_id:incident._id,
      action:"incident_created",
      user_id:req.user.userId
    });

    res.json(incident);

    // Broadcast creation
    setTimeout(() => {
      sseController.broadcast(req.user.team_id, "incident_created", incident);
    }, 0);
  }catch(err){
    res.status(500).json({message:err.message});
  }
};

exports.getIncidents = async (req,res)=>{
  try{

    const {status,severity,assigned_to} = req.query;

    const filter = { team_id:req.user.team_id };

    if(status) filter.status = status;
    if(severity) filter.severity = severity;
    if(assigned_to) filter.assigned_to = assigned_to;

    const incidents = await Incident.find(filter);

    res.json(incidents);

  }catch(err){
    res.status(500).json({message:err.message});
  }
};

exports.getIncidentById = async (req,res)=>{
  try{
    const incident = await Incident.findById(req.params.id);

    res.json(incident);
  }catch(err){
    res.status(500).json({message:err.message});
  }
};

exports.updateIncident = async (req,res)=>{
  try{

    const incident = await Incident.findById(req.params.id);

    if(req.body.assigned_to && req.body.assigned_to != incident.assigned_to){
      await ActivityLog.create({
        incident_id:incident._id,
        action:"incident_assigned",
        user_id:req.user.userId
      });
    }

    if(req.body.status && req.body.status != incident.status){
      await ActivityLog.create({
        incident_id:incident._id,
        action:"status_changed",
        user_id:req.user.userId
      });
    }

    Object.assign(incident,req.body);

    await incident.save();

    res.json(incident);

    // Broadcast update
    setTimeout(() => {
      sseController.broadcast(req.user.team_id, "incident_updated", incident);
    }, 0);

  }catch(err){
    res.status(500).json({message:err.message});
  }
};

exports.deleteIncident = async (req,res)=>{
  try{
    const incidentId = req.params.id;
    await Incident.findByIdAndDelete(incidentId);
    res.json({message:"Incident deleted"});

    // Broadcast deletion
    setTimeout(() => {
      sseController.broadcast(req.user.team_id, "incident_deleted", { _id: incidentId });
    }, 0);
  }catch(err){
    res.status(500).json({message:err.message});
  }
};
