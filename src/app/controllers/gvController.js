//chay cai mongodb
const { mutipleMongooseToObject,mongooseToObject } = require('../../util/mongoose');
const Project = require('../models/Project');
const User = require('../models/User');
const Group = require('../models/Group');
const Instructor = require('../models/Instructor');
const Task = require('../models/Task')
const Messages = require('../models/Messages');
const Votecomplete = require('../models/Votecomplete');
const Scores = require('../models/Scores');
const UserClass = require('../models/Userclass');

//----------------------------------------------------------------
class gvController {
    //[GET] /gv/doan
    viewdoan(req, res) {
        const id = req.session.userId;
        Project.find({owner:id}).populate('owner')
        .then((projects) => {
            res.render('gv/gv_doan', {
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
        });
    };
    //[GET] /gv/create_doan
    viewcreatedoan(req, res,next) {
        res.render('gv/gv_create_doan',{title:'Create đồ án'})
    }
    //[POST] /gv/create_doan
    async createdoan(req, res, next) {
        try {
            const { name, description, level } = req.body;

            const myId = req.session.userId;
            const project = new Project({ name, description, level, owner: myId });
            await project.save();
    
            res.redirect("/gv/doan");
        }   catch (error) {
            console.error(error);
            res.render('error/404',{
                title:'LỖI HỆ THỐNG',
                home:true
            });
        }
    }

    //[DELETE] /gv/:id/forcedelete
    forcedelete(req, res, next) {
        const id = req.params.id;
        Group.findOne({ project: id })
          .then((group) => {
            if (group.members.length === 0) {
              Group.deleteOne({ project: id })
                .then(() => {
                  Project.deleteOne({ _id: id })
                    .then(() => {
                      return res.redirect('back');
                    })
                    .catch((error) => {
                        console.error(error);
                        res.render('error/404',{
                            title:'LỖI HỆ THỐNG',
                            home:true
                        });
                    });
                })
                .catch((error) => {
                    console.error(error);
                    res.render('error/404',{
                        title:'LỖI HỆ THỐNG',
                        home:true
                    });
                });
            } else {    
              return res.redirect('back');
            }
          })
          .catch(() => {
            Project.deleteOne({ _id: id })
                .then(() => {
                    return res.redirect('back');
                })
                .catch((error) => {
                    console.error(error);
                    res.render('error/404',{
                        title:'LỖI HỆ THỐNG',
                        home:true
                    });
                });
          });
      }
    //[get] /gv/:id/edit-project
    editproject(req, res, next) {
        const errorName = req.session.errorName;
        delete req.session.errorName;
        Project.findById(req.params.id)
            .then((project) =>
                res.render('gv/gv_edit-project', {
                    project: mongooseToObject(project),
                    title:'Edit ' + Project.name,
                    errorName
                }),
            )
            .catch((error) => {
                console.error(error);
                res.render('error/404',{
                    title:'LỖI HỆ THỐNG',
                    home:true
                });
            });
    }
    //[put] /gv/:id
    async updateproject(req, res, next) {
        const { id } = req.params;
        const { name, description, level } = req.body;
        const owner = req.session.userId;
        console.log(id, name, description, level,owner)
        const existingProject = await Project.findOne({name})
        if (!existingProject){
            Project.updateOne({ _id: id }, { $set: { name , description, level, owner } })
            .then(() => res.redirect('/gv/doan'))
            .catch((error) => {
                console.error(error);
                res.render('error/404',{
                    title:'LỖI HỆ THỐNG',
                    home:true
                });
            });
        } else {
            req.session.errorName = 'Đồ án đã tồn tại';
            return res.redirect('/gv/' + id + '/edit-project')
        }
       
    }
    //[GET] /sv/doan
    async viewyeucau(req, res, next) {
        try {
            const myId = req.session.userId;
            const instructor = await Instructor.findOne({ instructorId: myId });
        
            if (instructor) {
                const studentIds = instructor.studentsId;
                const projects = await Project.find({ owner: myId });
                // console.log("projects: "+projects)
                const groupPromises = projects.map(
                    project => Group.findOne({ project: project._id }).populate('project members')
                );
                // console.log("groupPromises: "+groupPromises)
                const groupResults = await Promise.all(groupPromises);
                // console.log("groupResults: "+groupResults)
                const existingGroups = groupResults.filter(group => group !== null);
                const groupsId = existingGroups.map(group => group._id);
                // console.log("groupsId: ",groupsId)
                if (existingGroups) {
                    const userInstructor = await User.find({$and: [{ _id: { $in: studentIds } },{isVerifiedbyInstructor:0}]});
                    {$and:[{owner:myId},{bylecturer:0}]}
                    const Groupcomplete = await Votecomplete.find( { $and: [ {group:{ $in: groupsId }} , {iscomplete: true } , {iscompletebylec: false } ] } ).populate({
                        path: 'group',
                        populate: [
                          { path: 'project', select: 'name' },
                          { path: 'members' }
                        ]
                      });
                    // console.log("Groupcomplete: ",Groupcomplete)
                    Promise.all([userInstructor, existingGroups,Groupcomplete])
                        .then(([userinstructors,usergroups,groupcompletes]) => {
                            res.render('gv/gv_yeucau', {
                                userinstructors: mutipleMongooseToObject(userinstructors),
                                usergroups: mutipleMongooseToObject(usergroups),
                                groupcompletes: mutipleMongooseToObject(groupcompletes),
                                title: 'Duyệt yêu cầu'
                            });
                        })
                        .catch((error) => {
                            console.error(error);
                            res.render('error/404',{
                                title:'LỖI HỆ THỐNG',
                                home:true
                            });
                        });
                } else {
                    User.find({$and: [{ _id: { $in: studentIds } },{isVerifiedbyInstructor:0}]})
                        .then((userinstructors) => {
                            res.render('gv/gv_yeucau', {
                                userinstructors: mutipleMongooseToObject(userinstructors),
                                title: 'Duyệt yêu cầu'
                            });
                        })
                        .catch((error) => {
                            console.error(error);
                            res.render('error/404',{
                                title:'LỖI HỆ THỐNG',
                                home:true
                            });
                        });
                }
            } else {
                res.render('gv/gv_yeucau', {
                    title: 'Duyệt yêu cầu'
                });
                console.log('Chưa có đối tượng nào');
            }
        } catch (error) {
            console.error(error);
            res.render('error/404',{
                title:'LỖI HỆ THỐNG',
                home:true
            });
        }
      }
    async refuseinstructor(req, res, next) {
        const { studentId } = req.params;
        const myId = req.session.userId;

        Instructor.findOne({instructorId:myId})
            .then(instructor => {
                instructor.studentsId.pull(studentId);
                instructor.save()
                    .then(savedInstructor => {
                        res.redirect('back');
                    })
                    .catch((error) => {
                        console.error(error);
                        res.render('error/404',{
                            title:'LỖI HỆ THỐNG',
                            home:true
                        });
                    });
            })
            .catch((error) => {
                console.error(error);
                res.render('error/404',{
                    title:'LỖI HỆ THỐNG',
                    home:true
                });
            });
    }
    async acceptinstructor(req, res, next) {
        const { studentId } = req.params;
        User.updateOne({ _id: studentId }, { $set: {isVerifiedbyInstructor:1} })
            .then(() => res.redirect('back'))
            .catch((error) => {
                console.error(error);
                res.render('error/404',{
                    title:'LỖI HỆ THỐNG',
                    home:true
                });
            });
    }
    async refusegroup(req, res, next) {
        const { studentId, projectId } = req.params;
        // console.log(studentId, projectId)
        Group.findOne({project:projectId})
            .then(group => {
                group.members.pull(studentId);
                group.save()
                    .then(savedGroup => {
                        // console.log(savedGroup);
                        res.redirect('back');
                    })
                    .catch((error) => {
                        console.error(error);
                        res.render('error/404',{
                            title:'LỖI HỆ THỐNG',
                            home:true
                        });
                    });
            })
            .catch((error) => {
                console.error(error);
                res.render('error/404',{
                    title:'LỖI HỆ THỐNG',
                    home:true
                });
            });
    }
    async acceptgroup(req, res, next) {
        const { studentId } = req.params;
        User.updateOne({ _id: studentId }, { $set: {isVerifiedbyInstructor:2} })
            .then(() => res.redirect('back'))
            .catch((error) => {
                console.error(error);
                res.render('error/404',{
                    title:'LỖI HỆ THỐNG',
                    home:true
                });
            });
    }
    async refusevotecomplete(req, res, next) {
        const {Id} = req.params;
        await Votecomplete.deleteOne({ _id:Id})
            .then(()=>{
                res.redirect('back')
            })
            .catch((error) => {
                console.error(error);
                res.render('error/404',{
                    title:'LỖI HỆ THỐNG',
                    home:true
                });
            });

    }
    async acceptvotecomplete(req,res,next){
        const {Id} = req.params;
        await Votecomplete.updateOne({ _id: Id }, { $set: {iscompletebylec:true} })
            .then(() => res.redirect('back'))
            .catch((error) => {
                console.error(error);
                res.render('error/404',{
                    title:'LỖI HỆ THỐNG',
                    home:true
                });
            });
    }
    //[GET] /sv/doan
    async viewsinhvien(req, res) {
        const myId = req.session.userId;
        const instructor = await Instructor.findOne({ instructorId: myId });
        if (instructor){
            const studentIds = instructor.studentsId;
            User.find({$and: [{ _id: { $in: studentIds } },{isVerifiedbyInstructor: { $ne: 0 } }]})
            .then((users) => {
                res.render('gv/gv_sinhvien', {
                    users: mutipleMongooseToObject(users),
                    title: 'Sinh viên'
                  });
            })
            .catch((error) => {
                console.error(error);
                res.render('error/404',{
                    title:'LỖI HỆ THỐNG',
                    home:true
                });
            });
        } else {
            res.render('gv/gv_sinhvien', {
                title: 'Sinh viên'
              });
        }
    };

    async kickinstructor(req, res,next) {
        const { studentId } = req.params;
        const instructor = await Instructor.findOne({ studentsId: { $in: [studentId] } })
        const group = await Group.findOne({ members: { $in: [studentId] } })
        // console.log("ins: ", instructor);
        // console.log("gr: ", group);
        if (group) {
            group.members.pull(studentId)
            group.save()
                .then(() =>{
                    instructor.studentsId.pull(studentId)
                    instructor.save()
                        .then(() =>{
                            User.updateOne({ _id: studentId }, { $set: {isVerifiedbyInstructor:0} })
                            .then(() => res.redirect('back'))
                            .catch((error) => {
                                console.error(error);
                                res.render('error/404',{
                                    title:'LỖI HỆ THỐNG',
                                    home:true
                                });
                            });
                        })
                        .catch((error) => {
                            console.error(error);
                            res.render('error/404',{
                                title:'LỖI HỆ THỐNG',
                                home:true
                            });
                        });
                })
                .catch((error) => {
                    console.error(error);
                    res.render('error/404',{
                        title:'LỖI HỆ THỐNG',
                        home:true
                    });
                });
        } else {
            instructor.studentsId.pull(studentId)
                    instructor.save()
                        .then(() =>{
                            User.updateOne({ _id: studentId }, { $set: {isVerifiedbyInstructor:0} })
                            .then(() => res.redirect('back'))
                            .catch((error) => {
                                console.error(error);
                                res.render('error/404',{
                                    title:'LỖI HỆ THỐNG',
                                    home:true
                                });
                            });
                        })
                        .catch((error) => {
                            console.error(error);
                            res.render('error/404',{
                                title:'LỖI HỆ THỐNG',
                                home:true
                            });
                        });
        }

    }



    //[GET] /sv/doan
    async viewnhom(req, res, next) {
        const myId = req.session.userId
        const projects = await Project.find({ owner: myId });
        // console.log("projects: "+projects)
        const groupPromises = projects.map(
            project => Group.findOne({ project: project._id }).populate('project members')
        );
        // console.log("groupPromises: "+groupPromises)
        const groupResults = await Promise.all(groupPromises);
        // console.log("groupResults: "+groupResults)
        const existingGroups = groupResults.filter(group => group !== null);
        const groupsId = existingGroups.map(group => group._id);
        const groupcompletes = Votecomplete.find({ group:{ $in: groupsId }});
        Promise.all([existingGroups,groupcompletes])
            .then(([groups,groupcomplete]) => {
                res.render('gv/gv_nhom',{
                    groups: mutipleMongooseToObject(groups),
                    groupcomplete: mutipleMongooseToObject(groupcomplete),
                    title:'Nhóm'
                })
            })
            .catch((error) => {
                console.error(error);
                res.render('error/404',{
                    title:'LỖI HỆ THỐNG',
                    home:true
                });
            });
        // 
    };


    async kickgroup(req, res, next) {
        const { studentId, projectId } = req.params;
        console.log(studentId, projectId)
       
        Group.findOne({project:projectId})
            .then(group => {
                group.members.pull(studentId);
                group.save()
                    .then(savedGroup => {
                        // console.log(savedGroup);
                        User.updateOne({ _id: studentId }, { $set: {isVerifiedbyInstructor:1} })
                        .then((user) => {
                            // console.log(user);
                            res.redirect('back');
                        })
                        .catch((error) => {
                            console.error(error);
                            res.render('error/404',{
                                title:'LỖI HỆ THỐNG',
                                home:true
                            });
                        });
                    })
                    .catch((error) => {
                        console.error(error);
                        res.render('error/404',{
                            title:'LỖI HỆ THỐNG',
                            home:true
                        });
                    });
            })
            .catch((error) => {
                console.error(error);
                res.render('error/404',{
                    title:'LỖI HỆ THỐNG',
                    home:true
                });
            });
    }
    async addtask(req, res, next){
        const myId = req.session.userId;
        const {title, description,datacomplete,scores,studentId} = req.body;
        // console.log(scores);
        function convertStringToDays(str) {
            const numericValue = parseInt(str); // Lấy giá trị số từ chuỗi
            if (!isNaN(numericValue)) { // Kiểm tra xem giá trị có hợp lệ hay không
                const currentDate = new Date(); // Ngày hiện tại
                const convertedDate = new Date(currentDate.getTime() + numericValue * 24 * 60 * 60 * 1000); // Chuyển đổi thành ngày thực tế
                return convertedDate;
            }
            return null; // Trả về null nếu giá trị không hợp lệ
        }
        const task = new Task({title, description,owner:myId,datacomplete:convertStringToDays(datacomplete),assignedTo:studentId,scores})
        await task.save()
            .then(() => {
                res.json({ message: "Thêm thành công" });
            })
            .catch((err) => {
                res.status(500).json({ message: "Thêm thất bại" });
            });
    }
    viewnhiemvu(req, res, next){
        const myId = req.session.userId;
        Task.find({$and:[{owner:myId},{bylecturer:0}]}).populate('assignedTo')
            .then((tasks) => {
                res.render('gv/gv_nhiemvu',{
                    tasks: mutipleMongooseToObject(tasks),
                    title:'Nhiệm vụ'
                })
            })
    }
    async verifytask(req,res,next){
        // const myId = req.session.userId;
        const taskId = req.params.taskId;
        const studentTask = await Task.findById(taskId)
        // console.log(studentTask)
        const studentScores = await Scores.findOne({student:studentTask.assignedTo})
        await Task.findOneAndUpdate({ _id: taskId },{ $set: { bylecturer: 1 } },{ new: true })
                    .then((task) => {
                        if (studentScores) {
                            Scores.findById(studentScores._id)
                                .then((currentScoresDoc) => {
                                        // console.log(task.scores);
                                        const updatedScores = currentScoresDoc.scores + task.scores;
                                        Scores.updateOne({ _id: studentScores._id },{ $set: { scores: updatedScores } })
                                                .then(() => {
                                                    res.redirect('back')
                                                })
                                                .catch((error) => {
                                                    console.error(error);
                                                    res.render('error/404',{
                                                        title:'LỖI HỆ THỐNG',
                                                        home:true
                                                    });
                                                });
                                })
                                .catch((error) => {
                                    console.error(error);
                                    res.render('error/404',{
                                        title:'LỖI HỆ THỐNG',
                                        home:true
                                    });
                                });
                        } else {
                           UserClass.findOne({members:{ $in: studentTask.assignedTo }})
                            .then((classuser) => {
                                // console.log(classuser.name)
                                const newScores = new Scores({student:studentTask.assignedTo,scores:task.scores,userclass:classuser.name})
                                newScores.save()
                                        .then(() => {
                                            res.redirect('back')
                                        })
                                        .catch((error) => {
                                            console.error(error);
                                            res.render('error/404',{
                                                title:'LỖI HỆ THỐNG',
                                                home:true
                                            });
                                        });
                            })
                            .catch((error) => {
                                console.error(error);
                                res.render('error/404',{
                                    title:'LỖI HỆ THỐNG',
                                    home:true
                                });
                            });
                        }
                    })
                    .catch((error) => {
                        console.error(error);
                        res.render('error/404',{
                            title:'LỖI HỆ THỐNG',
                            home:true
                        });
                    });
    }
    async deletetask(req,res,next){
        const taskId = req.params.taskId;
        await Task.updateOne({_id:taskId},{$set:{bylecturer:2}})
                    .then(()=>{
                        res.redirect('back')
                    })
                    .catch((error) => {
                        console.error(error);
                        res.render('error/404',{
                            title:'LỖI HỆ THỐNG',
                            home:true
                        });
                    });
    }
    //đamg ở đây
    historynhiemvu(req, res, next){
        const myId = req.session.userId;
        Task.find({$and:[{owner:myId},{ bylecturer: { $ne: 0 }}]}).populate('assignedTo')
            .then((tasks) => {
                res.render('gv/gv_historynhiemvu',{
                    tasks: mutipleMongooseToObject(tasks),
                    title:'Nhiệm vụ'
                })
            })
    }
    async viewdiem(req, res, next){
        const myId = req.session.userId;
        const instructor = await Instructor.findOne({ instructorId: myId });
        if (instructor) {
            const studentIds = instructor.studentsId;
            await Scores.find({student:{ $in: studentIds }}).populate('student')
                    .then((scores) => {
                        res.render('gv/gv_diem',{
                            scores: mutipleMongooseToObject(scores),
                            title:'Điểm'
                        })
                    })
        } else {
            res.render('gv/gv_diem',{
                title:'Điểm'
            })
        }
    }
    async diem(req, res, next) {
        const groupId = req.params.groupId;
        const scores = req.params.scores;
        const group = await Group.findOne({_id: groupId})
        group.members.map(async (member) => {
            // console.log(member)
            const existingscores = await Scores.find({student: member})
            console.log(existingscores)
            if (existingscores) {
                await Scores.updateOne({student: member},{$set:{scoresbylec:scores,completed:true}})
                            .then(()=>console.log("thanhcong"))
                            .catch(err => console.log("err: ",err))
            } else {
                await UserClass.findOne({members:{ $in: member}})
                        .then((userClass) => {
                            const newScores = new Scores({student:member,scoresbylec:scores,completed:true,userclass:userClass._id})
                            newScores.save()
                        })
            }
        })
        res.redirect("back")

    }
}
module.exports = new gvController();
