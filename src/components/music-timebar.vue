<template>
    <div class="mp-tb-wrapper">
        <vue-slider
            :drag-on-click="true"
            :lazy="true"
            :marks="markcomp"
            tooltip="none"
            @drag-start="drag = true"
            @dragging="change"
            @drag-end="drag = false"
            @change="change"
            class="mp-tb-slider"
            height="8px"
            ref="slider"
            max="500"
        ></vue-slider>
        <clock :val="val" :max="max" :rate="rate" ref="clock"></clock>
    </div>
</template>

<script>
import VueSlider from "vue-slider-component";
import "vue-slider-component/theme/antd.css";
import clock from "./clock.vue";

export default {
    components: {
        VueSlider,
        clock,
    },
    props: {
        max: {
            type: Number,
            required: true,
        },
        marks: {
            type: Array,
            required: false,
            default: null,
        },
    },
    data() {
        return {
            drag: false,
            val: 0,
        };
    },
    methods: {
        refs_change(second){
            this.change(second * this.rate);
        },
        change(val) {
            if (this.drag) {
                val = (1 / this.rate) * val;
                this.$emit("change", val);
            }
        },
        timechange(v) {
            if (this.drag) {
                return;
            }

            if (this.$refs.slider) {
                this.val = this.$refs.slider.getValue();
            } else {
                this.val = 0;
            }
            this.$refs.slider.setValue(v * this.rate);
        },
        stop() {
            this.val = -1;
        },
    },
    computed: {
        rate() {
            return 500 / this.max;
        },
        markcomp() {
            let d = {};
            this.marks.map((v) => {
                if (this.max < v * this.rate) {
                } else {
                    let val = this.$refs.clock.convTime(Math.floor(v));
                    d[Math.floor(v * this.rate)] = "";
                }
            });
            return d;
        },
    },
};
</script>

<style lang="scss">
.mp-tb-wrapper {
    padding: 3px 10px;
}
</style>
