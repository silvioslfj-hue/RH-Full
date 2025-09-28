import Link from "next/link"
import Image from "next/image"
import { PlaceHolderImages } from "@/lib/placeholder-images"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { User, LogOut, Bell, CalendarCheck, UserPlus } from "lucide-react"

const notifications = [
  {
    title: "Nova solicitação de ausência",
    description: "Bob Williams solicitou licença médica para 01/08.",
    icon: <CalendarCheck className="h-4 w-4 text-primary" />,
  },
  {
    title: "Novo funcionário adicionado",
    description: "George Harrison foi adicionado ao departamento de Marketing.",
    icon: <UserPlus className="h-4 w-4 text-green-500" />,
  },
];

export function UserNav() {
  const companyLogo = PlaceHolderImages.find(p => p.id === 'company-logo');

  return (
    <div className="flex items-center gap-2">
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            <span className="absolute top-1.5 right-1.5 flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
            </span>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80" align="end">
           <div className="p-2">
            <h3 className="font-medium">Notificações</h3>
            <p className="text-sm text-muted-foreground">Você tem {notifications.length} novas notificações.</p>
          </div>
          <div className="mt-2 space-y-2">
            {notifications.map((notification, index) => (
              <div
                key={index}
                className="flex items-start gap-3 rounded-lg p-2 hover:bg-muted/50"
              >
                <div className="mt-1">{notification.icon}</div>
                <div>
                  <p className="text-sm font-medium">{notification.title}</p>
                  <p className="text-xs text-muted-foreground">
                    {notification.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
           <div className="mt-2 border-t pt-2">
             <Button variant="ghost" size="sm" className="w-full">Ver todas as notificações</Button>
           </div>
        </PopoverContent>
      </Popover>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative h-8 w-8 rounded-full">
            <Avatar className="h-9 w-9">
              {companyLogo && (
                 <AvatarImage 
                    src={companyLogo.imageUrl} 
                    alt="Company Logo" 
                    data-ai-hint={companyLogo.imageHint}
                    className="p-1"
                  />
              )}
              <AvatarFallback>JD</AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end" forceMount>
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">Jane Doe</p>
              <p className="text-xs leading-none text-muted-foreground">
                jane.doe@example.com
              </p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem asChild>
              <Link href="/profile">
                <User className="mr-2" />
                <span>Perfil</span>
              </Link>
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <Link href="/">
              <LogOut className="mr-2" />
              <span>Sair</span>
            </Link>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
