const chai = require("chai");
const chaiHttp = require("chai-http");

const { app, runServer, closeServer } = require("../server");

const expect = chai.expect;

chai.use(chaiHttp);

describe('Blog Posts', function () {
    before(function() {
        return runServer();
    });

    after(function() {
        return closeServer();
    });

    it("should return all blog posts on GET", function(){
        return chai.request(app).get('/blog-posts')
        .then(function (res) {
            expect(res).to.have.status(200);
            expect(res).to.be.json;
            expect(res.body).to.be.a('array');
            expect(res.body.length).to.be.at.least(1);
            res.body.forEach(function(item){
                expect(item).to.be.a('object');
                expect(item).to.include.keys('id', 'title', 'content','author', 'publishDate');
            });
        });
    });

    it("should add a blog post on POST", function(){
        const newPost = {
            title: "Key Foods Must Tries",
            content: "Curabitur sit amet \nultricies sem. Mauris faucibus lectus a massa molestie aliquam. Donec \nvehicula, dolor sit amet luctus euismod, enim neque bibendum mauris, quis \nfringilla nisl nibh eget quam. Donec laoreet placerat ipsum, non consectetur \nipsum gravida eget. Phasellus iaculis feugiat nunc. Nam gravida, turpis \nfeugiat congue fringilla, lorem mi ultricies elit, ut maximus tellus eros \nin sapien. Nulla nec elit vel ex aliquam fermentum vel quis odio.",
            author: "PeasofMind"};
        return chai.request(app).post('/blog-posts').send(newPost)
        .then(function(res) {
            expect(res).to.have.status(201);
            expect(res).to.be.json;
            expect(res.body).to.be.a('object');
            expect(res.body).to.include.keys('id', 'title', 'content', 'author', 'publishDate');
        });
    });

    it("should update blog post on PUT", function(){
        const updatePost = {
            title: "Updated: Tips for Trying New Recipes",
            content: "Curabitur sit amet \nultricies sem. Mauris faucibus lectus a massa molestie aliquam. Donec \nvehicula, dolor sit amet luctus euismod, enim neque bibendum mauris, quis \nfringilla nisl nibh eget quam. Donec laoreet placerat ipsum, non consectetur \nipsum gravida eget. Phasellus iaculis feugiat nunc. Nam gravida, turpis \nfeugiat congue fringilla, lorem mi ultricies elit, ut maximus tellus eros \nin sapien. Nulla nec elit vel ex aliquam fermentum vel quis odio.",
            author: "PeasofMind"};
        return chai.request(app).get('/blog-posts')
        .then(function(res){
            updatePost.id = res.body[0].id;

            return chai.request(app)
            .put(`/blog-posts/${updatePost.id}`)
            .send(updatePost)
        })
        .then(function(res){
            expect(res).to.have.status(204);
        });
    });

    it('should delete blog post on DELETE', function(){
        return chai.request(app).get('/blog-posts')
        .then(function(res){
            return chai.request(app)
            .delete(`/blog-posts/${res.body[0].id}`)
        })
        .then(function(res){
            expect(res).to.have.status(204);
        });
    })
})
