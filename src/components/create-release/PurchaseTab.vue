<template>
  <div class="purchase-tab">
    <!-- <div class="purchase-tab--wrapper"> -->
    <div class="purchase-tab--header mb5">
      Выбор тарифного плана
    </div>
    <el-row>
      <PurchaseCard hide-first hide-second header-text="Базовый" price="590" time-text="дней" />
      <PurchaseCard hide-second header-text="Промо" price="880" time-text="дней" />
      <PurchaseCard income-percent="90" time-text="недель" grey-text="бесплатно" header-text="Промо+" price="1500" />
    </el-row>
    <!-- </div> -->
  </div>
</template>

<script>
import PurchaseCard from '@/components/cards/PurchaseCard.vue';

import {
  ElMessage,
} from 'element-plus';

export default {
  name: 'PurchaseTab',
  components: {
    PurchaseCard,
  },
  props: {
    id: String,
  },
  data: () => ({
    items: [],
  }),
  mounted() {
    // this.getPurchaseList();
  },
  methods: {
    getImg() {
      return require('@/assets/img/Base3.png'); //eslint-disable-line
    },
    async getPurchaseList() {
      await this.$axios.get('Purchase/GetUserPurchases')
        .then((res) => {
          const { data } = res;
          this.items = data;
        })
        .catch(() => {
          ElMessage({ message: 'Упс! Что-то пошло не так.', type: 'error' });
        });
    },
  },
};
</script>

<style lang="scss">
  // @media screen and (max-width: 1300px) {
  //   .purchase-tab{
  //     flex-basis: 700px !important;
  //   }
  // }
.purchase-tab{
  display: flex;
  flex-direction: column;
  &--wrapper{
    flex-basis: 1114px;
  background-color: #222222;
  border-radius: 40px;
  }

  &--header{
    text-align: left;
    font-size:32px;
  }
}
</style>
