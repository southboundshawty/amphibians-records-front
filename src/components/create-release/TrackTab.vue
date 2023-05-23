<template>
  <div style="position: relative;">
    <h2>
      Трек-лист
    </h2>
    <el-button type="success" class="mv4" @click="dialogVisible = true">
      Добавить трек
    </el-button>
    <div style="display: flex; flex-direction: column;">
      <audio ref="track" @timeupdate="onTimeUpdate" />
      <el-table v-loading="loading" :data="items" :loading="loading">
        <el-table-column prop="order" label="">
          <template #default="scope">
            <el-input-number v-model="scope.row.order" style="width:80px" class="orderInput" controls-position="right" :min="1" :max="items.length" @input="debouncedSetOrder" @change="handleChange" />
          </template>
        </el-table-column>
        <el-table-column prop="name" label="Название" />
        <el-table-column prop="version" label="Версия" />
        <el-table-column prop="headArtist" label="Артист" />
        <el-table-column prop="collaborators" label="Доп. артист" />
        <el-table-column prop="isrc" label="ISRC" />
        <el-table-column prop="hasProfanity" label="Лексика">
          <template #default="scope">
            {{ scope.row.hasProfanity ? "Да" : "Нет" }}
          </template>
        </el-table-column>
        <el-table-column prop="author" label="Автор" />
        <el-table-column prop="composer" label="Композитор" />
        <el-table-column>
          <template #default="scope">
            <el-dropdown>
              <div class="release-card__header--menu-btn">
                <el-icon size="20" style="transform: rotate(90deg);">
                  <MoreFilled color="rgba(41, 175, 85, 1)" />
                </el-icon>
              </div>
              <template #dropdown>
                <el-dropdown-menu style="margin-left: 0 auto;">
                  <template v-if="!scope.row.__wasPlaing">
                    <el-dropdown-item @click="playTrack(scope.row)">
                      <el-icon size="30" style="width:30px;height:30px">
                        <Play />
                      </el-icon>
                      <div class="ml3">
                        Воспроизвести
                      </div>
                    </el-dropdown-item>
                  </template>
                  <template v-else>
                    <el-dropdown-item @click="stopTrack(scope.row)">
                      <el-icon size="30" style="width:30px;height:30px" color="rgba(41, 175, 85, 1)">
                        <VideoPause />
                      </el-icon>
                      <div class="ml3">
                        Остановить
                      </div>
                    </el-dropdown-item>
                  </template>
                  <!-- <el-dropdown-item>
                    <el-icon size="30" style="width:30px;height:30px">
                      <Download />
                    </el-icon>
                    <div class="ml3">
                      Загрзуить
                    </div>
                  </el-dropdown-item> -->
                  <el-dropdown-item v-if="!isModerator" @click="deleteReleaseTrack(scope.row.id)">
                    <el-icon size="30" color="rgba(41, 175, 85, 1)" style="width:30px;height:30px">
                      <Delete />
                    </el-icon>
                    <div class="ml3">
                      Удалить
                    </div>
                  </el-dropdown-item>
                  <el-dropdown-item @click="downloadTrack(scope.row)">
                    <el-icon size="30" style="width:30px;height:30px">
                      <Download />
                    </el-icon>
                    <div class="ml3">
                      Скачать
                    </div>
                  </el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </template>
        </el-table-column>
      </el-table>
      <div v-if="playingTrack.id" class="player__wrapper">
        <div class="player">
          <div style="display: flex; align-items: center;">
            <div class="mr3" style="flex-basis:300px">
              {{ playingTrack.name }}
            </div>
            <el-icon v-if="!wasTrackPlaying" size="30" style="width:30px;height:30px" @click="$refs.track.play(); wasTrackPlaying = true;">
              <Play />
            </el-icon>
            <el-icon v-else size="30" style="width:30px;height:30px" color="rgba(41, 175, 85, 1)" @click="$refs.track.pause(); wasTrackPlaying = false;">
              <VideoPause />
            </el-icon>
          </div>
          <div style="width:100%; padding-left:20px">
            <el-slider v-model="playingTrack.currentTime" :show-tooltip="false" :max="playingTrack.duration" @change="setCurrentTime()" />
            <div style="display: flex; flex-direction: row;justify-content: space-between;">
              <div>
                {{ formatCurrentTime }}
              </div>
              <div>
                {{ formatDurationTime }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <CreateTrackModal :id="id" v-model="dialogVisible" @update="getReleaseList" />
  </div>
</template>

<script >
import {
  Play,
  Delete,
  Download,
} from '@/assets/icons/index.js';
import {
  ElMessage,
} from 'element-plus';
import { mapGetters } from 'vuex';
import debounce from 'lodash.debounce';
import CreateTrackModal from '../modals/CreateTrackModal.vue';

export default {
  name: 'TrackTab',
  components: {
    CreateTrackModal,
    Play,
    Delete,
    Download,
  },
  props: {
    id: String,
  },
  data: () => ({
    wasTrackPlaying: false,
    playingTrack: {
      id: null,
      name: null,
      duration: null,
      currentTime: null,
    },
    loading: true,
    items: [],
    dialogVisible: false,
  }),
  mounted() {

  },
  watch: {
    id() {
      this.getReleaseList();
    },
  },
  methods: {
    setCurrentTime() {
      this.$refs.track.currentTime = this.playingTrack.currentTime;
    },
    async downloadTrack(track) {
      const { data, headers } = await this.$http({
        method: 'GET',
        responseType: 'blob',
        url: track.audioUrl,
      });
      const filename = track.techName.slice(37);
      const objectUrl = window.URL.createObjectURL(new Blob([data]), { type: headers['content-type'] });
      const link = document.createElement('a');
      link.href = objectUrl;
      link.download = filename;
      link.click();
      window.URL.revokeObjectURL(objectUrl);
    },
    async stopTrack(trackItem) {
      const track = this.$refs.track;
      track.pause();
      trackItem.__wasPlaing = false;
      this.wasTrackPlaying = false;
    },
    async playTrack(trackItem) {
      const track = this.$refs.track;
      trackItem.__wasPlaing = true;
      if (this.playingTrack.id !== trackItem.id) {
        this.playingTrack.name = trackItem.name;
        this.playingTrack.id = trackItem.id;
        this.playingTrack.duration = track.duration;
        this.playingTrack.currentTime = track.currentTime;
        track.src = trackItem.audioUrl;
      }
      this.wasTrackPlaying = true;
      track.play();
    },
    async deleteReleaseTrack(id) {
      await this.$axios.delete(`Track/DeleteTrackById?id=${id}`)
        .then(() => {
          ElMessage({ message: 'Трек успешно удалён', type: 'success' });
          this.getReleaseList();
        })
        .catch(() => {
          ElMessage({ message: 'Упс! Что-то пошло не так.', type: 'error' });
        });
    },
    async setOrder() {
      const items = this.orderedItems.map((it) => {
        const { id, order } = it;
        return {
          trackId: id,
          order,
        };
      });
      const res = {
        items,
      };
      await this.$axios.post('Track/UpdateTracksOrder', res);
    },
    async onTimeUpdate() {
      const track = this.$refs.track;
      this.playingTrack.duration = track.duration;
      this.playingTrack.currentTime = track.currentTime;
    },
    async getReleaseList() {
      this.loading = true;
      const { data } = await this.$axios.post(`Track/GetTracksByReleaseId/${this.id}`, {
        pageNumber: 1,
        pageSize: 20,
      });
      this.items = data.map((it,i) => it = { // eslint-disable-line
        ...it,
        order: i + 1,
        __wasPlaing: false,

      });
      this.$emit('has-track', this.items.length > 0);
      this.loading = false;
    },
  },
  computed: {
    ...mapGetters(['isModerator']),

    debouncedSetOrder() {
      return debounce(this.setOrder, 500);
    },

    orderedItems() {
      const it = this.items;
      return it.sort((a, b) => {
        if (a.order > b.order) {
          return 1;
        }
        return 0;
      });
    },
    formatDurationTime() {
      const minutes = Math.floor(this.playingTrack.duration / 60);
      let seconds = Math.floor(this.playingTrack.duration - minutes * 60);
      if (seconds < 10) {
        seconds = `0${seconds}`;
      }
      return `${minutes || 0}:${seconds || '00'}`;
    },
    formatCurrentTime() {
      const minutes = Math.floor(this.playingTrack.currentTime / 60);
      let seconds = Math.floor(this.playingTrack.currentTime - minutes * 60);
      if (seconds < 10) {
        seconds = `0${seconds}`;
      }
      return `${minutes || 0}:${seconds || '00'}`;
    },
  },
};
</script>

<style lang="scss">
// .orderInput {
  .el-input-number{
  --el-input-inner-height: 20px!important;
  .el-input-number__increase{
    --el-input-number-controls-height:25px !important;
    border-radius: 0  14px 0 0!important;
  }
  .el-input-number__decrease{
    border-radius: 0 0 14px 0!important;
    --el-input-number-controls-height:25px !important
  }
}
// }
.player{
  background: $primaryGrey;
  width:900px;
  padding: 10px 30px;
  margin: 0 auto;
  border-radius: 30px;
  display: flex;

  &__wrapper{
    background: $primaryGrey;
    width: 100%;
    margin-left: -395px ;
    bottom: 0;

  position: fixed;
  }
}
</style>
