import BLOG, { LAYOUT_MAPPINGS } from '@/blog.config'
import { getQueryParam, getQueryVariable, isBrowser } from '../lib/utils'
import dynamic from 'next/dynamic'
import getConfig from 'next/config'
import * as ThemeComponents from '@theme-components'

// Scan all themes in next.config.js
export const { THEMES = [] } = getConfig().publicRuntimeConfig

/**
 * Load global layout based on the theme query
 * @param {*} themeQuery
 * @returns
 */
export const getGlobalLayoutByTheme = themeQuery => {
  if (themeQuery !== BLOG.THEME) {
    return dynamic(() => import(`@/themes/${themeQuery}`).then(m => m[getLayoutNameByPath(-1)]), { ssr: true })
  } else {
    return ThemeComponents[getLayoutNameByPath('-1')]
  }
}

/**
 * Load the theme file
 * @param {*} router
 * @param {*} theme
 * @returns
 */
export const getLayoutByTheme = ({ router, theme }) => {
  const themeQuery = getQueryParam(router.asPath, 'theme') || theme
  const isHomePage = router.pathname === '/'

  // For homepage, use the 'landing' theme; for others, use 'gitbook' theme
  const themeToLoad = isHomePage ? 'landing' : 'gitbook'

  return dynamic(
    () =>
      import(`@/themes/${themeToLoad}`).then(m => {
        setTimeout(() => {
          checkThemeDOM()
        }, 500)

        const layoutName = isHomePage ? 'LayoutIndex' : getLayoutNameByPath(router.pathname, router.asPath)
        const components = m[layoutName]
        if (components) {
          return components
        } else {
          // Fallback to LayoutSlug if no specific component is found
          return m.LayoutSlug
        }
      }),
    { ssr: true }
  )
}

/**
 * Get corresponding layout by path
 * @param {*} path
 * @returns
 */
const getLayoutNameByPath = path => {
  if (LAYOUT_MAPPINGS[path]) {
    return LAYOUT_MAPPINGS[path]
  } else {
    // Default layout name for paths without special handling
    return 'LayoutSlug'
  }
}

/**
 * Special handling when switching themes
 */
const checkThemeDOM = () => {
  if (isBrowser) {
    const elements = document.querySelectorAll('[id^="theme-"]')
    if (elements?.length > 1) {
      elements[elements.length - 1].scrollIntoView()
      // Remove previous elements, keep only the last one
      for (let i = 0; i < elements.length - 1; i++) {
        elements[i].parentNode.removeChild(elements[i])
      }
    }
  }
}

/**
 * 初始化主题 , 优先级 query > cookies > systemPrefer
 * @param isDarkMode
 * @param updateDarkMode 更改主题ChangeState函数
 * @description 读取cookie中存的用户主题
 */
export const initDarkMode = (updateDarkMode, defaultDarkMode) => {
  // 查看用户设备浏览器是否深色模型
  let newDarkMode = isPreferDark()

  // 查看localStorage中用户记录的是否深色模式
  const userDarkMode = loadDarkModeFromLocalStorage()
  console.log('深色模式', userDarkMode)
  if (userDarkMode) {
    newDarkMode = userDarkMode === 'dark' || userDarkMode === 'true'
  }

  // 如果站点强制设置默认深色，则优先级改过用
  if (defaultDarkMode === 'true') {
    newDarkMode = true
  }

  // url查询条件中是否深色模式
  const queryMode = getQueryVariable('mode')
  if (queryMode) {
    newDarkMode = queryMode === 'dark'
  }

  updateDarkMode(newDarkMode)
  saveDarkModeToLocalStorage(newDarkMode)
  document.getElementsByTagName('html')[0].setAttribute('class', newDarkMode ? 'dark' : 'light')
}

/**
 * 是否优先深色模式， 根据系统深色模式以及当前时间判断
 * @returns {*}
 */
export function isPreferDark() {
  if (BLOG.APPEARANCE === 'dark') {
    return true
  }
  if (BLOG.APPEARANCE === 'auto') {
    // 系统深色模式或时间是夜间时，强行置为夜间模式
    const date = new Date()
    const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches
    return (
      prefersDarkMode ||
      (BLOG.APPEARANCE_DARK_TIME &&
        (date.getHours() >= BLOG.APPEARANCE_DARK_TIME[0] || date.getHours() < BLOG.APPEARANCE_DARK_TIME[1]))
    )
  }
  return false
}

/**
 * 读取深色模式
 * @returns {*}
 */
export const loadDarkModeFromLocalStorage = () => {
  return localStorage.getItem('darkMode')
}

/**
 * 保存深色模式
 * @param newTheme
 */
export const saveDarkModeToLocalStorage = newTheme => {
  localStorage.setItem('darkMode', newTheme)
}
