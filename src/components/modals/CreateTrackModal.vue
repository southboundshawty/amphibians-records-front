<template>
  <div>
    <input
      ref="inputFile"
      style="display:none"
      type="file"
      @change="loadImage"
    >
    <el-dialog
      v-model="visible"
      title="Новый трек"
      style="width:800px"
      @close="close"
    >
      <!-- <div class="drop-zone">
        Добавить сюда
      </div> -->
      <el-form style="width:500px;margin: auto;">
        <el-form-item :error="getErrorMessage('name')">
          <el-input v-model="form.name" placeholder="Название трека" @blur="v$.form.name.$touch()" />
        </el-form-item>
        <el-form-item :error="getErrorMessage('version')">
          <el-input v-model="form.version" placeholder="Версия" @blur="v$.form.version.$touch()" />
        </el-form-item>
        <el-form-item :error="getErrorMessage('headArtist')">
          <el-input v-model="form.headArtist" placeholder="Основной артист" @blur="v$.form.headArtist.$touch()" />
        </el-form-item>
        <el-form-item>
          <el-dropdown style="width:100%">
            <el-input v-model="collaborators" placeholder="Дополнительный артист" readonly />
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
                <el-input v-model="collaborator" class="mr2" placeholder="Дополнительный артист" />
                <el-button :disabled="!collaborator" type="success" style="" @click="addColloborator()">
                  +
                </el-button>
              </div>
            </template>
          </el-dropdown>
        </el-form-item>
        <!-- <el-form-item :error="getErrorMessage('collaborators')">
          <el-dropdown style="width:100%">
            <el-input v-model="form.collaborators" readonly placeholder="Дополнительный артист" @blur="v$.form.collaborators.$touch()" />
            <template #dropdown>
              <div style="display: flex; flex-direction: row;">
                <el-input v-model="collaborator" class="mr2" placeholder="Дополнительный артист" />
                <el-button type="success" style="" :disabled="!collaborator" @click="addColloborator()">
                  +
                </el-button>
              </div>
            </template>
          </el-dropdown>
        </el-form-item> -->
        <el-form-item :error="getErrorMessage('author')">
          <el-input v-model="form.author" placeholder="Автор текста" @blur="v$.form.author.$touch()" />
        </el-form-item>
        <el-form-item :error="getErrorMessage('composer')">
          <el-input v-model="form.composer" placeholder="Композитор" @blur="v$.form.composer.$touch()" />
        </el-form-item>
        <el-form-item :error="getErrorMessage('isrc')">
          <el-input v-model="form.isrc" placeholder="ISRC" @blur="v$.form.isrc.$touch()" />
        </el-form-item>
        <div style="display:flex; flex-direction:row; align-items:center">
          <el-radio-group v-model="form.hasProfanity" size="large" class="hasProfanity-switch">
            <el-radio-button :label="true">
              Да
            </el-radio-button>
            <el-radio-button :label="false">
              Нет
            </el-radio-button>
          </el-radio-group>
          <div style="margin-left:20px">
            Наличие ненормативной лексики
          </div>
        </div>

        <el-tag v-if="files.length !== 0" size="large" class="mt4">
          {{ filesInfo[0] }}.{{ filesInfo[1] }}
          <el-icon @click="files = []; filesInfo=null">
            <Close />
          </el-icon>
        </el-tag>
      </el-form>
      <template #footer>
        <div v-if="files.length === 0" class="dialog-footer">
          <el-button type="success" @click="$refs.inputFile.click()">
            Добавить трек
          </el-button>
        </div>
        <div v-else class="dialog-footer">
          <el-button type="success" :disabled="allowSubmit" :loading="loading" @click="uploadTrack();">
            Подтвердить
          </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import {
  ElMessage,
} from 'element-plus';
import { required, minLength, maxLength } from '@vuelidate/validators';
import { useVuelidate } from '@vuelidate/core';

export default {
  setup() {
    return { v$: useVuelidate() };
  },
  name: 'CreateTrackModal',
  props: {
    id: String,
    modelValue: Boolean,
  },
  data: () => ({
    collaborator: null,
    loading: false,
    form: {
      name: null,
      version: null,
      headArtist: null,
      collaborators: [],
      author: null,
      isrc: null,
      composer: null,
      hasProfanity: false,
    },
    files: [],
    inputFile: null,
    filesInfo: null,
  }),
  computed: {
    collaborators() {
      return this.form.collaborators.join(',');
    },
    allowSubmit() {
      return this.v$.$invalid;
    },
    visible: {
      get() {
        return this.modelValue;
      },
      set(value) {
        this.$emit('update:modelValue', value);
      },
    },
  },
  watch: {
    visible() {
      if (this.visible) {
        this.v$.$reset();
      }
    },
  },
  methods: {
    deleteColloborator(i) {
      this.form.collaborators.splice(i, 1);
    },
    addColloborator() {
      this.form.collaborators.push(this.collaborator);
      this.collaborator = null;
    },
    getErrorMessage(fieldName) {
      return this.$errorsMessages(this.v$, `form.${fieldName}`);
    },
    async  createFile(file) {
      this.filesInfo = file.name.split('.');
      this.files.push(file);
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
    async uploadTrack() {
      this.loading = true;
      const formData = new FormData();
      for (const it in this.form) {
        if (this.form[it]) {
          formData.append(`${it}`, this.form[it]);
        }
      }
      formData.append('hasProfanity', this.form.hasProfanity);
      formData.append('audio', this.files[0]);
      formData.append('releaseId', this.id);
      await this.$axios.post('/Track/UploadTrack', formData)
        .then(() => {
          ElMessage({ message: 'Трек успешно загружен', type: 'success' });
          this.$emit('update');
          this.close();
        })
        .catch(() => {
          ElMessage({ message: 'Упс! Что-то пошло не так.', type: 'error' });
        })
        .finally(() => {
          this.loading = false;
        });
    },
    close() {
      this.form = {
        name: null,
        version: null,
        headArtist: null,
        collaborators: [],
        author: null,
        isrc: null,
        composer: null,
        hasProfanity: false,
      };
      this.files = [];
      this.visible = false;
      this.$refs.inputFile.value = null;
    },
  },

  validations() {
    return {
      form: {
        name: { required, minLength: minLength(2), maxLength: maxLength(255) },
        version: { minLength: minLength(2), maxLength: maxLength(255) },
        headArtist: { required, minLength: minLength(2), maxLength: maxLength(255) },
        author: { required, minLength: minLength(5), maxLength: maxLength(255) },
        isrc: { minLength: minLength(5), maxLength: maxLength(255) },
        composer: { required, minLength: minLength(5), maxLength: maxLength(255) },
      },
    };
  },
};
</script>

<style lang="scss">
.drop-zone{
  border:white 1px dashed;
  position: absolute;
  display: flex;
  width:100%;
  height:100%;
  margin-left:-20px;
}
</style>
