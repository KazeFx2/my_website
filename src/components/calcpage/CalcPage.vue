<script setup lang="ts">
import { theme } from '@/stores/theme'
import { ref, type Ref } from 'vue'
import CalcItemVue from './CalcItems.vue'
import NumberInputVue from './NumberInput.vue'
import CustButtonVue from './../CustButton.vue'
const Theme = theme()

const resultTxt = ref('')

interface ItemType {
  sig: Boolean
  ua: Number
  ub: Number
  da: Number
  db: Number
}

interface ComDownType {
  a: Number
  b: Number
  indexes: Array<Number>
}

interface PointType {
  x: Number
  y: Number
}

interface ZoneType {
  a: Number
  b: Number
}

const exa = 1e-8
const NegInf = -10e8
const PosInf = 10e8

function multiple(a: Array<Number>, b: Array<Number>): Array<Number> {
  const resMat: Array<Array<Number>> = []
  for (let i = 0; i < a.length; i++) {
    const row = []
    for (let j = 0; j < b.length; j++) {
      row.push((a[i] as number) * (b[j] as number))
    }
    resMat.push([...row])
  }
  const result = []
  for (let i = 0; i < a.length + b.length - 1; i++) {
    let x = i,
      y = 0
    if (x >= a.length) {
      ;(x = a.length - 1), (y = i - x)
    }
    let val = resMat[x][y] as number
    while (x - 1 >= 0 && y + 1 < b.length) {
      x--, y++
      val += resMat[x][y] as number
    }
    result.push(val as Number)
  }
  return result
}

function add(a: Array<Number>, b: Array<Number>): Array<Number> {
  let lmax = 0,
    lmin = 0,
    pt = 0
  let amax = [],
    amin = []
  if (a.length > b.length) {
    lmax = a.length
    lmin = b.length
    amax = a
    amin = b
  } else {
    lmin = a.length
    lmax = b.length
    amin = a
    amax = b
  }
  const diff = lmax - lmin
  const res = []
  for (let i = 0; i < lmax; i++) {
    if (pt < diff) {
      pt++
      res.push(amax[i])
    } else {
      res.push((amax[i] as number) + (amin[i - diff] as number))
    }
  }
  return res
}

function removeZero(a: Array<Number>): Array<Number> {
  const res = []
  for (let i = 0; i < a.length; i++) {
    if (Math.abs(a[i] as number) < exa) continue
    for (; i < a.length; i++) {
      res.push(a[i])
    }
    break
  }
  return res
}

function nano(a: Array<Number>): Array<Number> {
  const min = Math.min(
    ...a.map((val) => {
      return Math.abs(val as number)
    })
  )
  const res = []
  for (let i = 0; i < a.length; i++) {
    res.push((a[i] as number) / min)
  }
  return res
}

function calcCom(): Array<ComDownType> {
  const ret: Array<ComDownType> = []
  for (let i = 0; i < items.value.length; i++) {
    let flag = false
    for (let j = 0; j < ret.length; j++) {
      if (
        Math.abs((ret[j].a as number) - (items.value[i].da as number)) < 10e-5 &&
        Math.abs((ret[j].b as number) - (items.value[i].db as number)) < 10e-5
      ) {
        ret[j].indexes.push(i)
        flag = true
        break
      }
    }
    if (!flag) {
      ret.push({
        a: items.value[i].da,
        b: items.value[i].db,
        indexes: [i]
      })
    }
  }
  return ret
}

function calcFunc(func: Array<Number>, x: Number): Number {
  let temp_x = 1
  let ret = 0
  for (let i = func.length - 1; i >= 0; i--) {
    ret += (func[i] as number) * temp_x
    temp_x *= x as number
  }
  return ret
}

function calcZero(func: Array<Number>, a: Number, b: Number): Number {
  const ay = calcFunc(func, a),
    by = calcFunc(func, b)
  if (Math.abs(ay as number) < exa) return a
  if (Math.abs(by as number) < exa) return b
  const inner = ((a as number) + (b as number)) / 2
  const iy = calcFunc(func, inner)
  if ((ay as number) * (iy as number) < 0) return calcZero(func, a, inner)
  else return calcZero(func, inner, b)
}

function calcZeros(func: Array<Number>, ps: Array<PointType>): Array<Number> {
  const ret = [NegInf]
  for (let i = 0; i < ps.length - 1; i++) {
    if ((ps[i].y as number) * (ps[i + 1].y as number) < 0) {
      ret.push(calcZero(func, ps[i].x, ps[i + 1].x) as number)
    }
  }
  ret.push(PosInf)
  return ret
}

function ecPs(comD: Array<ComDownType>): Array<Number> {
  const ret = []
  for (let i = 0; i < comD.length; i++) {
    if (Math.abs(comD[i].a as number) > exa) {
      ret.push((comD[i].b as number) / ((comD[i].a as number) * -1))
    }
  }
  return ret
}

function calcFinalZones(
  func: Array<Number>,
  zeros: Array<Number>,
  ecp: Array<Number>
): Array<ZoneType> {
  const ps = [],
    ret = []
  let i = 0,
    j = 0
  while (ps.length < zeros.length + ecp.length) {
    if ((zeros[i] as number) < (ecp[j] as number)) {
      ps.push(zeros[i])
      i++
      if (i === zeros.length) {
        for (; j < ecp.length; j++) {
          ps.push(ecp[j])
        }
      }
    } else {
      ps.push(ecp[j])
      j++
      if (j === ecp.length) {
        for (; i < zeros.length; i++) {
          ps.push(zeros[i])
        }
      }
    }
  }
  for (i = 0; i < ps.length - 1; i++) {
    const ct = ((ps[i] as number) + (ps[i + 1] as number)) / 2
    const y = calcFunc(func, ct)
    if ((y as number) > 0) {
      if (Math.abs((ps[i] as number) - NegInf) < exa) {
        ret.push({
          a: -Infinity,
          b: ps[i + 1]
        })
      } else if (Math.abs((ps[i + 1] as number) - PosInf) < exa) {
        ret.push({
          a: ps[i],
          b: Infinity
        })
      } else {
        ret.push({
          a: ps[i],
          b: ps[i + 1]
        })
      }
    }
  }
  return ret
}

function doCalc() {
  if (items.value.length === 0) return
  let down = [1]
  let up = [0]
  const ComD = calcCom()
  const ecp = ecPs(ComD)
  for (let i = 0; i < ComD.length; i++) {
    down = multiple(down, [
      (ComD[i].a as number) + 10e-20,
      (ComD[i].b as number) + 10e-20
    ]) as number[]
  }
  for (let i = 0; i < items.value.length; i++) {
    const si = items.value[i].sig ? 1 : -1
    let _up = [
      (items.value[i].ua as number) * si + 10e-20,
      (items.value[i].ub as number) * si + 10e-20
    ]
    for (let j = 0; j < ComD.length; j++) {
      if (ComD[j].indexes.includes(i)) continue
      _up = multiple(_up, [
        (ComD[j].a as number) + 10e-20,
        (ComD[j].b as number) + 10e-20
      ]) as number[]
    }
    up = add(up, _up) as number[]
  }
  up = removeZero(up) as number[]
  down = removeZero(down) as number[]
  console.log(up, down)
  let raw = []
  if (ineqSig.value <= 1) {
    raw = add(up, multiple([-1 * Number(right_const.value)], down))
  } else {
    raw = add(multiple([Number(right_const.value)], down), multiple([-1], up))
  }
  raw = nano(removeZero(raw))
  console.log(raw)
  const di = [raw]
  let pos = 0
  while (di[pos].length > 2) {
    const newDi = []
    for (let i = 0; i < di[pos].length - 1; i++) {
      newDi.push((di[pos].length - 1 - i) * (di[pos][i] as number))
    }
    di.push(removeZero(newDi))
    pos++
  }
  console.log(di)
  const Zeros = []
  if (di.length < 2) {
    if (di.length === 1) {
      Zeros.push([NegInf, (-di[0][1] as number) / (di[0][0] as number), PosInf])
    } else {
      Zeros.push([])
    }
  } else {
    const ExtremePs: Array<Array<PointType>> = [
      [
        {
          x: NegInf,
          y: calcFunc(di[di.length - 2], NegInf)
        },
        {
          x: (-di[di.length - 1][1] as number) / (di[di.length - 1][0] as number),
          y: calcFunc(
            di[di.length - 2],
            (-di[di.length - 1][1] as number) / (di[di.length - 1][0] as number)
          )
        },
        {
          x: PosInf,
          y: calcFunc(di[di.length - 2], PosInf)
        }
      ]
    ]
    for (let i = di.length - 2; i > 0; i--) {
      Zeros.push(calcZeros(di[i], ExtremePs[ExtremePs.length - 1]))
      ExtremePs.push(
        Zeros[Zeros.length - 1].map((val) => {
          return {
            x: val,
            y: calcFunc(di[i - 1], val)
          }
        })
      )
    }
    Zeros.push(calcZeros(di[0], ExtremePs[ExtremePs.length - 1]))
  }
  console.log(Zeros)
  let zones: Array<ZoneType> = []
  if (di.length > 0) {
    zones = calcFinalZones(di[0], Zeros[Zeros.length - 1], ecp)
  }
  console.log(zones)
  let info = ''
  for (let i = 0; i < zones.length; i++) {
    if (zones[i].a === -Infinity) {
      info +=
        'x ' +
        ((ineqSig.value === 1 || ineqSig.value === 3) && !ecp.includes(zones[i].b) ? '≤' : '<') +
        ' ' +
        zones[i].b.toFixed(5) +
        '或'
    } else if (zones[i].b === Infinity) {
      info +=
        'x ' +
        ((ineqSig.value === 1 || ineqSig.value === 3) && !ecp.includes(zones[i].a) ? '≥' : '>') +
        ' ' +
        zones[i].a.toFixed(5) +
        '或'
    } else {
      info +=
        zones[i].a.toFixed(5) +
        ' ' +
        ((ineqSig.value === 1 || ineqSig.value === 3) && !ecp.includes(zones[i].a) ? '≤' : '<') +
        ' x ' +
        ((ineqSig.value === 1 || ineqSig.value === 3) && !ecp.includes(zones[i].b) ? '≤' : '<') +
        ' ' +
        zones[i].b.toFixed(5) +
        '或'
    }
  }
  resultTxt.value = info.slice(0, -1)
}

const right_const = ref('150')

// 0-<
// 1-<=
// 2->
// 3->=
const ineqSig = ref(0)

const ineqTxt = ref('<')

const items: Ref<ItemType[]> = ref([
  {
    sig: true,
    ua: 0,
    ub: 5500,
    da: 1,
    db: 22.4
  },
  {
    sig: true,
    ua: 0,
    ub: 10000,
    da: 1,
    db: 0
  },
  {
    sig: true,
    ua: 0,
    ub: 10000,
    da: 1,
    db: 22.4
  }
])
</script>

<template>
  <div :class="['calcBk']">
    <div :class="['backZone', Theme.dark ? 'solidDark' : 'solidWhite']">
      <div :class="['IneqItems']">
        <CalcItemVue
          v-for="(item, index) in items"
          :key="index"
          :data="item"
          @del="
            () => {
              items.splice(index, 1)
            }
          "
          @sw-sig="items[index].sig = !item.sig"
          @set-val="
            (flag, val) => {
              switch (flag) {
                case 0:
                  items[index].ua = Number(val)
                  break
                case 1:
                  items[index].ub = Number(val)
                  break
                case 2:
                  items[index].da = Number(val)
                  break
                case 3:
                  items[index].db = Number(val)
                  break
              }
            }
          "
        />
        <div :class="['ineq']">
          <div
            :class="['ineqBox']"
            @click="
              () => {
                ineqSig++
                if (ineqSig === 4) ineqSig = 0
                switch (ineqSig) {
                  case 0:
                    ineqTxt = '<'
                    break
                  case 1:
                    ineqTxt = '≤'
                    break
                  case 2:
                    ineqTxt = '>'
                    break
                  case 3:
                    ineqTxt = '≥'
                    break
                }
              }
            "
          >
            {{ ineqTxt }}
          </div>
          <NumberInputVue v-model="right_const" />
        </div>
      </div>
      <div :class="['buttons']">
        <CustButtonVue
          :title="'添加项'"
          @click="
            () => {
              items.push({
                sig: true,
                ua: 0,
                ub: 100,
                da: 1,
                db: 0
              })
            }
          "
        />
        <div :class="['mag']"></div>
        <CustButtonVue :title="'开始解算'" @click="doCalc" />
      </div>
      <div :class="['resBox']">
        <div :class="['resTxt']">
          {{ resultTxt }}
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.ineqBox {
  width: 25px;
}
.resBox {
  width: 100%;
  display: flex;
  justify-content: center;
}

.resTxt {
  width: calc(100% - 50px);
  text-align: center;
}
.calcBk {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.backZone {
  width: 500px;
  height: 500px;
  border-radius: 10px;
}
.IneqItems {
  width: 100%;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  align-items: center;
}
.ineq {
  margin-top: 23px;
  margin-inline: 10px;
  user-select: none;
  cursor: pointer;
  display: flex;
  flex-direction: row;
}

.buttons {
  margin-block: 20px;
  display: flex;
  flex-direction: row;
  justify-content: center;
}
.mag {
  width: 25px;
}
</style>
