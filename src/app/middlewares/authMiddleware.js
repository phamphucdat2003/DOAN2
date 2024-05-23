const Votecomplete = require('../models/Votecomplete');

const authMiddleware = async (req, res, next) => {
  const currentTime = new Date();
  const votecompletes = await Votecomplete.find().populate('group');
  
  votecompletes.map(async (votecomplete) => {
    if (votecomplete.timelife.getTime() < currentTime.getTime()) {
      if (!(votecomplete.membersisvoted.length === votecomplete.group.members.length)) {
        await Votecomplete.deleteOne({ _id: votecomplete._id });
        // console.log("auth:",votecomplete.timelife.getTime(),currentTime.getTime());
      } else {
        await Votecomplete.updateOne({ _id: votecomplete._id }, { $set: { iscomplete:true } });
      }
    } else {
      if (votecomplete.membersisvoted.length === votecomplete.group.members.length) {
        await Votecomplete.updateOne({ _id: votecomplete._id }, { $set: { iscomplete:true } });
      } 
    }
  });

  if (req.session.userId) {
    next();
  } else {
    res.redirect('/auth/login');
  }
};

module.exports = authMiddleware;