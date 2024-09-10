import breaks from '@bytemd/plugin-breaks'
import frontmatter from '@bytemd/plugin-frontmatter'
import gemoji from '@bytemd/plugin-gemoji'
import gfm from '@bytemd/plugin-gfm'
import highlightSsr from '@bytemd/plugin-highlight-ssr'
import mediumZoom from '@bytemd/plugin-medium-zoom'
import mermaid from '@bytemd/plugin-mermaid'
import footnotes from '@bytemd/plugin-footnotes'
import math from '@bytemd/plugin-math-ssr'
import mermaid_zhHans from '@bytemd/plugin-mermaid/lib/locales/zh_Hans.json'
import math_zhHans from '@bytemd/plugin-math/lib/locales/zh_Hans.json'
import gfm_zhHans from '@bytemd/plugin-gfm/lib/locales/zh_Hans.json'

// css
import 'bytemd/dist/index.css'
import 'juejin-markdown-themes/dist/juejin.css'
import 'highlight.js/styles/default.css'

const plugins = [
  breaks(),
  frontmatter(),
  gemoji(),
  gfm({ locale: gfm_zhHans }),
  math({ locale: math_zhHans }),
  highlightSsr(),
  mermaid({ locale: mermaid_zhHans }),
  mediumZoom(),
  footnotes()
]

export default plugins
