<template>
  <div>
    <input
      ref="inputFile"
      style="display:none"
      type="file"
      @change="loadImage"
    >
    <div>
      <div v-if="loaders.openDraft" id="form" style="width: 100%; height:1000px;" />
      <el-form v-else label-position="right" label-width="280px">
        <div style="width:100%; padding-top:12px;display: flex; flex-direction: row;" justify-content:stretch>
          <div style="padding:0 24px 20px 0px; justify-content:center; display:flex; flex-direction:column; justify-content:start; align-content:center;">
            <div>
              <div>
                <el-image
                  ref="image"
                  class="release-image"
                  :src="preview"
                  fit="cover"
                >
                  <template #error>
                    <div class="image-slot">
                      <el-icon size="50">
                        <Catalog />
                      </el-icon>
                    </div>
                  </template>
                </el-image>
              </div>

              <div v-if="!isModerator" style="width:260px; display:flex; flex-direction: row; justify-content: center;">
                <el-button type="success" style="width:160px" @click="$refs.inputFile.click()">
                  Загрузить
                </el-button>
              </div>
            </div>
          </div>

          <div style="display: flex;flex-direction:column; flex-basis: 880px; padding-right:25px;">
            <el-form-item
              label="Название релиза"
              :error="getErrorMessage('name')"
            >
              <el-input ref="name" v-model="form.name" :readonly="isModerator" @blur="v$.form.name.$touch()" />
            </el-form-item>
            <el-form-item
              label="Версия релиза"
              :error="getErrorMessage('version')"
            >
              <el-input ref="version" v-model="form.version" :readonly="isModerator" @blur="v$.form.version.$touch()" />
            </el-form-item>
            <el-form-item
              label="Основной артист"
              :error="getErrorMessage('headArtist')"
            >
              <el-input ref="headArtist" v-model="form.headArtist" :readonly="isModerator" @blur="v$.form.headArtist.$touch()" />
            </el-form-item>
            <el-form-item label="Дополнительный артист">
              <el-dropdown style="width:100%" :disabled="isModerator">
                <el-input v-model="collaborators" readonly />
                <template #dropdown>
                  <div style="display: flex; flex-direction: column;">
                    <div v-for="collaboratorName, i in form.collaborators" :key="i" class="collobarator">
                      <div>
                        {{ collaboratorName }}
                      </div>
                      <div>
                        <el-button link style="width:10px;  height:10px" type="danger" @click="deleteColloborator(i)">
                          <el-icon size="20">
                            <Close />
                          </el-icon>
                        </el-button>
                      </div>
                    </div>
                  </div>

                  <div style="display: flex; flex-direction: row;" class="mt2">
                    <el-input v-model="collaborator" :readonly="isModerator" class="mr2" placeholder="Дополнительный артист" />
                    <el-button :disabled="!collaborator" type="success" style="" @click="addColloborator()">
                      +
                    </el-button>
                  </div>
                </template>
              </el-dropdown>
            </el-form-item>
            <el-form-item label="Жанр" :disabled="isModerator" :error="getErrorMessage('genre')">
              <el-tree-select
                v-model="form.genre"
                :readonly="isModerator"
                style="width:100%"
                :props="{
                  children:'subGenres',
                  label:'name'
                }"
                value-key="id"
                :render-after-expand="false"

                :data="genres"
                :loading="loaders.genre"
                @blur="v$.form.genre.$touch()"
              />
            </el-form-item>
            <el-form-item style="height:50px" label="Дата релиза" :error="getErrorMessage('releaseDate')">
              <el-date-picker v-model="form.releaseDate" :readonly="isModerator" style="width:100%" @blur="v$.form.releaseDate.$touch()" />
            </el-form-item>
            <el-form-item style="height:50px" label="Дата предзаказа" :error="getErrorMessage('preOrderDate')">
              <el-date-picker v-model="form.preOrderDate" :readonly="isModerator" style="width:100%" @blur="v$.form.preOrderDate.$touch()" />
            </el-form-item>
            <el-form-item class="mt-2" label="Тип релиза" :error="getErrorMessage('type')">
              <el-select v-model="form.type" :disabled="isModerator" style="width:100%" size="large" @blur="v$.form.type.$touch()">
                <el-option
                  v-for="item in releaseTypes"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
            <el-form-item v-if="form.language" label="Язык релиза" :error="getErrorMessage('language')">
              <el-select v-model="form.language" :readonly="isModerator" class="m-2" style="width:100%" size="large" @blur="v$.form.language.$touch()">
                <el-option
                  v-for="item in languages"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="Copyright" :error="getErrorMessage('copyright')">
              <el-input v-model="form.copyright" :readonly="isModerator" @blur="v$.form.copyright.$touch()" />
            </el-form-item>
            <el-form-item label="UPC релиза">
              <el-input v-model="form.UPC" :readonly="isModerator" @blur="v$.form.UPC.$touch()" />
            </el-form-item>
          </div>
        </div>
      </el-form>
    </div>
  </div>
</template>

<script>
import { required, minLength } from '@vuelidate/validators';
import { useVuelidate } from '@vuelidate/core';
import {
  ElMessage,
  ElLoading,
} from 'element-plus';
import Catalog from '@/assets/icons/Catalog.vue';
import { mapGetters } from 'vuex';

export default {
  name: 'ReleaseTab',
  props: {
    id: String,
    published: Boolean,
  },
  components: {
    Catalog,
  },
  data: () => ({
    v$: useVuelidate(),
    collaborator: null,
    releaseId: null,
    genres: [],
    imagePath: null,
    form: {
      name: '',
      version: '',
      headArtist: '',
      copyright: '',
      UPC: '',
      releaseLabel: '',
      publisherLabel: '',
      language: '',
      collaborators: [],
      genre: '',
      releaseDate: '',
      preOrderDate: '',
      image: '',
      type: '',
      obscenities: false,
    },
    loaders: {
      openDraft: false,
      genres: false,
    },
    files: [],
    filesInfo: null,
    preview: '',
    releaseTypes: [
      {
        value: 0,
        label: 'Single',
      },
      {
        value: 1,
        label: 'EP',
      },
      {
        value: 2,
        label: 'Album',
      },
    ],
  }),
  async mounted() {
    const loading = ElLoading.service({
      lock: true,
      text: 'Загрузка',
      background: 'rgba(0, 0, 0, 0)',
      target: '#form',
    });
    this.loaders.openDraft = true;

    await this.getGenres();
    await this.getLanguages();
    this.releaseId = this.id;
    if (this.releaseId) {
      await this.getDraftRelease();
    } else {
      await this.saveReleaseDraft();
    }
    loading.close();
    this.loaders.openDraft = false;
  },
  methods: {
    deleteColloborator(i) {
      this.form.collaborators.splice(i, 1);
    },
    validateForm() {
      this.v$.form.$touch();
    },
    addColloborator() {
      this.form.collaborators.push(this.collaborator);
      this.collaborator = null;
    },
    async getDraftRelease() {
      await this.$axios.get(`Release/GetReleasesById/${this.releaseId}`)
        .then((res) => {
          const { data } = res;
          this.form = {
            language: data.language,
            name: data.name,
            version: data.version,
            headArtist: data.headArtist,
            copyright: data.copyright,
            UPC: data.UPC,
            releaseLabel: data.releaseLabel,
            publisherLabel: data.publisherLabel,
            collaborators: data.collaborators[0] !== null ? data.collaborators[0].split(',') : [],
            genre: data.genre,
            releaseDate: data.releaseDate,
            preOrderDate: data.preOrderDate,
            type: data.type,
            obscenities: data.obscenities,
          };
          this.$emit('set-comment', data.comment);
          this.$emit('has-file', !!data.imagePath);
          this.preview = data.imagePath;
          this.validateForm();
        })
        .catch(() => {
          ElMessage({ message: 'Упс! Что-то пошло не так.', type: 'error' });
        });
    },
    async saveReleaseDraft() {
      if (this.isModerator) {
        return;
      }
      this.openDraft = true;
      const request = {
        ...this.form,
        releaseDate: this.form.releaseDate ? this.$moment(this.form.releaseDate).format('YYYY-MM-DD HH:MM:SS') : null,
        preOrderDate: this.form.preOrderDate ? this.$moment(this.form.preOrderDate).format('YYYY-MM-DD HH:MM:SS') : null,
      };
      const formData = new FormData();
      for (const it in request) {
        if (request[it]) {
          formData.append(`${it}`, request[it]);
        }
      }
      formData.append('image', this.files[0]);
      await this.$axios.post(`/Release/SaveReleaseDraft?${this.releaseId ? `releaseId=${this.releaseId}` : ''}`, formData)
        .then((res) => {
          const { data } = res;
          if (data && !this.releaseId) {
            this.releaseId = data;
          }
          this.$emit('set-id', data);
        }).catch(() => {
          ElMessage({ message: 'Упс! Что-то пошло не так.', type: 'error' });
        });
    },
    getErrorMessage(fieldName) {
      const message = this.$errorsMessages(this.v$, `form.${fieldName}`);
      if (!this.loaders.openDraft) {
        this.$emit('add-error', fieldName, message);
      }
      return message;
    },
    async getGenres() {
      this.loaders.genres = true;
      const { data } = await this.$axios.get('/Genre/GetAllGenres');
      this.loaders.genres = false;
      this.genres = data;
    },
    async getLanguages() {
      this.loaders.languages = true;
      const { data } = await this.$axios.get('/Release/GetReleaseLanguages');
      this.loaders.languages = false;
      this.languages = data;
    },
    async  createFile(file) {
      this.filesInfo = file.name.split('.');
      this.files.push(file);
      this.$emit('has-file', true);
    },
    async  loadImage(e) {
      e.preventDefault();
      const files = e.target.files || e.dataTransfer.files;
      const data = this;
      const reader = new FileReader();

      reader.onload = function (e) { // eslint-disable-line
        data.preview = e.target.result;
      };
      reader.readAsDataURL(files[0]);
      for (const file of files) {
        this.createFile(file);
      }
    },
  },
  computed: {
    ...mapGetters(['isModerator']),
    collaborators() {
      return this.form.collaborators.join(',');
    },
  },
  watch: {
    files() {

    },
  },
  validations() {
    return {
      form: {
        language: { required },
        name: { required, minLength: minLength(2) },
        version: '',
        headArtist: { required, minLength: minLength(2) },
        copyright: { required, minLength: minLength(2) },
        UPC: '',
        releaseLabel: '',
        publisherLabel: '',
        collaborators: {},
        genre: { required },
        releaseDate: { required },
        preOrderDate: { required },
        image: '',
        type: { required },
        obscenities: false,
      },
    };
  },

};

</script>

<style lang="scss">

.collobarator{
  padding-left: 10px;
  align-items: center;
  display: flex;
   flex-direction: row;
   justify-content: space-between;
     border-radius: 10px;

    &:hover{
      background-color: #151515;
     }
}

.release-image {
  width:260px;
  height:260px;
  border-radius:14px; z-index:1;margin-bottom:20px
}

.image-slot {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  background: var(--el-fill-color-light);
  color: var(--el-text-color-secondary);
  font-size: 30px;
  color:$primaryGreen
}

 .obscenities-switch  .el-radio-button{
  background: #151515 ;

  .el-radio-button__inner{
    border-color:rgba(41, 175, 85, 1) !important;
     color: white !important;
  }
    &:first-child{
      border-radius:15px 0 0 15px;
      .el-radio-button__inner{
       border-radius:15px 0 0 15px;
      }
    }
    &:last-child{
      border-radius:0 15px 15px 0;
      .el-radio-button__inner{
        border-radius:0 15px 15px 0;
      }

 }
 }
  .obscenities-switch  .is-active{
      .el-radio-button__inner {
          background-color: rgba(41, 175, 85, 1)!important;
          box-shadow: none;
      }

    }

</style>
