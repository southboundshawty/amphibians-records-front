<template>
  <div>
    <div class="promotion__header">
      Продвижение
    </div>
    <div v-if="loading" id="loader" style="min-height:720px ; width:100%; " />
    <template v-else>
      <template v-if="releases.length === 0">
        <el-empty style="min-height:620px" description="нет данных" />
      </template>
      <template v-else>
        <el-row :gutter="20">
          <div v-for="release in releases" :key="release.id" class="promotion-card">
            <div class="promotion-card__wrapper">
              <div style="position: absolute; right:20px; top:20px; display:flex">
                <div class="promotion-card__btn" @click="copy(release)">
                  <el-icon size="20" color="success">
                    <Copy />
                  </el-icon>
                </div>
                <div class="promotion-card__btn" @click="selectedRelease = release; promotionModal = true">
                  <el-icon size="24" color="success">
                    <Edit />
                  </el-icon>
                </div>
              </div>

              <el-image :src="release.imagePath" class="promotion-image">
                <template #error>
                  <div class="image-slot">
                    <el-icon size="50">
                      <Catalog />
                    </el-icon>
                  </div>
                </template>
              </el-image>
              <div class="promotion-card__content">
                <div class="promotion-card__name">
                  {{ release.name }}
                </div>
                <div class="promotion-card__artist">
                  {{ release.headArtist }}
                </div>
                <div class="promotion-card__artist">
                  {{ release.type }}
                </div>
              </div>
            </div>
          </div>
        </el-row>
      </template>
    </template>

    <PromotionModal v-model="promotionModal" :release="selectedRelease" @update="getReleaseList" />
  </div>
</template>

<script>
import { Catalog, Edit, Copy } from '@/assets/icons/index.js';
import PromotionModal from '@/components/modals/PromotionModal.vue';
import {
  ElMessage,
  ElLoading,
} from 'element-plus';

export default {
  name: 'PromotionList',
  components: {
    Catalog, Edit, PromotionModal, Copy,
  },
  data: () => ({
    loading: false,
    releases: [],
    selectedRelease: null,
    promotionModal: false,
  }),
  async mounted() {
    this.getReleaseList();
  },
  methods: {
    copy(release) {
      navigator.clipboard.writeText(`${window.location.host}/promotion-link/${release.id}`);
      ElMessage({ message: 'Ссылка успешно скопирована', type: 'success' });
    },
    async getReleaseList() {
      this.loading = true;
      const loading = ElLoading.service({
        lock: true,
        text: 'Загрузка',
        background: 'rgba(0, 0, 0, 0)',
        target: '#loader',
      });
      const { data } = await this.$axios.post('Release/GetReleaseByRequestStatus/4', {});
      this.releases = data;
      loading.close();
      this.loading = false;
    },
  },
};
</script>

<style lang="scss">
  @media screen and (max-width: 1500px) {
    .promotion-card {
      flex-basis:100%!important;
      max-width:100%!important;
    }
  }

  .promotion{
      &__header{
        width:500px;
        font-size: 32px;
        margin-bottom: 30px;
        padding-bottom: 20px;
        border-bottom: 2px solid $whiteOpacity;
      }
  }

  .promotion-card{
    transition: 0.3s;
    padding:10px;
    flex-basis:50%;
    max-width:50%;

    &__btn{
      cursor: pointer;
      transition: 0.2s;
      display: flex;
      justify-content: center;
      align-items: center;
      width:36px;
      height:36px;
      border-radius: 50%;

      font-weight:500;
      color:$primaryGreen;

      &:hover{
        background-color: rgba(255,255,255,.2);
      }
    }

    &:hover{
      transform: scale(1.01)
    }

    &__wrapper{
      border: 1px solid $whiteOpacity20;
      overflow: hidden;
      border-radius: 35px;
      position: relative;
      display: flex;
    }

    &__content{
      width:calc(100% - 280px);
      justify-content: space-around;
      padding: 50px 35px ;
      display: flex;
      flex-direction: column;
    }

    &__name{
      font-size: 22px;
      font-weight: 500;
    }

    &__artist{
      color: $whiteOpacity70;
      font-size: 18px;
      font-weight: 400;
    }

    .el-image{
      width:280px;
      height:280px;
      padding: 0;
      margin: 0;

      .image-slot{

        background-color: #151515;
        width:100%;
        height:100%;
        display: flex;
        justify-content: center;
        align-items: center;
      }
    }
  }
</style>
