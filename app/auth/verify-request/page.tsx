'use client'

import { Icon } from '@iconify/react'
import Link from 'next/link'

export default function EmailVerificationSent() {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <div className="text-center">
            <Icon icon="mdi:email-check" className="mx-auto h-12 w-12 text-green-400" />
            <h2 className="mt-6 text-3xl font-extrabold text-gray-900">验证邮件已发送</h2>
            <p className="mt-2 text-sm text-gray-600">
              我们已经向您的邮箱发送了一封包含验证链接的邮件。
            </p>
          </div>
          <div className="mt-8">
            <div className="rounded-md bg-yellow-50 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <Icon
                    icon="mdi:information"
                    className="h-5 w-5 text-yellow-400"
                    aria-hidden="true"
                  />
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-yellow-800">请注意</h3>
                  <div className="mt-2 text-sm text-yellow-700">
                    <p>验证链接将在30分钟后过期。如果您没有收到邮件，请检查您的垃圾邮件文件夹。</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-6">
            <Link
              href="/"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              返回首页
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
