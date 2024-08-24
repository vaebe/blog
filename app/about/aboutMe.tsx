import { SectionContainer } from './sectionContainer'
import * as React from "react"

export function AboutMe() {
  return (
    <SectionContainer title='关于我' titleIcon='mdi:account'>
      <p className="text-gray-700 dark:text-gray-300">
        你好！我是vaebe，一名全栈开发者。我喜欢探索新技术，解决复杂问题，
        并且热衷于在掘金分享我的技术见解。在GitHub上，我积极参与开源项目，不断提升自己的编程技能。
        欢迎访问我的掘金主页和GitHub主页，了解更多关于我的信息！
      </p>
    </SectionContainer>
  )
}