<template>
    <footer class="py-8 md:py-4" :class="[isLight?'light':'']">
        <div class="inner flex flex-col md:flex-row md:w-[30rem] mx-auto items-center">
            <div class="left">
                <img class="w-[3.2rem] block mx-auto md:mx-0" :src="LOGO" alt="">
                <h3 class="font-bold text-[0.51rem] py-2 text-center md:text-left">Subscribe to Our Newsletter</h3>
                <div class="bg-white flex items-center rounded-full input-box">
                    <img class="w-[0.46rem]" :src="MESS" alt="">
                    <div class="w-[1px] h-2 bg-[#6E777E] mx-[0.32rem]"></div>
                    <input class="input" type="text">
                    <button class="rounded-full">SUBSCRIBE</button>
                </div>
                <p class="text-[#808080] text-[0.36rem] mt-3"><span>Terms of Service</span> <span class="ml-4">Privacy Policy</span></p>
            </div>
            <div class="right mt-4 md:mt-0 md:ml-auto flex flex-col items-center">
                <h3 class="font-bold text-[0.51rem]">Join our Community</h3>
                <div v-if="isLight" class="flex items-center gap-x-[0.6rem] my-3">
                    <a href="https://discord.gg/Rcmgth4a" target="_blank" class="hover:opacity-80"><img class="w-[1.12rem]" :src="DISCORDW" alt=""></a>
                    <a href="https://twitter.com/Dormydotai" target="_blank" class="hover:opacity-80"><img class="w-[1.12rem]" :src="TWITTERW" alt=""></a>
                    <a href="https://medium.com/@dormydotai" target="_blank" class="hover:opacity-80"><img class="w-[1.12rem]" :src="MDW" alt=""></a>
                </div>
                <div v-else class="flex items-center gap-x-[0.6rem] my-3">
                    <a href="https://discord.gg/Rcmgth4a" target="_blank" class="hover:opacity-80"><img class="w-[1.12rem]" :src="DISCORD" alt=""></a>
                    <a href="https://twitter.com/Dormydotai" target="_blank" class="hover:opacity-80"><img class="w-[1.12rem]" :src="TWITTER" alt=""></a>
                    <a href="https://medium.com/@dormydotai" target="_blank" class="hover:opacity-80"><img class="w-[1.12rem]" :src="MD" alt=""></a>
                </div>
                <p class="text-[#808080] text-[0.36rem]">Copyright © 2023 DormyAI</p>
            </div>
        </div>
    </footer>
</template>

<script setup>
import { useRoute } from 'vue-router';
import { ref, watchEffect } from 'vue';
const LOGO = new URL('@/assets/images/logo_footer.png', import.meta.url).href
const DISCORD = new URL('@/assets/images/icon-discord.png', import.meta.url).href
const TWITTER = new URL('@/assets/images/icon-twitter.png', import.meta.url).href
const MD = new URL('@/assets/images/icon-md.png', import.meta.url).href
const DISCORDW = new URL('@/assets/images/icon-discord-w.png', import.meta.url).href
const TWITTERW = new URL('@/assets/images/icon-twitter-w.png', import.meta.url).href
const MDW = new URL('@/assets/images/icon-md-w.png', import.meta.url).href
const MESS = new URL('@/assets/images/icon-message.png', import.meta.url).href
const router = useRoute()
const isLight = ref(false)

watchEffect(() => {
  if (router.path === '/') {
    isLight.value = false
  } else {
    isLight.value = true
  }
})

</script>

<style lang="less" scoped>
footer {
    background-color: var(--footer-bg);
    &.light {
        --footer-bg: #FAFAFA;
        --footer-text: black;
        --footer-input: #EFF0F5;
    }
    .inner {
        color: var(--footer-text);

        .input-box {
            padding: 4px 4px 4px 25px;
            background: var(--footer-input);
            .input {
                background: transparent;
                border: none;
                font-size: 20px;
                height: 20px;
                padding: 10px 0;
                width: 6rem;
                outline: none;
                color: #222;
            }
            button {
                font-size: 18px;
                background-color: #3B5CFF;
                padding: 12px 16px;
                border: 0;
            }
        }

    }
}
</style>