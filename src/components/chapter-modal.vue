<template>
    <transition>
        <div v-cloak class="cp-ed-wrapper" v-show="isShow">
            <div class="cp-ed-bg" @click="isShow = false"></div>
            <div class="cp-ed-body">
                <form @submit="save">
                    <label for="poawmdla56" class="cp-ed-label">
                        <span class="cp-ed-title">タイトル</span
                        ><input
                            type="text"
                            placeholder="タイトル"
                            class="cp-ed-input"
                            id="poawmdla56"
                            v-model="title_ans"
                    /></label>
                    <span class="cp-ed-label">
                        <span class="cp-ed-title">時間</span>
                        <vue-timepicker
                            class="cp-ed-input"
                            :format="form"
                            @change="timechange"
                            :value="time"
                            lazy
                            auto-scroll
                            close-on-complete
                        ></vue-timepicker
                    ></span>
                    <label class="cp-ed-label" v-if="Auth > 0">
                        <span class="cp-ed-title">公開範囲</span>
                        <select class="cp-ed-input" v-model="aria">
                            <option value="9999999">パブリック</option>
                            <option :value="UserID">プライベート</option>
                        </select>
                    </label>
                    <div class="cp-ed-ctrl">
                        <input
                            type="submit"
                            value="保存"
                            class="cp-ed-b cp-ed-yes"
                        />
                        <input
                            type="button"
                            value="キャンセル"
                            class="cp-ed-b cp-ed-no"
                            @click="isShow = false"
                        />
                    </div>
                </form>
            </div>
        </div>
    </transition>
</template>

<script>
import VueTimepicker from "vue2-timepicker";
import "vue2-timepicker/dist/VueTimepicker.css";

export default {
    components: {
        VueTimepicker,
    },
    props: {
        second: {
            type: Number,
            required: true,
        },
        max: {
            type: Number,
            required: true,
        },
        title: {
            type: String,
            default: "新規チャプター",
        },
        cid: {
            type: Number,
            default: NaN,
        },
        userid: {
            type: Number,
            default: NaN,
        },
        Auth: {
            type: Number,
            default: 0,
        },
    },
    data() {
        return {
            isShow: false,
            time: "",
            secondTime: 0,
            title_ans: "",
            aria: this.Auth > 0 ? 9999999 : sessionStorage.getItem("UserID"),
        };
    },
    methods: {
        show() {
            this.isShow = true;
        },
        convTime(second) {
            let h = Math.floor(second / 3600);
            let m = Math.floor((second % 3600) / 60);
            let s = Math.floor(second % 60);
            let f = "";
            if (h > 0 && h >= 10) {
                f = h + ":";
            } else if (h > 0) {
                f = "0" + h + ":";
            } else if (this.max < 3600) {
                f = "00:";
            } else {
                f = "";
            }
            return f + (m < 10 ? "0" + m : m) + ":" + (s < 10 ? "0" + s : s);
        },
        reverseTime(time) {
            let t = time.split(":");
            let h = parseInt(t[0]);
            let m = parseInt(t[1]);
            let s = parseInt(t[2]);
            return h * 3600 + m * 60 + s;
        },
        save(e) {
            e.preventDefault();
            console.log(this.secondTime);
            this.$emit(
                "save",
                this.secondTime,
                this.title_ans,
                this.cid,
                this.aria
            );
        },
        timechange(time) {
            let d = time["data"];
            let v =
                Number(d["HH"]) * 3600 + Number(d["mm"]) * 60 + Number(d["ss"]);
            this.secondTime = v;
        },
        hide() {
            this.isShow = false;
        },
    },
    computed: {
        form() {
            if (this.max < 3600) {
                return "mm:ss";
            } else {
                return "HH:mm:ss";
            }
        },
        UserID() {
            return sessionStorage.getItem("UserID");
        },
    },
    watch: {
        second(val) {
            this.time = this.convTime(val);
            this.secondTime = val;
        },
        title(val) {
            this.title_ans = val;
        },
        userid(val) {
            this.aria = val;
        },
    },
};
</script>

<style lang="scss">
.v-enter-active,
.v-leave-active {
    transition: opacity 0.5s;
    z-index: auto;
}

.v-enter,
.v-leave-to {
    opacity: 0;
}

.cp-ed-wrapper {
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
    .cp-ed-bg {
        width: 100%;
        height: 100%;
        background-color: rgba(30, 30, 30, 0.9);
        position: fixed;
        top: 0;
        left: 0;
        z-index: 5000;
    }
    .cp-ed-body {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 98%;
        max-width: 400px;
        padding: 15px;
        background-color: #fff;
        z-index: 5001;
        border-radius: 5px;
    }
    .cp-ed-b {
        display: inline-block;
        height: 40px;
        min-width: 80px;
        text-align: center;
        border-radius: 4px;
        font-weight: 700;
        font-size: 16px;
        padding: 6px 20px;
        cursor: pointer;
        &.cp-ed-yes {
            background-color: white;
            color: #0096d9;
            border: #0096d9 2px solid;
        }
        &.cp-ed-no {
            background-color: #0096d9;
            color: white;
            border: none;
        }
    }
    .cp-ed-label {
        display: flex;
        margin: 0 0 4px;
        padding-top: 10px;
        padding-right: 5px;
        .cp-ed-title {
            padding-top: 5px;
            display: block;
            width: 25%;
            text-align: center;
        }
        .cp-ed-input {
            display: block;
            width: 75%;
        }
    }
}
</style>
