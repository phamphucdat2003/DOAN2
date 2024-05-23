//chay cai mongodb
const { mutipleMongooseToObject } = require('../../util/mongoose');
const Project = require('../models/Project');
const User = require('../models/User');
const Group = require('../models/Group');
const UserClass = require('../models/Userclass');
const Instructor = require('../models/Instructor');
const Task = require('../models/Task');
//----------------------------------------------------------------
class gvController {
    //[GET] /sv/waitresponse
    viewwaitresponse(req,res,next) {
        // const response = req.session.response;
        // delete req.session.response;
        res.render('sv/sv_waitresponse',{
            title:"Đợi phản hồi",
            hide:true
        })
    }
    //[GET] /sv/waitmodify
    viewwaitmodify(req,res,next) {
        // const response = req.session.response;
        // delete req.session.response;
        res.render('sv/sv_waitmodify',{
            title:"Yêu cầu cập nhật lớp học phần",
            hide:true
        })
    }
    //[GET] /sv/doan
    async viewdoan(req, res) {
        const myId = req.session.userId;
        const userClass = await UserClass.findOne({ members: { $in: [myId] } })
        const classId = userClass._id
        const findinstructor = await Instructor.findOne({ studentsId: { $in: [myId] } })
        // console.log(findinstructor.instructorId)
        // const userInstructor = await User.find({$and: [{ _id: { $in: studentIds } },{isVerifiedbyInstructor:0}]});

        Project.find({$and:[{owner:findinstructor.instructorId},{$or:[{userclass:classId},{userclass: { $exists: false }}]}]})
        .then((projects) => {
            res.render('sv/sv_doan', {
                projects: mutipleMongooseToObject(projects),
                title:'Đồ án'
            });
        })
        .catch((error) => {
            console.error(error);
            res.render('error/404',{
                title:'LỖI HỆ THỐNG',
                home:true
            });
        })
    };
    
    //[GET] /sv/giangvien
    viewgiangvien(req, res) {
        User.find({role:"lecturer"})
        .then((instructors) => {
            res.render('sv/sv_giangvien', {
                instructors: mutipleMongooseToObject(instructors),
                title:'Tìm giảng viên hướng dẫn'
            });
        })
        .catch((error) => {
            console.error(error);
            res.render('error/404',{
                title:'LỖI HỆ THỐNG',
                home:true
            });
        })
    };
    //[POST] /sv/:id/johninstructor
    async johninstructor(req, res, next) {
        const instructorId = req.params.id;
        const myId = req.session.userId;
        const instructor  = await Instructor.findOne({instructorId})
        const student = await Instructor.findOne({ studentsId: { $in: [myId] } })
        // console.log(instructor,student)
        if (!student) {
            if (!instructor) {
                try {
                    const newInstructor = await Instructor.create({ instructorId, studentsId: [myId] });
                    await newInstructor.save();
                    req.session.instructor = true;
                    res.redirect('/sv/waitresponse')
                } catch (error) {
                        console.error(error);
                        res.render('error/404',{
                            title:'LỖI HỆ THỐNG',
                            home:true
                        });
                }

            } else {
                instructor.studentsId.push(myId);
                await instructor.save()
                                .then(() => {
                                    req.session.instructor = true;
                                    res.redirect('/sv/waitresponse')
                                })
                                .catch((error) => {
                                    console.error(error);
                                    res.render('error/404',{
                                        title:'LỖI HỆ THỐNG',
                                        home:true
                                    });
                                })
            }
        } else {
            console.log('Sinh viên không thể tham gia 2 giảng viên');
            res.redirect('back')
        }
 
    }
    //[POST] /sv/:id/johngroup
    async johngroup(req, res) {
        const pjId = req.params.id;
        const myId = req.session.userId;
        const group = await Group.findOne({ project: pjId });
        const userClass = await UserClass.findOne({ members: { $in: [myId] } })
        const ClassId = userClass.id
        if (!group) {
            const newGroup = await Group.create({ members: [myId], project: pjId});
            await newGroup.save()
                          .then(() => {
                            Project.updateOne({ _id:pjId},{ $set: {userclass:ClassId}})
                                    .then(() => {
                                        // console.log(newGroup);
                                        req.session.group = true;
                                        res.redirect('/sv/waitresponse')
                                    })
                                    .catch((error) => {
                                        console.error(error);
                                        res.render('error/404',{
                                            title:'LỖI HỆ THỐNG',
                                            home:true
                                        });
                                    })
                          })
                          .catch((error) => {
                            console.error(error);
                            res.render('error/404',{
                                title:'LỖI HỆ THỐNG',
                                home:true
                            });
                        })
        } else {
            // Kiểm tra xem sinh viên đã tồn tại trong mảng members hay chưa
            const isDuplicate = group.members.includes(myId);
            if (isDuplicate) {
                console.log('Sinh viên đã có trong nhóm');
                res.redirect('back');
            } else {
                group.members.push(myId);
                await group.save()
                            .then(() => {
                                req.session.group = true;
                                res.redirect('/sv/waitresponse')
                            })
                            .catch((error) => {
                                console.error(error);
                                res.render('error/404',{
                                    title:'LỖI HỆ THỐNG',
                                    home:true
                                });
                            })
            }
        }
    }



    //[GET] /sv/doan
    async viewnhiemvu(req, res,next) {
        const myId = req.session.userId
        await Task.find({$and:[ {assignedTo:myId},{iscomplete:false}]})
                    .then((tasks) =>{
                        res.render('sv/sv_nhiemvu',{
                            tasks: mutipleMongooseToObject(tasks),
                            title:'Nhiệm vụ'
                        })
                    })
                    .catch((error) => {
                        console.error(error);
                        res.render('error/404',{
                            title:'LỖI HỆ THỐNG',
                            home:true
                        });
                    })
        
    };
    async completetask(req,res,next){
        const taskId = req.params.id;
        await Task.updateOne({_id:taskId},{$set:{iscomplete:true}})
                    .then(()=>{
                        res.redirect('back')
                    })
                    .catch((error) => {
                        console.error(error);
                        res.render('error/404',{
                            title:'LỖI HỆ THỐNG',
                            home:true
                        });
                    })
    }
    //[GET] /sv/doan
    viewnhantin(req, res) {
        res.render('sv/sv_nhantin',{ title:'Nhắn tin'})
    };
}
module.exports = new gvController();
