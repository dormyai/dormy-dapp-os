<template>
    <a-modal class="wallet-container" :width="width" v-model:visible="visible" @ok="handleOk" @close="handleClose" @cancel="handleCancel" :footer="false" :title-align="'start'">
        <template #title>
            {{ props.title }}
        </template>
        <slot name="main"></slot>
    </a-modal>
</template>

<script setup>
import { ref, watch } from 'vue';
const props = defineProps({
    modelValue: {
        type: String,
    },
    title: {
        type: String,
        default: ''
    },
    width: {
        type: String,
        default: '520px'
    }
})
const emit = defineEmits(['update:modelValue', 'close'])

const visible = ref(false)
watch(
    () => props.modelValue,
    (val) => {
        console.log('val:',val)
        if (visible.value !== val) {
            visible.value = val
        }
    }
)
watch(
    () => visible.value,
    (val) => {
        if (props.modelValue !== val) {
            emit('update:modelValue', val)
        }
    }
)

const handleOk = () => {
    visible.value = !visible.value
}
const handleCancel = () => {

}
const handleClose = () => {
    emit('close')
}
</script>

<style lang="less">

.wallet-container {
    .arco-modal-header {
     border-bottom: none;
   }
   .arco-modal {
        max-width: 90% !important;
   }
   .arco-modal-body {
    padding-top: 10px;
   }
}
</style>