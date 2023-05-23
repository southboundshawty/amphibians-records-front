<template>
  <div style="width:100%;height:100%; padding:25px" class="sidebar">
    <!-- <div style="color:white">
    Основная панель
    </div> -->
    <el-space direction="vertical" alignment="start">
      <!-- <router-link class="router-link" to="/main"> -->
      <div v-if="!isModerator" link class="link-btn disabled">
        <el-icon :size="30" color="green">
          <Home />
        </el-icon>
        Главная страница
      </div>
      <!-- </router-link> -->
      <router-link v-if="!isModerator" class="router-link" to="/create_release">
        <div link class="link-btn">
          <el-icon :size="30" color="green">
            <Release />
          </el-icon>
          Создать релиз
        </div>
      </router-link>
      <router-link v-if="isModerator" class="router-link" to="/moderation-list">
        <div link class="link-btn">
          <el-icon :size="30" color="green">
            <Catalog />
          </el-icon>
          Модерация
        </div>
      </router-link>
      <router-link v-if="!isModerator" class="router-link" to="/release-list">
        <div link class="link-btn">
          <el-icon :size="30" color="green">
            <Catalog />
          </el-icon>
          Каталог
        </div>
      </router-link>
      <div v-if="!isModerator" link class="link-btn disabled">
        <el-icon :size="30" color="green">
          <Analityc />
        </el-icon>
        Аналитика
      </div>
      <div v-if="!isModerator" link class="link-btn disabled">
        <el-icon :size="30" color="green">
          <Finance />
        </el-icon>
        Финансы
      </div>
      <router-link v-if="!isModerator" class="router-link" to="/promotion-list">
        <div link class="link-btn ">
          <el-icon :size="30" color="green">
            <Promotion />
          </el-icon>
          Продвиждение
        </div>
      </router-link>
    </el-space>
    <el-divider />
    <el-space direction="vertical" alignment="start">
      <div v-if="!isModerator" link class="link-btn disabled">
        <el-icon :size="30" color="green">
          <User />
        </el-icon>
        Клуб
      </div>

      <!-- <router-link class="router-link" to="/purchase"> -->
      <div v-if="!isModerator" link class="link-btn disabled">
        <el-icon :size="30" color="green">
          <ShoppingBag />
        </el-icon>
        Магазин
      </div>
      <!-- </router-link> -->
    </el-space>
  </div>
</template>
<script>
import {
  Home, Catalog,
  Analityc,
  Finance,
  Promotion,
  Release,
} from '@/assets/icons/index.js';
import { mapGetters } from 'vuex';

export default {
  name: 'Sidebar',
  components: {
    Release,
    Home,
    Catalog,
    Analityc,
    Finance,
    Promotion,
  },
  computed: {
    ...mapGetters(['isModerator']),
  },
};
</script>
<style lang="scss" scoped>
.router-link-active {
  .link-btn{

    border-radius: 10px;
    background-color: rgba(255,255,255,.3);
    //  color:#29AF55;
     font-weight:500;

  }
}
  .link-btn{
    transition: .3s;
    font-family: 'Stolzl', sans-serif;
    height:55px;
    display: flex;
    flex-direction: row;
    align-items: center;
    width:300px;
    padding: 10px 15px 10px 20px;
    margin: 0px 0px 20px 0px;
    font-size:14px;
    font-weight:400;
    color:white;
    font-size:18px;
    border-radius: 10px;
    &:hover:not(.disabled){
      background-color: rgba(255,255,255,.1);
    }
    &:active:not(.disabled){
      background-color: rgba(255,255,255,.4);
    }
    .el-icon{
      color: $primaryGreen;
      margin-right:20px
    }

    &.disabled{
      opacity: .3;
    }
  }

</style>
