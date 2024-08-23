"use client"

import { useState } from 'react'

import './style.css'
import bytemdPlugins from '@/lib/bytemdPlugins'

import { Editor } from '@bytemd/react'
import zh_Hans from 'bytemd/locales/zh_Hans.json';

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
        plugins={bytemdPlugins}
        onChange={(v) => {
          setValue(v)
        }}
        uploadImages={uploadImages}
      />
    </div>
  )
}