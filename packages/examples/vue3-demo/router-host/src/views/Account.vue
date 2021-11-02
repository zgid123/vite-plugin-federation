<template>
  <el-card class="account-container">
    <el-form :model="nameForm" :rules="rules" ref="nameRef" label-width="80px" label-position="right" class="demo-ruleForm">
      <el-form-item label="登录名：" prop="loginName">
        <el-input style="width: 200px" v-model="nameForm.loginName" disabled></el-input>
      </el-form-item>
      <el-form-item label="昵称：" prop="nickName">
        <el-input style="width: 200px" v-model="nameForm.nickName" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="danger" @click="submitName">确认修改</el-button>
      </el-form-item>
    </el-form>
  </el-card>
  <el-card class="account-container">
    <el-form :model="passForm" :rules="rules" ref="passRef" label-width="80px" label-position="right" class="demo-ruleForm">
      <el-form-item label="原密码：" prop="oldpass">
        <el-input style="width: 200px" v-model="passForm.oldpass" show-password clearable></el-input>
      </el-form-item>
      <el-form-item label="新密码：" prop="newpass">
        <el-input style="width: 200px" v-model="passForm.newpass" show-password clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="danger" @click="submitPass">确认修改</el-button>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script>
import {onMounted, reactive, ref, toRefs} from 'vue'

import * as api from "../utils/hostUtils.js"
import {ElButton, ElCard, ElForm, ElFormItem, ElInput, ElMessage} from 'element-plus'

export default {
  name: 'Account',
  components: {ElButton, ElCard, ElForm, ElFormItem, ElInput, ElMessage},
  setup() {
    const nameRef = ref(null)
    const passRef = ref(null)
    const state = reactive({
      user: null,
      nameForm: {
        loginName: '',
        nickName: ''
      },
      passForm: {
        oldpass: '',
        newpass: ''
      },
      rules: {
        loginName: [
          { required: 'true', message: '登录名不能为空', trigger: ['change'] }
        ],
        nickName: [
          { required: 'true', message: '昵称不能为空', trigger: ['change'] }
        ],
        oldpass: [
          { required: 'true', message: '原密码不能为空', trigger: ['change'] }
        ],
        newpass: [
          { required: 'true', message: '新密码不能为空', trigger: ['change'] }
        ]
      },
    })
    onMounted(() => {
      const res = api.getUserInfo()
      state.user = res
      state.nameForm.loginName = res.loginUserName
      state.nameForm.nickName = res.nickName

    })
    const submitName = () => {
      nameRef.value.validate((vaild) => {
        if (vaild) {
          api.changeNickName(state.nameForm.nickName).then(res => {
            if (res) {
              ElMessage.success('修改成功')
              window.location.reload()
            } else {
              ElMessage.error('修改失败')
            }
          })
        }
      })
    }
    const submitPass = () => {
      passRef.value.validate((vaild) => {
        if (vaild) {
          const res = api.changePassword(state.passForm.oldpass, state.passForm.newpass)
          if (res) {
            ElMessage.success('修改成功')
            window.location.reload()
          } else {
            ElMessage.error('修改失败')
          }
        }
      })
    }
    return {
      ...toRefs(state),
      nameRef,
      passRef,
      submitName,
      submitPass
    }
  }
}
</script>

<style>
  .account-container {
    margin-bottom: 20px;
  }
</style>
