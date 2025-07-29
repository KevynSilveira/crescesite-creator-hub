import { useState } from "react"
import { Home, Briefcase, Mail, Users, Settings, User } from "lucide-react"
import { NavLink, useLocation } from "react-router-dom"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
  SidebarHeader,
} from "@/components/ui/sidebar"

const publicItems = [
  { title: "Início", url: "/", icon: Home },
  { title: "Serviços", url: "/services", icon: Briefcase },
  { title: "Contato", url: "/contact", icon: Mail },
]

const adminItems = [
  { title: "Painel Admin", url: "/admin", icon: Settings },
  { title: "Gerenciar Empresa", url: "/admin/company", icon: User },
  { title: "Gerenciar Serviços", url: "/admin/services", icon: Briefcase },
  { title: "Contatos Recebidos", url: "/admin/contacts", icon: Users },
]

export function AppSidebar() {
  const { state } = useSidebar()
  const location = useLocation()
  const currentPath = location.pathname
  const collapsed = state === "collapsed"

  const isActive = (path: string) => currentPath === path
  const getNavCls = ({ isActive }: { isActive: boolean }) =>
    isActive 
      ? "bg-primary text-primary-foreground shadow-sm" 
      : "hover:bg-accent hover:text-accent-foreground transition-smooth"

  return (
    <Sidebar
      className={collapsed ? "w-14" : "w-64"}
      collapsible="icon"
    >
      <SidebarHeader className="border-b border-sidebar-border p-4">
        {!collapsed && (
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 gradient-tech rounded-lg flex items-center justify-center text-white font-bold">
              C
            </div>
            <span className="text-lg font-bold gradient-primary bg-clip-text text-transparent">
              CresceSite
            </span>
          </div>
        )}
        {collapsed && (
          <div className="w-8 h-8 gradient-tech rounded-lg flex items-center justify-center text-white font-bold mx-auto">
            C
          </div>
        )}
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Menu Principal</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {publicItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink to={item.url} end className={getNavCls}>
                      <item.icon className="w-4 h-4" />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Administração</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {adminItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink to={item.url} className={getNavCls}>
                      <item.icon className="w-4 h-4" />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}