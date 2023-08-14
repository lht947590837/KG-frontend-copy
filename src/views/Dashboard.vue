<template>
  <div>
    <div class="container">

        <h>核电知识图谱原型系统</h>
                  <li>基础查询</li>
                  <ul>输入一个实体，查询其关联的所有关系和关联实体。</ul>
                  <ul>模块，异常现象，异常原因，解决方案，故障影响，测点，检测方法</ul>
                  <li>多跳关系查询</li>
                  <ul>输入两个实体，查询其可能存在的多跳关系，其中用户可以自定义跳数。</ul>
                  <ul>原因与对策之间，现象与原因之间,模块和异常现象之间，设备和模块之间</ul>
                  <li>基本知识查询</li>
                 <ul>查询在某个模块的异常原因以及相关对策</ul>
                  <ul>以可交互方式呈现（支持沿着图进一步扩展，detail信息等）</ul>
                  <li>上传数据文件并更新数据库</li>

    </div>
  </div>
</template>

<script>

export default {
  name: "charts",
 
  methods: {
    
  },
  
};
</script>

<style scoped>
.schart-box {
  display: inline-block;
  margin: 20px;
}

.schart {
  width: 600px;
  height: 400px;
}

.content-title {
  clear: both;
  font-weight: 400;
  line-height: 50px;
  margin: 10px 0;
  font-size: 22px;
  color: #1f2f3d;
}

.el-row {
  margin-bottom: 20px;
}

.el-col {
  border-radius: 4px;
}

.grid-content {
  border-radius: 4px;
  min-height: 36px;
}

.row-bg {
  padding: 10px 0;
  background-color: #f9fafc;
}
</style>