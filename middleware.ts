import { withAuth } from "next-auth/middleware"
const ADMIN_PATHS = ['/api/articles/delete', '/api/articles/add', '/api/articles/update', '/api/user'];

export default withAuth(
  function middleware(req) {
    console.log("request:", req.method, req.url);
  },
  {
    callbacks: {
      authorized: function ({ token , req}) {
        const pathname = req.nextUrl.pathname
        
        if (ADMIN_PATHS.some(item => pathname.startsWith(item))) {
          return token?.role === '00'
        }
        return true
      },
    },
  },
)

export const config = {
  matcher: ['/api/:path*'],
};
