<template>
    <div>
        <el-card class="box-card">
            <div id="graph">
                <el-row :gutter="2">
                    <el-col :span="5">
                        <el-card>
                            <template #header>
                                <div class="card-header">
                                    <el-form :model="form">
                                        <el-form-item label="请输入">
                                            <el-input v-model="form.firstName" size="mini"></el-input>
                                        </el-form-item>
                                        <el-form-item label="查询类型">
                                            <el-radio-group v-model="form.firstCategory" size="mini">
                                                <el-radio label="Component"></el-radio>
                                                <el-radio label="Detection"></el-radio>
                                                <el-radio label="Effect"></el-radio>
                                                <el-radio label="Method"></el-radio>
                                                <el-radio label="Point"></el-radio>
                                                <el-radio label="Reason"></el-radio>
                                                <el-radio label="Situation"></el-radio>
                                            </el-radio-group>
                                        </el-form-item>
                                        <el-form-item label="请输入">
                                            <el-input v-model="form.endName" size="mini"></el-input>
                                        </el-form-item>
                                        <el-form-item label="查询类型">
                                            <el-radio-group v-model="form.endCategory" size="mini">
                                                <el-radio label="Component"></el-radio>
                                                <el-radio label="Detection"></el-radio>
                                                <el-radio label="Effect"></el-radio>
                                                <el-radio label="Method"></el-radio>
                                                <el-radio label="Point"></el-radio>
                                                <el-radio label="Reason"></el-radio>
                                                <el-radio label="Situation"></el-radio>
                                            </el-radio-group>
                                        </el-form-item>
                                        <el-form-item>
                                            <span>最小跳数</span>
                                            <el-input-number size="mini" v-model="form.minJump"
                                                :min="1" :max="form.maxJump" />
                                        </el-form-item>
                                        <el-form-item>
                                            <span>最大跳数</span>
                                            <el-input-number size="mini" v-model="form.maxJump"
                                                :min="form.minJump" :max="3" />
                                        </el-form-item>
                                        <el-form-item>
                                            <el-button type="primary" @click="getRelationGraph()" size="mini">查询
                                            </el-button>
                                            <el-button size="mini">取消</el-button>
                                        </el-form-item>
                                    </el-form>
                                </div>
                            </template>
                            <!-- div>关系次数：<h2 align="center">{{cooperateNum}}</h2></div -->
                        </el-card>

                    </el-col>
                    <el-col :span="14">
                        <div id="chart" ref="scatterMap" class="chart-wrapper" />
                    </el-col>
                    <el-col :span="5">
                        <el-card style="margin-top:30%">
                                <el-descriptions :title="curNode.name" :column="1" border size="mini">
                                    <div v-for="(value, name) in curNode.content" :key="name">
                                        <el-descriptions-item :label="name">{{ value }}</el-descriptions-item>
                                    </div>    
                                </el-descriptions>
                        </el-card>
                    </el-col>
                </el-row>
            </div>
        </el-card>
        <el-card class="box-card">
            <h1 class="title">多跳关系详述</h1>
            <el-table :data="detailData" style="width: 100%" max-height="350" stripe empty-text="目前暂无数据">
                <el-table-column type="index" :index=1 />
                <el-table-column prop="relation" label="Relation" />
            </el-table>
        </el-card>
    </div>
</template>

<script lang="ts">
import * as echarts from "echarts";
import { defineComponent, onMounted, ref, reactive } from "vue";
import cloneDeep from "lodash/cloneDeep";
import { NGetRelation, MGetEntity, NGetCooperate} from "../api/index";


export default defineComponent({
    name: "echarts",
    props: {},
    data() {
        return {
            form: { 
                firstName: null, 
                firstCategory: null,
                endName: null,
                endCategory: null, 
                minJump:1,
                maxJump:2
            },
            curNode:{
                content: {
                },
                name: "暂无节点", 
                category: null
            },
            detailData:[],
            data: {
                "nodes": [],
                "links": [],
                "categories": [
                    {
                        "name": "Component"
                    },
                    {
                        "name": "Detection"
                    },                                         
                    {
                        "name": "Effect"
                    },
                    {
                        "name": "Method"
                    },
                    {
                        "name": "Point"
                    },
                    {
                        "name": "Reason"
                    },
                    {
                        "name": "Situation"
                    }
                ]
            }
            , config: {
                color: 0,
                colorOptions: [
                    { label: "方案一", value: 0 },
                    { label: "方案二", value: 1 },
                    { label: "方案三", value: 2 },
                ],
                size: 1,
                sizeOptions: [
                    { label: "小", value: 0 },
                    { label: "中", value: 1 },
                    { label: "大", value: 2 },
                ],
                length: 1,
                showAll: true,
                id: "0", // 随意设置一个,初始化时根据参数重置
            }, lastNodes: null,
            myChart: null,
            scatterMap: null,
            cooperateNum:'暂无'
        }
    },
    mounted() {
        var that = this;

        // that.myChart = ref(null);
        // var scatterMap = ref();
        that.myChart = echarts.init(document.getElementById('chart'));
        that.lastNodes = this.data.nodes;
        that.draw();
        //that.config.id = that.data.nodes[0].id;
        that.myChart.on("click", function (params) {
            // 点击节点时，才会触发绘图
            if (params.dataType === "node") {
                // 设置当前选中点
                console.log(params.data.name, params.data.category);
                that.getEntityMes(params.data.name, params.data.category);
                // that.config.id = params.data.id;
                // that.draw();
            }
        });
    },

    methods: {
        getRelationGraph() {
            console.log("submit!");
            console.log(this.form);
            this.cooperateNum = '暂无';
            this.getEntityMes(this.form.firstName, this.form.firstCategory);
            NGetRelation({
                startNode: this.form.firstName,
                startType: this.form.firstCategory,
                endNode: this.form.endName,
                endType: this.form.endCategory,
                minJump: this.form.minJump,
                maxJump: this.form.maxJump,
            })
                .then((data) => {
                    console.log(data);
                    this.detailData = [];
                    for(var i = 0;i < data.length;i++){
                        var strRelation = '';
                        var j = 0;
                        for(j = 0;j < data[i].node.length - 1;j++){
                            strRelation = strRelation +"(" + data[i].node[j].name + ")——[" + data[i].relationship[j] + "]——";
                        }
                        strRelation = strRelation +"(" + data[i].node[j].name + ")";
                        this.detailData.push({relation:strRelation});
                    }
                    if(this.form.firstCategory == 'author' && this.form.endCategory == 'author'){
                     /*   NGetCooperate({
                            firstName:this.form.firstName,
                            lastName:this.form.endName, 
                        })
                        .then((cooperateData) => {
                            console.log(cooperateData);
                            this.cooperateNum = cooperateData;
                        })
                        .catch((err) => {
                            console.log(err);
                        });*/
                    }
                    this.data.nodes = []
                    this.data.links = []
                    for(var i = 0;i < data.length;i++){
                        for(var j = 0;j < data[i].node.length;j++){
                            var temp = 0;
                            this.data.nodes.find(function(value) {
                                if(value.id === data[i].node[j].id) {
                                    temp = 1;
                                }
                            })
                            if(temp == 0){
                                this.data.nodes.push(data[i].node[j])
                            }
                            if(j != data[i].node.length - 1){
                                this.data.links.push({
                                    "source": data[i].node[j].id,
                                    "target": data[i].node[j + 1].id,
                                    "relation": data[i].relationship[j]
                                })
                            }
                        }
                    }
                    console.log(this.data.nodes);
                    this.draw();
                })
                .catch((err) => {
                    console.log(err);
                });
        },
        getEntityMes(name, category) {
            console.log("getEntityMes!");
            this.curNode.name = name;
            this.curNode.category = category;
            if (category == "Point") {
                MGetEntity({
                    name: name,
                    category: category,
                })
                    .then((data) => {
                        console.log(data);
                        this.curNode.content = data;
                    })
                    .catch((err) => {
                        console.log(err);
                    });

            } else {
                this.curNode.content = {};
            }
        },


        getCenterPoint() {
            return {
                x: 500,
                y: 400,
            };
        },

        setNodes(id, length, position, links) {
            let existNodes = [id];
            // 目的：查找某节点附近的ID，如果之前已经查找过，则过滤掉
            function findNearNodes(id) {
                let nodesID = [];
                const tempNodeID = [];
                // 根据已有的ID查找target和source所对应的ID
                links.forEach((item) => {
                    if (item.source === id) {
                        tempNodeID.push(item.target);
                    }
                    if (item.target === id) {
                        tempNodeID.push(item.source);
                    }
                });
                // 先剔除自身重复，即查找出来的nodesID的重复项
                nodesID = [...new Set(tempNodeID)];
                // 剔除已经查找过的点 []
                const res = nodesID.filter(function (v) {
                    return existNodes.indexOf(v) == -1;
                });
                // 把新找出来的点，加到已经存在的list中 existNodes
                existNodes = existNodes.concat(res);
                // 返回已经剔除出来的新找出来的节点
                return res;
            }
            const nodeLevel = [];
            for (let i = 0; i < length + 1; i++) {
                nodeLevel.push([]);
            }
            let res = [];
            function setNodeLevel(nodes, levelIndex) {
                nodes.forEach((item) => {
                    nodeLevel[levelIndex].push(item);
                });
                // 查找节点附近的点
                let nearNodes = [];
                nodeLevel[levelIndex].forEach((item) => {
                    nearNodes = nearNodes.concat(findNearNodes(item));
                });
                if (levelIndex < length) {
                    setNodeLevel(nearNodes, levelIndex + 1);
                } else {
                    // 根据这个nodeLevel设置对应id的category属性
                    const visibleNodesId = nodeLevel.flat(); //去括号，获取所有要显示的节点 ID
                    let coypNodes = cloneDeep(this.data.nodes);
                    const visibleNodes = coypNodes.filter((item) => {
                        return visibleNodesId.indexOf(item.id) !== -1;
                    });
                    nodeLevel.forEach((nodeIds, index) => {
                        nodeIds.forEach((nodeId) => {
                            // 多级遍历设置对应的category属性
                            visibleNodes.forEach((node) => {
                                if (node.id === nodeId) {
                                    ////node.category = index + 1;
                                    ////node.symbolSize = 15;
                                }
                                if (node.id === id) {
                                    ////node.x = position.x;
                                    ////node.y = position.y;
                                    ////node.fixed = true;
                                }
                            });
                        });
                    });
                    // 添加上次 查询出来的点
                    // 遍历 上次查询出来的点
                    res = visibleNodes;
                }
            }
            // 示例，第一个节点id为'1'
            setNodeLevel([id], 0);
            return res;
        },
        setConfig(nodeId, position) {
            let nodes = cloneDeep(this.data.nodes);
            // link可以不改变，但是category要改变，cloneDeep防止覆盖
            // 是否显示全部，不然有的节点永远选不到，肯定要有这么一个选项
            // 即：显示全部、显示当前节点
            // 如果显示全部节点category如何设置？随机！
            // 如果节点部分设置，选中点category为1，其余按照链路累加
            if (this.config.showAll) {
                nodes.forEach(function (node) {
                    ////node.symbolSize = 15;
                    ////node.category = Math.floor(Math.random() * 8);
                });
            } else {
                nodes = this.setNodes(nodeId, this.config.length, position, this.data.links);
            }
            // TODO
            // handle 处理 要显示的node跟上一次的进行合并
            const visibleNodes = cloneDeep(nodes);
            // const visibleNodesId = visibleNodes.map((item) => {
            //   return item.id;
            // });
            // 把上次的节点也显示进去
            // lastNodes.value.forEach((item) => {
            //   if (visibleNodesId.indexOf(item.id) === -1) {
            //     item.category = 0;
            //     item.symbolSize = 15;
            //     visibleNodes.push(item);
            //   }
            // });
            // 把当前查出来的nodes保存到lastNodes中
            this.lastNodes = cloneDeep(nodes);

            // nodes 跟上次的合并处理
            const options = {

                tooltip: {
                    formatter: '{b}'
                },
                toolbox: {
                    show: true,
                    feature: {
                        restore: {
                            show: true
                        },
                        saveAsImage: {
                            show: true
                        }
                    }
                },
                legend: {
                    data: this.categories,

                },
                series: [
                    {
                        // edgeSymbol:["circle","arrow"],
                        // edgeSymbolSize:10,
                        name: "Les Miserables",
                        type: "graph",
                        layout: "force",
                        draggable: true,
                        data: this.data.nodes,
                        links: this.data.links,
                        categories: this.data.categories,
                        roam: true,
                        symbolSize: 20, // 调整节点的大小
                        edgeSymbolSize: [0, 10],
                        edgeSymbol: ['null', 'arrow'],
                        // labelLayout: {
                        //     hideOverlap: true
                        // },
                        label: {
                            position: "right",
                            show: true, // 默认显示label

                            clolr: "#fff", // label颜色,
                            fontSize: 12, // 字体大小
                        },
                        edgeLabel: {
                            normal: {
                                show: true,
                                formatter: function (x) {
                                    return x.data.relation;
                                }
                            }
                        },
                        force: {
                            edgeLength: 160, // TODO可以由用户设置  边的两个节点之间的距离，这个距离也会受 repulsion。
                            // 支持设置成数组表达边长的范围，此时不同大小的值会线性映射到不同的长度。值越小则长度越长。
                            repulsion: 100, // 节点之间的斥力因子。
                            // 支持设置成数组表达斥力的范围，此时不同大小的值会线性映射到不同的斥力。值越大则斥力越大
                            gravity: 0.1, // 节点受到的向中心的引力因子。该值越大节点越往中心点靠拢。
                        },
                    },
                ],
            };
            return options;
        },
        // 三组配色方案 ok
        // 三组间距，球大小 ok
        // 点击后，小球居中 ok
        // 出现问题：拖拽后小球位置自动移动，发生偏移
        // filter链路可调
        // 箭头双向过滤
        // 关于颜色的使用：因为总颜色有限，中心点设为category为1，其他的依次相加，0作为默认颜色



        async initEcharts() {
            this.myChart = echarts.init(this.scatterMap);
            this.lastNodes = this.data.nodes;
            this.draw();
            this.config.id = this.data.nodes[0].id;
            this.myChart.on("click", function (params) {
                // 点击节点时，才会触发绘图
                if (params.dataType === "node") {
                    // 设置当前选中点
                    this.config.id = params.data.id;
                    this.draw();
                }
            });
        },
        async drawImage() {
            this.getRelationGraph();
            this.draw();
        },
        draw() {
            const position = this.getCenterPoint();
            if (this.config.showAll) {
                const option = this.setConfig(0, position);
                this.myChart.setOption(option);
            } else {
                // TODO设置是否居中，居中的话方便查看，不居中的话可能会导致部分节点不显示？maybe
                const option = this.setConfig(this.config.id, position);
                // 居中现实的话setoption第二个参数为 true
                this.myChart.setOption(option);
            }
        }


    },
});
</script>

<style scoped>
.box-card {
    height: 95%;
}

.chart-wrapper {
    width: 100%;
    height: 450px;
}

.title{
    margin-bottom: 2%;
    margin-top: 2%;
}
</style>