<template>
    <div class="main">
        <div class="content">
            <el-upload class="upload-demo" drag ref="upload" :limit="1" :on-exceed="handleExceed" :auto-upload="false"
                action="http://127.0.0.1/api/file/upload" 
                accept="application/pdf" 
                :on-progress="handleProgress"
                :before-upload="handleBeforeUpload"
                :on-success="handleSuccess"
                >
                <el-icon class="el-icon--upload"><icon-ep-upload-filled /></el-icon>
                <div class="el-upload__text">
                    将PDF拽入此处 或者 <em>点击上传</em>
                </div>
                <template #tip>
                    <div class="el-upload__tip">
                        仅限上传PDF文件 大小控制在10MB以内
                    </div>
                </template>
            </el-upload>
            <div class="demo-progress">
                <el-progress type="circle" :percentage="percent" :status="status" />
            </div>
        </div>
        <el-button @click="next" type="primary" size="large" :icon="Right" circle></el-button>
    </div>
</template>

<script>
import { Right, UploadFilled } from '@element-plus/icons-vue'
import { useCommonStore } from '@/store/common'
import { ElMessage } from 'element-plus'


export default {
    setup() {
        return {
            UploadFilled,
            Right,
        }
    },
    mounted() {
        //固定步骤
        const useCommon = useCommonStore()
        useCommon.setSteps(2)
        //判断是否填写了打印信息
        const stepOne = useCommon.getStepOne
        if(stepOne.copies == 0 || stepOne.pageFormat == '' || stepOne.userName == '') {
            ElMessage.error('请先填写打印信息')
            this.$router.push('/')
        }
    },
    data() {
        return {
            printInfo: {
                fileName: '',
                count: 0,
            },
            percent:0,
            status: '',
            uploadFiles: [],
        }
    },
    methods: {
        next() {
            this.$refs.upload.submit()
        },
        handleExceed(files, uploadFiles) {
            //修改文件
            this.$refs.upload.clearFiles()
            this.$refs.upload.handleStart(files[0])
        },
        handleProgress(evt, uploadfile, uploadFiles) {
            this.percent = evt.percent;
            if(evt.percent == 100) {
                this.status = 'success'
            }
            //console.log(evt, uploadfile, uploadFiles)
        },
        handleBeforeUpload(file) {
            //判断文件格式和大小
            if(file.type !== 'application/pdf') {
                ElMessage.error('仅限上传PDF文件')
                return false
            }else if(file.size > 1024 * 1024 * 10) {
                ElMessage.error('仅限10MB以内的文件')
                return false
            }
            return true;
        },
        handleSuccess(res, file, fileList) {
            if(res.code == 200) {
                if(res.data != null && res.data.fileName != null && res.data.count != null && res.data.count > 0) {
                    const useCommon = useCommonStore()
                    this.printInfo.fileName = res.data.fileName
                    this.printInfo.count = res.data.count
                    useCommon.setStepTwo(this.printInfo)
                    ElMessage.success('文件上传成功')
                    setTimeout(() => {
                        this.$router.push('/pay')
                        useCommon.moveSteps()
                    }, 2000);
                }else{
                    ElMessage.error('文件上传失败')
                    this.$refs.upload.clearFiles()
                }
            }
        }
    }
}
</script>

<style>
.el-form-item__content {
    width: 150px;
}

.upload-demo {
    width: 280px;
    height: 240px;
}

.el-upload-dragger {
    border-radius: 20px;
}

.el-upload__tip {
    width: 100%;
    text-align: center;
}
.demo-progress{
    margin-top: 20px;
}

</style>