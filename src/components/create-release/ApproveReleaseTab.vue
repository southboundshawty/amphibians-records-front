<template>
  <div style="display: flex;">
    <div class="pa5" style="border-radius:35px; background-color: #222222; flex-basis:700px; display: flex; flex-direction: column; justify-content: center;">
      <div style="font-size: 25px;" class="mb3">
        Опубликовать релиз?
      </div>
      <el-input
        v-model="form.comment"
        class="mb3"
        placeholder="Комменатарий"
        :rows="2"
        type="textarea"
      />
      <el-input
        v-model="form.upc"
        class="mb3"
        placeholder="UPC"
        :rows="2"
      />
      <div>
        <el-button :loading="loaders.approve" :disabled="!form.upc || loaders.reject" type="success" @click="approveRelease">
          Опубликовать
        </el-button>
        <el-button :loading="loaders.reject" :disabled="!form.comment || loaders.approve" type="danger" @click="rejectRelease">
          Отклонить
        </el-button>
      </div>
    </div>
  </div>
</template>

<script>
import {
  ElMessage,
} from 'element-plus';

export default {
  name: 'ApproveReleaseTab',
  props: {
    id: String,
  },
  data: () => ({
    form: {
      comment: null,
      upc: null,
    },
    loaders: {
      approve: false,
      reject: false,
    },
  }),
  methods: {
    async approveRelease() {
      this.loaders.approve = true;
      const req = {
        upc: this.form.upc,
      };
      this.$axios.post(`ReleaseRequest/Accept/${this.$route.query.requestId}`, req)
        .then(() => {
          this.$router.push('/moderation-list');
          ElMessage({ message: 'Трек успешно опубликован', type: 'success' });
        })
        .catch(() => {
          ElMessage({ message: 'Усп! Что-то пошло не так.', type: 'error' });
        })
        .finally(() => {
          this.loaders.approve = false;
        });
    },
    async rejectRelease() {
      this.loaders.reject = true;
      const req = {
        comment: this.form.comment,
      };
      this.$axios.post(`ReleaseRequest/Denie/${this.$route.query.requestId}`, req)
        .then(() => {
          this.$router.push('/moderation-list');
          ElMessage({ message: 'Трек успешно отклонён', type: 'success' });
        })
        .catch(() => {
          ElMessage({ message: 'Усп! Что-то пошло не так.', type: 'error' });
        })
        .finally(() => {
          this.loaders.reject = false;
        });
    },
  },
};
</script>
