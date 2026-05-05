import leoProfanity from 'leo-profanity';

// Загружаем русский словарь
leoProfanity.loadDictionary('ru');

// Добавляем дополнительные слова (опционально)
const customBadWords = [
  // свои слова, если нужно
];
customBadWords.forEach(word => leoProfanity.add(word));

export const containsProfanity = (text) => {
  if (!text || typeof text !== 'string') return false;
  return leoProfanity.check(text);
};

export const filterProfanity = (text, replacement = '*') => {
  if (!text || typeof text !== 'string') return text;
  return leoProfanity.clean(text, replacement);
};

export const filterWithPartialMask = (text) => {
  if (!text || typeof text !== 'string') return text;
  const words = text.split(' ');
  const filteredWords = words.map(word => {
    if (containsProfanity(word)) {
      if (word.length <= 2) return '*'.repeat(word.length);
      return word[0] + '*'.repeat(word.length - 1);
    }
    return word;
  });
  return filteredWords.join(' ');
};

export const isAppropriateChannelName = (name) => {
  if (!name) return false;
  return !containsProfanity(name.toLowerCase());
};

export const isAppropriateMessage = (message) => {
  if (!message) return true;
  return !containsProfanity(message.toLowerCase());
};

export default {
  containsProfanity,
  filterProfanity,
  filterWithPartialMask,
  isAppropriateChannelName,
  isAppropriateMessage,
};
