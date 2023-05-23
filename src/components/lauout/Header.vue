<template>
  <div class="header">
    <el-row>
      <el-col :span="6" class="header__name">
        AMPHIBIANS RECORDS ENTERTAINMENT
      </el-col>
      <el-col :span="11" class="header__search">
        <el-input class="header__search--input" placeholder="Поиск">
          <template #prefix>
            <el-icon>
              <Search />
            </el-icon>
          </template>
        </el-input>
      </el-col>
      <el-col :span="7" class="header__menu">
        <el-icon :size="30" color="green">
          <Notification />
        </el-icon>
        <div style="display:flex; flex-direction:row; align-items:center">
          <el-dropdown>
            <div class="el-dropdown-link " style="display:flex; flex-direction:row;align-items:center">
              <el-icon :size="30" color="green">
                <User />
              </el-icon>
            </div>
            <template #dropdown>
              <el-dropdown-menu>
                <div v-if="user" class="ph4 pt2">
                  {{ user.pseudonym }}
                </div>
                <el-divider />
                <el-dropdown-item>
                  <router-link class="router-link" to="/contacts">
                    Контакты
                  </router-link>
                </el-dropdown-item>
                <el-dropdown-item v-if="isModerator">
                  <router-link class="router-link" to="/registration">
                    Регистрация юзера
                  </router-link>
                </el-dropdown-item>
                <el-dropdown-item @click="$router.push('/auth'); signOut()">
                  Выход
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>

import { mapState, mapActions, mapGetters } from 'vuex';
import {
  User,
} from '@/assets/icons/index.js';

export default {

  data: () => ({

  }),
  components: {
    User,
  },
  mounted() {
    this.getProfile();
  },
  computed: {
    ...mapGetters(['isModerator']),
    ...mapState(['user']),
  },
  methods: {
    ...mapActions(['getProfile', 'signOut']),
  },
};
</script>

<style lang="scss" >

  .header{
      height: 80px;
      display:flex;
      flex-direction: column;
      justify-items: center;

      &__search{
        height: 80px;
        display:flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;

        &--input {
          .el-input__wrapper{
            padding-left: 30px !important;
            --el-input-border-color:rgba(142, 142, 142, 0);

            input{
              --el-input-inner-height:45px;
            }
          }
        }

      }

      &__menu{
        height: 80px;
      display: flex;
      flex-direction: row;
      justify-content: flex-end;
      align-items: center;

      .el-icon{
        margin-right:10px;
        color: #29AF55;
      }
      }

      &__name{
        height: 80px;
        display:flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;
      }
  }
</style>
