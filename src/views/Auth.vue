<template>
  <div style="text-align:center">
    <el-row class="row-bg" justify="center" align="middle" style="height:80vh">
      <el-col :span="6">
        <div :style="`font-size: 50px`" style="color:white; margin-bottom: 50px;">
          Вход
        </div>
        <el-container class="a-container">
          <el-form style="width: 500px" label-position="top">
            <div v-if="error" class="mb3">
              <el-tag class="ml-2" type="danger">
                Неверный логин или пароль
              </el-tag>
            </div>
            <el-form-item>
              <el-input v-model="form.email" placeholder="Логин" type="email" />
            </el-form-item>
            <el-form-item>
              <el-input v-model="form.password" placeholder="Пароль" type="password" show-password />
            </el-form-item>
            <el-form-item>
              <div style="width:100%;display:flex; flex-direction:row; justify-content:space-between">
                <el-button style="width:100px" type="success" size="large" :loading="loading" @click="login">
                  Вход
                </el-button>
                <!-- <el-button link size="large" @click="redirectToRegistration">
                  Регистрация
                </el-button> -->
              </div>
            </el-form-item>
          </el-form>
        </el-container>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { loginAndRedirect } from '@/api/helpers';

export default {
  name: 'Auth',
  data: () => ({
    error: null,
    loading: false,
    form: {
      email: '',
      password: '',
    },
  }),
  methods: {
    redirectToRegistration() {
      this.$router.push('/registration');
    },
    redirectToMain() {
      this.$router.push('/release-list');
    },
    async login() {
      this.loading = true;
      await this.$axios.post('Auth/GetTokenAsync', this.form).then((res) => {
        const { data } = res;
        loginAndRedirect(data);
      }).catch((e) => {
        this.error = e;
      }).finally(() => {
        this.loading = false;
      });
    },
  },
};
</script>
