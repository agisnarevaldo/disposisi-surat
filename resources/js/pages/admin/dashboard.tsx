import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
    Users, 
    UserPlus, 
    Mail, 
    FileText,
    Shield,
    TrendingUp,
    BarChart3,
    Plus
} from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard Admin',
        href: '/admin/dashboard',
    },
];

interface UserStats {
    total: number;
    admin: number;
    kepala: number;
    pmo: number;
    pegawai: number;
    can_dispose: number;
}

interface SuratStats {
    total: number;
    draft: number;
    diajukan: number;
    selesai: number;
}

interface DashboardProps {
    auth: {
        user: {
            name: string;
        };
    };
    userStats?: UserStats;
    suratStats?: SuratStats;
}
export default function Dashboard({ auth, userStats, suratStats }: DashboardProps) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard Admin" />
            
            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Dashboard Admin</h1>
                        <p className="text-gray-600">Selamat datang, {auth.user.name}</p>
                    </div>
                    <div className="flex space-x-3">
                        <Link href="/admin/users/create">
                            <Button>
                                <UserPlus className="mr-2 h-4 w-4" />
                                Tambah User
                            </Button>
                        </Link>
                        <Link href="/admin/surat-masuk/create">
                            <Button variant="outline">
                                <Plus className="mr-2 h-4 w-4" />
                                Surat Masuk Baru
                            </Button>
                        </Link>
                    </div>
                </div>

                {/* User Statistics */}
                <div>
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">Statistik Pengguna</h2>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                        <Card>
                            <CardContent className="p-4">
                                <div className="flex items-center space-x-2">
                                    <Users className="h-5 w-5 text-blue-600" />
                                    <div>
                                        <p className="text-2xl font-bold">{userStats?.total || 0}</p>
                                        <p className="text-sm text-gray-600">Total User</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardContent className="p-4">
                                <div className="flex items-center space-x-2">
                                    <Shield className="h-5 w-5 text-red-600" />
                                    <div>
                                        <p className="text-2xl font-bold">{userStats?.admin || 0}</p>
                                        <p className="text-sm text-gray-600">Admin</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardContent className="p-4">
                                <div className="flex items-center space-x-2">
                                    <Users className="h-5 w-5 text-purple-600" />
                                    <div>
                                        <p className="text-2xl font-bold">{userStats?.kepala || 0}</p>
                                        <p className="text-sm text-gray-600">Kepala</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardContent className="p-4">
                                <div className="flex items-center space-x-2">
                                    <Users className="h-5 w-5 text-green-600" />
                                    <div>
                                        <p className="text-2xl font-bold">{userStats?.pmo || 0}</p>
                                        <p className="text-sm text-gray-600">PMO</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardContent className="p-4">
                                <div className="flex items-center space-x-2">
                                    <Users className="h-5 w-5 text-orange-600" />
                                    <div>
                                        <p className="text-2xl font-bold">{userStats?.pegawai || 0}</p>
                                        <p className="text-sm text-gray-600">Pegawai</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardContent className="p-4">
                                <div className="flex items-center space-x-2">
                                    <Shield className="h-5 w-5 text-yellow-600" />
                                    <div>
                                        <p className="text-2xl font-bold">{userStats?.can_dispose || 0}</p>
                                        <p className="text-sm text-gray-600">Hak Disposisi</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>

                {/* Surat Statistics */}
                <div>
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">Statistik Surat Masuk</h2>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <Card>
                            <CardContent className="p-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-gray-600">Total Surat</p>
                                        <p className="text-2xl font-bold">{suratStats?.total || 0}</p>
                                    </div>
                                    <Mail className="h-8 w-8 text-blue-600" />
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardContent className="p-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-gray-600">Draft</p>
                                        <p className="text-2xl font-bold text-gray-600">{suratStats?.draft || 0}</p>
                                    </div>
                                    <FileText className="h-8 w-8 text-gray-600" />
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardContent className="p-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-gray-600">Diajukan</p>
                                        <p className="text-2xl font-bold text-yellow-600">{suratStats?.diajukan || 0}</p>
                                    </div>
                                    <TrendingUp className="h-8 w-8 text-yellow-600" />
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardContent className="p-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-gray-600">Selesai</p>
                                        <p className="text-2xl font-bold text-green-600">{suratStats?.selesai || 0}</p>
                                    </div>
                                    <BarChart3 className="h-8 w-8 text-green-600" />
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* User Management */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Users className="h-5 w-5" />
                                Manajemen User
                            </CardTitle>
                            <CardDescription>
                                Kelola pengguna dan hak akses sistem
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                <Link href="/admin/users">
                                    <Button variant="outline" className="w-full justify-start">
                                        <Users className="h-4 w-4 mr-2" />
                                        Lihat Semua User
                                    </Button>
                                </Link>
                                <Link href="/admin/users/create">
                                    <Button variant="outline" className="w-full justify-start">
                                        <UserPlus className="h-4 w-4 mr-2" />
                                        Tambah User Baru
                                    </Button>
                                </Link>
                                
                                <div className="pt-3 border-t">
                                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                                        <h4 className="font-medium text-blue-900 mb-1">Tips Admin</h4>
                                        <p className="text-sm text-blue-700">
                                            Kelola privilege disposisi dengan hati-hati untuk menjaga alur kerja yang efisien.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Surat Management */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Mail className="h-5 w-5" />
                                Manajemen Surat
                            </CardTitle>
                            <CardDescription>
                                Kelola surat masuk dan proses disposisi
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                <Link href="/admin/surat-masuk">
                                    <Button variant="outline" className="w-full justify-start">
                                        <Mail className="h-4 w-4 mr-2" />
                                        Lihat Surat Masuk
                                    </Button>
                                </Link>
                                <Link href="/admin/surat-masuk/create">
                                    <Button variant="outline" className="w-full justify-start">
                                        <Plus className="h-4 w-4 mr-2" />
                                        Input Surat Baru
                                    </Button>
                                </Link>

                                <div className="pt-3 border-t">
                                    <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                                        <h4 className="font-medium text-green-900 mb-1">Status Sistem</h4>
                                        <div className="flex items-center gap-2">
                                            <Badge variant="secondary" className="bg-green-100 text-green-800">
                                                Sistem Normal
                                            </Badge>
                                            <span className="text-sm text-green-700">Semua fitur aktif</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}
