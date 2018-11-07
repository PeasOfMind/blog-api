const express = require('express');
const router = express.Router();

const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

const {BlogPosts} = require('./models');

BlogPosts.create('Tips for Trying New Recipes', `Lorem ipsum dolor sit amet, 
consectetur adipiscing elit. Sed a maximus augue. Morbi in dapibus tortor, ac 
finibus metus. Suspendisse interdum justo ac pretium ultricies. Cras dignissim
tristique nunc, nec tempor neque euismod eu. Quisque sit amet nunc vel turpis 
viverra pulvinar. Donec risus dui, pharetra a urna quis, vestibulum sagittis 
risus. Vivamus eu nisi sed turpis lacinia scelerisque.`, 'PeasofMind');

BlogPosts.create('Top Vegan Friendly Places to Try in New York', `Curabitur sit amet 
ultricies sem. Mauris faucibus lectus a massa molestie aliquam. Donec 
vehicula, dolor sit amet luctus euismod, enim neque bibendum mauris, quis 
fringilla nisl nibh eget quam. Donec laoreet placerat ipsum, non consectetur 
ipsum gravida eget. Phasellus iaculis feugiat nunc. Nam gravida, turpis 
feugiat congue fringilla, lorem mi ultricies elit, ut maximus tellus eros 
in sapien. Nulla nec elit vel ex aliquam fermentum vel quis odio.`, 'PeasofMind');

BlogPosts.create('Things to Look Out for on Black Friday', `Lorem ipsum dolor sit amet, 
consectetur adipiscing elit. Sed a maximus augue. Morbi in dapibus tortor, ac 
finibus metus. Suspendisse interdum justo ac pretium ultricies. Cras dignissim
tristique nunc, nec tempor neque euismod eu. Quisque sit amet nunc vel turpis 
viverra pulvinar. Donec risus dui, pharetra a urna quis, vestibulum sagittis 
risus. Vivamus eu nisi sed turpis lacinia scelerisque.`, 'PeasofMind');

router.get('/', (req, res) => {
    res.json(BlogPosts.get());
});

router.post('/', jsonParser, (req, res) => {
    const requiredFields = ['title', 'content', 'author'];
    if(!req.body.title || !req.body.content || !req.body.author){
        res.status(400).send(`Missing \`${field}\` in request body`);
      } else {
        let entry;
        if (req.body.publishDate) {
            entry = BlogPosts.create(req.body.title, req.body.content, req.body.author, req.body.publishDate);
        } else {
            entry = BlogPosts.create(req.body.title, req.body.content, req.body.author);
        }
        res.status(201).json(entry);
      }
    // requiredFields.forEach(field => {
    //     if(!(field in req.body)) {
    //         const message = `Missing \`${field}\` in request body`;
    //         console.error(message);
    //         res.status(400).send(message);
    //     }
    // });
    // res.status(201).json(entry);
});

router.delete('/:id', jsonParser, (req, res) => {
    BlogPosts.delete(req.params.id);
    console.log(`Deleted blog post \`${req.params.id}\``);
    res.status(204).end();
});

router.put('/:id', jsonParser, (req, res) => {
    const requiredFields = ['title', 'content', 'author'];
    requiredFields.forEach(field => {
        if(!(field in req.body)) {
            const message = `Missing \`${field}\` in request body`;
            console.error(message);
            return res.status(400).send(message);
        }
    });
    if (req.params.id !== req.body.id) {
        const message = (`Request path id (${req.params.id}) and request body id (${req.body.id} must match)`);
        console.error(message);
        return res.status(400).send(message);
    }
    console.log(`Updating blog post entry \`${req.params}\``);
    const updatedEntry = BlogPosts.update({
        id: req.params.id,
        title: req.body.title,
        content: req.body.content,
        author: req.body.author,
        publishDate: Date.now()
    });
    res.status(204).end();
});

module.exports = router;