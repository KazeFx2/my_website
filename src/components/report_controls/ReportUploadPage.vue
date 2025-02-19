<script setup lang="ts">
import { theme } from '@/stores/theme';
import { dialog } from '@/stores/dialog';
import { notification } from '@/stores/notifications';
import TextInput from '../TextInput.vue';
import CustButton from '../CustButton.vue';
import { onMounted, ref, type Ref } from 'vue';
import HighlightTxt from '../HighlightTxt.vue';
import { status } from '@/stores/status';
import axios from 'axios';
// import axios from 'axios';
const Theme = theme()
const Dialog = dialog()
const Status = status()
const Notification = notification()

const onUpload = ref(false)
const time = ref((new Date()).getTime())

const stuNum = ref("")

interface UploadType {
    click: ()=>void
    files: Array<any>
    style: {
        display: String
    }
    value: String
}

onMounted(()=>{
    document.title = '实验报告提交'
})

async function query_exp_time(num: string) {
    try {
        let ret = await axios.get(Status.HomeworkUrl + '/api/report_exp_time_query?exp=' + num)
        if (ret.data.left == "尚未开放或已失效"){
            Dialog.showDialog(ret.data.left, '知道了', ()=>{}, '「...」', ()=>{})
        } else {
            Dialog.showDialog("实验"+num +"<br>开始于: " + ret.data.start.slice(0, -10) + "<br>结束于: " + ret.data.end.slice(0, -10) + "<br>剩余: " + ret.data.left , '知道了', ()=>{}, '「...」', ()=>{})
        }
    } catch(e: any) {
        Dialog.showDialog('查询失败', '知道了', ()=>{}, '「...」', ()=>{})
    }
}

async function query_upload_res(stuNum: string) {
    try {
        let ret = await axios.get(Status.HomeworkUrl + '/api/report_upload_query?exp=' + exp_num.value + "&student=" + stuNum)
        Dialog.showDialog("实验"+exp_num.value +"<br>学号: " + stuNum + "<br>" + ret.data.msg , '知道了', ()=>{}, '「...」', ()=>{})
    } catch(e) {
        Dialog.showDialog('查询失败，可能是未设置实验次数或学号错误', '知道了', ()=>{}, '「...」', ()=>{})
    }
}

async function do_upload(form: EventTarget) {
    let now_time = (new Date()).getTime()
    if (onUpload.value && (now_time - time.value) / 1000 < 10) {
        Notification.showInfo('正在上传，请稍候...')
        return
    }
    time.value = (new Date()).getTime()
    onUpload.value = true
    var formData = new FormData(form as HTMLFormElement);
    formData.append('exp_num', exp_num.value)
    let config = {
    headers: {
        "Content-Type": "multipart/form-data"
        }
	}
    try {
        Notification.showInfo('稍候...')
        let ret = await axios.post(Status.HomeworkUrl + '/api/report_upload', formData, config)
        console.log(ret)
        if (ret.status === 200 && ret.data.status === 0) {
            Notification.showSuccess('提交成功！')
            onUpload.value = false
        }else {
            if (ret.data.status === 3) {
                Notification.showError('提交失败！' + ret.data.msg)
                onUpload.value = false
                return
            }
            Notification.showError('提交失败！请检查输入')
            onUpload.value = false
        }
    } catch(e: any) {
        if (e.response.status === 403) {
            Notification.showError('提交失败！' + e.response.data.msg)
            onUpload.value = false
            return
        }
        Notification.showError('提交失败！请检查输入')
        onUpload.value = false
    }
}

const exp_num = ref('请选择')
const file_name = ref('请选择')
const fileUpload : Ref<UploadType> = ref<UploadType>(null as unknown as UploadType)
</script>

<template>
    <div :class="['Bk']">
      <div :class="['backZone', Theme.dark ? 'solidDark' : 'solidWhite']">
        <HighlightTxt 
        :text="'实验报告提交'"
        :class="['hl']"
        :height="30"
        />
        <form id="uploadForm"
        enctype="multipart/form-data"
        @submit="(event)=>{
             event.preventDefault();
            if (exp_num === '请选择') {
                Notification.showError('请选择实验次数！')
                return
            }
            if (file_name === '请选择') {
                Notification.showError('请上传报告文件！')
                return
            }
            if(event.target)
                do_upload(event.target)
        }"
        >
            <label for="">姓名:</label>
            <TextInput
            :textType="'text'"
            :name="'student_name'"
            :width="'250px'"
            :required="true"
            />
            <br>
            <label for="">学号:</label>
            <TextInput
            v-model="stuNum"
            :textType="'text'"
            :name="'student_num'"
            :width="'250px'"
            :required="true"
            />
            <br>
            上传实验为第 '{{ exp_num }}' 次实验
            <CustButton 
            :title="'点此选择实验次数'"
            :type="'button'"
            @click="()=>{
                Dialog.showSelectDialog('请选择实验次数', '确认', (val: string)=>{
                    if (val === '请选择'){ 
                        Notification.showError('请选择实验次数！')
                        return false 
                    }
                    exp_num = val
                }, '取消', ()=>{
                }, ['1', '2', '3', '4', '5', '6', '7', '8'], exp_num)
            }"
            />
            <br>
            <input type="file"
            ref="fileUpload"
            :class="'cssHidden'"
            name="report_file"
            accept=".doc, .docx"
            @change="
                () => {
                    if (fileUpload.files.length > 0){
                        file_name = fileUpload.files[0].name
                        if (file_name.search(/\.(doc|docx)$/) === -1){
                            file_name = '请选择'
                            Notification.showError('请选择后缀为.doc/.docx的word文档文件！')
                        }
                    }
                }"
            >
            文件名: '{{ file_name }}'
            <CustButton 
            :title="'点此上传报告文件(*.doc, *.docx)'"
            :type="'button'"
            @click="()=>{
                fileUpload.style.display = 'none'
                fileUpload.value = ''
                file_name = '请选择'
                fileUpload.click()
            }"
            />
            <br>
            <div :class="['submit']">
            <CustButton
            :type="'submit'"
            :title="'提交'"
            />
        </div>
        <br>
        <div :class="['bottomZone']">
                <CustButton
                :type="'button'"
                :title="'查询提交结果'"
                @click="()=>{
                    Dialog.showInputDialog('请输入学号', '确认', (val: string)=>{
                        query_upload_res(val)
                    }, '取消', ()=>{}, stuNum)
                }"
                />
                <CustButton
                :type="'button'"
                :title="'查询实验时间'"
                @click="()=>{
                    Dialog.showSelectDialog('请选择实验次数', '确认', (val: string)=>{
                        if (val === '请选择') return
                        query_exp_time(val)
                    }, '取消', ()=>{
                    }, ['1', '2', '3', '4', '5', '6', '7', '8'], exp_num)
                }"
                />
            </div>
        </form>
      </div>
      </div>
</template>

<style scoped>
.Bk {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  /* background-color: #000 */
}

.backZone {
  width: 500px;
  height: 500px;
  border-radius: 10px;
  display: flex;
  position: relative;
  align-items: center;
  justify-content: center;
}

.submit {
    width: 100%;
    display: flex;
    justify-content: center;
}

.hl {
    position: absolute;
    top: 20px;
    left: 20px;
}
.bottomZone{
    width: 100%;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
}
</style>