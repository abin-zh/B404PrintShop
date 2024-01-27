import { defineStore } from "pinia";
import Decimal from "decimal.js";

export const useCommonStore = defineStore('common', {

    state: () => ({
        printInfo: {
            price: new Decimal(0.1), 
            step1: {
                //打印数量
                copies: 0,
                pageRanges: '',
                //打印尺寸
                pageFormat: '',
                //备注信息
                userName: '',
                duplex: false,
                color: false
            },
            step2: {
                //文件信息
                fileName: '',
                //文件页数
                count: 0,
            },
        },
        steps: 1,
    }),
    getters: {
        getPrice: (state) => state.printInfo.price,
        getSteps: (state) => state.steps,
        getStepOne: (state) => state.printInfo.step1,
        getStepTwo: (state) => state.printInfo.step2,
        // getUserToken: (state) => state.user.token
    },
    actions: {
        moveSteps() {
            this.steps++
            console.log(this.steps)
        },
        setSteps(steps) {
            this.steps = steps
        },
        setStepOne(info) {
            this.printInfo.step1 = info
        },
        setStepTwo(info) {
            this.printInfo.step2 = info
        },
    },
    // persist: true
})