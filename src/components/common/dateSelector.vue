<template>
    <div>
        <div style="margin-bottom:5px;" v-for="(value, key, index) in openingTime" :key='index'>
            <el-select style="width:18%;" @change="submit" v-model="value.day" placeholder="星期">
                <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value">
                </el-option>
            </el-select>
            <el-time-picker
                style="width:63%;"
                is-range
                arrow-control
                @change="submit"
                v-model="value.time"
                range-separator="至"
                start-placeholder="营业时间"
                end-placeholder="打烊时间"
                placeholder="选择时间范围">
            </el-time-picker>
            <el-button v-if="key !== 0" type="primary" @click="minus(key)" size="mini" icon="el-icon-minus" circle></el-button>
            <el-button v-if="key === openingTime.length -1" type="primary" @click="add" size="mini" icon="el-icon-plus" circle></el-button>
        </div>
    </div>
</template>

<script>
export default {
    data(){
        return {
            openingTime:[
                {
                   day:null,
                   time:null
                },
                ],
            options: [{
                value: 'monday',
                label: '周一'
            }, {
                value: 'tuesday',
                label: '周二'
            }, {
                value: 'wednesday',
                label: '周三'
            }, {
                value: 'thursday',
                label: '周四'
            }, {
                value: 'friday',
                label: '周五'
            }, {
                value: 'saturday',
                label: '周六'
            }, {
                value: 'sunday',
                label: '周日'
            }]
        }
    },
    watch:{
    },
    methods:{
        submit(){
            this.$emit("getOpeningTime",this.openingTime);
        },
        add(){
            this.openingTime.push({
                day:null,
                time:null
            })
        },
        minus(para){
            this.openingTime.splice(para,1)
        }
    }
}
</script>
