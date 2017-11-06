<template>
    <div style="width:100%;height:95%;">
        <iframe v-bind:src="user.loginUrl+'&t='+Math.random()" @load="load()" width="0" height="0">
        </iframe>
        <iframe id="fineReport" frameborder="0" width="100%" height="100%" scrolling="no">
        </iframe>
    </div>
</template>
<script>
export default {
    name: 'FineReport',
    data() {
        return {
            user: loginUtils.getUserInfo(),
        }
    },
    beforeRouteUpdate(to, from, next) {
        if (to.query.name !== from.query.name) {
            next();
            this.load()
        }
    },
    methods: {
        load() {
            var name = this.$route.query.name;
            if (name) {
                var iframe = document.getElementById("fineReport");
                var src = this.user.domainUrl + "/WebReport/ReportServer?reportlet=" + name;
                var op = this.$route.query.op;
                if (op) {
                    src += "&op=" + op;
                }
                var __bypagesize__ = this.$route.query.__bypagesize__;
                if (__bypagesize__) {
                    src += "&__bypagesize__=" + __bypagesize__;
                }
                iframe.src = src;
            }
        }
    }
}
</script>