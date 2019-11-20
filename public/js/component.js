// Vue.component("my-component", {
//     template: `<h2>Hello</h2>`,
//     // supporting old browsers
//     // template: `#my-template`
//     data:function () {
//         return{
//             subGreeting: "yo!"
//         }
//     },
//     props: ["grettee"],
//     mathod: {
//         changeSubGreeting: function() {
//             this.subGreeting = "nice to see you";
//
//         }
//     }
// });

// data: should be  function that returns an object

// in HTML - can't be placed on the main element - must be outside of the vuw instance
// requires to be only one element
// <script type="text/x-template" id="my-template">
// <div>
//     <h3 @click="changeSubGreeting">{{subGreeting}} {{greetee}}</h3>
//     <h4>hello hello hello</4>

// </script>;

Vue.component("my-component", {
    template: "#popup-template",
    props: ["id"],
    data: function() {
        return {
            singleimage: "",
            title: "",
            comment: "",
            username: "",
            timestamp: "",
            description: "",
            comments: []
        };
    },
    mounted: function() {
        console.log("i will always love vueee");
        var me = this;
        axios
            .get(`/singleimage/${me.id}`)
            .then(function(resp) {
                console.log("response from :", resp.data);
                me.singleimage = resp.data[0].url;
                me.title = resp.data[0].title;
                me.username = resp.data[0].username;
                me.timestamp = resp.data[0]["created_at"];
                me.description = resp.data[0].description;
            })
            .catch(err => {
                console.log("errrorr:  ", err);
            });
    },

    methods: {
        closemodal: function() {
            this.$emit("close");
        },
        submitcomment: function(e) {
            e.preventDefault();

            console.log("APRRRRRRILLL");
            var submittedComments = {
                comment: this.comment,
                username: this.username
            };
            var me = this;

            axios
                .post(`/singleimage/${me.id}`, submittedComments)
                .then(function(resp) {
                    console.log("axios is working...!");
                    console.log("respod ", resp);
                    me.comments.unshift(resp.data[0].comment);
                    me.username = resp.data[0].username;
                    me.timestamp = resp.data[0]["created_at"];
                })
                .catch(function(err) {
                    console.log("error: ", err);
                });
        }
    }
});
