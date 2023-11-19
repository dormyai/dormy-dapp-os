<template>
    <section class="top-list">
        <div class="card" v-for="item in topList">
            <div class="card-info">
                <img class="nft aspect-w-1 aspect-h-1" src="https://i.seadn.io/s/raw/files/33a413987337fb53186e65e937a99a31.png?auto=format&dpr=1&w=640" alt="">
                <div class="operate-box flex items-center">
                    <div class="item"><i class="i-solar-course-up-outline"></i></div>
                    <div class="item"><i class="i-solar-like-broken"></i></div>
                </div>
            </div>
        </div>
    </section>
</template>

<script setup>
import { useAuthStore } from '@/store/auth'
import { ref } from 'vue';

const topList = ref([1,2,3,4,5])

const store = useAuthStore()
const handleIncrece = () => {
    store.increment()
}
</script>

<style scoped lang="less">

@gradient01: linear-gradient(to right, #373b44, #4286f4);
@gradient02: linear-gradient(to right, #eecda3, #ef629f);
@gradient03: linear-gradient(to right, #7f7fd5, #86a8e7, #91eae4);
@gradient04: linear-gradient(to right, #11998e, #38ef7d);
@gradient05: linear-gradient(to right, #30e8bf, #ff8235);

.top-list {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 10px;
    padding: 12px;
    .card {
        aspect-ratio: 1;
        padding: 1px;
        border-radius: 1rem;
        overflow: visible;
        background: @gradient04;
        position: relative;
        z-index: 1;
        .card-info {
            --color: #181818;
            background: var(--color);
            color: var(--color);
            display: flex;
            justify-content: center;
            align-items: center;
            width: 100%;
            height: 100%;
            overflow: visible;
            border-radius: 1rem;
            overflow: hidden;

            .nft {
                max-inline-size: 100%;
            }

            .operate-box {
                position: absolute;
                top: 5px;
                right: 5px;
                .item {
                    transition: 0.2s ease-in-out;
                    border-radius: 10px;
                    margin: 5px;
                    width: 30px;
                    height: 30px;
                    background-color: #ffffff;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    border: 1px solid #F7F8FA;
                    cursor: pointer;
                    
                    &:hover {
                        transform: scale(1.1) rotate(10deg);
                        box-shadow: 0 0 10px #0000000d;
                    }
                }
            }
        }
    }
}

</style>