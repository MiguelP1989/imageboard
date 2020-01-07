Vue.component("my-component", {
    template: "#popup-template",
    props: ["id"],
    data: function() {
        return {
            singleimage: "",
            title: "",
            comment: "",
            commentusername: "",
            username: "",
            timestamp: "",
            description: "",
            comments: []
        };
    },
    watch: {
        id: function() {
            var me = this;
            axios.get(`/singleimage/${me.id}`).then(function(resp) {
                if (resp.data.length > 0) {
                    me.singleimage = resp.data[0].url;
                    me.title = resp.data[0].title;
                    me.username = resp.data[0].username;
                    me.timestamp = resp.data[0]["created_at"];
                    me.description = resp.data[0].description;
                } else {
                    function closemodal() {
                        me.$emit("close");
                    }
                    closemodal();
                }
            });
        }
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
        axios.get(`/singleimage/${me.id}/comment`).then(function(resp) {
            me.comments = resp.data;
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
                username: this.commentusername
            };
            var me = this;

            axios
                .post(`/singleimage/${me.id}`, submittedComments)
                .then(function(resp) {
                    console.log("axios is working...!");
                    console.log("respod ", resp);
                    me.comments.unshift(resp.data[0]);
                })
                .catch(function(err) {
                    console.log("error: ", err);
                });
        }
    }
});
