import * as Yup from 'yup'

export const getAddChannelSchema = channels => Yup.object({
  name: Yup.string()
    .min(3, 'От 3 до 20 символов')
    .max(20, 'От 3 до 20 символов')
    .notOneOf(
      channels.map(ch => ch.name),
      'Канал с таким именем уже существует',
    )
    .required('Обязательное поле'),
})

export const getRenameChannelSchema = (channels, selectedChannel) => Yup.object({
  name: Yup.string()
    .min(3, 'От 3 до 20 символов')
    .max(20, 'От 3 до 20 символов')
    .notOneOf(
      channels
        .filter(ch => ch.id !== selectedChannel?.id)
        .map(ch => ch.name),
      'Канал с таким именем уже существует',
    )
    .required('Обязательное поле'),
})
