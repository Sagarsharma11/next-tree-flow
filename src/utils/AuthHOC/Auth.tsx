"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { verifyToken } from "../apis/api";

//@ts-ignore
function Auth<P extends JSX.IntrinsicAttributes>(WrappedComponent: React.ComponentType<P>) {
  const HOC: React.FC<P> = (props) => {
    const router = useRouter();
    const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

    useEffect(() => {
      const verifyAuth = async () => {
        const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

        if (!token) {
          router.replace("/login");
          return;
        }

        try {
          // **Send request to backend to verify token**
          const response = await verifyToken(token)
          console.log("dashboard response ", response)
          if (response.status === 200) {
            setIsAuthenticated(true);   
          } else {
            localStorage.removeItem("token");
            router.replace("/login");
          }
        } catch (error) {
          console.error("Token validation failed:", error);
          localStorage.removeItem("token");
          router.replace("/login");
        }
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
