<template>
    <div id="ap-ts-wrapper">
        <h2 class="ap-ts-chapter">チャプター</h2>
        <div>
            <ul class="ap-ts-list">
                <li
                    v-for="(link, i) in list"
                    :key="link[0]"
                    @click="click(link[0])"
                    :class="isNow(i)"
                >
                    <div class="ap-ts-state">
                        <i
                            class="fas fa-1x scoped-state"
                            :class="{
                                'fa-globe': link[2] == 9999999,
                                'fa-lock': link[2] != 9999999,
                            }"
                        ></i>
                    </div>
                    <span class="ap-ts-title">{{ link[1] }}</span>
                    <span class="ap-ts-time">{{ convTime(link[0]) }}</span>
                    <div v-if="link[2] != 9999999 || Auth > 0" @click="del(link)"><i class="fas fa-trash fa-1x"></i></div>
                    <div v-if="link[2] != 9999999 || Auth > 0" @click="edit(link)"><i class="fas fa-edit fa-1x"></i></div>
                </li>
                <li @click="chapteredit">
                    <i class="far fa-plus-square fa-1x"></i>
                    <span class="ap-ts-title">新規追加</span>
                    <span class="ap-ts-time"></span>
                </li>
            </ul>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        list: {
            type: Array,
            required: true,
        },
        Auth: {
            type: Number,
            default: 0,
        },
    },
    data() {
        return {
            nowIndex: NaN,
        };
    },
    methods: {
        del(e) {
            this.$emit("del", e);
        },
        edit(e){
            this.$emit("chapteredit", e[0], e[1], e[3],e[2]);
        },
        chapteredit() {
            this.$emit("chapteredit", NaN, "新規チャプター", NaN);
        },
        click(second) {
            this.$emit("click", second);
        },
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
        changeTime(second) {
            second = Math.floor(second);

            this.nowIndex = NaN;
            for (let i = 0; i < this.list.length; i++) {
                let s = true;
                if (this.list[i + 1]) {
                    s = second < this.list[i + 1][0];
                }
                if (second >= this.list[i][0] && s) {
                    this.nowIndex = i;
                    break;
                }
            }
        },
        isNow(i) {
            return {
                "ap-ts-now": i === this.nowIndex,
            };
        },
    },
    computed: {
        isShow() {
            return this.list.length > 0;
        },
    },
};
</script>

<style lang="scss" scoped>
#ap-ts-wrapper {
    background-color: #f0f0f0;
    margin: 5px;
    border: 1px solid #8f8f8f;

    .ap-ts-chapter {
        font-size: 1.5em;
        padding: 5px 10px;
        color: black;
    }
    .ap-ts-hid-title {
        color: #8f8f8f;
        font-size: 0.7em;
    }
    .ap-ts-list {
        margin-bottom: 0;
        font-size: initial;
        list-style: none;
        li {
            width: 100%;
            padding: 5px;
            cursor: pointer;
            font-size: initial;
            @media screen and (min-width: 767px) {
                &:hover {
                    background-color: #bfbfbf;
                }

                .fa-trash:hover {
                    transition: 0.2s;
                    color: red;
                }
                .fa-edit:hover {
                    transition: 0.2s;
                    color: rgb(255, 255, 255);
                }
            }
            .fa-edit{
                margin-left: 5px;
            }
            .fa-trash ,.fa-edit{
                color: #c2c2c2;
                cursor: pointer;
                padding: 5px;
                background-color: #5f5f5f;
                padding-top: 2px;
                border-radius: 3px;
            }
            display: flex;
            .ap-ts-state{
                width: 23px;
            }
            .ap-ts-title {
                display: block;
                font-size: 1.3em;
                font-weight: bold;
                color: black;
                min-width: 50%;
            }
            .ap-ts-time {
                display: block;
                font-size: 1em;
                color: #373737;
                min-width: 50px;
            }
            &.ap-ts-now {
                border-left: blue solid 3px;
                background-color: #bad3ff;
            }
            .scoped-state {
                color: #8f8f8f;
            }
        }
    }
}
</style>
