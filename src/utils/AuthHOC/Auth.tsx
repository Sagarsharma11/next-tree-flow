// "use client";

// import { useEffect, useState } from "react";
// import { useRouter } from "next/navigation";
// import { refreshToken, verifyToken } from "../apis/api";

// //@ts-ignore
// function Auth<P extends JSX.IntrinsicAttributes>(WrappedComponent: React.ComponentType<P>) {
//   const HOC: React.FC<P> = (props) => {
//     const router = useRouter();
//     const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

//     useEffect(() => {
//       // console.log("Auth is running")
//       const verifyAuth = async () => {
//         const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

//         if (!token) {
//           router.replace("/login");
//           return;
//         }

//         try {
//           // **Send request to backend to verify token**
//           // console.log("token", token)
//           const cleanToken = token.replace(/['"]+/g, "");
//           const response = await verifyToken(cleanToken)
//           // console.log("dashboard response ", response)
//           //@ts-ignore
//           if (response?.status === 200) {
//             // console.log("Token verified")
//             setIsAuthenticated(true);   
//           } else {
//             const ref_token = typeof window !== "undefined" ? localStorage.getItem("refresh_token") : null;
//             const refreshToken = ref_token?.replace(/['"]+/g, "");
//             if(refreshToken){
//               const response =  await refreshToken(refreshToken);

//             }

//             localStorage.removeItem("token");
//             router.replace("/login");
//           }
//           console.log("done ")
//         } catch (error) {
//           console.error("Token validation failed:", error);
//           localStorage.removeItem("token");
//           router.replace("/login");
//         }
//       };

//       verifyAuth();
//     }, []);

//     if (isAuthenticated === null) {
//       return null; // Prevents flicker while checking auth
//     }

//     return <WrappedComponent {...props} />;
//   };

//   return HOC;
// }

// export default Auth;

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { refreshToken as refreshTokenAPI, verifyToken } from "../apis/api";

//@ts-ignore
function Auth<P extends JSX.IntrinsicAttributes>(WrappedComponent: React.ComponentType<P>) {
  const HOC: React.FC<P> = (props) => {
    const router = useRouter();
    const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

    useEffect(() => {
      const verifyAuth = async () => {
        const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

        if (!token) {
          handleLogout();
          return;
        }

        try {
          const cleanToken = token.replace(/['"]+/g, "");
          const response = await verifyToken(cleanToken);

          if (response?.status === 200) {
            setIsAuthenticated(true);
          } else {
            console.warn("Access token invalid, attempting refresh...");
            await attemptRefreshToken();
          }
        } catch (error) {
          console.error("Token validation failed:", error);
          await attemptRefreshToken();
        }
      };

      const attemptRefreshToken = async () => {
        const refToken = typeof window !== "undefined" ? localStorage.getItem("refresh_token") : null;

        if (!refToken) {
          console.warn("No refresh token found, logging out...");
          handleLogout();
          return;
        }

        try {
          const cleanRefreshToken = refToken.replace(/['"]+/g, "");
          const response = await refreshTokenAPI(cleanRefreshToken);

          if (response?.status === 200 && response.data?.accessToken) {
            console.log("Refresh successful, updating tokens...");
            localStorage.setItem("token", response.data.accessToken);
            localStorage.setItem("refresh_token", response.data.refreshToken);
            await verifyAuth(); // Retry authentication with new token
          } else {
            console.warn("Refresh token expired or invalid, logging out...");
            handleLogout();
          }
        } catch (error) {
          console.error("Refresh token request failed:", error);
          handleLogout();
        }
      };

      const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("refresh_token");
        router.replace("/login");
      };

      verifyAuth();
    }, []);

    if (isAuthenticated === null) {
      return null; // Prevents flicker while checking auth
    }

    return <WrappedComponent {...props} />;
  };

  return HOC;
}

export default Auth;