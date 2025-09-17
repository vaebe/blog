import { Control } from 'react-hook-form'
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { FormValues } from './form'

const CATEGORIES = ['后端', '前端', 'Android', 'iOS', '人工智能', '阅读'] as const

export function FormCategoryField({ control }: { control: Control<FormValues> }) {
  return (
    <FormField
      control={control}
      name="classify"
      render={({ field }) => (
        <FormItem>
          <FormLabel>
            分类<span className="text-destructive">*</span>:
          </FormLabel>
          <Select value={field.value} onValueChange={field.onChange}>
            <FormControl className="w-full">
              <SelectTrigger>
                <SelectValue placeholder="请选择分类" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {CATEGORIES.map((cat) => (
                <SelectItem key={cat} value={cat}>
                  {cat}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}
