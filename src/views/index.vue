<template>
    <div class="main">
        <div class="content">
            <h1>欢迎打印</h1>
            <el-form ref="printInfo" :model="printInfo" :rules="rules">
                <el-form-item label="打印份数" prop="copies">
                    <el-input-number v-model="printInfo.copies" />
                </el-form-item>
                <el-form-item label="打印尺寸" prop="pageFormat">
                    <el-select v-model="printInfo.pageFormat" clearable>
                        <el-option v-for="item in sizes" :key="item.value" :value="item.value" :label="item.label">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="领取姓名" prop="userName">
                    <el-input v-model="printInfo.userName" placeholder="领取人姓名" />
                </el-form-item>
            </el-form>
        </div>
        <el-button @click="next" type="primary" size="large" :icon="Right" circle></el-button>
    </div>
</template>

<script>
import { Right } from '@element-plus/icons-vue'
import { useCommonStore } from '@/store/common'

export default {
    setup() {
        return {
            Right,
        }
    },
    mounted() {
        const useCommon = useCommonStore()
        useCommon.$reset()
        useCommon.setSteps(1)
    },
    data() {
        return {
            printInfo: {
                copies: 1,
                userName: '',
                pageFormat: '',
            },
            sizes: [
                { value: 'A4', label: 'A4' },
                // { value: 'A3', label: 'A3' }
            ],
            //校验规则
            //https://blog.csdn.net/weixin_43405300/article/details/132326466
            rules: {
                copies: [
                    { required: true, message: '必须输入份数', trigger: 'blur' },
                    { type: 'number', message: '请输入数字', trigger: 'blur' },
                    { validator: this.regNum , trigger: 'blur' }
                ],
                pageFormat: [
                    { required: true, message: '必须选择尺寸', trigger: 'blur' },
                    { validator: this.regSize, trigger: 'change' },
                ],
                userName: [
                    { required: true, message: '必须输入领取信息', trigger: 'blur' },
                ],
            }
        }
    },
    methods: {
        //校验数字
        regNum(rule, value, callback) {
            if(value > 0 && value <= 10) callback()
            callback('暂不支持的打印份数')
        },
        //校验尺寸
        regSize(rule, value, callback) {
            const sizes = this.sizes;
            for (let i = 0; i < sizes.length; i++) {
                if (value == sizes[i].value) callback()
            }
           callback('暂不支持该尺寸')
        },
        next() {
            const useCommon = useCommonStore()
            //校验
            this.$refs.printInfo.validate((valid) => {
                if(valid){
                    //存储打印信息
                    useCommon.setStepOne(this.printInfo)
                    useCommon.moveSteps()
                    //跳转
                    this.$router.push('/upload')
                }
            })
        },
    }
}
</script>

<style>
.el-form-item__content {
    width: 150px;
}
</style>