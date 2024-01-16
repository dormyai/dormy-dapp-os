<script setup>
import { effect, ref } from 'vue';
import SystemUiconsPicture from '@/assets/svg/SystemUiconsPicture.svg';
const props = defineProps(['src'])
const imageUrl = ref(null)
const isError = ref(true)

const handleImageError = (event) => {
    isError.value = true
    imageUrl.value = SystemUiconsPicture
}

effect(() => {

    if (!props.src) {
        isError.value = true
        imageUrl.value = SystemUiconsPicture
        return;
    }

    imageUrl.value = props.src;
    isError.value = false
}, [props.src])

</script>

<template>
    <img class="preview-image" :src="imageUrl" :class="[isError?'error':'']" @error="handleImageError" />
</template>

<style lang="less" scoped>
.preview-image {
    object-fit: cover;
}
.error {
    object-fit: contain !important;
    opacity: .2;
}
</style>