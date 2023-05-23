<template>
  <div>
    <el-dialog
      v-model="visible"
      class="promotion-modal"
      style="width:700px"
      @close="close"
    >
      <template #header="{ }">
        <div>
          {{ release.name }}
        </div>
      </template>
      <el-form id="form" label-position="left" label-width="230px">
        <template v-if="!loaders.getVenue">
          <el-form-item>
            <template #label>
              <el-icon size="33" class="mr3">
                <VkMusic />
              </el-icon>
              <div>
                VK Музыка
              </div>
            </template>
            <el-input v-model="form.vk" />
          </el-form-item>
          <el-form-item>
            <template #label>
              <el-icon size="33" class="mr3">
                <YandexMusic />
              </el-icon>
              <div>
                Yandex Music
              </div>
            </template>
            <el-input v-model="form.yandex" />
          </el-form-item>
          <el-form-item>
            <template #label>
              <el-icon size="33" class="mr3">
                <Spotify />
              </el-icon>
              <div>
                Spotify
              </div>
            </template>
            <el-input v-model="form.spotify" />
          </el-form-item>
          <el-form-item>
            <template #label>
              <el-icon size="33" class="mr3">
                <AppleMusic />
              </el-icon>
              <div>
                Apple music
              </div>
            </template>
            <el-input v-model="form.apple" />
          </el-form-item>
          <el-form-item>
            <template #label>
              <el-icon size="33" class="mr3">
                <YoutubeMusic />
              </el-icon>
              <div>
                YouTube Music
              </div>
            </template>
            <el-input v-model="form.youtube" />
          </el-form-item>
        </template>
        <div v-else div style="height:410px" />
      </el-form>
      <template #footer>
        <div>
          <el-button type="success" :disabled="loaders.postVenues" @click="postVenuesList">
            Сохранить
          </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import {
  VkMusic,
  Spotify,
  AppleMusic,
  YoutubeMusic,
  YandexMusic,
} from '@/assets/icons/index.js';

import {
  ElMessage,
  ElLoading,
} from 'element-plus';

export default {
  name: 'PromotionModal',
  data: () => ({
    loaders: {
      getVenue: false,
      postVenues: false,
    },
    form: {
      yandex: null,
      vk: null,
      spotify: null,
      apple: null,
      youtube: null,
    },
    venueId: {
      yandex: null,
      vk: null,
      spotify: null,
      apple: null,
      youtube: null,
    },
  }),
  props: {
    modelValue: Boolean,
    release: Object,
  },
  components: {
    YandexMusic,
    VkMusic,
    Spotify,
    AppleMusic,
    YoutubeMusic,
  },
  watch: {
    visible() {
      if (this.visible) {
        this.getVenuesList();
      }
    },
  },
  computed: {
    visible: {
      get() {
        return this.modelValue;
      },
      set(value) {
        this.$emit('update:modelValue', value);
      },
    },
  },
  methods: {
    async getVenuesList() {
      this.loaders.getVenue = true;
      const loading = ElLoading.service({
        lock: true,
        text: 'Загрузка',
        background: 'rgba(0, 0, 0, 0)',
        target: '#form',
      });
      await this.$axios.get('MusicVenue/GetAllMusicVenues')
        .then((res) => {
          const { data } = res;
          for (let i = 0; i < data.length; i++) {
            const venue = data[i];
            this.venueId[venue.name.toLowerCase()] = venue.id;
          }
        }).then(() => {
          this.getVenue();
        }).catch(() => {
          ElMessage({ message: 'Упс! Что-то пошло не так.', type: 'error' });
        })
        .finally(() => {
          loading.close();
          this.loaders.getVenue = false;
        });
    },
    async getVenue() {
      const { data } = await this.$axios.get(`MusicVenue/GetReleaseVenue?releaseId=${this.release.id}`);
      for (let i = 0; i < data.items.length; i++) {
        const venue = data.items[i];
        this.form[venue.name.toLowerCase()] = venue.link;
      }
    },
    async postVenuesList() {
      this.loaders.postVenues = true;
      const items = [];
      for (const venue in this.form) {
        if (this.form[venue]) {
          items.push({
            releaseId: this.release.id,
            musicVenueId: this.venueId[venue],
            link: this.form[venue],
          });
        }
      }
      const req = {
        items,
      };
      await this.$axios.post('MusicVenue/CreateReleaseVenue', req)
        .then(() => {
          ElMessage({ message: 'Cсылки успешно обновлены', type: 'success' });
          this.$emit('update');
          this.close();
        })
        .catch(() => {
          ElMessage({ message: 'Упс! Что-то пошло не так.', type: 'error' });
        })
        .finally(() => {
          this.loaders.postVenues = false;
        });
    },
    close() {
      this.visible = false;
      this.form = {
        yandex: null,
        vk: null,
        spotify: null,
        apple: null,
        youtube: null,
      };
    },
  },
};
</script>

<style lang="scss">
.promotion-modal{

  .el-form-item__label{
    display: flex;
    flex-direction: row;
    align-items: center;
  }
&__btn{

}
.el-dialog{
  &__header{
    font-size: 32px;
    color:white;
    padding:30px 45px 15px 45px!important;
    margin:0;

    &btn{
      font-size: 25px;
      top: 26px !important;
      right: 30px !important;
    }
  }

  &__body{
    padding:60px 70px 20px 70px!important;
  }

  &__footer{
    display: flex;
    justify-content: center;
    padding:20px 45px 30px 30px!important;
  }
}
}
</style>
