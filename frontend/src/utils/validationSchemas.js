import * as Yup from 'yup'

export const loginSchema = Yup.object({
  username: Yup.string().required('Обязательное поле'),
  password: Yup.string().required('Обязательное поле'),
})

export const signupSchema = Yup.object({
  username: Yup.string()
    .min(3, 'От 3 до 20 символов')
    .max(20, 'От 3 до 20 символов')
    .required('Обязательное поле'),

  password: Yup.string()
    .min(6, 'Не менее 6 символов')
    .required('Обязательное поле'),

  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password'), null], 'Пароли должны совпадать')
    .required('Обязательное поле'),
})
