import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { type NavItem, type SharedData } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { Download, LayoutGrid, Upload, Users, FileEdit, Printer, BarChart3 } from 'lucide-react';
import AppLogo from './app-logo';

// Navigation items berdasarkan role
const getNavigationItems = (userRole: string): NavItem[] => {
    switch (userRole) {
        case 'admin':
            return [
                {
                    title: 'Dashboard',
                    href: '/admin/dashboard',
                    icon: LayoutGrid,
                },
                {
                    title: 'Surat Masuk',
                    href: '/admin/surat-masuk',
                    icon: Download,
                },
                {
                    title: 'Manajemen User',
                    href: '/admin/users',
                    icon: Users,
                },
            ];
        
        case 'kepala':
            return [
                {
                    title: 'Dashboard',
                    href: '/kepala/dashboard',
                    icon: LayoutGrid,
                },
                {
                    title: 'Disposisi Surat',
                    href: '/kepala/disposisi',
                    icon: FileEdit,
                },
                {
                    title: 'Riwayat',
                    href: '/kepala/riwayat',
                    icon: BarChart3,
                },
            ];
        
        case 'pmo':
            return [
                {
                    title: 'Dashboard',
                    href: '/pmo/dashboard',
                    icon: LayoutGrid,
                },
                {
                    title: 'Disposisi Surat',
                    href: '/pmo/disposisi',
                    icon: FileEdit,
                },
                {
                    title: 'Laporan',
                    href: '/pmo/laporan',
                    icon: BarChart3,
                },
            ];
        
        case 'pegawai':
            return [
                {
                    title: 'Dashboard',
                    href: '/pegawai/dashboard',
                    icon: LayoutGrid,
                },
                {
                    title: 'Tugas Disposisi',
                    href: '/pegawai/tugas',
                    icon: FileEdit,
                },
            ];
        
        default:
            return [
                {
                    title: 'Dashboard',
                    href: '/dashboard',
                    icon: LayoutGrid,
                },
                {
                    title: 'Surat Keluar',
                    href: '/surat-keluar',
                    icon: Upload,
                },
                {
                    title: 'Surat Masuk',
                    href: '/surat-masuk',
                    icon: Download,
                },
            ];
    }
};

// const footerNavItems: NavItem[] = [
//     {
//         title: 'Repository',
//         href: 'https://github.com/laravel/react-starter-kit',
//         icon: Folder,
//     },
//     {
//         title: 'Documentation',
//         href: 'https://laravel.com/docs/starter-kits#react',
//         icon: BookOpen,
//     },
// ];

export function AppSidebar() {
    const { auth } = usePage<SharedData>().props;
    const userRole = (auth.user as any).role || 'default';
    const navigationItems = getNavigationItems(userRole);
    
    // Dashboard link berdasarkan role
    const getDashboardLink = (role: string): string => {
        switch (role) {
            case 'admin':
                return '/admin/dashboard';
            case 'kepala':
                return '/kepala/dashboard';
            case 'pmo':
                return '/pmo/dashboard';
            case 'pegawai':
                return '/pegawai/dashboard';
            default:
                return '/dashboard';
        }
    };

    return (
        <Sidebar collapsible="icon" variant="sidebar">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={getDashboardLink(userRole)} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={navigationItems} />
            </SidebarContent>

            <SidebarFooter>
                {/* <NavFooter items={footerNavItems} className="mt-auto" /> */}
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
