<template>
  <div>
    <el-tabs v-model="activeTabName">
      <el-tab-pane label="Модерация" name="moderation" />
      <el-tab-pane label="Прошло модерацию" name="drafts" />
    </el-tabs>
    <div v-if="releaseList.length === 0 && !loaders.releaseList" class="mt7">
      <el-empty description="Нет данных" />
    </div>
    <el-row :gutter="20">
      <!-- <el-col v-for="release in releaseList" :key="release.id" :span="6" class="pa3" style="background-color: #222222; border-radius: 13px;">
        <router-link
          class="router-link"
          :to="{
            name: 'EditDraftRelease',
            params: {
              id: release.releaseId,
            },
            query: {
              requestId: release.id
            }
          }"
        >
          {{ release.description || 'dadasd' }}

        <ReleaseCard :release="release" />
      </el-col> -->
      <el-col v-for="release in releaseList" :key="release.id" class="release-card__wrapper">
        <router-link
          class="router-link"
          :to="{
            name: 'EditDraftRelease',
            params: {
              id: release.releaseId,
            },
            query: {
              requestId: release.id
            }
          }"
        >
          <ReleaseCard :release="release.release" @delete-release="deleteRelease" />
        </router-link>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import {
  ElMessage,
  ElLoading,
} from 'element-plus';
import ReleaseCard from '@/components/cards/ReleaseCard.vue';

export default {
  name: 'ModerationList',
  components: {
    ReleaseCard,
  },
  data: () => ({
    releaseList: [],
    activeTabName: 'moderation',
    loaders: {
      releaseList: false,
    },
  }),
  created() {
    this.getReleaseList();
  },
  watch: {
    activeTabName() {
      if (this.activeTabName === 'moderation') {
        this.getReleaseList();
      } else {
        this.getRelesedReleases();
      }
    },
  },
  methods: {
    async getReleaseList() {
      this.loaders.releaseList = true;
      const loading = ElLoading.service({
        lock: true,
        text: 'Загрузка',
        background: 'rgba(0, 0, 0, 0)',
      });
      const { data } = await this.$axios.post('ReleaseRequest/GetByStatus?status=3', {});
      this.loaders.releaseList = false;
      this.releaseList = data;
      loading.close();
    },
    async getRelesedReleases() {
      this.loaders.releaseList = true;
      const loading = ElLoading.service({
        lock: true,
        text: 'Загрузка',
        background: 'rgba(0, 0, 0, 0)',
      });
      await this.$axios.get('ReleaseRequest/GetByModeratorId', {})
        .then((res) => {
          const { data } = res;
          this.releaseList = data;
        })
        .catch(() => {
          ElMessage({ message: 'Упс! Что-то пошло не так.', type: 'error' });
        })
        .finally(() => {
          this.loaders.releaseList = false;
        });
      loading.close();
    },
  },
  computed: {

  },

};
</script>

<style lang="scss">
@media screen and (max-width: 1500px) {
  .release-card__wrapper {
    flex-basis:100%!important;
  }
}

 .release-card {
  background-color: $primaryGrey;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 35px 35px;
  border-radius: 35px;
  // background-color: grey;
  margin-bottom:20px;
  transition: .3s;

  &:hover{
    transform: scale(1.01)
  }

  &__header {
    display: flex;
    flex-direction: row;

    .el-image{
      border-radius: 35px!important;
      width:140px;
      height:140px;
      border-radius: 10px;

      .image-slot{
        background-color: #151515;
        height:100%;
        display: flex;
        justify-content: center;
        align-items: center;
      }
    }

    &--menu-btn{
      cursor: pointer;
      transition: 0.2s;
      display: flex;
      justify-content: center;
      align-items: center;
      width:36px;
      height:36px;
      border-radius: 50%;

      font-weight:500;

      &:hover{
        background-color: rgba(255,255,255,.2);
      }
    }

    &--info{
      font-size: 24px;
      display: flex;
      flex-direction: column;
      justify-content: space-around;
    }
    &--name{
      overflow: hidden;
      width:40%;
      white-space: nowrap;
      text-overflow: ellipsis;
      font-weight: 500;
    }
    &--artist{

    }
  }

  &__data {

    &--fields{
      font-size: 18px;
      display: flex;
      flex-direction: row;

      & :first-child{

        width:70px;
        margin-right: 10px;
        color: $primaryGreen;
      }
      & :last-child{
        font-weight: 300;
        margin-left: 10px;
      }
    }
  }
 }
</style>
