<template>
    <a-modal class="wallet-container" v-model:visible="visible" @ok="handleOk" @cancel="handleCancel" :footer="false" :title-align="'start'">
        <template #title>
            Connect a Wallet
        </template>
        <div>You can customize modal body text by the current situation. This modal will be closed immediately once you
            press the OK button.</div>
    </a-modal>
</template>

<script setup>
import { ref, watch } from 'vue';
const props = defineProps(['modelValue'])
const emit = defineEmits(['update:modelValue'])

const visible = ref(false)
watch(
    () => props.modelValue,
    (val) => {
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
</script>

<style lang="less">

.wallet-container {
    .arco-modal-header {
     border-bottom: none;
   }

}
</style>