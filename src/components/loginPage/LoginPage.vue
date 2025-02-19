<script setup lang="ts">
import TextInput from '../TextInput.vue'
import CustButton from '../CustButton.vue'
import CryptoJS from 'crypto-js'
import { theme } from '@/stores/theme'
import { ref } from 'vue'
import { notification } from '@/stores/notifications'
import { status } from '@/stores/status'
import axios from 'axios'
import { useRouter } from 'vue-router'
const router = useRouter()

interface ResType {
  status?: number
  data?: {
    status: number
    data: string
  }
}

const Theme = theme()
const Status = status()
const Notification = notification()

const username = ref('')
const password = ref('')

const onLogin = ref(false)

async function loginQuery() {
  const sha256 = CryptoJS.SHA256(password.value).toString()
  const res = (await await axios
    .get(Status.ReqUrl + Status.urlUser + '?username=' + username.value + '&password=' + sha256, {
      withCredentials: true
    })
    .catch((e) => {
      Notification.showError(
        "守卫: #%@...\"<font style='font-weight: bold'>" + e + '"</font>...*^?/...'
      )
      onLogin.value = false
    })) as ResType
  if (res.status !== 200) {
    Notification.showError('一串神秘代码"' + res.status + '"赫然出现在大门上！')
    onLogin.value = false
    return
  }
  const identity = res.data
  if (identity)
    if (identity.status === 0) {
      Notification.showSuccess('ようこそ！')
      Status.setAu(true)
      Status.setId(identity.data)
      onLogin.value = false
      router.push('/')
      return
    } else if (identity.status === 1) {
      Notification.showError('你的气质很独特...')
    } else if (identity.status === 2) {
      Notification.showError(
        '大门抖了一下，你的吟词似乎有些问题...</br>你还有' + parseInt(identity.data) + '次机会！'
      )
    } else if (identity.status === 3) {
      const val = parseInt(identity.data)
      Notification.showError(
        '...嗯...你不对劲...</br>请在' +
          (val / 60 < 1 ? (val % 60) + '秒' : Math.floor(val / 60) + '分钟') +
          '后再来！'
      )
    }
  onLogin.value = false
}

function login() {
  if (username.value === '') {
    Notification.showError('无名行者？请求拒绝！')
    return
  } else if (password.value === '') {
    Notification.showError('纯粹容器！404 Not Found...')
    return
  } else if (onLogin.value) {
    Notification.showInfo('城门处拥堵，请稍后再来看看！')
    return
  }
  onLogin.value = true
  loginQuery()
}
</script>
<script lang="ts"></script>

<template>
  <div :class="['loginBox', Theme.dark ? 'solidDarkTrs' : 'solidWhiteTrs']">
    <div :class="['innerBox', Theme.dark ? 'solidDark' : 'solidWhite']">
      <div :class="['loginZone']">
        <div :class="['loginTitle']">守卫者</div>
        <div :class="['marginBox']"></div>
        <div :class="['InputZone']">
          <div :class="['InputItem']">
            <div :class="['itemTxt']">用户名</div>
            <TextInput v-model="username" placeholder="请输入用户名" />
          </div>
          <div :class="['InputItem']">
            <div :class="['itemTxt']">密码</div>
            <TextInput v-model="password" placeholder="请输入密码" :type="'password'" />
          </div>
        </div>
        <div :class="['marginBottom']"></div>
        <div :class="['loginButton']">
          <CustButton :title="'登录'" @click="login" />
          <div :class="['marginCenter']"></div>
          <CustButton
            :title="'忘记密码?'"
            @click="
              () => {
                Notification.showError(
                  '站长你忘了密码？¯⁠\\(°_o)/¯自个儿去数据库重置去！</br></br><center>🐷！活该！🐷</center>'
                )
              }
            "
          />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.marginCenter {
  width: 25px;
}

.marginBottom {
  width: 100%;
  height: 50px;
}

.loginButton {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.InputItem {
  display: flex;
  width: 100%;
  justify-content: center;
  align-items: center;
  margin-top: 10px;
}

.loginTitle {
  font-size: xx-large;
  font-weight: bolder;
  width: 100%;
  text-align: center;
}

.InputZone {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
}

.itemTxt {
  width: 75px;
}

.marginBox {
  width: 100%;
  height: 50px;
}

/* .loginZone {
    background-color: aqua;
    transform: translate(0px, -25px);
} */

.innerBox {
  width: calc(100% - 50px);
  height: calc(100% - 50px);
  border-radius: 12px;
  border: 1px solid gray;
  display: flex;
  justify-content: center;
  align-items: center;
}

.loginBox {
  position: absolute;
  display: flex;
  width: 50%;
  max-width: 500px;
  min-width: 400px;
  height: 50%;
  max-height: 500px;
  min-height: 400px;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  box-shadow: 0px 0px 15px rgba(0, 0, 0, 1);
  border-radius: 25px;
  justify-content: center;
  align-items: center;
}
</style>
