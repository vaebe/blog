// 改成接口
async function getFileUrlByFileHash(Hash: string) {
  const query = {
    type: 'file',
    searchQuery: 'tags IN ["02bb3659658d225b1b4c3ca599d70a6aa657c1455361099ffc14df15f5b0e496"]',
    limit: '1'
  }

  const url = `https://api.imagekit.io/v1/files?${new URLSearchParams(query).toString()}`

  const key = btoa('私有key' + ':')

  const res = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Basic ${key}`
    }
  }).then((res) => res.json())

  if (!Array.isArray(res) || res.length === 0) {
    return ''
  }

  return res?.[0]?.url
}

async function getFileHash(file: File) {
  const arrayBuffer = await file.arrayBuffer()
  const hashBuffer = await crypto.subtle.digest('SHA-256', arrayBuffer)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('')
}

async function getImagekitToken(info: Record<string, any>) {
  const res = await fetch('/api/file/getImagekitToken', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      payload: {
        uploadPayload: info,
        publicKey: process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY
      }
    })
  }).then((res) => res.json())

  if (res.code === 0) {
    return res.data
  } else {
    return ''
  }
}

interface ImagekitUploadFileOpts {
  file: File
  fileName: string
}

export async function imagekitUploadFile(opts: ImagekitUploadFileOpts) {
  const { file, fileName } = opts

  const fileHash = await getFileHash(file)

  const url = await getFileUrlByFileHash(fileHash)

  console.log(url)

  if (url) {
    return url
  }

  const payload = {
    fileName,
    tags: fileHash,
    folder: '/blog'
  }

  const token = await getImagekitToken(payload)

  console.log(token)

  if (!token) {
    return -1
  }

  const formData = new FormData()
  formData.append('file', file)
  formData.append('fileName', payload.fileName)
  formData.append('tags', payload.tags)
  formData.append('folder', payload.folder)
  formData.append('token', token)

  // 调用 ImageKit.io 上传 API
  const uploadResponse = await fetch('https://upload.imagekit.io/api/v2/files/upload', {
    method: 'POST',
    body: formData
  })

  if (!uploadResponse.ok) {
    throw new Error('Upload failed')
  }

  const uploadBody = await uploadResponse.json()
}
