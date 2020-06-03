const express = require('express');
const app = express();
const fs = require('fs');
const port = process.env.PORT || 9000;
var cors = require("cors");
var path = require('path');
var {logger} = require ('./logger')

var folder_path = path.join(__dirname, 'forms');
app.use(cors());

app.use ((req , res , next) => {
    logger.info('info' , 'error')
    next()
})
var server = app.listen(port  , () => {console.log(`Example app listening at http://localhost:${port}`)})


app.post('/api/forms/:id(\\d+)', express.json(), (req, res) => {

    let { id } = req.params;
    fs.appendFile(`./forms/form${id}.json`, JSON.stringify(req.body), function (err) {
        if (err) throw err;
        console.log('Saved!');
    });
    console.log(req.body)
    res.json({done : true})
});

app.post('/api/forms/:id(\\d+)/submitted', express.json(), (req, res) => {
    console.log(req.body)
    res.json({done : true})
});


app.get('/api/forms', (req, res) => {
    var forms = fs.readdirSync(folder_path);
    var result = []
    forms.forEach(Element => {
        const form = fs.readFileSync(path.join(folder_path, Element));
        const json_form = JSON.parse(form);
        result.push({
            id: json_form.id,
            title: json_form.title
            });
    });
    if (result == null){
        logger.logger.error(err);
    }
    res.send(result);
});

app.get('/api/forms/:id(\\d+)', (req, res) => {

  let forms = fs.readdirSync(folder_path);
  let { id } = req.params;
  let result ;
  forms.forEach((Element) => {
    const form = fs.readFileSync(path.join(folder_path, Element));
    const json_form = JSON.parse(form);
    if (json_form.id === id) {
        result = json_form;
    }
  });

  if (result == null) {
    res.status(404)
      .json({
        err: 'Couldn\'t find the file you requested!',
      });
  } else {
    res.json(result);
  }
});

