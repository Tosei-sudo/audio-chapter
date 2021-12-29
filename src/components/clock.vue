<template>
    <div class="mp-tb-stamp">
        {{ stamp }}
    </div>
</template>

<script>
export default {
    props: {
        val: {
            type: Number,
            required: true,
        },
        max: {
            type: Number,
            required: true,
        },
        rate: {
            type: Number,
            required: true,
        },
    },
    data() {
        return {
            stamp: "--:--/--:--",
        };
    },
    methods: {
        convTime(second) {
            let h = Math.floor(second / 3600);
            let m = Math.floor((second % 3600) / 60);
            let s = Math.floor(second % 60);
            return (
                (h > 0 ? h + ":" : "") +
                (m < 10 ? "0" + m : m) +
                ":" +
                (s < 10 ? "0" + s : s)
            );
        },
    },
    watch: {
        val(v) {
            let val, max;
            if(v == -1){
                return "--:--/--:--";
            }
            v = (1 / this.rate) * v;
            try {
                val = this.convTime(v);
                max = this.convTime(this.max);
            } catch (e) {
                val = "--:--";
                max = "--:--";
            }
            this.stamp = val + "/" + max;
        },
    },
};
</script>

<style>
.mp-tb-stamp{
    text-align: center;
    font-size: 1.5em;
    color: #eee;
}
</style>
