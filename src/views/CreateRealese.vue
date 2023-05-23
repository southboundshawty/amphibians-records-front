<template>
  <el-container class="a-container">
    <div style="width:100%;">
      <el-tabs v-model="activeName" class="release-custom-tab">
        <el-tab-pane :disabled="loading" label="Релиз" name="release">
          <template #label>
            <span class="custom-tabs-label">
              <span :style="hasError?'color:#f56c6c':null" class="mr2">Релиз</span>
              <el-icon v-if="hasError" color="#f56c6c" class="mt10"><Warning /></el-icon>
            </span>
          </template>
          <ReleaseTab :id="id" ref="releaseTab" :published="published" @set-comment="setComment" @has-file="setHasFile" @add-error="addError" @set-id="setReleaseId" />
        </el-tab-pane>
        <el-tab-pane :disabled="loading" label="Трек-лист" name="tracks">
          <TrackTab :id="releaseId" @has-track="setHasTrack" />
        </el-tab-pane>
        <el-tab-pane :disabled="loading" label="Проверка" name="verification">
          <template v-if="!isModerator">
            <div v-if="hasError || !hasTrack || !hasFile">
              <div style="border-left:4px solid rgb(245, 108, 108)">
                <ul class="ml4">
                  <li v-if="moderComment" class="mb3">
                    Комментарий модератора: <br> <span style="color:rgb(245, 108, 108)">{{ moderComment }}</span>
                  </li>
                  <li v-if="!hasTrack" class="mb4">
                    Для загрузки необходим  <span style="color:rgb(245, 108, 108)">минимум 1 трек</span>
                  </li>
                  <li v-if="!hasFile" class="mb4">
                    Необходимо <span style="color:rgb(245, 108, 108)">загрузить </span> лого релиза
                  </li>
                  <div v-for="(value, name) in errors" :key="name">
                    <li v-if="value" class="mb4">
                      {{ errorEnum[name] }} - <span v-if="value" style="color:rgb(245, 108, 108)"> {{ value }}</span>
                    </li>
                  </div>
                </ul>
              </div>
            </div>
            <template v-else>
              <div v-if="moderComment" style="border-left:4px solid rgb(245, 108, 108)" class="mb4">
                <ul class="ml4">
                  <li>
                    Комментарий модератора: <br> <span style="color:rgb(245, 108, 108)">{{ moderComment }}</span>
                  </li>
                </ul>
              </div>
              <div style="display:flex">
                <div class="pa5" style="border-radius:35px; background-color: #222222; flex-basis:500px; display: flex; flex-direction: row;justify-content: center;">
                  <div style="display: flex; flex-direction: column;justify-content: center;">
                    Релиз прошёл проверку теперь его можно опубликовать
                    <el-button type="success" :loading="loading" class="mt4" @click="publishRelease">
                      Опубликовать релиз
                    </el-button>
                  </div>
                </div>
              </div>
            </template>
          </template>
          <template v-else>
            <ApproveReleaseTab :id="id" />
          </template>
        </el-tab-pane>
        <!-- <el-tab-pane label="Оплата" name="payment">
          <PurchaseTab />
        </el-tab-pane> -->
      </el-tabs>
    </div>
  </el-container>
</template>

<script>

import ReleaseTab from '@/components/create-release/ReleaseTab.vue';
import TrackTab from '@/components/create-release/TrackTab.vue';
import ApproveReleaseTab from '@/components/create-release/ApproveReleaseTab.vue';
// import PurchaseTab from '@/components/create-release/PurchaseTab.vue';
import { ElMessage } from 'element-plus';
import { mapGetters } from 'vuex';

export default {
  name: 'CreateRelease',
  props: {
    id: String,
  },
  data: () => ({
    moderComment: null,
    published: false,
    loading: false,
    hasFile: false,
    hasTrack: false,
    errors: {},
    releaseId: '',
    activeName: 'release',
    errorEnum: {
      language: 'Язык',
      name: 'Наименование релиза',
      version: 'Версия',
      headArtist: 'Главный артист',
      copyright: 'Копирайт',
      UPC: 'UPC',
      releaseLabel: 'Лейбл',
      publisherLabel: 'Лейбл',
      collaborators: 'Дополнительный артист',
      genre: 'Жанр',
      releaseDate: 'Дата релиза',
      preOrderDate: 'Дата предзаказа',
      type: 'Тип',
      obscenities: 'Мат',
      releaseSites: 'Площадки релиза',
      year: 'Год',
    },
  }),
  components: {
    ApproveReleaseTab,
    // PurchaseTab,
    ReleaseTab,
    TrackTab,
  },
  mounted() {
    if (this.id) {
      this.setReleaseId(this.id);
    }
  },
  computed: {
    ...mapGetters(['isModerator']),
    hasError() {
      const errors = Object.values(this.errors);
      return !!errors.join('');
    },
  },
  methods: {
    async  publishRelease() {
      this.loading = true;
      await this.$axios.post(`/Release/PublishRelease?draftReleaseId=${this.releaseId}`).then(() => {
        this.published = true;
        ElMessage({ message: 'Релиз успешно опубликован', type: 'success' });
        this.$router.push('/release-list');
      }).catch(() => {
        ElMessage({ message: 'Упс! Что-то пошло не так.', type: 'error' });
      });
      this.loading = false;
    },
    setHasFile(v) {
      this.hasFile = v;
    },
    setHasTrack(v) {
      this.hasTrack = v;
    },
    setComment(v) {
      this.moderComment = v;
    },
    addError(field, text) {
      this.errors[field] = text;
    },
    setReleaseId(id) {
      this.releaseId = id;
    },
  },
  async beforeRouteLeave(to, from, next) {
    if (!this.published && !this.isModerator) {
      if (to.name !== 'Auth') {
        await this.$refs.releaseTab.saveReleaseDraft();
        ElMessage({
          message: 'Черновик успешно сохранён', type: 'success',
        });
      }
    }
    next();
  },
  watch: {
    activeName() {
      this.$refs.releaseTab.validateForm();
      if (!this.published || this.isModerator) {
        this.$refs.releaseTab.saveReleaseDraft();
      }
    },
  },
};
</script>

<style lang="scss" >

</style>
