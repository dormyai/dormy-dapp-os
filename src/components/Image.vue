<script setup>
import { effect, ref } from 'vue';
import SolarGalleryRoundBold from '@/assets/svg/SolarGalleryRoundBold.svg';
const props = defineProps(['src'])
const imageUrl = ref(null)

const handleImageError = (event) => {
    imageUrl.value = SolarGalleryRoundBold
}

effect(() => {
    imageUrl.value = props.src
}, [props.src])

</script>

<template>
    <img :src="props.src" onerror="handleImageError" />
</template>