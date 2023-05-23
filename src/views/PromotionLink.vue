<template>
  <div v-if="venue.imagePath">
    <div id="form" class="promotion-link__background" :style="`background: center / cover url(${venue.imagePath});`" />
    <div class="promotion-link__wrapper">
      <div class="promotion-link">
        <div class="promotion-link__image">
          <el-image :src="venue.imagePath" />
        </div>
        <div class="promotion-link__content-wrapper">
          <div class="promotion-link__name">
            {{ venue.name }}
          </div>
          <div class="promotion-link__author mb4">
            {{ venue.publisherName }}
          </div>
          <a v-if="venue.items.vk" class="promotion-link__link" :href="venue.items.vk" target="_blank">
            <div class="promotion-link__link--text">
              <el-icon size="33" class="mr3">
                <VkMusic />
              </el-icon>
              VK Музыка
            </div>
            <el-icon color="rgba(41, 175, 85, 1)">
              <ArrowRightBold />
            </el-icon>
          </a>
          <a v-if="venue.items.yandex" class="promotion-link__link" :href="venue.items.yandex" target="_blank">
            <div class="promotion-link__link--text">
              <el-icon size="33" class="mr3">
                <YandexMusic />
              </el-icon>
              Yandex Music
            </div>
            <el-icon color="rgba(41, 175, 85, 1)">
              <ArrowRightBold />
            </el-icon>
          </a>
          <a v-if="venue.items.spotify" class="promotion-link__link" :href="venue.items.spotify" target="_blank">
            <div class="promotion-link__link--text">
              <el-icon size="33" class="mr3">
                <Spotify />
              </el-icon>

              Spotify
            </div>
            <el-icon color="rgba(41, 175, 85, 1)">
              <ArrowRightBold />
            </el-icon>
          </a>
          <a v-if="venue.items.apple" class="promotion-link__link" :href="venue.items.apple" target="_blank">
            <div class="promotion-link__link--text">
              <el-icon size="33" class="mr3">
                <AppleMusic />
              </el-icon>

              Apple music
            </div>
            <el-icon color="rgba(41, 175, 85, 1)">
              <ArrowRightBold />
            </el-icon>
          </a>
          <a v-if="venue.items.youtube" class="promotion-link__link" :href="venue.items.youtube" target="_blank">
            <div class="promotion-link__link--text">
              <el-icon size="33" class="mr3">
                <YoutubeMusic />
              </el-icon>

              YouTube Music
            </div>
            <el-icon color="rgba(41, 175, 85, 1)">
              <ArrowRightBold />
            </el-icon>
          </a>
        </div>
      </div>
    </div>
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
  ElLoading,
} from 'element-plus';

export default {
  name: 'PromotionLink',
  components: {
    YandexMusic,
    VkMusic,
    Spotify,
    AppleMusic,
    YoutubeMusic,
  },
  props: {
    id: String,
  },
  data: () => ({
    venue: {},
    // venues: {},
  }),
  methods: {
    async getVenue() {
      const loading = ElLoading.service({
        lock: true,
        text: 'Загрузка',
        background: 'rgba(0, 0, 0, 0)',
        target: '#form',
      });
      const { data } = await this.$axios.get(`MusicVenue/GetReleaseVenue?releaseId=${this.id}`);
      const items = {};
      for (let i = 0; i < data.items.length; i++) {
        const venue = data.items[i];
        items[venue.name.toLowerCase()] = venue.link;
      }
      this.venue = {
        ...data,
        items,
      };
      loading.close();
    },
  },
  mounted() {
    this.getVenue();
  },
};
</script>

<style lang="scss">
.promotion-link{
  overflow: hidden;
  border-radius: 35px;
  width:350px;
  margin: auto auto;
  background:$primaryGrey;
  border: 1px solid rgba(255,255,255,.2);
  box-shadow: -5px 5px 10px 0px rgba(0,0,0,.4);

  &__name{
    text-align: center;
    margin-bottom: 12px;
    font-size: 24px;
  }

  .el-image{
    width:350px;
    height:350px;
  }

  &__author{
    color: white;
    opacity: .5;
    text-align: center;
    font-size: 16px;
  }

  &__content-wrapper{
    padding:20px;
  }

  &__link{
    color: white;
    text-decoration: none;
    font-size: 16px;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    border-radius: 15px;
    transition: .3s;
    margin: 5px 0;
    padding: 10px ;

    &:hover{
      background-color: rgba(255,255,255,.1);
    }
    &:active{
      background-color: rgba(255,255,255,.4);
    }

    &--text{
      display: flex;
      align-items: center;
    }
  }

  &__background{
    z-index: -1;
    opacity: .3;
    position: fixed;
    width:100%;
    height: 100%;
    filter:blur(10px);

  }

  &__wrapper{
    display: flex;
    width:100vw;
    height: 100vh;
  }
}
</style>
