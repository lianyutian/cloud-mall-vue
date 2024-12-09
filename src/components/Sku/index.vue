<script setup>
import { ref, watchEffect } from 'vue'
import getPowerSet from './power-set'

const props = defineProps({
  // specs:所有的规格信息  skus:所有的sku组合
  good: {
    type: Object,
    // 解构
    default: () => ({ specs: [], skus: [] }),
  },
})

const emit = defineEmits(['change'])

const spliter = '★'
// 根据skus数据得到路径字典对象
const getPathMap = (skus) => {
  const pathMap = {}
  if (skus && skus.length > 0) {
    skus.forEach((sku) => {
      // 1. 过滤出有库存有效的sku
      if (sku.inventory) {
        // 2. 得到sku属性值数组
        // 例如：[ { "name": "颜色", "valueName": "米白" }, { "name": "尺码", "valueName": "73/18M" } ]
        // 得到 ["米白","73/18M"]
        const specVauleNames = sku.specs.map((spec) => spec.valueName)
        // 3. 得到sku属性值数组的子集(例如)
        debugger
        const powerSet = getPowerSet(specVauleNames)
        // 4. 设置给路径字典对象
        powerSet.forEach((set) => {
          const key = set.join(spliter)
          // 如果没有就先初始化一个空数组
          if (!pathMap[key]) {
            pathMap[key] = []
          }
          pathMap[key].push(sku.id)
        })
      }
    })
  }
  return pathMap
}

// 初始化禁用状态
function initDisabledStatus(specs, pathMap) {
  if (specs && specs.length > 0) {
    specs.forEach((spec) => {
      spec.values.forEach((val) => {
        // 设置禁用状态(没有库存的属性禁用)
        val.disabled = !pathMap[val.name]
      })
    })
  }
}

// 得到当前选中规格集合
const getSelectedArr = (specs) => {
  const selectedArr = []
  specs.forEach((spec, index) => {
    const selectedVal = spec.values.find((val) => val.selected)
    if (selectedVal) {
      selectedArr[index] = selectedVal.name
    } else {
      selectedArr[index] = undefined
    }
  })
  return selectedArr
}

// 更新按钮的禁用状态
const updateDisabledStatus = (specs, pathMap) => {
  // 遍历每一种规格
  specs.forEach((item, i) => {
    // 拿到当前选择的项目
    const selectedArr = getSelectedArr(specs)
    // 遍历每一个按钮
    item.values.forEach((val) => {
      if (!val.selected) {
        selectedArr[i] = val.name
        // 去掉undefined之后组合成key
        const key = selectedArr.filter((value) => value).join(spliter)
        val.disabled = !pathMap[key]
      }
    })
  })
}

// 监视skus属性和specs属性变化
const pathMap = ref({})
watchEffect(() => {
  // 得到所有字典集合
  pathMap.value = getPathMap(props.good.skus)
  // 组件初始化的时候更新禁用状态
  initDisabledStatus(props.good.specs, pathMap.value)
})

// 选中规格
const clickSpecs = (item, val) => {
  debugger
  if (val.disabled) return false
  // 选中与取消选中逻辑
  if (val.selected) {
    val.selected = false
  } else {
    // 除选中的其他属性 selected 全置为 false
    item.values.forEach((bv) => {
      bv.selected = false
    })
    // 选中属性置为 true
    val.selected = true
  }

  // 点击之后再次更新选中状态
  updateDisabledStatus(props.good.specs, pathMap)
  // 把选择的sku信息传出去给父组件
  // 触发change事件将sku数据传递出去
  const selectedArr = getSelectedArr(props.good.specs).filter((value) => value)
  // 如果选中得规格数量和传入得规格总数相等则传出完整信息(都选择了)
  // 否则传出空对象
  if (selectedArr.length === props.good.specs.length) {
    // 从路径字典中得到skuId
    const skuId = pathMap[selectedArr.join(spliter)][0]
    const sku = props.good.skus.find((sku) => sku.id === skuId)
    // 传递数据给父组件
    emit('change', {
      skuId: sku.id,
      price: sku.price,
      oldPrice: sku.oldPrice,
      inventory: sku.inventory,
      specsText: sku.specs
        .reduce((p, n) => `${p} ${n.name}：${n.valueName}`, '')
        .trim(),
    })
  } else {
    emit('change', {})
  }
}
</script>

<template>
  <div class="good-sku">
    <dl v-for="item in good.specs" :key="item.id">
      <dt>{{ item.name }}</dt>
      <dd>
        <template v-for="val in item.values" :key="val.name">
          <img
            :class="{ selected: val.selected, disabled: val.disabled }"
            @click="clickSpecs(item, val)"
            v-if="val.picture"
            :src="val.picture"
          />
          <span
            :class="{ selected: val.selected, disabled: val.disabled }"
            @click="clickSpecs(item, val)"
            v-else
          >
            {{ val.name }}
          </span>
        </template>
      </dd>
    </dl>
  </div>
</template>

<style scoped lang="scss">
@mixin sku-state-mixin {
  border: 1px solid #e4e4e4;
  margin-right: 10px;
  cursor: pointer;

  &.selected {
    border-color: $mallColor;
  }

  &.disabled {
    opacity: 0.6;
    border-style: dashed;
    cursor: not-allowed;
  }
}

.good-sku {
  padding-left: 10px;
  padding-top: 20px;

  dl {
    display: flex;
    padding-bottom: 20px;
    align-items: center;

    dt {
      width: 50px;
      color: #999;
    }

    dd {
      flex: 1;
      color: #666;

      > img {
        width: 50px;
        height: 50px;
        margin-bottom: 4px;
        @include sku-state-mixin;
      }

      > span {
        display: inline-block;
        height: 30px;
        line-height: 28px;
        padding: 0 20px;
        margin-bottom: 4px;
        @include sku-state-mixin;
      }
    }
  }
}
</style>
