<template>
  <div>
    <el-tabs v-model="activeTabName">
      <el-tab-pane label="Релизы" name="releases" />
      <el-tab-pane label="Черновики" name="drafts" />
      <el-tab-pane label="Модерация" name="moderation" />
    </el-tabs>
    <div id="list" style="min-height:720px ;">
      <div v-if="releaseList.length === 0 && !loaders.releaseList" class="mt7" style="display: flex; align-items: center; flex-direction: column;">
        <el-empty description="Нет данных" />
        <el-button type="success" @click="$router.push('create_release')">
          Создать релиз
        </el-button>
      </div>
      <el-row :gutter="20">
        <el-col v-for="release in releaseList" :key="release.id" class="release-card__wrapper">
          <ReleaseCard :release="release" @delete-release="deleteRelease" />
        </el-col>
      </el-row>
    </div>
  </div>
</template>
<script>
import {
  ElMessage,
  ElLoading,
} from 'element-plus';
import ReleaseCard from '@/components/cards/ReleaseCard.vue';

export default {
  name: 'ReleaseList',
  components: {
    ReleaseCard,
  },
  data: () => ({
    activeTabName: 'drafts',
    releaseList: [],
    loaders: {
      releaseList: false,
    },
    releasesId: {
      drafts: 0,
      moderation: 3,
      releases: 4,
    },
  }),
  created() {
    this.getReleaseList();
  },
  watch: {
    activeTabName() {
      this.releaseList = [];
      this.getReleaseList();
    },
  },
  methods: {
    async deleteRelease(id) {
      await this.$axios.delete(`Release/DeleteReleaseById?releaseId=${id}`)
        .then(() => {
          ElMessage({ grouping: true, message: 'Релиз успешно удалён', type: 'success' });
          this.getReleaseList();
        }).catch(() => {
          ElMessage({ message: 'Упс! Что-то пошло не так.', type: 'error' });
        });
    },
    async getReleaseList() {
      this.loaders.releaseList = true;
      const loading = ElLoading.service({
        target: '#list',
        lock: true,
        text: 'Загрузка',
        background: 'rgba(0, 0, 0, 0)',
      });
      const { data } = await this.$axios.post(`Release/GetReleaseByRequestStatus/${this.releasesId[this.activeTabName]}`, {});
      this.loaders.releaseList = false;
      this.releaseList = data;
      loading.close();
    },
  },
  computed: {

  },

};
</script>
