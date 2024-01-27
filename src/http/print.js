import axios from './axios'

const pushPrintJob = (data) => {
    return axios.request({
        url:'/print/printjob',
        method:'post',
        data
    })
}

export {
    pushPrintJob
}