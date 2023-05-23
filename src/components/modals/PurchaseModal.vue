<template>
  <div>
    <el-dialog
      v-model="visible"
      class="purchase-modal"
      style="width:500px"
      @close="close"
    >
      <template #header="{ }">
        <div>
          Ваш заказ
        </div>
      </template>
      <div style="display: flex; flex-direction: row; align-items: center;justify-content: space-between; width:100%">
        <div style="font-size: 18px;  flex-basis: 170px;">
          Тариф:
          {{ tarifName }}
        </div>
        <div style="font-size: 18px;">
          1
        </div>
        <div style="font-size: 24px;">
          {{ price }} ₽
        </div>
      </div>

      <template #footer>
        <div style="display: flex; flex-direction: row; align-items: center;justify-content: space-between; width:100%" class="mb3">
          <div style="font-size: 18px; flex-basis: 182px;">
            Общая стоимость
          </div>
          <div style="font-size: 18px;">
            1
          </div>
          <div style="font-size: 24px;">
            {{ price }} ₽
          </div>
        </div>
        <el-checkbox v-model="allow" class="mb3">
          <template #default>
            Я ознакомлен с условиями <a style="text-decoration: none;" href="/files/oferta.pdf" target="_blank">оферты</a>
          </template>
        </el-checkbox>
        <div class="purchase-modal__btn">
          <el-button type="success" :disabled="!allow">
            Подтвердить
          </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script>

export default {
  name: 'PurchaseModal',
  props: {
    tarifName: String,
    modelValue: Boolean,
    price: String,
  },
  data: () => ({
    allow: false,
  }),
  computed: {
    visible: {
      get() {
        return this.modelValue;
      },
      set(value) {
        this.$emit('update:modelValue', value);
      },
    },
  },
  methods: {
    close() {
      this.visible = false;
    },
  },

};
</script>

<style lang="scss">
  .purchase-modal{

    &__btn{

    }
    .el-dialog{
      &__header{
        font-size: 32px;
        color:$primaryGreen;
        padding:30px 45px 15px 45px!important;
        text-align: left !important;
        border-bottom: $whiteOpacity 1px solid;
        margin:0;

        &btn{
          font-size: 25px;
          top: 26px !important;
          right: 30px !important;
        }
      }

      &__body{
        padding:20px 45px 20px 30px!important;
        border-bottom: $whiteOpacity 1px solid;
      }

      &__footer{
        padding:20px 45px 30px 30px!important;
      }
    }
  }
</style>
