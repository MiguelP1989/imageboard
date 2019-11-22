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
            currentImage: location.hash.slice(1),
            images: [],
            file: null,
            title: "",
            description: "",
            username: ""
        },
        mounted: function() {
            // console.log("my vue component has mounted");
            // console.log("this is my images data: ", this.images);
            var me = this;
            axios.get("/images").then(function(response) {
                console.log("response from /images :", response.data);
                // console.log("me.images: ", me.images);
                me.images = response.data;
                me.loadMore();
            });
        },
        methods: {
            handleChange: function(e) {
                console.log("handle change is happening...!!");
                console.log("e.target.files...", e.target.files[0]);
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

                var me = this;
                axios
                    .post("/upload", formData)
                    .then(function(response) {
                        console.log("uploaaaad, :", response.data);
                        // console.log("me.results....", me.data);

                        me.images.unshift(response.data.image);
                    })
                    .catch(function(err) {
                        console.log("error in post upload..", err);
                    });
            },
            popupmodal: function(id) {
                this.currentImage = id;
                console.log("id.....", id);
            },
            closingthemodal: function() {
                this.currentImage = 0;
            },

            loadMore: function() {
                var me = this;
                window.onscroll = function() {
                    console.log("scroll running");
                    let bottomOfWindow =
                        document.documentElement.scrollTop +
                            window.innerHeight ===
                        document.documentElement.offsetHeight;
                    // console.log(document.documentElement.scrollTop);
                    // console.log("me.image inside scroll :", me.images);
                    // console.log("bottomOfWindow...", bottomOfWindow);
                    // console.log("thiiiiiss: ", me);
                    let lastimageid = me.images[me.images.length - 1].id;
                    console.log("lastimageid...", lastimageid);
                    if (bottomOfWindow == true) {
                        console.log("lastimageid....", lastimageid);
                        console.log("we are in the infinite scrool!");
                        axios
                            .get("/loadImages/" + lastimageid)
                            .then(response => {
                                console.log("response.data ", response.data);
                                me.images = me.images.concat(response.data);
                            });
                    }
                };
            }
        }
    });
})();

// if (nextUrl) {
//     checkScroll();
// }
// mounted: function(){
//     var me = this
// }
// addEventListener("hashcahage", function() {
//     console.log(location.hash.slice(1));
// });

// <a v-for:images in images
