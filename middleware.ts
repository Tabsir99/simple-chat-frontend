import { NextRequest, NextResponse } from "next/server";
import { jwtVerify, errors, SignJWT } from "jose";

export default async function middleware(req: NextRequest) {
  const accessToken = req.cookies.get("accessToken")?.value;
  const refreshToken = req.cookies.get("refreshToken")?.value;
  const currentPath = req.nextUrl.pathname;
  const hostname = process.env.NEXT_PUBLIC_FRONTEND_URL;

  console.log(currentPath);

  const accessSecret = process.env.JWT_SECRET_ACCESS;
  const refreshSecret = process.env.JWT_SECRET_REFRESH;

  function clearTokensAndRedirect() {
    const response = NextResponse.redirect(hostname as string);
    response.cookies.delete("accessToken");
    response.cookies.delete("refreshToken");
    return response;
  }

  async function refreshAccessToken() {
    if (refreshToken) {
      try {
        const { payload } = await jwtVerify(
          refreshToken,
          new TextEncoder().encode(refreshSecret)
        );
        const newAccessToken = await new SignJWT({
          id: payload.id,
          email: payload.email,
          user_status: payload.user_status,
          username: payload.username,
        })
          .setProtectedHeader({ alg: "HS256" })
          .setIssuedAt()
          .setExpirationTime("1h")
          .sign(new TextEncoder().encode(accessSecret));

        const response = NextResponse.next();
        response.cookies.set("accessToken", newAccessToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
          maxAge: 3600 * 1000, // Set cookie expiration to 4 hours
          domain: `.${process.env.HOSTNAME}`,
        });
        return response;
      } catch (error) {
        console.log(
          "Refresh token verification failed:",
          (error as Error).message
        );
        return clearTokensAndRedirect();
      }
    } else {
      return clearTokensAndRedirect();
    }
  }

  // If there's no access token but there's a refresh token, try to refresh
  if (!accessToken && refreshToken) {
    return await refreshAccessToken();
  }

  // If there are no tokens at all, redirect to login (except for the home page)
  if (!accessToken && !refreshToken) {
    console.log("No tokens");
    if (currentPath !== "/") {
      return NextResponse.redirect(hostname as string);
    }
    return NextResponse.next();
  }

  // Verify the access token
  try {
    await jwtVerify(accessToken!, new TextEncoder().encode(accessSecret));
    console.log("Access token verified");
    if (currentPath === "/") {
      return NextResponse.redirect(`${hostname}/chats`);
    }
  } catch (error) {
    if (error instanceof errors.JWTExpired) {
      console.log("Access token expired, attempting to refresh");
      return await refreshAccessToken();
    } else {
      console.log(
        "Access token verification failed:",
        (error as Error).message
      );
      return clearTokensAndRedirect();
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/chats/:path*", "/profile/:path*", "/search-people/:path*", "/"],
};
