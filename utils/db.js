var spicedPg = require("spiced-pg");
var db = spicedPg(
    process.env.DATABASE_URL ||
        "postgres:postgres:postgres@localhost:5432/imageboard"
);

module.exports.getImages = function() {
    return db.query(`SELECT * FROM images ORDER BY id DESC`);
};

module.exports.addImage = function(title, des, username, imageUrl) {
    return db.query(
        `
            INSERT INTO images (title, description, username, url)
            VALUES ($1, $2, $3, $4)
            RETURNING id, url, username, title, description`,
        [title || null, des || null, username || null, imageUrl]
    );
};
