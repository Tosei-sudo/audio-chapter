<template>
    <div v-cloak class="ln-wrapper">
        <div class="ln-bg"></div>
        <div class="ln-body">
            <h2>LINE通知送信</h2>
            <div class="ln-input">
                <div>
                    <span>
                        送信先
                        <select v-model="room">
                            <option
                                v-for="room in rooms"
                                :key="room.id"
                                :value="room.id"
                            >
                                {{ room.name }}
                            </option>
                        </select>
                    </span>
                </div>
                <div>
                    <label for="ln-alart-bool"
                        ><input
                            type="checkbox"
                            id="ln-alart-bool"
                            v-model="alart"
                        />プッシュ通知
                    </label>
                </div>
            </div>
            <div class="ln-ctrl">
                <input type="button" value="送信" class="ln-b ln-yes" />
                <input type="button" value="キャンセル" class="ln-b ln-no" />
            </div>
        </div>
    </div>
</template>

<script>


export default {
    props: {
        rooms: {
            type: Array,
            required: true,
        },
        message: {
            type: String,
            required: false,
            default: "",
        },
    },
    data() {
        return {
            room: "",
            alart: true,
        };
    },
    watch: {
        rooms: function (newVal, oldVal) {
            this.room = newVal[0].id;
        },
    },
};
</script>

<style lang="scss" scoped>
.ln-wrapper {
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
    .ln-bg {
        width: 100%;
        height: 100%;
        background-color: rgba(30, 30, 30, 0.9);
        position: fixed;
        top: 0;
        left: 0;
        z-index: 5000;
    }
    .ln-body {
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
    .ln-input {
        border-bottom: 2px solid #e1e6ea;
        padding-bottom: 15px;
    }
    .ln-ctrl {
        padding: 15px 0 0;
        display: flex;
        justify-content: space-between;
    }
    .ln-b {
        display: inline-block;
        height: 40px;
        min-width: 80px;
        text-align: center;
        border-radius: 4px;
        font-weight: 700;
        font-size: 16px;
        padding: 6px 20px;
        cursor: pointer;
        &.ln-yes {
            background-color: white;
            color: #0096d9;
            border: #0096d9 2px solid;
        }
        &.ln-no {
            background-color: #0096d9;
            color: white;
            border: none;
        }
    }
}
</style>
