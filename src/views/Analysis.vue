<template>
    <el-card class="box-card">
        <el-row :gutter="15">
        <el-col :span="16">
            <el-input
            v-model="inputComponent"
            class="input"
            size="large"
            placeholder="Please Input"
            clearable
            />
        </el-col>
        <el-col :span="8">
            <el-button type="primary" @click="search()">查询</el-button>
        </el-col>
        </el-row>
         <div ref="wordcloud" class="wordcloud">
            <wordcloud></wordcloud>
        </div>
        <h1 class="title">查询单元历史信息</h1>
        <el-table :data="equipmentData" style="width: 100%" max-height="350" stripe empty-text="目前暂无数据">
            <el-table-column type="index" :index=1 />
            <el-table-column prop="component" label="单元" width="250" />
            <el-table-column prop="situation" label="故障模式" width="250" />
            <el-table-column prop="effect" label="故障影响" width="250" />
            <el-table-column prop="detection" label="故障检测方法" width="250" />
            <el-table-column prop="reason" label="故障原因" width="250" />
            <el-table-column prop="solution" label="改进措施" width="250" />
            <el-table-column fixed="right" label="操作" width="200">
            <template #default="scope">
                <el-button
                type="primary"
                size="small"
                @click="viewEntity(scope.row)"
                link
                >
                查看关联与详情
                </el-button>
            </template>
            </el-table-column>
        </el-table>
        <h1 class="title">异常现象测点</h1>
        <el-table :data="situationData" style="width: 100%" max-height="350" stripe empty-text="目前暂无数据">
            <el-table-column type="index" :index=1 />
            <el-table-column prop="situation" label="故障模式" width="250" />
            <el-table-column prop="point" label="测点" width="700" />
            <el-table-column fixed="right" label="操作" width="200">
            <template #default="scope">
                <el-button
                type="primary"
                size="small"
                @click="viewEntity(scope.row)"
                link
                >
                查看关联与详情
                </el-button>
            </template>
            </el-table-column>
        </el-table>
        <h1 class="title" hidden>解决方法</h1>
        <el-table :data="solutionData" style="width: 100%" max-height="350" stripe empty-text="目前暂无数据" hidden>
            <el-table-column type="index" :index=1 />
            <el-table-column prop="reason" label="Reason" width="250" />
            <el-table-column prop="solution" label="SolutionName" width="700" />
            <el-table-column fixed="right" label="Operations" width="200">
            <template #default="scope">
                <el-button
                type="primary"
                size="small"
                @click="viewEntity(scope.row)"
                link
                >
                查看关联与详情
                </el-button>
            </template>
            </el-table-column>
        </el-table>
    </el-card>
</template>

<script>
import { NGetEquipmentRank, NGetSituationRank, NGetSolutionRank } from "../api/index";
import * as echarts from "echarts";
import "echarts-wordcloud/dist/echarts-wordcloud";
import "echarts-wordcloud/dist/echarts-wordcloud.min";
export default {
  data() {
    return {
        situationData:[],
        equipmentData:[],
        solutionData:[],
        inputComponent:'',
        wordList:[
       {
         name: "转子组成",
         value: 13
       },
       {
         name: "轴承部件及其润滑",
         value: 16
       },
       {
         name: "泵本体",
         value: 4
       },
       {
         name: "冷水机",
         value: 22
       },
       {
         name: "电动机",
         value: 54
       },
     ]
    }
  },
  mounted() {
    this.initchart();
  },
  methods: {
    initchart(){
       var that = this;
       let myChart = echarts.init(this.$refs.wordcloud);
       myChart.setOption({
         series: [
           {
             type: "wordCloud",
             //用来调整词之间的距离
             gridSize: 10,
             //用来调整字的大小范围
             // Text size range which the value in data will be mapped to.
             // Default to have minimum 12px and maximum 60px size.
             sizeRange: [14, 60],
             // Text rotation range and step in degree. Text will be rotated randomly in range [-90,                                                                             90] by rotationStep 45
             //用来调整词的旋转方向，，[0,0]--代表着没有角度，也就是词为水平方向，需要设置角度参考注释内容
             // rotationRange: [-45, 0, 45, 90],
             // rotationRange: [ 0,90],
             rotationRange: [0, 0],
             //随机生成字体颜色
             // maskImage: maskImage,
             textStyle: {
                 color: function() {
                   return (
                     "rgb(" +
                     Math.round(Math.random() * 255) +
                     ", " +
                     Math.round(Math.random() * 255) +
                     ", " +
                     Math.round(Math.random() * 255) +
                     ")"
                   );
               }
             },
             //位置相关设置
             // Folllowing left/top/width/height/right/bottom are used for positioning the word cloud
             // Default to be put in the center and has 75% x 80% size.
             left: "center",
             top: "center",
             right: null,
             bottom: null,
             width: "200%",
             height: "200%",
             //数据
             data: this.wordList
           }
         ]
       })
        myChart.on('click',function(params){
            console.log(params.data);
            that.inputComponent = params.data.name;
            console.log(that.inputComponent)
        });
     },
      search() {
        NGetEquipmentRank({
            componentName: this.inputComponent,
        })
        .then((data) => {
            console.log(data);
            this.equipmentData = data;
            NGetSituationRank({
                componentName: this.inputComponent,
            })
            .then((data) => {
                console.log(data);
                this.situationData = data;
                NGetSolutionRank({
                    componentName: this.inputComponent,
                })
                .then((data) => {
                    console.log(data);
                    this.solutionData = data;
                })
                .catch((err) => {
                    console.log(err);
                });
            })
            .catch((err) => {
                console.log(err);
            });
        })
        .catch((err) => {
            console.log(err);
        });       
      },
      viewEntity(row){
        console.log(row);
        if(row.hasOwnProperty("component")){
            console.log("component");
            this.$router.push(
            {
                path:'/entity', 
                query:{name:row.component,
                    category: "Component"}
            })
        }else if(row.hasOwnProperty("situation")){
            console.log("situation");
            this.$router.push(
            {
                path:'/entity', 
                query:{name:row.situation,
                    category: "Situation"}
            })
        }else if(row.hasOwnProperty("solution")){
            console.log("solution");
            this.$router.push(
            {
                path:'/entity', 
                query:{name:row.solution,
                    category: "Method"}
            })
        }
      }
  },
 
};
</script>


<style scoped>
.title{
    margin-bottom: 2%;
    margin-top: 2%;
}
.wordcloud{
 width:100%;
 height:300px;
 margin:auto;
 margin-top: 2%;
}
</style>