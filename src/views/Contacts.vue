<template>
  <div>
    <div class="contacts__header">
      Контакты
    </div>
    <div class="contacts__wrapper">
      <div class="mb3">
        ИП Кукуи Стефан Фирмин
      </div>
      <div class="mb3">
        ИНН 519098995268
      </div>
      <div class="mb3">
        ОГРН 321519000017391
      </div>
      <div class="mb3">
        pie@amphibiansrecords.ru
      </div>
    </div>
  </div>
</template>

<script>

export default {
  name: 'Contacts',
};
</script>

<style lang="scss">
  .contacts{
    &__header{
      width:500px;
      font-size: 32px;
      padding-bottom: 30px;
      border-bottom: 2px solid $whiteOpacity;
    }

    &__wrapper{
      width:500px;
      margin-top:50px;
      padding: 50px;
      border-radius: 35px;
      background-color: $primaryGrey;
      font-size: 18px;
    }
  }
</style>
