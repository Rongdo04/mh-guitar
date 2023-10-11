const Course = require('../models/Course');
const CourseShow = require('../models/CourseShow');
const {mutipleMongooseToObject} = require('../../util/mongoose');
const {mongooseToObject} = require('../../util/mongoose');
const mongoose = require('mongoose');



class MeController {


    // [GET] /me/create Create Courses
    create(req, res, next) {
        
        res.render('me/create',{UserName: req.cookies.name});
        
    }

    // [POST] /me/store  // Post Courses
    postCourse(req, res, next) {
        
        // res.json(req.body);

        const Courses = mongoose.model('courses', Course);
        const coursesNew = new Courses(req.body);

        coursesNew.save()
            .then(() => res.redirect(`/me/stored/courses`))
            .catch(error => {

            });


    }

    // [GET] /me/stored/courses --- Show Courses
    storedCourses(req, res, next) {
        const Courses = mongoose.model('courses', Course );

        Promise.all([Courses.find({}), Courses.countDocumentsDeleted()])
            .then(([courses, deletedCount]) => 
                res.render('me/stored-courses', {
                    deletedCount,
                    courses: mutipleMongooseToObject(courses),
                    UserName: req.cookies.name,
                })
            )
            .catch(next);

        // Courses.find({})
        //     .then(courses => res.render('me/stored-courses', {
        //         courses: mutipleMongooseToObject(courses),
        //     }))
        //     .catch(next);
        
    }

    // [GET] /me/trash/courses // Trash Courses
    trashCourses(req, res, next) {
        const Courses = mongoose.model('courses', Course );

        Courses.findDeleted({})
            .then(courses => 
                res.render('me/trash-courses', {
                    courses: mutipleMongooseToObject(courses),
                    UserName: req.cookies.name,
                }),
            )
            .catch(next);
        
    }

    // [GET] /me/stored/courses/:id/edit  // Edit Courses
    edit(req, res, next) {
        const Courses = mongoose.model('courses', Course );

        Courses.findById(req.params.id)
            .then(course => res.render('me/edit', {
                course: mongooseToObject(course),
                UserName: req.cookies.name,
            }))
            .catch(next);
        
    }

    // [PUT] /me/courses/:id    // Update Courses
    update(req, res,  next){
        
        const Courses = mongoose.model('courses', Course );

        Courses.updateOne({_id: req.params.id}, req.body)
            .then(() => res.redirect(`/me/stored/courses`))
            .catch(next);
    }

    // [DELETE] /me/courses/:id // Delete Courses
    destroy(req, res, next) {
        const Courses = mongoose.model('courses', Course );

        Courses.delete({_id: req.params.id})
            .then(() => res.redirect('back'))
            .catch(next);
    }

    // [DELETE] /me/courses/:id/force // Delete Courses forever
    forceDestroy(req, res, next) {
        const Courses = mongoose.model('courses', Course );

        Courses.deleteOne({_id: req.params.id})
            .then(() => res.redirect('back'))
            .catch(next);
    }

    // [PATCH] /me/courses/:id/restore // Restore Courses deleted
    restore(req, res, next) {
        const Courses = mongoose.model('courses', Course );

        Courses.restore({_id: req.params.id})
            .then(() => res.redirect('back'))
            .catch(next);
    }

    // [GET] /me/stored/courses/:slug // stored videos
    showStoredVideo(req, res, next) {
        const name = req.params.slug;

        const course = mongoose.model(`${name}`, CourseShow); 

        // course.find()
        //     .then(courses => res.render('me/stored-course-slug', {
        //         courses: mutipleMongooseToObject(courses),
        //     }))
        //     .catch(next);

        Promise.all([
            course.find({}), 
            course.findOneWithDeleted({slug: name}), 
            course.countDocumentsDeleted()
        ])
            .then(([courses, courseSlug, deletedCount]) => 
                res.render('me/stored-videos', {
                    deletedCount,
                    courseSlug:  mongooseToObject(courseSlug),
                    courses:  mutipleMongooseToObject(courses),
                    UserName: req.cookies.name,           
                })
            )
            .catch(next);
        
    }
    // [GET] /me/trash/courses/:slug    // Show Trash Videos
    showTrashVideo(req, res, next) {
        const name = req.params.slug;

        const course = mongoose.model(`${name}`, CourseShow); 

        // course.findDeleted({})
        //     .then(courses => res.render('me/trash-course-slug', {
        //         courses: mutipleMongooseToObject(courses),
        //     }))
        //     .catch(next);

        Promise.all([
            course.findDeleted({}), 
            course.findOneWithDeleted({slug: name})
        ])
            .then(([courses, courseSlug]) => 
                res.render('me/trash-videos', {
                    courseSlug:  mongooseToObject(courseSlug),
                    courses:  mutipleMongooseToObject(courses),
                    UserName: req.cookies.name,           
                })
            )
            .catch(next);
        
    }

    //[GET] /me/course/add // Create Video
    addCourse(req, res, next) {
        const Courses = mongoose.model('courses', Course );

        Courses.find()
            .then(courses => res.render('me/create-video', {
                courses: mutipleMongooseToObject(courses),
                UserName: req.cookies.name,
            }))
            .catch(next);
    }

    //[Post] /me/course/new // Post Video
    addVideo(req, res, next) {
        const name = req.body.slug;

        const course = mongoose.model(`${name}`, CourseShow);
        const courseNew = new course(req.body);

        courseNew.save()
            .then(() => res.redirect(`/me/stored/courses/${name}`))
            .catch(error => {

            });
       
        //res.send('da luu');
    }

    // [GET] /me/stored/courses/:slug/:id/edit
    editVideo(req, res, next) {

        const name = req.params.slug;
        const id = req.params.id;

        const Courses = mongoose.model(`${name}`,  CourseShow);

        Courses.findById(id)
            .then(course => res.render('me/edit-video', {
                course: mongooseToObject(course),
                UserName: req.cookies.name,
            }))
            .catch(next);
        
    }

    // [PUT] /me/courses/:slug/:id
    updateVideo(req, res,  next){
        
        const name = req.params.slug;
        const id = req.params.id;


        const Courses = mongoose.model(`${name}`, CourseShow);

        Courses.updateOne({_id: id}, req.body)
            .then(() => res.redirect(`/me/stored/courses/${name}`))
            .catch(next);
    }
    
   // [DELETE] /me/courses/:slug/:id
   destroyVideo(req, res, next) {
        const name = req.params.slug;

        const Courses = mongoose.model(`${name}`, CourseShow);

        Courses.delete({_id: req.params.id})
            .then(() => res.redirect('back'))
            .catch(next);
    }

    // [DELETE] /me/courses/:slug/:id/force
   forceDestroyVideo(req, res, next) {
        const name = req.params.slug;

        const Courses = mongoose.model(`${name}`, CourseShow);

        Courses.deleteOne({_id: req.params.id})
            .then(() => res.redirect('back'))
            .catch(next);

    }

    // [PATCH] /me/courses/:slug/:id/restore
    restoreVideo(req, res, next) {
        const name = req.params.slug;

        const Courses = mongoose.model(`${name}`, CourseShow);


        Courses.restore({_id: req.params.id})
            .then(() => res.redirect('back'))
            .catch(next);
    }

    
    handleFromActions(req, res, next) {
        const Courses = mongoose.model('courses', Course);
        switch (req.body.action) {
          case 'delete':
            Courses.delete({ _id: { $in : req.body.courseIds} })
                .then(() => res.redirect('back'))
                .catch(next);
            break;
          
           default: 
            res.json({message : 'No action'});
        }
      }
      handleFromActions2(req, res, next) {
        const Courses = mongoose.model('courses', Course);
        switch (req.body.action) {
            case 'forceDelete':
              Courses.deleteMany({ _id: { $in: req.body.courseIds }})
                  .then(() => res.redirect('back'))
                  .catch(next);
              break;
          case 'restore':
              Courses.restore({ _id: { $in: req.body.courseIds }})
                  .then(() => res.redirect('back'))
                  .catch(next);
              break;
          
           default: 
            res.json({message : 'No action'});
        }
      }
     
}

module.exports = new MeController;