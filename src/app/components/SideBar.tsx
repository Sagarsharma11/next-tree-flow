import {useEffect, useState} from "react"

import { SearchForm } from "../components/SearchForm"
import { VersionSwitcher } from "../components/VersionSwitcher"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar"
import { logout } from "@/utils/apis/api"
import { getLocalStorage, removeLocalStorage } from "@/utils/localstorage/localStorage"

// This is sample data.
const data = {
  versions: ["1.0.1", 
    // "1.1.0-alpha", "2.0.0-beta1"


  ],
  navMain: [
    {
      title: "Getting Started",
      url: "#",
      items: [
        // {
        //   title: "Cloud Scanner",
        //   url: "/cloud-scanner",
        //   isActive: true,
        // },
        {
          title: "Secure Code",
          url: "/secure-code",
          isActive: true,
        },
      ],
    },
    // {
    //   title: "Building Your Application",
    //   url: "#",
    //   items: [
    //     {
    //       title: "Routing",
    //       url: "#",
    //     },
    //     {
    //       title: "Data Fetching",
    //       url: "#",
    //       isActive: true,
    //     },
    //     {
    //       title: "Rendering",
    //       url: "#",
    //     },
    //     {
    //       title: "Caching",
    //       url: "#",
    //     },
    //     {
    //       title: "Styling",
    //       url: "#",
    //     },
    //     {
    //       title: "Optimizing",
    //       url: "#",
    //     },
    //     {
    //       title: "Configuring",
    //       url: "#",
    //     },
    //     {
    //       title: "Testing",
    //       url: "#",
    //     },
    //     {
    //       title: "Authentication",
    //       url: "#",
    //     },
    //     {
    //       title: "Deploying",
    //       url: "#",
    //     },
    //     {
    //       title: "Upgrading",
    //       url: "#",
    //     },
    //     {
    //       title: "Examples",
    //       url: "#",
    //     },
    //   ],
    // },
    // {
    //   title: "API Reference",
    //   url: "#",
    //   items: [
    //     {
    //       title: "Components",
    //       url: "#",
    //     },
    //     {
    //       title: "File Conventions",
    //       url: "#",
    //     },
    //     {
    //       title: "Functions",
    //       url: "#",
    //     },
    //     {
    //       title: "next.config.js Options",
    //       url: "#",
    //     },
    //     {
    //       title: "CLI",
    //       url: "#",
    //     },
    //     {
    //       title: "Edge Runtime",
    //       url: "#",
    //     },
    //   ],
    // },
    // {
    //   title: "Architecture",
    //   url: "#",
    //   items: [
    //     {
    //       title: "Accessibility",
    //       url: "#",
    //     },
    //     {
    //       title: "Fast Refresh",
    //       url: "#",
    //     },
    //     {
    //       title: "Next.js Compiler",
    //       url: "#",
    //     },
    //     {
    //       title: "Supported Browsers",
    //       url: "#",
    //     },
    //     {
    //       title: "Turbopack",
    //       url: "#",
    //     },
    //   ],
    // },
    {
      title: "Actions",
      url: "#",
      items: [
        {
          title: "Logout",
          url: "#",
        },
      ],
    }
  ],
}

export function AppSideBar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const handleClick = async () => {
    const accessToken = getLocalStorage("token")?.replace(/['"]+/g, "") || "";
    const refreshToken = getLocalStorage("refresh_token")?.replace(/['"]+/g, "") || "";
  
    try {
      if (accessToken && refreshToken) {
        // const result = await logout(accessToken, refreshToken);
        // if (result.status === 200) {
        //   removeLocalStorage("token");
        //   removeLocalStorage("refresh_token");
        // }
      }
    } catch (error) {
      console.error("Logout failed", error);
    } finally {
      removeLocalStorage("token");
      removeLocalStorage("refresh_token");

      if (typeof window !== "undefined") {
        window.location.reload();
      }
    }
  };
  

  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <VersionSwitcher
          versions={data.versions}
          defaultVersion={data.versions[0]}
        />
        <SearchForm />
      </SidebarHeader>
      <SidebarContent>
        {/* We create a SidebarGroup for each parent. */}
        {data.navMain.map((item) => (
          <SidebarGroup key={item.title}>
            <SidebarGroupLabel>{item.title}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {item.items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    
                    <SidebarMenuButton asChild isActive={item.isActive}>
                      {
                        item.title === "Logout" ?
                          <button className="border cursor-pointer"
                            onClick={handleClick}
                           >{item.title}</button>
                          : <a href={item.url}>{item.title}</a>
                      }
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  )
}
