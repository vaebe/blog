import { withAuth } from 'next-auth/middleware'

const ADMIN_PAGES = ['/article/add']
const ADMIN_APIS = [
  '/api/articles/delete',
  '/api/articles/add',
  '/api/articles/update',
  '/api/user'
]
const ADMIN_PATH_ALL = [...ADMIN_PAGES, ...ADMIN_APIS]

export default withAuth(
  function middleware(req) {
    console.log('request:', req.method, req.url)

    if (req.url.endsWith('')) {
      console.log('文章路由')
    }
  },
  {
    callbacks: {
      authorized: function ({ token, req }) {
        const pathname = req.nextUrl.pathname

        if (ADMIN_PATH_ALL.some((item) => pathname.startsWith(item))) {
          return token?.role === '00'
        }

        return true
      }
    }
  }
)

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)']
}
