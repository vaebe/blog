"use client"

import { useState } from 'react'

import './style.css'

import { Editor } from '@bytemd/react'
import zh_Hans from 'bytemd/locales/zh_Hans.json';
import breaks from '@bytemd/plugin-breaks';
import frontmatter from '@bytemd/plugin-frontmatter';
import gemoji from '@bytemd/plugin-gemoji';
import gfm from '@bytemd/plugin-gfm';
import highlightSsr from '@bytemd/plugin-highlight-ssr';
import mediumZoom from '@bytemd/plugin-medium-zoom';
import mermaid from '@bytemd/plugin-mermaid';
import footnotes from '@bytemd/plugin-footnotes';
import math from '@bytemd/plugin-math-ssr';
import mermaid_zhHans from '@bytemd/plugin-mermaid/lib/locales/zh_Hans.json';
import math_zhHans from '@bytemd/plugin-math/lib/locales/zh_Hans.json';
import gfm_zhHans from '@bytemd/plugin-gfm/lib/locales/zh_Hans.json';

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
];

export default function Component() {

  const [value, setValue] = useState('')

  // 上传文件多个
const uploadImages = async (files) => {
  let resultData = [];

  for (const item of files) {
    const formData = new FormData();
    formData.append('file', item);
    // const res = await uploadFile(formData);
    // if (res.code === 0) {
    //   resultData.push({
    //     url: res.data,
    //     alt: item.name,
    //     title: item.name
    //   });
    // }
  }
  return resultData;
};

  return (
    <div className='overflow-hidden h-[100vh]'>
      <Editor
        value={value}
        locale={zh_Hans}
        plugins={plugins}
        onChange={(v) => {
          setValue(v)
        }}
        uploadImages={uploadImages}
      />
    </div>
  )
}