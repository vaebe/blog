'use client'

import { useEffect, useState, useMemo } from 'react'
import dayjs from 'dayjs'
import 'dayjs/locale/zh-cn'
import { Icon } from '@iconify/react'
import { motion, AnimatePresence } from 'framer-motion'

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

interface StatisticsInfoItem {
  month: string
  count: number
}

export function ArchiveInfo() {
  const [error, setError] = useState('')
  const [isLoading, setLoading] = useState(true)
  const [statisticsInfo, setStatisticsInfo] = useState<Record<string, StatisticsInfoItem[]>>({})
  const [selectedYear, setSelectedYear] = useState<string>('')

  const years = useMemo(
    () => Object.keys(statisticsInfo).sort((a, b) => Number(b) - Number(a)),
    [statisticsInfo]
  )
  const currentYearInfo = useMemo(
    () => statisticsInfo[selectedYear] || [],
    [statisticsInfo, selectedYear]
  )

  useEffect(() => {
    async function fetchArticles() {
      try {
        setLoading(true)
        const res = await fetch(`/api/articles/articleCountByMonth`).then((res) => res.json())

        if (res.code !== 0) {
          throw new Error('获取归档数据失败!')
        }

        const obj: Record<string, StatisticsInfoItem[]> = {}
        res.data?.forEach((item: StatisticsInfoItem) => {
          const year = dayjs(item.month).format('YYYY')
          if (!obj[year]) {
            obj[year] = []
          }
          obj[year].push(item)
        })

        setStatisticsInfo(obj)
        setSelectedYear(Object.keys(obj).sort((a, b) => Number(b) - Number(a))[0])
      } catch (err) {
        console.error(err)
        setError('获取归档数据失败!')
      } finally {
        setLoading(false)
      }
    }

    fetchArticles()
  }, [])

  if (isLoading) {
    return <ArchiveSkeleton />
  }

  if (error) {
    return <ErrorMessage message={error} />
  }

  return (
    <div className="space-y-8">
      <h2 className="text-3xl font-extrabold my-8 text-center">归档信息</h2>

      <YearSelector years={years} selectedYear={selectedYear} onSelectYear={setSelectedYear} />

      <AnimatePresence>
        <motion.div
          key={selectedYear}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 mt-8"
        >
          {currentYearInfo.map((item) => (
            <MonthCard key={item.month} item={item} />
          ))}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

function YearSelector({
  years,
  selectedYear,
  onSelectYear
}: {
  years: string[]
  selectedYear: string
  onSelectYear: (year: string) => void
}) {
  return (
    <Card className="overflow-x-auto">
      <CardContent className="flex items-center justify-start p-4 space-x-2">
        {years.map((year) => (
          <Button
            key={year}
            size="sm"
            variant={year === selectedYear ? 'default' : 'outline'}
            onClick={() => onSelectYear(year)}
          >
            {year}
          </Button>
        ))}
      </CardContent>
    </Card>
  )
}

const monthEnums = [
  '一月',
  '二月',
  '三月',
  '四月',
  '五月',
  '六月',
  '七月',
  '八月',
  '九月',
  '十月',
  '十一月',
  '十二月'
]

function MonthCard({ item }: { item: StatisticsInfoItem }) {
  return (
    <Card className="hover:shadow-lg transition-shadow duration-300">
      <CardContent className="p-4 flex justify-between items-center">
        <div className="flex items-center">
          <Icon icon="mdi:calendar-month" className="w-6 h-6 mr-2 text-blue-500" />
          <span className="font-medium">{monthEnums[dayjs(item.month).get('M')]}</span>
        </div>
        <div className="flex items-center">
          <span className="font-bold text-lg">{item.count}</span>
          <Icon icon="mdi:file-document-multiple" className="w-5 h-5 ml-1 text-gray-500" />
        </div>
      </CardContent>
    </Card>
  )
}

function ArchiveSkeleton() {
  return (
    <div className="space-y-8">
      <Skeleton className="h-10 w-64 my-8 mx-auto" />
      <Skeleton className="h-12 w-full mb-8" />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {[...Array(6)].map((_, i) => (
          <Skeleton key={i} className="h-20 w-full" />
        ))}
      </div>
    </div>
  )
}

function ErrorMessage({ message }: { message: string }) {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8 text-center">
      <Icon icon="mdi:alert-circle" className="w-16 h-16 text-red-500 mx-auto mb-4" />
      <p className="text-xl font-semibold text-red-600">{message}</p>
    </div>
  )
}
