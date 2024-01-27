<template>
    <div class="main">
        <div class="content">
            <el-image class="pay-image" :src="url" />
            <div class="pay-text">
                您打印
                <el-text type="danger" tag="b">{{ printInfo.num }}</el-text>
                份共
                <el-text type="danger" tag="b">{{ printInfo.count }}</el-text>
                页
                <br />
                需支付
                <el-text type="danger" tag="b">{{ printInfo.pay }}</el-text>
                元,请扫码
                <br />
                <el-text type="warning" tag="b">请注意,支付金额不匹配将无法进行打印, 支付成功后会自动跳转</el-text>
            </div>
        </div>
        <el-button v-if="!printInfo.isPay" type="info" size="large" :icon="Close" circle></el-button>
        <el-button v-else type="success" size="large" :icon="Check" circle></el-button>
    </div>
</template>

<script>
import { Check, Close } from '@element-plus/icons-vue'
import { useCommonStore } from '@/store/common'
import mqtt from "mqtt";
import Demical from 'decimal.js'

export default {
    setup() {
        return {
            Check,
            Close
        }
    },
    mounted() {
        const useCommon = useCommonStore()
        const stepOne = useCommon.getStepOne
        this.printInfo.num = stepOne.num
        if(stepOne.copies == 0 || stepOne.pageFormat == '' || stepOne.userName == '') {
            ElMessage.error('请先填写打印信息')
            this.$router.push('/')
        }
        const stepTwo = useCommon.getStepTwo
        const price = useCommon.getPrice
        this.printInfo.count = stepTwo.count
        this.printInfo.pay = new Demical(price).mul(stepOne.num * stepTwo.count).toFixed(2)
        if(stepTwo.fileName == "" || stepTwo.count <= 0) {
            ElMessage.error('文件上传错误')
            this.$router.push('/')
        }
        useCommon.setSteps(3)
        this.createConnection();

        this.doSubscribe();
        this.doPublish();

    },
    data() {
        return {
            btnIcon: Close,
            btnType: 'info',
            url: 'https://pic.imgdb.cn/item/657572dec458853aef85b531.png',
            printInfo: {
                num: 0,
                count: 0,
                pay: 0,
                isPay: false,
            },
            connection: {
                protocol: "ws",
                host: "",
                // ws: 8083; wss: 8084
                port: 8083,
                endpoint: "/mqtt",
                // for more options, please refer to https://github.com/mqttjs/MQTT.js#mqttclientstreambuilder-options
                clean: true,
                connectTimeout: 30 * 1000, // ms
                reconnectPeriod: 4000, // ms
                clientId: "emqx_vue_" + Math.random().toString(16).substring(2, 8),
                // auth
                username: "emqx_test",
                password: "emqx_test",
            },
            subscription: {
                topic: "test1",
                qos: 0,
            },
            publish: {
                topic: "test1",
                qos: 0,
                payload: '{ "msg": "Hello, I am browser." }',
            },
            receiveNews: "",
            qosList: [0, 1, 2],
            client: {
                connected: false,
            },
            subscribeSuccess: false,
            connecting: false,
            retryTimes: 0,
        }
    },
    methods: {
        next() {
            const useCommon = useCommonStore()
            useCommon.moveSteps()
        },
        initData() {
            this.client = {
                connected: false,
            };
            this.retryTimes = 0;
            this.connecting = false;
            this.subscribeSuccess = false;
        },
        handleOnReConnect() {
            this.retryTimes += 1;
            if (this.retryTimes > 5) {
                try {
                    this.client.end();
                    this.initData();
                    this.$message.error("Connection maxReconnectTimes limit, stop retry");
                } catch (error) {
                    this.$message.error(error.toString());
                }
            }
        },
        createConnection() {
            try {
                this.connecting = true;
                const { protocol, host, port, endpoint, ...options } = this.connection;
                const connectUrl = `${protocol}://${host}:${port}${endpoint}`;
                this.client = mqtt.connect(connectUrl, options);
                if (this.client.on) {
                    this.client.on("connect", () => {
                        this.connecting = false;
                        //console.log("Connection succeeded!");
                    });
                    this.client.on("reconnect", this.handleOnReConnect);
                    this.client.on("error", (error) => {
                        console.error("Connection failed", error);
                    });
                    this.client.on("message", (topic, message) => {
                        this.receiveNews = this.receiveNews.concat(message);
                        //console.log(`Received message ${message} from topic ${topic}`);
                        this.payCheck(message.toString());
                    });
                }
            } catch (error) {
                this.connecting = false;
                console.log("mqtt.connect error", error);
            }
        },
        doSubscribe() {
            const { topic, qos } = this.subscription
            this.client.subscribe(topic, { qos }, (error, res) => {
                if (error) {
                    console.log('Subscribe to topics error', error)
                    return
                }   
                this.subscribeSuccess = true
                console.log('Subscribe to topics res', res)
            })
        },
        doPublish() {
            const { topic, qos, payload } = this.publish
            this.client.publish(topic, payload, { qos }, error => {
                if (error) {
                    console.log('Publish error', error)
                }
            })
        },
        destroyConnection() {
            if (this.client.connected) {
                try {
                    this.client.end(false, () => {
                        this.initData()
                        console.log('Successfully disconnected!')
                    })
                } catch (error) {
                    console.log('Disconnect failed', error.toString())
                }
            }
        },
        payCheck(message) {
            //json转对象
            const obj = JSON.parse(message.toString())
            //提取信息
            const msgs = obj.msg.split("#")
            const payTime = new Date(msgs[0])
            const payMsg = msgs[1]
            const payMsgReg = /(\[\d条\]){0,1}二维码赞赏到账\d*.\d{2}元/;
            const realPayReg = /\d*.\d{2}/
            //判断是否为赞赏消息
            if (payMsgReg.test(payMsg)) {
                const realPay = new Demical(realPayReg.exec(payMsg)[0]).toFixed(2)
                if (realPay == this.printInfo.pay) {
                    this.printInfo.isPay = true
                    this.next()
                    this.destroyConnection()
                    setTimeout(() => {
                        this.$router.push('/print')
                    }, 2000)
                }
            }
        }
    },
}
</script>

<style>
.el-form-item__content {
    width: 150px;
}

.pay-image {
    width: 280px;
    margin-bottom: 20px;
    border-radius: 20px;
}

.pay-text {
    width: 90%;
    text-align: center;
}
</style>