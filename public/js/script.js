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

new Vue({
    el: "#main",
    data: {
        images: []
    },
    mounted: function() {
        console.log("my vue component has mounted");
        console.log("this is my animals data: ", this.images);
        var me = this;
        axios.get("/images").then(function(response) {
            console.log("response from /animals :", response.data);
            console.log("me.animals: ", me.images);
            me.images = response.data;
        });
    }
});
