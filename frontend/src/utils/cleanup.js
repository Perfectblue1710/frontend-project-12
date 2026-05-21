import leoProfanity from 'leo-profanity'

leoProfanity.loadDictionary('ru')

const customBadWords = ['boobs', 'fuck', 'shit', 'ass', 'bitch', 'cunt', 'dick', 'pussy']
customBadWords.forEach(word => leoProfanity.add(word))

export const filterProfanity = (text) => {
  if (!text || typeof text !== 'string') return text
  let filtered = text
  customBadWords.forEach((word) => {
    const regex = new RegExp(word, 'gi')
    if (regex.test(filtered)) {
      filtered = '*'.repeat(word.length)
    }
  })
  filtered = leoProfanity.clean(filtered, '*')
  return filtered
}

export const containsProfanity = (text) => {
  if (!text || typeof text !== 'string') return false
  const lowerText = text.toLowerCase()
  return customBadWords.some(word => lowerText.includes(word)) || leoProfanity.check(text)
}

export default { filterProfanity, containsProfanity }