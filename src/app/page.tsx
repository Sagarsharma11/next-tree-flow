"use client"
import Auth from "@/utils/AuthHOC/Auth";
import Dashboard from "./dashboard/page";

const Home = () =>{
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
          Home page 
      </div>
    </div>
  );
}

export default Auth(Home)