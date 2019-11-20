const express = require("express");
const db = require("./utils/db");
const multer = require("multer");
const uidSafe = require("uid-safe");
const path = require("path");
const s3 = require("./s3");
const { s3Url } = require("./config");
const app = express();

const diskStorage = multer.diskStorage({
    destination: function(req, file, callback) {
        callback(null, __dirname + "/uploads");
    },
    filename: function(req, file, callback) {
        uidSafe(24).then(function(uid) {
            callback(null, uid + path.extname(file.originalname));
        });
    }
});

const uploader = multer({
    storage: diskStorage,
    limits: {
        fileSize: 2097152
    }
});

app.use(express.static("./public"));

app.use(
    express.urlencoded({
        extended: false
    })
);

app.use(express.json());

app.post("/upload", uploader.single("file"), s3.upload, function(req, res) {
    // console.log("this is the upload file...!");
    // console.log("input....:", req.body);
    // console.log(("input...", req.file));
    const { title, desc, username } = req.body;
    const imageUrl = `${s3Url}/${req.file.filename}`;
    console.log("imaaaaaaaaaaaaaaage   :", imageUrl);
    db.addImage(title, desc, username, imageUrl)
        .then(({ rows }) => {
            if (req.file) {
                res.json({
                    image: rows[0],
                    success: true
                });
            }
        })
        .catch(err => {
            console.log("err...", err);
        });
});

app.get("/images", (req, res) => {
    db.getImages()
        .then(results => {
            // console.log("results  :", results);
            let rows = results.rows;
            res.json(rows);
        })
        .catch(err => console.log("err ", err));
});

//////////    get singleimage comments///////

app.get("/singleimage/:id", (req, res) => {
    console.log("req.params....", req.params);
    let imageid = req.params.id;
    db.getSelectedImage(imageid).then(results => {
        console.log("results....", results);

        let rows = results.rows;
        res.json(rows);
    });
});

// app.get("/singleimage/:id", (req, res) => {
//     let imageid = req.params.id;
//     db.getComments(imageid).then(data => {
//         console.log("daaaaaata....", data);
//         let rows = data.rows;
//         res.json(rows);
//     });
// });

//////////// post comments //////////

app.post("/singleimage/:id", (req, res) => {
    console.log("req.bodoooooody....:", req.body);
    let comment = req.body.comment;
    let username = req.body.username;
    let imageid = req.params.id;
    db.insertComment(comment, username, imageid).then(results => {
        console.log("results from insertComment...:", results);
        let rows = results.rows;
        res.json(rows);
    });
});

app.listen(8080, () => console.log("imageboard up and running...."));
