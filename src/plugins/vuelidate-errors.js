import { get } from 'lodash-es';
import voca from 'voca';

/**
 * Returns error string for field using Vuelidate instance
 * @param $v
 * @param field
 * @param store
 * @returns {string|any|string}
 */
export const getFormErrorMessage = ($v, field, store) => {
  const camelField = voca.camelCase(field);
  const fieldParams = get($v, field, $v?.field);
  const isInvalid = fieldParams.$invalid;
  const isDirty = fieldParams.$dirty;
  if (isInvalid && isDirty) {
    const errorsStack = {
      name: 'Некорректное имя пользователя',
      priceFactor: 'Введен некорректный коэффициент',
      kpp: 'Некорректный КПП',
      inn: 'Неправильный ИНН',
      pass: 'Пароль не может содержать только цифры',
      notSameAsLogin: 'Пароль и логин не должны совпадать',
      phone: 'Допустимое значение в формате "+7(123)4567890"',
      internationalPhone: 'Допустимое значение в формате "+7(123)4567890"',
      alpha: 'Некорректное значение. Разрешены только буквы.',
      alphaWithSpace: 'Некорректное значение. Разрешены только буквы.',
      required: 'Обязательное поле',
      money: 'Допустимое значение в формате "0.00" и не может быть отрицательным',
      numeric: 'Допустимы только цифры',
      decimal: 'Допустимы только числа',
      alphaNum: 'Допустимы только цифры и латинские буквы',
      email: 'Допустимое значение в формате "user@example.com"',
      company: 'Некорректное название организации',
      noSpaces: 'Запрещено использование пробелов',
      minLength: '',
      maxLength: '',
      minValue: '',
      maxValue: '',
      maxPrice: '',
      passRe: 'Пароли не совпадают',
      positiveNumber: 'Число должно быть больше нуля',
      integer: 'Число должно быть целым',
      extra: 'Меньше доступного числа',
      minDate: '',
      maxDate: '',
      isDate: 'Введена несуществующая дата',
      url: 'Некорректная ссылка',
      fileRequired: 'Необходимо прикрепить документ или указать ссылку',
      revokePrice: 'Допустимое отклонение цены - 20%',
    };
    return Object.keys(errorsStack).reduce((errors, key) => {
      if (Object.prototype.hasOwnProperty.call(errorsStack, key) && fieldParams[key]?.$invalid) {
        switch (key) {
          case 'maxPrice': {
            const max = fieldParams?.$params?.maxPrice?.value || 0;
            errors.push(`Значение должно быть меньше " ${max}"`);
            break;
          }
          case 'minDate': {
            const min = fieldParams?.$params?.minDate?.value || 0;
            errors.push(`Дата не может быть меньше  ${min}`);
            break;
          }
          case 'maxDate': {
            const max = fieldParams?.$params?.maxDate?.value || 0;
            errors.push(`Дата не может быть больше  ${max}`);
            break;
          }
          case 'minLength': {
            const min = fieldParams?.minLength?.$params?.min || 0;
            errors.push(`Поле может содержать не менее ${min} символов`);
            break;
          }
          case 'maxLength': {
            const max = fieldParams?.maxLength?.$params?.max || 0;
            errors.push(`Поле может содержать не более ${max} символов`);
            break;
          }
          case 'minValue': {
            const min = fieldParams?.$params?.minValue?.min || 0;
            errors.push(`Значение не может быть меньше ${min}`);
            break;
          }
          case 'maxValue': {
            const max = fieldParams?.$params?.maxValue?.max || 0;
            errors.push(`Значение не может быть больше ${max}`);
            break;
          }
          default:
            errors.push(errorsStack[key] || '');
        }
      }
      return errors;
    }, [])[0] || null;
  }
  if (store) {
    return get(store, `getters['error/validationErrors'].${camelField}`, null) || '';
  }
  return '';
};

/**
 * Return error string from API
 * @param error
 * @returns {string}
 */
export const getApiLocaleErrors = (error) => {
  let text = null;
  const { message, request } = error || {};

  if (request) {
    text = request.statusText;
  } else {
    text = message;
  }

  return text;
};
