import { Control } from 'react-hook-form'
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form'
import { Textarea } from '@/components/ui/textarea'
import { FormValues } from './form'

export function FormSummaryField({ control }: { control: Control<FormValues> }) {
  return (
    <FormField
      control={control}
      name="summary"
      render={({ field }) => (
        <FormItem>
          <FormLabel htmlFor="summary">
            编辑摘要<span className="text-destructive">*</span>:
          </FormLabel>
          <FormControl>
            <Textarea {...field} id="summary" placeholder="请输入文章摘要" rows={4} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}
