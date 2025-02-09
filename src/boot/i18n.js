import { defineBoot } from '#q-app/wrappers'
import { createI18n } from 'vue-i18n'
import messages from 'src/i18n'

export default defineBoot(({ app }) => {
  const i18n = createI18n({
    locale: 'MK',
    fallbackLocale: 'EN',
    globalInjection: true,
    messages
  })

  app.use(i18n)
})
