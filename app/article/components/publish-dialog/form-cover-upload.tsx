import { ChangeEvent } from 'react'
import { Control, useWatch, useFormContext } from 'react-hook-form'
import { FormField, FormItem, FormLabel } from '@/components/ui/form'
import Image from 'next/image'
import { toast } from 'sonner'
import { uploadFile } from '@/app/actions/image-kit'
import { FormValues } from './form'

export function FormCoverUpload({ control }: { control: Control<FormValues> }) {
  const { setValue } = useFormContext<FormValues>()
  const coverImg = useWatch({ control, name: 'coverImg' })

  const handleImageUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    try {
      const file = event.target.files?.[0]
      if (!file) {
        return
      }

      const res = await uploadFile({ file, fileName: file.name })

      if (res?.code === 0 && res.data?.url) {
        setValue('coverImg', res.data.url)
        toast.success('封面上传成功')
      } else {
        toast.error('图片上传失败')
      }
    } catch {
      toast.error('上传图片失败，请稍后重试')
    } finally {
      event.target.value = ''
    }
  }

  return (
    <FormField
      control={control}
      name="coverImg"
      render={() => (
        <FormItem>
          <FormLabel htmlFor="coverImgInput">文章封面</FormLabel>
          <label
            htmlFor="coverImgInput"
            className="flex gap-4 items-center border rounded-md cursor-pointer hover:bg-muted transition"
          >
            <div className="w-full h-[262px] border border-dashed rounded bg-muted/30 flex items-center justify-center overflow-hidden">
              {coverImg ? (
                <Image
                  src={coverImg}
                  alt="Cover"
                  width={192}
                  height={128}
                  className="object-cover w-full h-full"
                  priority
                />
              ) : (
                <span className="text-muted-foreground">暂无封面</span>
              )}
            </div>
            <input
              id="coverImgInput"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageUpload}
            />
          </label>
          <p className="text-xs text-muted-foreground mt-1">建议尺寸: 192×128 px（仅在首页展示）</p>
        </FormItem>
      )}
    />
  )
}
