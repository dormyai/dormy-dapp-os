<template>
    <footer class="py-8 md:py-4" :class="[isLight?'light':'']">
        <div class="inner flex flex-col md:flex-row md:w-[30rem] mx-auto items-center">
            <div class="left">
                <img class="w-[3.2rem] block mx-auto md:mx-0" :src="LOGO" alt="">
                <h3 class="font-bold text-[0.51rem] py-2 text-center md:text-left">Subscribe to Our Newsletter</h3>
                <div class="bg-white flex items-center rounded-full input-box">
                    <img class="w-[0.46rem]" :src="MESS" alt="">
                    <div class="w-[1px] h-2 bg-[#6E777E] mx-[0.32rem]"></div>
                    <input class="input" v-model.trim="email" type="text">
                    <a-button :loading="loading" shape="round" class="text-white" @click="handleSubscribe">SUBSCRIBE</a-button>
                </div>
                <p class="text-[#808080] text-[0.36rem] mt-3"><span>Terms of Service</span> <span class="ml-4">Privacy Policy</span></p>
            </div>
            <div class="right mt-4 md:mt-0 md:ml-auto flex flex-col items-center">
                <h3 class="font-bold text-[0.51rem]">Join our Community</h3>
                <div v-if="isLight" class="flex items-center gap-x-[0.6rem] my-3">
                    <a :href="twitterUrl" target="_blank" class="hover:opacity-80"><img class="w-[1.12rem]" :src="TWITTERW" alt=""></a>
                    <a :href="mediumUrl" target="_blank" class="hover:opacity-80"><img class="w-[1.12rem]" :src="MDW" alt=""></a>
                </div>
                <div v-else class="flex items-center gap-x-[0.6rem] my-3">
                    <a :href="twitterUrl" target="_blank" class="hover:opacity-80"><img class="w-[1.12rem]" :src="TWITTER" alt=""></a>
                    <a :href="mediumUrl" target="_blank" class="hover:opacity-80"><img class="w-[1.12rem]" :src="MD" alt=""></a>
                </div>
                <p class="text-[#808080] text-[0.36rem]">Copyright © 2023 DormyAI</p>
            </div>
        </div>
    </footer>
</template>

<script setup>
import { useRoute } from 'vue-router';
import { ref, watchEffect } from 'vue';
import service from '@/axios';
import qs from 'qs';
import { Notification } from '@arco-design/web-vue';

const LOGO = new URL('@/assets/images/logo_footer.png', import.meta.url).href
const TWITTER = new URL('@/assets/images/icon-twitter.png', import.meta.url).href
const MD = new URL('@/assets/images/icon-md.png', import.meta.url).href
const TWITTERW = new URL('@/assets/images/icon-twitter-w.png', import.meta.url).href
const MDW = new URL('@/assets/images/icon-md-w.png', import.meta.url).href
const MESS = new URL('@/assets/images/icon-message.png', import.meta.url).href
const router = useRoute()
const isLight = ref(false)
const sign = ref(import.meta.env.VITE_SPECIAL_SIGN)
const twitterUrl = ref(import.meta.env.VITE_TWITTER_LINK)
const mediumUrl = ref(import.meta.env.VITE_MEDIUM_LINK)

watchEffect(() => {
  if (router.path === '/') {
    isLight.value = false
  } else {
    isLight.value = true
  }
})

const email = ref('')
const loading = ref(false)

const handleSubscribe = async () => {

    let reg = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    if (!reg.test(email.value)) {
        return Notification.error({
            title: 'Please enter your usual email address.',
            duration: 2000
        })
    }

    if (loading.value) return;
    loading.value = true
    let resultRes = await service({
        url: "/api/v1/common/mail_subscribe",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          "sign": sign
        },
        method: "post",
        data: qs.stringify({
            email: email.value
        })
    })
    loading.value = false
    if (resultRes.code == 200) {
        email.value = ''
        return Notification.success({
            title: 'Successfully!',
            duration: 2000
        })
    }
    
}

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
                color: white;
                border: 0;
            }
        }

    }
}
</style>