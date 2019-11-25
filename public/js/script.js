// console.log("sanitycheck!!!!");

// new Vue({
//     el: "#main",
//     data: {
//         name: "Habanero!",
//         seen: false,
//         animals: []
//         // animals: [
//         //     {
//         //         name: "Squid",
//         //         emoji: "🦑"
//         //     },
//         //     {
//         //         name: "Rabbit",
//         //         emoji: "🐇"
//         //     }
//         // ]
//     },
//     mounted: function() {
//         console.log("my vue component has mounted");
//         console.log("this is my animals data: ", this.animals);
//         var me = this;
//         axios.get("/animals").then(function(response) {
//             console.log("response from /animals :", response.data);
//             console.log("me.animals: ", me.animals);
//             me.animals = response.data;
//         });
//     },
//     methods: {
//         myFunction: function(nameClickedOn) {
//             console.log("my function is running");
//             console.log("nameClickedOn :", nameClickedOn);
//             this.name = nameClickedOn;
//         }
//     }
// });
(function() {
    new Vue({
        el: "#main",
        data: {
            currentImage: location.hash.slice(1) || null,
            images: [],
            tags: [],
            file: null,
            title: "",
            description: "",
            username: "",
            tag: "",
            fuit: false,
            veg: false
        },

        mounted: function() {
            var me = this;
            window.addEventListener("hashchange", function() {
                me.currentImage = location.hash.slice(1);
            });

            // console.log("my vue component has mounted");
            // console.log("this is my images data: ", this.images);

            axios.get("/images").then(function(response) {
                // console.log("response from /images :", response.data);
                // console.log("me.images: ", me.images);
                me.images = response.data;
                me.loadMore();
            });
        },
        methods: {
            handleChange: function(e) {
                // console.log("handle change is happening...!!");
                // console.log("e.target.files...", e.target.files[0]);
                this.file = e.target.files[0];
                // var file = file.files[0];
            },
            submitFile: function(e) {
                e.preventDefault();
                console.log("thissss..:", this);
                let formData = new FormData();
                formData.append("file", this.file);
                formData.append("title", this.title);
                formData.append("description", this.description);
                formData.append("username", this.username);
                console.log("this description", this.description);

                var me = this;
                axios
                    .post("/upload", formData)
                    .then(function(resp) {
                        console.log("uploaaaad, :", resp.data);

                        me.images.unshift(resp.data.image);

                        var taggedImage = {
                            tag: me.tag,
                            image_id: resp.data.image.id
                        };

                        console.log("tagimage...", taggedImage);
                        axios
                            .post("/upload/tag", taggedImage)
                            .then(function(resp) {
                                // console.log("reeeeeesponse...taaaag", resp);
                                console.log(
                                    "respond.data.tag[0].....",
                                    resp.data[0]
                                );
                                me.tags.unshift(resp.data[0]);
                            });
                    })
                    .catch(function(err) {
                        console.log("error in post upload..", err);
                    });
            },
            popupmodal: function(id) {
                this.currentImage = id;
                // console.log("id.....", id);
            },
            closingthemodal: function() {
                this.currentImage = 0;
                location.hash = "";
            },

            loadMore: function() {
                var me = this;
                window.onscroll = function() {
                    console.log("scroll running");
                    let bottomOfWindow =
                        document.documentElement.scrollTop +
                            window.innerHeight ===
                        document.documentElement.offsetHeight;

                    let lastimageid = me.images[me.images.length - 1].id;

                    if (bottomOfWindow == true) {
                        axios
                            .get("/loadImages/" + lastimageid)
                            .then(response => {
                                console.log("response.data ", response.data);
                                me.images = me.images.concat(response.data);
                            });
                    }
                };
            },
            filterByTag: function(val) {
                this.tag = val;

                console.log("this.val...", this.tag);

                var me = this;
                axios
                    .get(`/images/${this.tag}`)
                    .then(function(resp) {
                        me.images = resp.data;

                        console.log("========aa..", resp.data);
                        let tag = resp.data[0].tag;
                        if (tag === "veg") {
                            me.veg = true;
                            me.fruit = false;
                        } else if (tag === "fruit") {
                            me.fruit = true;
                            me.veg = false;
                        }
                    })
                    .catch(err => {
                        console.log("error..", err);
                    });
            }
        }
    });
})();
