<template>
    <img :src="logo" alt="">
</template>

<script setup>
const logo = new URL('@/assets/vue.svg', import.meta.url).href
</script>