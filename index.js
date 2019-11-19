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

    // if (req.file) {
    //     res.json({
    //         success: true
    //     });
    // } else {
    //     res.json({
    //         success: false
    //     });
    // }
});

app.get("/images", (req, res) => {
    db.getImages()
        .then(results => {
            // console.log("results  :", results);
            let rows = results.rows;
            res.json(rows);
        })
        .catch(err => console.log("err ", err));

    // db.saveUploads().the()
});
// let animals = [
//     {
//         name: "Squid",
//         emoji: "🦑"
//     },
//     {
//         name: "Rabbit",
//         emoji: "🐇"
//     }
// ];
// });

app.listen(8080, () => console.log("imageboard up and running...."));
