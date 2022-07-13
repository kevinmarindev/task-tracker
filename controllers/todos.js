const toDoModel = require('../models/todos')
const projectsModel = require('../models/projects')
const User = require('../models/User')
const { off } = require('../models/todos')

module.exports = {
    getToDos: async(req, res)=>{
        console.log(req._startTime)
        try {
            const toDoitems = await toDoModel.find({userId : req.user.id});
            // console.log(toDoitems)
            const itemsLeft = await toDoModel.countDocuments({completed: false, userId : req.user.id});
            const username = await req.user.userName
            const projects = await projectsModel.find({userId : req.user.id})
            res.render('todos.ejs', {todos: toDoitems, left: itemsLeft, user: username, pro: projects})
            // console.log(toDoitems)   
        } catch (error) {
            console.log(error)
        }
    },
    getDueToday: async(req, res)=>{
        console.log(req.query.date)
        try {
            const toDoitems = await toDoModel.find({ date: { $lte: req.query.date }, userId: req.user.id}
            )
            const itemsLeft = await toDoModel.countDocuments({date: req.query.date, userId: req.user.id, completed: false})
            const projects = await projectsModel.find({userId : req.user.id})
            res.send({todos: toDoitems, left: itemsLeft, user: req.user.userName, pro: projects})
        } catch (error) {
            console.log(error)
        }
    },
    getProjectTodos: async(req, res)=>{
        console.log(req.params.project)
        try {
            const toDoitems = await toDoModel.find({project : req.params.project});
            console.log(toDoitems)
            const itemsLeft = await toDoModel.countDocuments({completed: false, userId : req.user.id, project: req.params.project });
            //change num when a specific project is selcted
            const username = await req.user.userName
            const projects = await projectsModel.find({userId : req.user.id})
            res.send({todos: toDoitems, left: itemsLeft, user: username, pro: projects})
            console.log(toDoitems)
            
        } catch (error) {
            console.log(error)
        }
    },
    createOne: async(req, res)=>{
        // console.log(req)
        // let time = dateFormater.asString('MM:dd:yy', req.body.date)
        try {
            await toDoModel.create({todo: req.body.itemFromJS, completed: false, userId: req.user.id, date: req.body.date, project: req.body.project})
            console.log('new to do added')
            res.redirect('/todos')
        } catch (error) {
            console.log(error)
        }
    },
    deleteOne: async(req, res)=>{
        try {
            console.log(req.params.id, req.body)
            await toDoModel.findOneAndDelete({_id: req.params.id})
            console.log('to do deleted')
            if(req.body.project) res.send('deleted item in project')
            else res.redirect('/todos')
        } catch (error) {
            console.log(error)
        }
    },
    completeOne: async (req, res) =>{
        try {
           await toDoModel.findOneAndUpdate({_id: req.body.itemFromJS}, {completed: true}) 
           console.log('marked complete')
           res.json('completed It')
        } catch (error) {
            console.log(error)
        }
    },
    uncompleteIt: async (req, res) =>{
        try {
           await toDoModel.findOneAndUpdate({_id: req.body.itemFromJS}, {completed: false}) 
           console.log('marked uncomplete')
           res.json('uncomplete')
        } catch (error) {
            console.log(error)
        }
    },
    updateItemm: async (req, res) =>{
        try {
            await toDoModel.findOneAndUpdate({_id: req.body.itemFromJS}, {todo: req.body.valueOfItem})
            console.log('Item updated')
           res.json('Item Updated')
        } catch (error) {
            console.log(error)
        }
    },
    updateDate: async (req, res) =>{
        try {
            console.log(req.body.date)
            await toDoModel.findOneAndUpdate({_id: req.body.itemFromJS}, {date: req.body.date})
            console.log('Date Updated')
           res.json('Date Updated')
        } catch (error) {
            console.log(error)
        }
    },
    createProject: async (req, res) =>{
        console.log(req.body.projectitem)
        const flashErrors = []
        let responseOne = await projectsModel.find({project: req.body.projectitem});
        console.log(responseOne, 'yes')
        try{
            if(responseOne == false){
            console.log('creating')
            await projectsModel.create({project: req.body.projectitem, userId: req.user.id});
            console.log('new project added');
                }
            else{
                flashErrors.push({msg: 'Project name is not unique. Please use a different name'}), res.flash('errors', flashErrors);
            }
            res.redirect('/todos')
        }catch(error){
            console.log(error)
        }
    },
    deleteProject: async (req, res) =>{
        console.log(req.body.projectid, req.body.project)
        try {
            await projectsModel.findOneAndDelete({projectId: req.body.projectId})
            console.log('Project Deleted')
            await toDoModel.deleteMany({project: req.body.project})
            console.log('Items related to project Deleted')
            res.redirect('/todos')
        } catch (error) {
            console.log(error)
        }
    },
    // createOne: async(req, res)=>{
    //     console.log(req.body.date)
    //     // let time = dateFormater.asString('MM:dd:yy', req.body.date)
    //     try {
    //         await toDoModel.create({todo: req.body.todoItem, completed: false, userId: req.user.id, date: req.body.date})
    //         console.log('new to do added')
    //         res.redirect('/todos')
    //     } catch (error) {
    //         console.log(error)
    //     }
    // },
    
}