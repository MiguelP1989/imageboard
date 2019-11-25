var spicedPg = require("spiced-pg");
var db = spicedPg(
    process.env.DATABASE_URL ||
        "postgres:postgres:postgres@localhost:5432/imageboard"
);

module.exports.getImages = function() {
    return db.query(`SELECT * FROM images ORDER BY id DESC LIMIT 8`);
};

module.exports.addImage = function(title, description, username, imageUrl) {
    return db.query(
        `
            INSERT INTO images (title, description, username, url)
            VALUES ($1, $2, $3, $4)
            RETURNING id, url, username, title, description`,
        [title || null, description || null, username || null, imageUrl]
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

// module.exports.getImages = function() {
//     return db.query(`SELECT images.*, (
//         select id from images
//         order by asc limit 1
//         ) as "lowerId" from images
//         WHERE id < $1
//         ORDER BY id DESC
//         LIMIT 10`);
// };

// // OFFSET 10 OR OFFSET $1
exports.loadImages = function(imagId) {
    return db.query(
        `SELECT * FROM images
    WHERE id < $1
    ORDER BY id DESC`,
        [imagId]
    );
};

exports.saveTag = function(tag, image_id) {
    return db.query(
        `
            INSERT INTO tags (tag, image_id)
            VALUES ($1, $2)
            RETURNING tag, image_id`,
        [tag, image_id || null]
    );
};

exports.getTags = function(tag) {
    console.log("taggggg...", tag);
    return db.query(
        `SELECT images.id AS id, url, title, description, username, tag
            FROM tags
            JOIN images
            ON images.id = tags.image_id
            WHERE LOWER(tag) = lOWER($1)
            ORDER BY id DESC

            `,
        [tag]
    );
};

// SELECT first, last, city, age, url, email
//         FROM users
//         JOIN user_profiles
//         ON users.id = user_profiles.user_id
//         WHERE users.id=$1`,
