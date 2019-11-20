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

module.exports.getSelectedImage = function(imageid) {
    return db.query(
        `SELECT * FROM images
            WHERE id = $1`,
        [imageid]
    );
};

exports.insertComment = function(comment, username, imageId) {
    return db.query(
        `
            INSERT INTO comments (comment, username, image_id)
            VALUES ($1, $2, $3)
            RETURNING comment, username, created_at`,
        [comment || null, username || null, imageId]
    );
};

exports.getComments = function(id) {
    return db.query(
        `SELECT * FROM comments
        WHERE image_id = $1
        ORDER BY id DESC`,
        [id]
    );
};
