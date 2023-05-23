<template>
  <div class="release-card">
    <div class="release-card__header">
      <el-image :src="release.imagePath">
        <template #error>
          <div class="image-slot">
            <el-icon size="50">
              <Catalog />
            </el-icon>
          </div>
        </template>
      </el-image>
      <div class="release-card__header--info ml3 mv3">
        <div class="release-card__header--name">
          {{ release.name || 'Нет названия' }}
        </div>
        <div class="release-card__header--artist">
          {{ release.headArtist || 'Нет исполнителя' }}
        </div>
        <div />
      </div>
      <div style="margin-left: auto; position: absolute; right: 20px;">
        <el-popover
          v-if="release.status === 'Черновик' && release.comment"
          placement="top-start"
          title="Причина"
          :width="200"
          trigger="hover"
          :content="release.comment"
        >
          <template #reference>
            <el-tag effect="dark" size="large" round type="danger" class="mr2 mt1">
              Отклонено
            </el-tag>
          </template>
        </el-popover>
        <el-tag v-else effect="dark" size="large" round :type="statusChipColor[ release.status ]" class="mr2 mt1">
          {{ release.status }}
        </el-tag>
        <el-dropdown
          v-if="release.status === 'Черновик'"
          :popper-options="{
            placement: 'left',
          }"
        >
          <div class="release-card__header--menu-btn">
            <el-icon size="25" style="transform: rotate(90deg);">
              <MoreFilled color="rgba(41, 175, 85, 1)" />
            </el-icon>
          </div>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item @click="$router.push(`/edit_draft_release/${release.id }`)">
                <el-icon size="30">
                  <Edit />
                </el-icon>
                <div class="ml2">
                  Редактировать
                </div>
              </el-dropdown-item>
              <el-dropdown-item @click="$emit('delete-release',release.id)">
                <el-icon size="30">
                  <Delete />
                </el-icon>
                <div class="ml2">
                  Удалить
                </div>
              </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </div>

    <el-row class="mt4">
      <el-col :span="12">
        <div class="release-card__data--fields mb4">
          <div>
            Жанр
          </div>
          <div>
            {{ release.genre ||LONG_DASH }}
          </div>
        </div>
        <div class="release-card__data--fields">
          <div>
            Дата релиза
          </div>
          <div v-if="release.releaseDate">
            {{ $moment(release.releaseDate ).format('YYYY.MM.DD') }}
          </div>
          <div v-else>
            {{ LONG_DASH }}
          </div>
        </div>
      </el-col>
      <el-col :span="12">
        <div class="release-card__data--fields mb4">
          <div>
            UPC
          </div>
          <div>
            {{ release.upc || LONG_DASH }}
          </div>
        </div>
        <div class="release-card__data--fields">
          <div>
            Лейбл
          </div>
          <div>
            {{ release.copyright || LONG_DASH }}
          </div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { Catalog, Delete, Edit } from '@/assets/icons/index.js';

export default {
  name: 'ReleaseCard',

  components: {
    Catalog, Delete, Edit,
  },
  props: {
    release: Object,
  },
  data: () => ({
    statusChipColor: {
      Черновик: 'info',
      'Прошел модерацию': 'success',
      'Проходит модерацию': 'warning',
    },
  }),
};
</script>

<style lang="scss">

@media screen and (max-width: 1500px) {
  .release-card__wrapper {
    flex-basis:100%!important;
  }
}

 .release-card {
  position: relative;
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

  &__wrapper{
    flex-basis:50%;
    max-width:50%;
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
        width:100%;
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
      width:calc(100% - 170px);
      padding: 10px;
      font-size: 24px;
      display: flex;
      flex-direction: column;
      justify-content: space-around;
    }

    &--name{
      width:calc(100% - 100px);
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      flex: 1;
      font-weight: 500;
    }

    &--artist{
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      flex: 1;
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
