<template>
    <div class="ap-wrapper">
        <div class="ap-title">{{ currentTitle }}</div>
        <div class="ap-ctrl" v-if="!loading">
            <audio-controller
                @play="c_play"
                @pause="c_pause"
                @next="next"
                @back="back"
                ref="controller"
            ></audio-controller>
        </div>
        <div v-if="!loading">
            <audio-timebar
                :max="max"
                :marks="marks"
                ref="audiotimebars"
                @change="change"
            ></audio-timebar>
        </div>
        <div class="ap-ts-editer">
            <chapter-editer
                :list="stamps"
                @click="markclick"
                :Auth="Auth"
                ref="timestamp"
                @chapteredit="chapteredit"
                @del="del"
            ></chapter-editer>
        </div>
        <div>
            <chapter-modal
                ref="modal"
                :second="second"
                :max="max"
                :title="title"
                @save="savechapter"
                :cid="cid"
                :Auth="Auth"
                :userid="userid"
                class="ap-ts-m"
            ></chapter-modal>
        </div>
        <vue-loading
            v-if="loading"
            type="bars"
            color="navy"
            :size="{ width: '100px', height: '100px' }"
        ></vue-loading>
    </div>
</template>

<script>
import audiocontroller from "./components/music-controller.vue";
import audiotimebar from "./components/music-timebar.vue";
import chapterediter from "./components/chapter-editer.vue";
import chaptermodal from "./components/chapter-modal.vue";
import { VueLoading } from "vue-loading-template";
import axios from "./axios";

class api {
    static EndPoint() {
        return [
            "/HumenFinder/php/audio/ChapterAPI",
            "/HumenFinder/php/audio/AudioAPI",
            "/HumenFinder/php/audio/GlobalChapterAPI",
            "/HumenFinder/php/ctrl/AuthAPI",
        ];
    }

    static get(AudioID) {
        let d = axios.getRestParm({ AudioID });
        return axios.get(this.EndPoint()[0], d);
    }

    static delete(ChapterID, UserID) {
        let e = (UserID = 9999999 ? this.EndPoint()[2] : this.EndPoint()[0]);
        let d = axios.getRestParm({ ChapterID });
        return axios.delete(e, d);
    }

    static getMeta(AudioID) {
        let d = axios.getRequestParm("getAudioList", { AudioID });
        return axios.get(this.EndPoint()[1], d);
    }

    static post(AudioID, Title, Second, UserID = 9999999) {
        let d = axios.getRestParm({
            AudioID,
            Title,
            Second,
        });
        if (UserID != 9999999) {
            return axios.post(this.EndPoint()[0], d);
        } else {
            return axios.post(this.EndPoint()[2], d);
        }
    }

    static put(ChapterID, AudioID, Title, Second, UserID = 9999999 ,Auth = 0) {
        let d = axios.getRestParm({
            ChapterID,
            AudioID,
            Title,
            Second,
            UserID,
        });
        if (Auth == 0) {
            return axios.put(this.EndPoint()[0], d);
        } else {
            return axios.put(this.EndPoint()[2], d);
        }
    }

    static check() {
        let d = axios.getRestParm({});
        return axios.get(this.EndPoint()[3], d);
    }
}

export default {
    components: {
        "audio-controller": audiocontroller,
        "audio-timebar": audiotimebar,
        VueLoading,
        "chapter-editer": chapterediter,
        "chapter-modal": chaptermodal,
    },
    data() {
        return {
            audio: null,
            currentAudioID: 0,
            currentpath: "",
            currentTitle: "Loading...",
            max: 0,
            stamps: [],
            loading: true,
            second: 0,
            title: "",
            cid: NaN,
            userid: NaN,
            Auth: 0,
        };
    },
    created() {
        let i = axios.getParam("a");
        let a = [api.getMeta(i), api.get(i), api.check()];
        Promise.all(a).then((res) => {
            let m = res[0].data.Body.Data[0];
            this.currentAudioID = m.AudioID;
            this.currentTitle = m.Title;
            this.currentpath = m.url;

            res[1].data.Body.Data.forEach((item) => {
                this.stamps.push([
                    item.Second,
                    item.Title,
                    item.UserID,
                    item.ChapterID,
                ]);
            });
            this.audio = new Audio(this.currentpath);
            this.setup();
            this.loading = false;

            let c = res[2].data.Body.Data["Authority2"];
            this.Auth = c;
        });
    },
    methods: {
        del(Chapter) {
            this.c_pause();
            let ChapterID = Chapter[3];
            let UserID = Chapter[2];
            this.$dialog
                .confirm(
                    {
                        title: "確認",
                        body: "削除してもよろしいですか？",
                    },
                    {
                        okText: "はい",
                        cancelText: "キャンセル",
                        reverse: true,
                    }
                )
                .then(() => {
                    api.delete(ChapterID, UserID).then((res) => {
                        this.stamps = this.stamps.filter(
                            (item) => item[3] != ChapterID
                        );
                        this.c_play();
                    });
                })
                .catch(() => {
                    this.c_play();
                });
        },
        markclick(second) {
            if (this.audio) {
                this.audio.currentTime = Math.floor(second);
            }
        },
        c_play() {
            this.audio.play();
        },
        c_pause() {
            this.audio.pause();
        },
        change(v) {
            this.audio.currentTime = v;
        },
        setup() {
            this.audio.oncanplay = () => {
                this.max = this.audio.duration;
            };
            this.audio.ontimeupdate = () => {
                this.$refs.timestamp.changeTime(this.audio.currentTime);
                this.$refs.audiotimebars.timechange(this.audio.currentTime);
            };
            this.audio.onpause = () => {
                this.$refs.controller.stop();
                this.$refs.audiotimebars.stop();
            };
            this.audio.onplay = () => {
                this.$refs.controller.start();
            };
        },
        next() {
            if (this.audio.currentTime + 10 > this.audio.duration) {
                this.audio.currentTime = this.audio.duration;
            } else {
                this.audio.currentTime += 10;
            }
        },
        back() {
            if (this.audio.currentTime < 10) {
                this.audio.currentTime = 0;
            } else {
                this.audio.currentTime -= 10;
            }
        },
        chapteredit(second, Title, cid, userid = NaN) {
            if (!second) {
                if (this.audio) {
                    second = this.audio.currentTime;
                } else {
                    second = 0;
                }
            }
            this.second = second;
            this.title = Title;
            this.cid = cid;
            this.userid = userid;
            this.c_pause();
            this.$refs.modal.show();
        },
        savechapter(second, Title, cid, userid) {
            this.stamps.filter((item) => {
                return item[3] !== cid;
            });
            if (Number.isNaN(cid)) {
                api.post(this.currentAudioID, Title, second, userid).then(
                    (res) => {
                        this.stamps.push([
                            second,
                            Title,
                            userid,
                            res.data.Body.ChapterID,
                        ]);
                        this.stamps.sort((a, b) => {
                            return a[0] - b[0];
                        });
                    }
                );
            } else {
                api.put(cid, this.currentAudioID, Title, second, userid,this.Auth).then(
                    (res) => {
                        this.stamps.map((item) => {
                            if (item[3] == cid) {
                                item[0] = second;
                                item[1] = Title;
                                item[2] = userid;
                            }
                        });
                    }
                );
            }
            this.$refs.modal.hide();
            this.c_play();
        },
    },
    computed: {
        marks() {
            let marks = [];
            if (this.stamps) {
                for (let time of this.stamps) {
                    marks.push(time[0]);
                }
            } else {
                return null;
            }
            return marks;
        },
    },
};
</script>

<style lang="scss">
.ap-wrapper {
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
    border: 3px solid gray;
    background-color: #999;
    .ap-ml {
        overflow-y: auto;
    }
    @media screen and (min-width: 1024px) {
        font-size: 18px;
    }
    @media screen and (max-width: 1023px) and (min-width: 768px) {
        font-size: 14px;
    }
    @media screen and (max-width: 767px) {
        font-size: 10px;
    }
    .ap-title {
        font-size: 1.8em;
        text-align: left;
        margin-top: 10px;
        margin-left: 10px;
    }
    .ap-ts-m {
        z-index: 20;
    }
}

.vue-slider-mark,
.vue-slider-process,
.vue-slider-dot {
    z-index: 0 !important;
}
</style>
