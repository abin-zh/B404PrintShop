<template>
    <el-container>
        <el-header>
            <el-steps :active="steps" simple>
                <el-step title="信息" :icon="InfoFilled" />
                <el-step title="上传" :icon="UploadFilled" />
                <el-step title="付款" :icon="Coin" />
                <el-step title="打印" :icon="Coin" />
            </el-steps>
        </el-header>
        <el-main>
            <router-view></router-view>
        </el-main>
        <el-affix position="bottom" :offset="20">
            <div class="dark-mode">
                <div @click="swiDarkMode">
                    <el-icon :size="21">
                        <icon-ep-sunny v-if="darkMode" />
                        <icon-ep-moon v-else />
                    </el-icon>
                </div>
            </div>
        </el-affix>
    </el-container>
</template>

<script>
import { ref } from 'vue'
import { useDark, useToggle } from '@vueuse/core'
import { InfoFilled, Coin, UploadFilled } from '@element-plus/icons-vue'
import { useCommonStore } from '@/store/common'

const isDark = useDark()


export default {
    setup() {
        return {
            InfoFilled,
            Coin,
            UploadFilled,
        }
    },
    data() {
        return {
            darkMode: ref(isDark.value),
        }
    },
    computed: {
        steps() {
            const useCommon = useCommonStore()
            return useCommon.getSteps
        },
    },
    methods: {
        swiDarkMode() {
            const toggleDark = useToggle(isDark)
            toggleDark()
            this.darkMode = isDark.value
        },
    },
}
</script>

<style>
.el-container {
    height: 100%;
    padding: 0 20px;
}

.el-header {
    padding: 0;
}

.main{
    display: flex;
    height: 70vh;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
}

.dark-mode {
    display: flex;
    justify-content: flex-end;
}

.dark-mode div {
    width: 31px;
    height: 31px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 64px;
    background-color: var(--el-color-primary-light-7);
    box-shadow: var(--el-box-shadow);
}

.dark-mode div:active {
    cursor: pointer;
    box-shadow: none;
}

.el-step.is-simple .el-step__title{
    font-size: 0.7em;
}
</style>
