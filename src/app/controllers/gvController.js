//chay cai mongodb
const { mutipleMongooseToObject,mongooseToObject } = require('../../util/mongoose');
const Project = require('../models/Project');
const User = require('../models/User');
const Group = require('../models/Group');
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
        .catch((error) => console.log("loi ne ba!!!!!!!!!"))
        // res.render('gv/gv_doan',{title:'Đồ án'})
    };
    //[GET] /gv/create_doan
    viewcreatedoan(req, res,next) {
        res.render('gv/gv_create_doan',{title:'Create đồ án'})
    }
    //[POST] /gv/create_doan
    async createdoan(req, res, next) {
        try {
            const { name, description, level } = req.body;

            const id = req.session.userId;
            const project = new Project({ name, description, level, owner: id });
            await project.save();

            // const pj = await Project.findOne({ name });
            // const group = new Group({members: 'không có ai cả', project: pj._id });
            // await group.save();

            // // console.log(group);
    
            res.redirect("/gv/doan");
        } catch (err) {
            console.log(err);
            res.render('error/404', { title: 'Error' });
        }
    }

    //[DELETE] /gv/:id/forcedelete
    forcedelete(req, res, next) {
        const id = req.params.id
        Project.deleteOne({ _id: id })
            .then(() => res.redirect('back'))
            .catch(next);
    }
    //[get] /gv/:id/edit-project
    editproject(req, res, next) {
        Project.findById(req.params.id)
            .then((project) =>
                res.render('gv/gv_edit-project', {
                    project: mongooseToObject(project),
                    title:'Edit ' + Project.name
                }),
            )
            .catch(next);
    }
    //[put] /manage/:id
    async update(req, res, next) {
        const { id } = req.params;
        const { name, description, level } = req.body;
        const owner = req.session.userId;
        console.log(id, name, description, level,owner)
        Project.updateOne({ _id: id }, { $set: { name , description, level, owner } })
            .then(() => res.redirect('/gv/doan'))
            .catch(next);
    }
}
module.exports = new gvController();
