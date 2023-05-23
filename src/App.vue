<template>
  <el-config-provider :locale="locale">
    <div class="common-layout">
      <el-container v-if="outerApp">
        <el-main style="padding:0">
          <router-view />
          <div v-if="$route.name !=='PromotionLink'" style="text-align:center">
            AMPHIBIANS RECORDS ENTERTAINMENT
          </div>
        </el-main>
      </el-container>
      <el-container v-else>
        <el-header style="background-color:#222222;height:80px">
          <Header />
        </el-header>
        <el-container class="main-wrapper">
          <el-aside width="330px">
            <Sidebar />
          </el-aside>
          <el-container>
            <el-main>
              <router-view />
            </el-main>
          </el-container>
        </el-container>
      </el-container>
    </div>
  </el-config-provider>
</template>

<script>
import Sidebar from '@/components/lauout/Sidebar.vue';
import Header from '@/components/lauout/Header.vue';
import ru from 'element-plus/dist/locale/ru.mjs';

export default {
  name: 'App',
  components: {
    Sidebar,
    Header,
  },
  computed: {
    outerApp() {
      return !this.$route.name || this.$route.name === 'Auth' || this.$route.name === 'Registration' || this.$route.name === 'PromotionLink' || this.$route.name === 'Purchase' || this.$route.name === 'Contacts';
    },
    locale() {
      return ru;
    },
  },
};
</script>
<style lang="scss">

</style>
