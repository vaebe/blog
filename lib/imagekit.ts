import { getFileHash } from '@/lib/utils'
import dayjs from 'dayjs'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
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
async function getFileInfoByFileHash(hash: string) {
  const url = `${process.env.NEXT_PUBLIC_SITE_URL}/api/imagekit/getFileInfoByHash?${new URLSearchParams({ hash })}`
  const res = await fetch(url).then((res) => res.json())
  return res.code === 0 ? res.data?.[0] : null
}

// 获取文件上传 token
async function getImagekitToken(info: Record<string, string | number>) {
  const res = await fetch('/api/imagekit/getToken', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      payload: {
        uploadPayload: info
      }
    })
  }).then((res) => res.json())
  return res.code === 0 ? res.data : null
}

interface ImagekitUploadFileOpts {
  file: File
  fileName: string
}

// 文件上传
export async function imagekitUploadFile({ file, fileName }: ImagekitUploadFileOpts) {
  const fileHash = await getFileHash(file)
  const existingFileInfo = await getFileInfoByFileHash(fileHash)

  if (existingFileInfo) {
    return { code: 0, data: existingFileInfo }
  }

  const payload = {
    fileName,
    tags: fileHash,
    folder: `/blog/${dayjs().format('YYYY-MM-DD')}`
  }

  const token = await getImagekitToken(payload)
  if (!token) return { code: -1, msg: '获取 token 失败' }

  const formData = new FormData()
  Object.entries({ ...payload, file, token }).forEach(([key, value]) =>
    formData.append(key, value as Blob | string)
  )

  const uploadRes = await fetch('https://upload.imagekit.io/api/v2/files/upload', {
    method: 'POST',
    body: formData
  })

  if (!uploadRes.ok) {
    return { code: -1, msg: '上传文件失败！' }
  }

  return {
    code: 0,
    data: await uploadRes.json(),
    msg: '上传成功！'
  }
}
