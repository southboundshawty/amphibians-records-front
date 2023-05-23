<template>
  <div>
    <el-row class="row-bg" justify="center" align="middle" style="height:80vh">
      <el-col :span="6">
        <div :style="`font-size: 50px`" style="color:white; margin-bottom: 50px; text-align:center">
          Регистрация
        </div>
        <el-container class="a-container">
          <el-form style="width: 500px" label-position="top">
            <el-form-item :error="getErrorMessage('pseudonym')">
              <el-input v-model="form.pseudonym" class="alternarive-input" placeholder=" Псевдоним артиста" @blur="v$.form.pseudonym.$touch()" />
            </el-form-item>
            <el-form-item :error="getErrorMessage('userName')">
              <el-input v-model="form.userName" placeholder="Логин" @blur="v$.form.userName.$touch()" />
            </el-form-item>
            <el-form-item :error="getErrorMessage('email')">
              <el-input v-model="form.email" placeholder="Электронная почта" @blur="v$.form.email.$touch()" />
            </el-form-item>
            <el-form-item :error="getErrorMessage('password')">
              <el-input v-model="form.password" placeholder="Пароль" type="password" show-password @blur="v$.form.password.$touch()" />
            </el-form-item>
            <el-form-item :error="getErrorMessage('passRe')">
              <el-input v-model="form.passRe" placeholder="Повторить пароль" type="password" show-password @blur="v$.form.passRe.$touch()" />
            </el-form-item>
            <el-form-item>
              <div style="display:flex; flex-direction:row; justify-content:space-between;width:100%">
                <el-button type="success" size="large" :disabled="allowSubmit" @click="createUser">
                  Зарегестрироваться
                </el-button>
                <el-button link size="large" @click="redirectToAuth">
                  <el-icon>
                    <ArrowLeft />
                  </el-icon>
                  Назад
                </el-button>
              </div>
            </el-form-item>
          </el-form>
        </el-container>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { ElMessage } from 'element-plus';
import {
  required, minLength, maxLength, email, helpers,
} from '@vuelidate/validators';
import { useVuelidate } from '@vuelidate/core';
import { mapGetters } from 'vuex';

const passRe = (params) => helpers.withParams(
  { type: 'passRe', value: params },
  (value) => !helpers.req(value) || value === params,
);

export default {
  setup() {
    return { v$: useVuelidate() };
  },
  name: 'Registration',
  data: () => ({
    form: {
      pseudonym: '',
      userName: '',
      email: '',
      password: '',
      passRe: '',
    },
  }),
  methods: {
    getErrorMessage(fieldName) {
      return this.$errorsMessages(this.v$, `form.${fieldName}`);
    },
    redirectToAuth() {
      this.$router.push('/moderation-list');
    },
    async createUser() {
      const res = {
        ...this.form,
        passRe: null,
      };
      await this.$axios.put('Auth/CreateUserAsync', res).then(() => {
        ElMessage({ message: 'Вы успешно зарегестрированы', type: 'success' });
        this.redirectToAuth();
      }).catch(() => {
        ElMessage({ message: 'Упс! Что-то пошло не так.', type: 'error' });
      });
    },
  },
  created() {
    if (!this.isModerator) {
      if (this.isUserLogin) {
        this.$router.push('/release-list');
      } else {
        this.$router.push('/auth');
      }
    }
  },
  computed: {
    ...mapGetters(['isModerator', 'isUserLogin']),
    allowSubmit() {
      return this.v$.$invalid;
    },
  },
  validations() {
    return {
      form: {
        pseudonym: { required, minLength: minLength(2), maxLength: maxLength(255) },
        userName: { required, minLength: minLength(2), maxLength: maxLength(255) },
        email: {
          email, required, minLength: minLength(2), maxLength: maxLength(255),
        },
        password: { required, minLength: minLength(2), maxLength: maxLength(255) },
        passRe: {
          required, minLength: minLength(3), maxLength: maxLength(255), passRe: passRe(this.form.password),
        },
      },
    };
  },
};

</script>
