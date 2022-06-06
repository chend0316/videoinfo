const zhCN = {
  'open-file': '打开文件',
}

const enUS = {
  'open-file': 'Open File',
}

const map = {
  'zh-CN': zhCN,
  'en-US': enUS,
}

const lang = 'zh-CN'
const dict = map[lang]

module.exports = {
  i18n: function (key) {
    return key in dict ? dict[key] : key
  }
}
