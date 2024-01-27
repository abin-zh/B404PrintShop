<template>
    <div class="main">
        <div class="content" v-loading="true" element-loading-text="打印中...">
            
        </div>
        <el-button type="info" size="large" :icon="Close" circle></el-button>
        <!-- <el-button v-else type="success" size="large" :icon="Check" circle></el-button>     -->
    </div>
</template>

<script>
import { Check, Close } from '@element-plus/icons-vue'
import { useCommonStore } from '@/store/common'

export default {
    setup() {
        return {
            Check,
            Close
        }
    },
    mounted() {
        const useCommon = useCommonStore()
        useCommon.setSteps(4)
    },
    data() {
        return {

        }
    },
    methods: {

    },
}
</script>

<style>
.print-title{
    height: 240px;
    text-align: center;
}
.demo-progress .el-progress--line {
    margin-bottom: 15px;
    width: 350px;
}
</style>