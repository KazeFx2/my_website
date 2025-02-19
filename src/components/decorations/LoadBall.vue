<script setup lang="ts">
import { theme } from '@/stores/theme'
const Theme = theme()
const oneTime = 0.5
const offSet = 0.1
</script>

<template>
  <div :class="['innerLoad', Theme.dark ? 'solidDarkTrs' : 'solidWhiteTrs']">
    <div :class="['innerLoadBox']">
      <div :class="['barBox']">
        <div :class="['bar']">
          <div :class="['barInner bar1']"></div>
        </div>
        <div :class="['bar']">
          <div :class="['barInner bar2']"></div>
        </div>
        <div :class="['bar']">
          <div :class="['barInner bar3']"></div>
        </div>
        <div :class="['bar']">
          <div :class="['barInner bar4']"></div>
        </div>
        <div :class="['bar']">
          <div :class="['barInner bar5']"></div>
        </div>
        <div :class="['bar']">
          <div :class="['barInner bar6']"></div>
        </div>
        <div :class="['bar']">
          <div :class="['barInner bar7']"></div>
        </div>
      </div>
      <div :class="['ballBoxOutter']">
        <div :class="['ballBox']">
          <div :class="['ball']"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.innerLoad {
  position: relative;
  width: 100px;
  aspect-ratio: 1/1;
  /* background-color: aqua; */
  overflow: hidden;
  /* display: flex; */
  /* align-items: end; */
  border-radius: 5px;
  padding: 5px;
  box-shadow: 0px 0px 5px rgba(0, 0, 0, 0.5);
}

.innerLoadBox {
  width: 100%;
  height: 100%;
  position: relative;
  overflow: hidden;
}

.barBox {
  width: 175%;
  height: 100%;
  position: absolute;
  display: flex;
  align-items: end;
  animation: v-bind(oneTime * 4 + 's ease-in-out 0.05s infinite barBox_anime');
}
.bar {
  /* position: absolute;
  right: 0px;
  bottom: 0px; */
  width: 14.29%;
  height: 100%;
  transform: translate(0px, 8px);
  /* background-color: aqua; */
  display: flex;
  justify-content: center;
  align-items: end;
}

.bar1 {
  transform: translateY(85.71%);
  animation: v-bind(oneTime * 4 + 's ease-in-out ' + (0 - offSet) + 's infinite bar_anime_noshape');
}
.bar2 {
  transform: translateY(71.43%);
  animation: v-bind(oneTime * 4 + 's ease-in-out ' + (oneTime - offSet) + 's infinite bar_anime');
}
.bar3 {
  transform: translateY(57.14%);
  animation: v-bind(
    oneTime * 4 + 's ease-in-out ' + (oneTime * 2 - offSet) + 's infinite bar_anime'
  );
}
.bar4 {
  transform: translateY(42.86%);
  animation: v-bind(
    oneTime * 4 + 's ease-in-out ' + (oneTime * 3 - offSet) + 's infinite bar_anime_noshape_last'
  );
}
.bar5 {
  transform: translateY(28.57%);
}
.bar6 {
  transform: translateY(14.29%);
}
.bar7 {
  transform: translateY(0%);
}

.barInner {
  width: 70%;
  height: 140%;
  background-color: gray;
}
.ballBoxOutter {
  width: 100%;
  height: 100%;
  position: absolute;
}

.ballBox {
  position: absolute;
  height: 20%;
  aspect-ratio: 1/1;
  /* background-color: aqua; */
  /* border-radius: 5px; */
  animation: v-bind(oneTime * 4 + 's ease-in-out 0s infinite ball_anime_move');
}

.ball {
  height: 100%;
  width: 100%;
  /* background-color: gray; */
  background-color: rgba(64, 128, 255, 1);
  box-shadow: 0px 0px 15px rgba(128, 200, 255, 1);
  border-radius: 50%;
  animation: v-bind(oneTime + 's ease-in-out 0s infinite ball_anime');
}
</style>
<style>
@keyframes barBox_anime {
  75% {
    transform: translate(0%, 0%);
  }
  100% {
    transform: translate(-42.86%, 60%);
  }
}

@keyframes bar_anime {
  0% {
    width: 70%;
    height: 140%;
    background-color: gray;
    box-shadow: 0px 0px 0px rgba(128, 200, 255, 1);
  }

  6.25% {
    width: 100%;
    height: 120%;
    background-color: rgba(64, 128, 255, 1);
    box-shadow: 0px 0px 15px rgba(128, 200, 255, 1);
  }

  12.5% {
    width: 70%;
    height: 140%;
    background-color: gray;
    box-shadow: 0px 0px 0px rgba(128, 200, 255, 1);
  }
}
@keyframes bar_anime_noshape {
  0% {
    background-color: gray;
    box-shadow: 0px 0px 0px rgba(128, 200, 255, 1);
  }

  6.25% {
    background-color: rgba(64, 128, 255, 1);
    box-shadow: 0px 0px 15px rgba(128, 200, 255, 1);
  }

  12.5% {
    background-color: gray;
    box-shadow: 0px 0px 0px rgba(128, 200, 255, 1);
  }
}
@keyframes bar_anime_noshape_last {
  0% {
    background-color: gray;
    box-shadow: 0px 0px 0px rgba(128, 200, 255, 1);
  }

  6.25% {
    background-color: rgba(64, 128, 255, 1);
    box-shadow: 0px 0px 15px rgba(128, 200, 255, 1);
  }
  26% {
    background-color: rgba(64, 128, 255, 1);
    box-shadow: 0px 0px 15px rgba(128, 200, 255, 1);
  }

  32.25% {
    background-color: gray;
    box-shadow: 0px 0px 0px rgba(128, 200, 255, 1);
  }
}

@keyframes ball_anime {
  0% {
    scale: 1 1;
  }

  33.33% {
    scale: 0.8 1.2;
  }

  66.66% {
    scale: 1.2 0.8;
  }

  100% {
    scale: 1 1;
  }
}

@keyframes ball_anime_move {
  0% {
    bottom: 12.5%;
    left: 2.5%;
  }

  16.66% {
    bottom: 42.5%;
    left: 15%;
  }

  25% {
    bottom: 27.5%;
    left: 27.5%;
  }

  41.66% {
    bottom: 62.5%;
    left: 40%;
  }

  50% {
    bottom: 45%;
    left: 52.5%;
  }

  66.66% {
    bottom: 82.5%;
    left: 65%;
  }

  75% {
    bottom: 72.5%;
    left: 77.5%;
  }

  100% {
    bottom: 12.5%;
    left: 2.5%;
  }
}
</style>
