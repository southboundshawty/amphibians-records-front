<template>
  <div class="purchase-card">
    <div class="purchase-card__header">
      {{ headerText }}
    </div>
    <div class="purchase-card__content-wrapper">
      <ul class="purchase-card__list">
        <li>Релиз <span>1 </span><span>трека</span></li>
        <li>Выплачивается <span>{{ incomePercent }}% </span><span>дохода</span></li>
        <li>Выпуск релиза от <span>2 </span><span>{{ timeText }}</span></li>
      </ul>
    </div>
    <div class="purchase-card__content-wrapper">
      <ul class="purchase-card__list-alternative">
        <li>Дополнительный трек <span>+50 ₽</span></li>
        <li>Серый текст <span>{{ greyText }} </span></li>
        <li>Караоке текст <span>+50 ₽ </span></li>
      </ul>
    </div>
    <div class="purchase-card__content-wrapper">
      <ul class="purchase-card__list-alternative">
        <li>Общая ссылка на релиз</li>
        <li>Работа по договору</li>
        <li>Верификации профиля в социальных сетях</li>
        <div :class="{'opacity':hideFirst}">
          <li>Рассылка материла в редакции</li>
          <li>Защита авторских прав</li>
          <li>Круглосуточная поддержка</li>
        </div>
        <div :class="{'opacity':hideSecond}">
          <li>Создание оригинального поста</li>
          <li>Создание оригинального поста для поднятия охвата релиза</li>
        </div>
      </ul>
    </div>
    <div class="purchase-card__price-wrapper">
      <div class="mb3">
        {{ price }} ₽
      </div>
      <el-button type="success" class="purchase-card__btn" @click="purchaseModal = true">
        Выбрать
      </el-button>
    </div>
    <PurchaseModal v-model="purchaseModal" :tarif-name="headerText" :price="price" />
  </div>
</template>

<script>
import PurchaseModal from '@/components/modals/PurchaseModal.vue';

export default {
  name: 'PurchaseCard',
  components: {
    PurchaseModal,
  },
  data: () => ({
    purchaseModal: false,
  }),
  props: {
    headerText: String,
    price: String,
    timeText: {
      default: 'дней', type: String,
    },
    hideFirst: {
      default: false, type: Boolean,
    },
    hideSecond: {
      default: false, type: Boolean,
    },
    incomePercent: {
      default: '80', type: String,
    },
    greyText: {
      default: '+50 ₽', type: String,
    },
  },
};

</script>

<style lang="scss">
  @media screen and (max-width: 1300px) {
    .purchase-card{
      // flex-basis: calc(50% - 40px) !important;
      // max-width: calc(50% - 40px) !important;
    }
  }

 .purchase-card{
      background-color:$primaryGrey ;
      margin:10px 10px;
      flex-basis: calc(33.33333333% - 40px);
      max-width: calc(33.33333333% - 40px);
      cursor: pointer;
      display: flex;
      flex-direction:column;
      align-items: center;
      transition: .2s;
      border-radius: 35px;

      &:hover{
        // transform: scale(1.01);
        // background-color: #151515;
      }

    .opacity{
      opacity:.3;
    }

    &__list{
      margin-left: 20px;
      font-size: 18px;
      font-weight: 300;
      span:first-child{
        font-weight: 400;
        color: $primaryGreen;
        font-size: 28px;
      }
      span:last-child{
        font-weight: 500;
      }
    }

    &__list-alternative{
      margin-left: 20px;
      font-size: 18px;
      font-weight: 300;

      li {
        margin-bottom: 10px;
      }
      span:first-child{
        font-weight: 400;
        color: $primaryGreen;
      }
    }

    &__header{
      text-transform: uppercase;
      color:$primaryGreen;
      width:100%;
      padding-top:50px;
      padding-bottom:20px;
      padding-left:60px;
      border-bottom: 2px $whiteOpacity solid;
      font-size: 32px;
      font-weight: 500;
    }

    &__btn{
      --el-font-weight-primary :400;
      height: 30px !important;
      width:200px;
    }

    &__content-wrapper{
      width:100%;
      padding: 30px 20px;
      border-bottom: 1px $whiteOpacity solid;
    }

    &__price-wrapper{
      padding: 30px 60px;
      width: 100%;
      font-size: 50px;
      font-weight: 500;
    }
    &__image{
      max-width: 260px;
    }

    &--name {
        font-size: 18px;
        margin-bottom: 10px;
      }

      &--price {
        font-size: 18px;
      }

    &__info-wrapper{
      text-align: center;
      display: flex;
      flex-direction:column;
    }
 }
</style>
