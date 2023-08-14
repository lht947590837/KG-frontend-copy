<template>
  <div><el-card>
       
              <el-form
                label-position="right"
                label-width="100px"
                :model="form"
                style="margin:0 0 0 30% ;"
              >
                <el-form-item label="上传图数据">
                  <el-upload
                    ref="upload"
                    action
                    accept=".xls"
                    :limit="1"
                    :auto-upload="false"
                    :before-upload="beforeUpload"
                    :on-change="handleChange"
                    :on-remove="handleRemove"
                    :on-exceed="handleExceed"
                    :on-success="handleSuccess"
                    :on-error="handleError"
                    :file-list="fileList"
                    drag
                    ><el-icon class="el-icon--upload"
                      ><upload-filled
                    /></el-icon>
                    <div class="el-upload__text">
                      Drop file here or <em>click to upload</em>
                    </div>
                  </el-upload>
                </el-form-item>

                <el-form-item>
                  <el-button type="primary" @click="nextStep">提交</el-button>
                  
                  
                </el-form-item>

                <el-form-item label="上传测点数据">
                  <el-upload
                    ref="upload"
                    action
                    accept=".xls"
                    :limit="1"
                    :auto-upload="false"
                    :before-upload="beforeUpload"
                    :on-change="handlePointChange"
                    :on-remove="handlePointRemove"
                    :on-exceed="handleExceed"
                    :on-success="handleSuccess"
                    :on-error="handleError"
                    :file-list="pointList"
                    drag
                    ><el-icon class="el-icon--upload"
                      ><upload-filled
                    /></el-icon>
                    <div class="el-upload__text">
                      Drop file here or <em>click to upload</em>
                    </div>
                  </el-upload>
                </el-form-item>

                <el-form-item>
                  <el-button type="primary" @click="nextPointStep">提交</el-button>
                  
                  
                </el-form-item>
              </el-form>
            
  </el-card></div>
</template>

<script>
import axios from "axios";
import { ElMessage } from 'element-plus'
export default {
  data() {
    return {
      
      form: {},
      fileList:[],
      pointList:[]
      // 表格数据
    };
  },
  
  methods: {
  

    
  
     // 上传文件之前的钩子, 参数为上传的文件,若返回 false 或者返回 Promise 且被 reject，则停止上传
    beforeUpload(file) {
      let extension = file.name.substring(file.name.lastIndexOf(".") + 1);
      let size = file.size / 1024 / 1024;
      if (extension !== "xlsx") {
        this.$message.warning("只能上传后缀是.xlsx的文件");
      }
      if (size > 100) {
        this.$message.warning("文件大小不得超过100M");
      }
    },
    // 文件状态改变
    handleChange(file, fileList) {
      if (file) {
        this.fileList = fileList.slice(-3);
      }
    },
    handlePointChange(file, fileList) {
      if (file) {
        this.pointList = fileList.slice(-3);
      }
    },
    // 删除文件
    handleRemove(file, fileList) {
      file;
      fileList;
      this.fileList = [];
    },
    handlePointRemove(file, fileList) {
      file;
      fileList;
      this.pointList = [];
    },
    // 文件超出个数限制
    handleExceed(files, fileList) {
      this.$message.warning(
        `只能选择1个文件，当前共选择了 ${files.length + fileList.length} 个`
      );
    },
    // 文件上传成功
    handleSuccess(res, file, fileList) {
      res;
      file;
      fileList;
      this.$message.success("文件上传成功");
    },
    // 文件上传失败
    handleError(err, file, fileList) {
      err;
      file;
      fileList;
      this.$message.error("文件上传失败");
    },
    async nextStep() {
      if (this.fileList.length === 0) {
        this.$message.warning("请点击上传文件，添加文件");
      } else {
        let dataEx = new FormData();
        let batch_file = this.fileList[0].raw;
        dataEx.append("excelFile", batch_file);
        const instance = axios.create({
          withCredentials: true,
        });
        instance.post(
            "http://127.0.0.1:8080"+"/api/Upload/uploadGraph",
            dataEx
          )
          .then((res) => {
            console.log(res);
           ElMessage({
            message: "文件处理中，请稍后刷新界面",
            type: "success",
          })
          }).catch((err) => {
          console.log(err)
          err;
          ElMessage({
            message: "失败",
            type: "error",
          });
        });
      }
    },
    async nextPointStep() {
      if (this.pointList.length === 0) {
        this.$message.warning("请点击上传文件，添加文件");
      } else {
        let dataEx = new FormData();
        let batch_file = this.pointList[0].raw;
        dataEx.append("excelFile", batch_file);
        const instance = axios.create({
          withCredentials: true,
        });
        instance.post(
            "http://127.0.0.1:8080"+"/api/Upload/uploadPoint",
            dataEx
          )
          .then((res) => {
            console.log(res);
           ElMessage({
            message: "测点文件处理中，请稍后刷新界面",
            type: "success",
          })
          }).catch((err) => {
          console.log(err)
          err;
          ElMessage({
            message: "失败",
            type: "error",
          });
        });
      }
    },
  },
};
</script>

<style>

</style>