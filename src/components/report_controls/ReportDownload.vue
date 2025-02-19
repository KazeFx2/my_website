<script setup lang="ts">
import HighlightTxt from '../HighlightTxt.vue';
import { theme } from '@/stores/theme';
import {ref} from 'vue';
import TextInput from '../TextInput.vue';
import CustButton from '../CustButton.vue';
import axios from 'axios';
import { notification } from '@/stores/notifications';
import { status } from '@/stores/status';

const Theme = theme()
const Notification = notification()
const Status = status()

const au = ref("")

const acc = ref(false)

const items = [1, 2, 3, 4, 5, 6, 7, 8]

async function checkAu() {
    if (au.value === "") {
        Notification.showError('请输入授权码！')
        return
    } else if (au.value.search(/^[0-9a-z]{64}$/) === -1) {
        Notification.showError('授权码为64位十六进制数！（小写字母）')
        return
    }
    try {
        let ret = await axios.get(Status.HomeworkUrl + "/api/report_validate?auth=" + au.value)
        console.log(ret)
        if (ret.status === 200 && ret.data.status === 0) {
            Notification.showSuccess('鉴权通过！')
            acc.value = true
        }
    } catch(e) {
        Notification.showError('授权码错误！')
        acc.value = false
    }
}

async function download(num: number) {
    if (num < 1 || num > 8) {return}
    // const zip = JSZip()
    // let ret = await axios.get(Status.HomeworkUrl + '/api/report_download_all?exp='+num.toString()+'&auth=' + au.value)
    // let fs = ret.data.data
    // for(let i = 0; i < fs.length; i++) {
    //     let data = await axios.get(Status.HomeworkUrl + '/api/report_download?exp='+num.toString()+'&name='+fs[i]+'&auth=' + au.value)
    //     console.log(data)
    //     zip.file(fs[i], data.data, {binary: true})
    // }
    // zip.generateAsync({ type: 'blob' }).then(content => {
    // saveAs(ret.data, '第'+num.toString()+'次实验报告');
    // });
    window.open(Status.HomeworkUrl + '/api/report_download_all?exp='+num.toString()+'&auth=' + au.value, '_blank');
}

</script>

<template>
    <div :class="['Bk']">
      <div :class="['backZone', Theme.dark ? 'solidDark' : 'solidWhite']">
        <HighlightTxt 
        :text="'实验报告下载'"
        :class="['hl']"
        :height="30"
        />
        <div :class="['blk', acc ?'cssHidden' : '']">
        <div :class="['ct']">
        <label>授权码：</label>
        <TextInput v-model="au"/>
        </div>
        <CustButton 
        title="确认"
        :class="['bt']"
        @click="()=>{
            checkAu()
        }"
        /></div>
        <div :class="['blk', acc ? '' : 'cssHidden']">
            <CustButton 
            :class="['item']"
            v-for="(item, index) in items"
            :key="index"
            :title="item.toString()"
            @click="download(item)"
            />
        </div>
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
  flex-direction: column;
}

.hl {
    position: absolute;
    top: 20px;
    left: 20px;
}

.ct {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
}

.bt {
    margin-top: 10px;
}

.blk {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
}

.item {
    margin-top: 10px;
}
</style>