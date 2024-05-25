var express = require("express")
var bodyParser = require("body-parser")
var mongoose = require("mongoose")

const app = express()
const path = require('path');

// Route handler for rendering 'index.html'

app.use(bodyParser.json())
app.use(express.static('public'))
app.use(bodyParser.urlencoded({
    extended: true
}))

mongoose.connect('mongodb://127.0.0.1:27017/mydb', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

var db = mongoose.connection;

db.on('error', () => console.log("Error in Connecting to Database"));
db.once('open', () => console.log("Connected to Database"))

app.post("/signup", (req, res) => {
    var name = req.body.name;
    var email = req.body.email;
    var password = req.body.password;
    var data = {
        "name": name,
        "email": email,
        "password": password,
    }

    db.collection('user').insertOne(data, (err, collection) => {
        if (err) {
            throw err;
        }
        console.log("Record Inserted Successfully");

    });

    return res.redirect('index.html')

});

app.post("/login", (req, res) => {
    var email = req.body.email;
    var password = req.body.password;

    db.collection('user').findOne({ email: email }, (err, user) => {
        if (err) {
            console.error("Error finding user:", err);
            return res.status(500).send("Internal Server Error");
        }
        if (!user) {
            return res.status(401).send('"Incorrect email or password" ');
        }
        
        if (user.password === password) {
            res.status(200).redirect('loginsuccess.html')
        } else {
            res.status(401).redirect('incorrect.html');
        }
    });
});


app.get('/', (req, res) => {
    res.sendFile(path.join(HTF23 - TEAM - 20 - MAIN, 'public', 'index.html'));

}).listen(3000);


console.log("Listening on PORT 3000");