'use server'

import { ApiRes } from '@/lib/utils'
import jwt from 'jsonwebtoken'
import { getFileHash } from '@/lib/utils'
import dayjs from 'dayjs'

interface ImagekitUploadFileRes {
  fileId: string
  name: string
  size: string
  versionInfo: {
    id: string
    name: string
  }
  filePath: string
  url: string
  fileType: string
  height: number
  width: number
  thumbnailUrl: string
  AITags: null | string
}

// 根据 hash 获取图片信息
export async function getFileInfoByHash(
  fileHash: string
): Promise<ApiRes<ImagekitUploadFileRes[]>> {
  try {
    if (!fileHash) {
      return { code: -1, msg: '文件 hash 不存在' }
    }

    const query = {
      type: 'file',
      searchQuery: `"customMetadata.md5" = "${fileHash}"`,
      limit: '1'
    }

    const url = `https://api.imagekit.io/v1/files?${new URLSearchParams(query).toString()}`

    const res = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Basic ${btoa(process.env.IMAGEKIT_PRIVATE_KEY + ':')}`
      }
    }).then((res) => res.json())

    if (!Array.isArray(res) || res.length === 0) {
      return { code: 0, data: [], msg: '文件不存在！' }
    }

    return { code: 0, data: res, msg: '获取文件成功！' }
  } catch (error) {
    console.error(error)
    return { code: -1, msg: 'Failed to fetch article' }
  }
}

export async function generateToken(payload: Record<string, string>): Promise<ApiRes<string>> {
  try {
    const privateKey = process.env.IMAGEKIT_PRIVATE_KEY ?? ''

    if (!privateKey) {
      return { code: -1, msg: 'IMAGEKIT_PRIVATE_KEY 不存在创建 token 失败!' }
    }

    const token = jwt.sign(payload, privateKey, {
      expiresIn: 60, // token 过期时间最大 3600 秒
      header: {
        alg: 'HS256',
        typ: 'JWT',
        kid: process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY
      }
    })

    return { code: 0, data: token, msg: '创建 token 成功！' }
  } catch (err) {
    console.error(err)
    return { code: -1, msg: '创建 token 失败!' }
  }
}

interface ImagekitUploadFileOpts {
  file: File
  fileName: string
}

// 文件上传
export async function uploadFile({
  file,
  fileName
}: ImagekitUploadFileOpts): Promise<ApiRes<ImagekitUploadFileRes | undefined>> {
  try {
    const fileHash = await getFileHash(file)

    console.log(fileHash)

    const exist = await getFileInfoByHash(fileHash)

    console.log('exist', exist)

    if (exist.code === 0 && exist.data?.length) {
      return { code: 0, data: exist.data[0], msg: '上传文件成功！' }
    }

    const payload = {
      fileName,
      customMetadata: JSON.stringify({ md5: fileHash }),
      folder: `/blog/${dayjs().format('YYYY-MM-DD')}`
    }

    const tokenRes = await generateToken(payload)
    console.log('tokenRes', tokenRes)

    if (tokenRes.code !== 0) {
      return { ...tokenRes, data: undefined }
    }

    const formData = new FormData()
    Object.entries({ ...payload, file, token: tokenRes.data }).forEach(([key, value]) =>
      formData.append(key, value as Blob | string)
    )

    const uploadRes = await fetch('https://upload.imagekit.io/api/v2/files/upload', {
      method: 'POST',
      body: formData
    })

    console.log('uploadRes', uploadRes)

    if (!uploadRes.ok) {
      return { code: -1, msg: '上传文件失败！' }
    }

    const data = await uploadRes.json()

    return { code: 0, data, msg: '上传成功！' }
  } catch (error) {
    console.log(error)
    return { code: 0, data: undefined, msg: '上传异常！' }
  }
}
