import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Icon } from '@iconify/react'

export default function Component() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-xl shadow-2xl">
        <div className="text-center">
          <Icon icon="mdi:login" className="mx-auto text-6xl text-blue-500" />
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">登录您的账户</h2>
        </div>
        <form className="mt-8 space-y-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="account" className="block text-sm font-medium text-gray-700">
                用户名
              </Label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Icon icon="mdi:account" className="h-5 w-5 text-gray-400" />
                </div>
                <Input
                  id="account"
                  name="account"
                  type="text"
                  required
                  className="pl-10 block w-full sm:text-sm border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  placeholder="请输入用户名"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="password" className="block text-sm font-medium text-gray-700">
                密码
              </Label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Icon icon="mdi:lock" className="h-5 w-5 text-gray-400" />
                </div>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  required
                  className="pl-10 block w-full sm:text-sm border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  placeholder="请输入密码"
                />
              </div>
            </div>
          </div>

          <div>
            <Button type="submit" className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
              登录
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}