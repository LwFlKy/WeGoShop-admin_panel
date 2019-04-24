<template>
    <div id="app">
        <transition name="el-fade-in-linear" mode="out-in">
                <router-view></router-view>
        </transition>
    </div>
</template>
<script>
    export default{
        data() {
            return {
                a:"bcd",
            }
        },
    }
</script>