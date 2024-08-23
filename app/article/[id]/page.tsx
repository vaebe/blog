"use client"

import { Viewer } from '@bytemd/react'
import bytemdPlugins from '@/lib/bytemdPlugins'
import './style.css'
import { useEffect, useState } from 'react'

export default function Component({ params }: { params: { id: string } }) {

  const [article, setArticle] = useState('')

  async function getData () {
    const res = await fetch(`http://localhost:3000/api/articles/details?id=${params.id}`)
    if (!res.ok) {
      throw new Error('获取文章失败')
    }
    const data = await res.json()

    console.log(data.data)

    setArticle(data.data)
  }
  
  useEffect(() => {
    getData()
  }, [])

  return (
    <div className='overflow-hidden h-[100vh]'>
      <Viewer value={article.content} plugins={bytemdPlugins}></Viewer>
    </div>
  )
}