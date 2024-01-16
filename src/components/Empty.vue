<script setup>
const props = defineProps({
    message: {
        type: String,
        default: 'Nothing here.'
    }
})
</script>

<template>
    <div>
        <img class="empty" src="../assets/images/empty.webp" alt="empty">
        <p class="message text-center text-[#808080] mt-2">{{ props.message }}</p>
        <div class="extra text-center mt-2"><slot></slot></div>
    </div>
</template>

<style scoped lang="less">
.empty {
    width: 220px;
    display: block;
    margin: 0 auto;
}
.message {
    font-size: 16px;
}
</style>