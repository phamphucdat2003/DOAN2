//chay cai mongodb
const { mutipleMongooseToObject,mongooseToObject } = require('../../util/mongoose');


const Message = require('../models/Messages');
const Project = require('../models/Project');
const User = require('../models/User');
const Group = require('../models/Group');
const Instructor = require('../models/Instructor');
const Task = require('../models/Task');
const Votecomplete = require('../models/Votecomplete');
//----------------------------------------------------------------
class MessageController {
    async viewnhantin(req, res, next) {
        try {
            const myId = req.session.userId;
            if (req.session.lecturer) {
                const instructor = await Instructor.findOne({ instructorId: myId });
                if (instructor) {
                    const studentIds = instructor.studentsId;
                    const usersvPromise = User.find({ $and: [{ _id: { $in: studentIds } }, { isVerifiedbyInstructor: { $ne: 0 } }] });
                    const usergvPromise = User.find({ $and: [{ role: 'lecturer' }, { _id: { $ne: myId } }] });
                    const projects = await Project.find({ owner: myId });
                    const groupPromises = projects.map(
                        project => Group.findOne({ project: project._id }).populate('project members')
                    );
                    const groupResults = await Promise.all(groupPromises);
                    const existingGroups = groupResults.filter(group => group !== null);
                    const [usergvs, usersvs,groups] = await Promise.all([usergvPromise, usersvPromise,existingGroups]);
                    res.render('message/message_nhantin', {
                        usergvs: mutipleMongooseToObject(usergvs),
                        usersvs: mutipleMongooseToObject(usersvs),
                        groups: mutipleMongooseToObject(groups),
                        title: 'Nhắn tin'
                    });
                } else {
                    const usergvPromise = User.find({ $and: [{ role: 'lecturer' }, { _id: { $ne: myId } }] });
                    const [usergvs] = await Promise.all([usergvPromise]);
                    res.render('message/message_nhantin', {
                        usergvs: mutipleMongooseToObject(usergvs),
                        title: 'Nhắn tin'
                    });
                }                            
            } else {
                const instructor = await Instructor.findOne({ studentsId: { $in: [myId] } }).populate('instructorId')
                const Groupsv = await Group.findOne({ members: { $in: [myId] } }).populate('members project')
                const [myinstructor,group] = await Promise.all([instructor,Groupsv]);
                    res.render('message/message_nhantin', {
                        myinstructor: mongooseToObject(myinstructor),
                        group: mongooseToObject(group),
                        title: 'Nhắn tin'
                    });    
            }
        } catch (error) {
                console.error(error);
                res.render('error/404',{
                    title:'LỖI HỆ THỐNG',
                    home:true
                });
        }
      }
    async nhantin1(req, res, next) {
        try {
            const myId = req.session.userId;
            const Id = req.params.id;
            if (req.session.lecturer) {
                const instructor = await Instructor.findOne({ instructorId: myId });
                if (instructor) {
                    const usergvPromise = User.find({ $and: [{ $and: [{ role: 'lecturer' }, { _id: { $ne: myId } }] }, { _id: { $ne: myId } }] });
                    const studentIds = instructor.studentsId;
                    const usersvPromise = await User.find({ $and: [{ _id: { $in: studentIds } }, { isVerifiedbyInstructor: { $ne: 0 } }] });
                    const contentmessage = await Message.find({
                        $or: [
                        { sender: { $in: [Id, myId] }, receiver: { $in: [Id, myId] } }
                        ]
                    });
                    // console.log("contentmessage: ",contentmessage)

                    const projects = await Project.find({ owner: myId });
                    // console.log("projects: "+projects)
                    const groupPromises = projects.map(
                        project => Group.findOne({ project: project._id }).populate('project members')
                    );
                    // console.log("groupPromises: "+groupPromises)
                    const groupResults = await Promise.all(groupPromises);
                    // console.log("groupResults: "+groupResults)
                    const existingGroups = groupResults.filter(group => group !== null);
                    const userInfo = await User.findOne({_id:Id})
                    const [usergvs,usersvs,groups,contentmessages,userinfo] = await Promise.all([usergvPromise, usersvPromise,existingGroups,contentmessage,userInfo]);
                    res.render('message/message_nhantin1', {
                        usergvs: mutipleMongooseToObject(usergvs),
                        usersvs: mutipleMongooseToObject(usersvs),
                        groups: mutipleMongooseToObject(groups),
                        contentmessages: mutipleMongooseToObject(contentmessages),
                        userinfo: mongooseToObject(userinfo),
                        title: 'Nhắn tin'
                    });
                } else {
                    const usergvPromise = User.find({ $and: [{ role: 'lecturer' }, { _id: { $ne: myId } }] });
                    const contentmessage = await Message.find({
                        $or: [
                        { sender: { $in: [Id, myId] }, receiver: { $in: [Id, myId] } }
                        ]
                    });
                    // console.log("contentmessage: ",contentmessage)
                    const userInfo = await User.findOne({_id:Id})
                    const [usergvs,contentmessages,userinfo] = await Promise.all([usergvPromise,contentmessage,userInfo]);
                    res.render('message/message_nhantin1', {
                        usergvs: mutipleMongooseToObject(usergvs),
                        contentmessages: mutipleMongooseToObject(contentmessages),
                        userinfo: mongooseToObject(userinfo),
                        title: 'Nhắn tin'
                    });
                }
            } else {
                const instructor = await Instructor.findOne({ studentsId: { $in: [myId] } }).populate('instructorId')
                const Groupsv = await Group.findOne({ members: { $in: [myId] } }).populate('members project')
                const contentmessage = await Message.find({
                    $or: [
                    { sender: { $in: [Id, myId] }, receiver: { $in: [Id, myId] } }
                    ]
                });
                const userInfo = await User.findOne({_id:Id})
                const [myinstructor,group,contentmessages,userinfo] = await Promise.all([instructor,Groupsv,contentmessage,userInfo]);
                    res.render('message/message_nhantin1', {
                        myinstructor: mongooseToObject(myinstructor),
                        group: mongooseToObject(group),
                        contentmessages: mutipleMongooseToObject(contentmessages),
                        userinfo: mongooseToObject(userinfo),
                        title: 'Nhắn tin'
                    });    
            }
        } catch (error) {
                console.error(error);
                res.render('error/404',{
                    title:'LỖI HỆ THỐNG',
                    home:true
                });
        }
    }
    async nhantin2(req, res, next) {
        try {
            const myId = req.session.userId;
            const Id = req.params.id;
            if (req.session.lecturer) {
                const instructor = await Instructor.findOne({ instructorId: myId });
                if (instructor) {
                    const usergvPromise = User.find({ $and: [{ $and: [{ role: 'lecturer' }, { _id: { $ne: myId } }] }, { _id: { $ne: myId } }] });
                    const studentIds = instructor.studentsId;
                    const usersvPromise = await User.find({ $and: [{ _id: { $in: studentIds } }, { isVerifiedbyInstructor: { $ne: 0 } }] });
                    const contentmessage = await Message.find({receiver:Id});
                    // console.log("contentmessage: ",contentmessage)

                    const projects = await Project.find({ owner: myId });
                    // console.log("projects: "+projects)
                    const groupPromises = projects.map(
                        project => Group.findOne({ project: project._id }).populate('project members')
                    );
                    // console.log("groupPromises: "+groupPromises)
                    const groupResults = await Promise.all(groupPromises);
                    // console.log("groupResults: "+groupResults)
                    const existingGroups = groupResults.filter(group => group !== null);
                    const userInfo = await Group.findOne({_id:Id}).populate('project')
                    const [usergvs,usersvs,groups,contentmessages,userinfo] = await Promise.all([usergvPromise, usersvPromise,existingGroups,contentmessage,userInfo]);
                    res.render('message/message_nhantin2', {
                        usergvs: mutipleMongooseToObject(usergvs),
                        usersvs: mutipleMongooseToObject(usersvs),
                        groups: mutipleMongooseToObject(groups),
                        contentmessages: mutipleMongooseToObject(contentmessages),
                        userinfo: mongooseToObject(userinfo),
                        title: 'Nhắn tin'
                    });
                } else {
                    const usergvPromise = User.find({ $and: [{ role: 'lecturer' }, { _id: { $ne: myId } }] });
                    const contentmessage = await Message.find({receiver:Id});
                    // console.log("contentmessage: ",contentmessage)
                    const userInfo = await Group.findOne({_id:Id}).populate('project')
                    const [usergvs,contentmessages,userinfo] = await Promise.all([usergvPromise,contentmessage,userInfo]);
                    res.render('message/message_nhantin2', {
                        usergvs: mutipleMongooseToObject(usergvs),
                        contentmessages: mutipleMongooseToObject(contentmessages),
                        userinfo: mongooseToObject(userinfo),
                        title: 'Nhắn tin'
                    });
                }
            } else {
                const instructor = await Instructor.findOne({ studentsId: { $in: [myId] } }).populate('instructorId')
                const Groupsv = await Group.findOne({ members: { $in: [myId] } }).populate('members project')
                const Existingvotecomplete = await Votecomplete.findOne({ group:Groupsv._id}).populate('group')
                // console.log(Array.isArray(Existingvotecomplete.toObject().membersisvoted))
                var kiemtra;
                if (await Votecomplete.findOne({ membersisvoted: { $in: [myId] } })) {
                    kiemtra = true;
                } else{
                    kiemtra = false;
                }
                const contentmessage = await Message.find({receiver:Id});
                const userInfo = await Group.findOne({_id:Id}).populate('project')
                const [myinstructor,group,contentmessages,userinfo,votecomplete] = await Promise.all([instructor,Groupsv,contentmessage,userInfo,Existingvotecomplete]);
                    res.render('message/message_nhantin2', {
                        myinstructor: mongooseToObject(myinstructor),
                        group: mongooseToObject(group),
                        contentmessages: mutipleMongooseToObject(contentmessages),
                        userinfo: mongooseToObject(userinfo),
                        votecomplete: mongooseToObject(votecomplete),
                        kiemtra,
                        title: 'Nhắn tin'
                    });    
            }
        } catch (error) {
                console.error(error);
                res.render('error/404',{
                    title:'LỖI HỆ THỐNG',
                    home:true
                });
        }
    }
    //[post] /message/
    sendmessage(req, res) {
        const myId = req.session.userId;
        const {content,receiverId} = req.body;
        const message = new Message({sender:myId,receiver:receiverId,content})
        message.save()
            .then(() => {
                res.json({ message: "Thêm thành công" });
            })
            .catch((err) => {
                res.status(500).json({ message: "Thêm thất bại" });
            });
    }
    async sendvotemessage(req, res) {
        const myId = req.session.userId;
        const {groupId} = req.body;
        const currentDate = new Date();
        const convertedDate = new Date(currentDate.getTime() + 14400000);
        const existingvotecomplete = await Votecomplete.findOne({group:groupId});
        if (existingvotecomplete) {
            const existingmyvotecomplete = await Votecomplete.findOne({group:groupId,membersisvoted:{ $in: [myId] }})
            if (existingmyvotecomplete) {
                res.status(500).json({ message: "Thêm thất bại" });
            } else {
                existingvotecomplete.membersisvoted.push(myId)
                existingvotecomplete.save()
                                    .then((voted) => {
                                        res.json({ message: "Thêm thành công" });
                                    })
                                    .catch((err) => {
                                        console.error(err)
                                        res.status(500).json({ message: "Thêm thất bại" });
                                    })
            }
        } else {
            // console.log(convertedDate)
            const vote = new Votecomplete({group:groupId,timelife:convertedDate,membersisvoted:myId})
            await vote.save()
                .then((vote1) => {
                    res.json({ message: "Thêm thành công" });
                })
                .catch((err) => {
                    console.error(err)
                    res.status(500).json({ message: "Thêm thất bại" });
                });
        }
    }
}
module.exports = new MessageController();
