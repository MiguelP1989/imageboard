const express = require("express");
const app = express();
app.use(express.static("./public"));
const db = require("./utils/db");

app.get("/images", (req, res) => {
    db.getImages()
        .then(results => {
            console.log("results  :", results);
            let rows = results.rows;
            res.json(rows);
        })
        .catch(err => console.log("err ", err));

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
});

app.listen(8080, () => console.log("imageboard up and running...."));
