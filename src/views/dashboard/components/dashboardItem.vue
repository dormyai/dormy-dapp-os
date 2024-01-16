<script setup>
import Image from '@/components/Image.vue'

const props = defineProps({
    item: {
        type: Object,
        require: true
    }
})

const dateFormat = (time) => {
    return new Date(time.toString()).toLocaleDateString();
}

</script>

<template>
    <div class="item flex items-center px-[0.36rem] py-[0.8rem]">
        <div class="w-[12.5rem] flex items-center gap-2">
            <Image class="list-image ml-2" :src="item.property_info_medium[0].url" />
            <div class="text-left">
                <h3 class="m-h3 truncate flex-1">{{ item.property_info.address1 }},{{ item.property_info.address2 }}</h3>
                <p class="name">{{ item.property_info.property_number }}</p>
                <a href="">View Title Deed</a>
            </div>
        </div>
        <div class="w-[2rem]">{{ item.property_user_summary.amount }}</div>
        <div class="w-[2.5rem]">--</div>
        <div class="w-[3.6rem]">{{ dateFormat(item.property_user_summary.start_time) }}</div>
        <div class="w-[3.2rem]">--</div>
        <div class="w-[3.5rem]">
            <a-button class="button" shape="round" size="small">Claim Rents</a-button>
        </div>
    </div>
</template>

<style lang="less" scoped>
.m-h3 {
    font-size: 20px;
}
.item {
    text-align: center;
    font-size: 18px;
    .list-image {
        width: 190px;
        height: 120px;
        border-radius: 8px;
    }
    .name {
        font-size: 18px;
        color: #7B7B80;
    }
    .m-h3 {
        max-width: 7.6rem;
    }
    a {
        color: #EC7201;
        font-size: 16px;
        margin-top: 20px;
        display: inline-block;
    }

    .button {
        font-size: 16px;
        background: rgba(59,92,255,0.1);
        color: #3B5CFF;
        &:disabled {
            background: #E9E9E9;
            color: #969696;
        }
    }
}
</style>