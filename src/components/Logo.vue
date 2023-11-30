<template>
    <img :src="logo" alt="">
</template>

<script setup>
const logo = new URL('@/assets/logo.png', import.meta.url).href
</script>