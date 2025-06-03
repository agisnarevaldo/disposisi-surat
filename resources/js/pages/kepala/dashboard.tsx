import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
    FileText, 
    Clock, 
    CheckCircle, 
    AlertCircle, 
    TrendingUp,
    Eye,
    UserCheck,
    Calendar,
    ArrowRight,
    Mail
} from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard Kepala',
        href: '/kepala/dashboard',
    },
];

interface DashboardData {
    totalSurat: number;
    menungguDisposisi: number;
    sudahDisposisi: number;
    suratSelesai: number;
    recentSurat: Array<{
        id: number;
        nomor_surat: string;
        perihal: string;
        tanggal_masuk: string;
        status_disposisi: string;
        pengirim: string;
        pmo?: { name: string };
        pegawai?: { name: string };
        prioritas: string;
        created_at: string;
    }>;
}

interface DashboardProps {
    auth: {
        user: {
            name: string;
            role: string;
        };
    };
    flash?: {
        success?: string;
        error?: string;
    };
    dashboardData: DashboardData;
}

export default function KepalaaDashboard({ auth, flash, dashboardData }: DashboardProps) {
    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'diajukan':
                return <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">
                    <Clock className="w-3 h-3 mr-1" />
                    Menunggu Disposisi
                </Badge>;
            case 'pmo':
                return <Badge variant="default" className="bg-blue-50 text-blue-700 border-blue-200">
                    <UserCheck className="w-3 h-3 mr-1" />
                    Dengan PMO
                </Badge>;
            case 'pegawai':
                return <Badge variant="default" className="bg-indigo-50 text-indigo-700 border-indigo-200">
                    <UserCheck className="w-3 h-3 mr-1" />
                    Dengan Pegawai
                </Badge>;
            case 'selesai':
                return <Badge variant="default" className="bg-green-50 text-green-700 border-green-200">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Selesai
                </Badge>;
            default:
                return <Badge variant="secondary">{status}</Badge>;
        }
    };

    const getPrioritasBadge = (prioritas: string) => {
        switch (prioritas) {
            case 'tinggi':
                return <Badge variant="destructive" className="text-xs">Tinggi</Badge>;
            case 'sedang':
                return <Badge variant="default" className="text-xs">Sedang</Badge>;
            case 'rendah':
                return <Badge variant="secondary" className="text-xs">Rendah</Badge>;
            default:
                return <Badge variant="secondary" className="text-xs">Sedang</Badge>;
        }
    };
    // Format tanggal untuk display
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('id-ID', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard Kepala" />

            <div className="container mx-auto p-4 space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">
                            Selamat datang, {auth.user.name}
                        </h1>
                        <p className="text-gray-600">Dashboard Kepala - Kelola disposisi surat masuk</p>
                    </div>
                    <div className="flex items-center space-x-2">
                        <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                            <UserCheck className="w-3 h-3 mr-1" />
                            Kepala
                        </Badge>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Surat Masuk</CardTitle>
                            <FileText className="h-4 w-4 text-blue-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-blue-600">{dashboardData.totalSurat}</div>
                            <p className="text-xs text-muted-foreground">Bulan ini</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Menunggu Disposisi</CardTitle>
                            <Clock className="h-4 w-4 text-orange-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-orange-600">{dashboardData.menungguDisposisi}</div>
                            <p className="text-xs text-muted-foreground">Perlu tindakan segera</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Sudah Disposisi</CardTitle>
                            <CheckCircle className="h-4 w-4 text-green-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-green-600">{dashboardData.sudahDisposisi}</div>
                            <p className="text-xs text-muted-foreground">Bulan ini</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Surat Selesai</CardTitle>
                            <AlertCircle className="h-4 w-4 text-green-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-green-600">{dashboardData.suratSelesai}</div>
                            <p className="text-xs text-muted-foreground">Telah diselesaikan</p>
                        </CardContent>
                    </Card>
                </div>

                {/* Quick Actions */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <TrendingUp className="h-5 w-5" />
                            Aksi Cepat
                        </CardTitle>
                        <CardDescription>
                            Akses cepat ke fitur utama dashboard kepala
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <Link href={route('kepala.disposisi.index')}>
                                <Button className="h-auto p-4 flex flex-col items-center space-y-2" variant="outline">
                                    <Eye className="h-6 w-6" />
                                    <span>Lihat Surat Masuk</span>
                                    <Badge variant="secondary">{dashboardData.menungguDisposisi} pending</Badge>
                                </Button>
                            </Link>
                            
                            <Link href={route('kepala.disposisi.index')}>
                                <Button className="h-auto p-4 flex flex-col items-center space-y-2" variant="outline">
                                    <FileText className="h-6 w-6" />
                                    <span>Disposisi Cepat</span>
                                    <Badge variant="secondary">Proses disposisi</Badge>
                                </Button>
                            </Link>
                            
                            <Link href={route('kepala.riwayat.index')}>
                                <Button className="h-auto p-4 flex flex-col items-center space-y-2" variant="outline">
                                    <Calendar className="h-6 w-6" />
                                    <span>Riwayat Disposisi</span>
                                    <Badge variant="secondary">Lihat riwayat</Badge>
                                </Button>
                            </Link>
                        </div>
                    </CardContent>
                </Card>

                {/* Recent Surat Masuk */}
                <Card>
                    <CardHeader>
                        <CardTitle>Surat Masuk Terbaru</CardTitle>
                        <CardDescription>
                            Surat masuk yang memerlukan perhatian Anda
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {dashboardData.recentSurat.length > 0 ? (
                                dashboardData.recentSurat.map((surat) => (
                                    <div key={surat.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-1">
                                                <h4 className="font-medium">{surat.nomor_surat}</h4>
                                                {getPrioritasBadge(surat.prioritas)}
                                            </div>
                                            <p className="text-sm text-gray-600">{surat.perihal}</p>
                                            <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                                                <span>Pengirim: {surat.pengirim}</span>
                                                <span>Tanggal: {new Date(surat.tanggal_masuk).toLocaleDateString('id-ID')}</span>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            {getStatusBadge(surat.status_disposisi)}
                                            <Link href={route('kepala.disposisi.show', surat.id)}>
                                                <Button size="sm" variant="ghost">
                                                    <Eye className="h-4 w-4" />
                                                </Button>
                                            </Link>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-6 text-gray-500">
                                    <Mail className="h-8 w-8 mx-auto mb-2 opacity-50" />
                                    <p>Tidak ada surat terbaru</p>
                                </div>
                            )}
                        </div>
                        <div className="mt-4 pt-4 border-t">
                            <Link href={route('kepala.disposisi.index')}>
                                <Button variant="outline" className="w-full">
                                    <ArrowRight className="h-4 w-4 mr-2" />
                                    Lihat Semua Surat Masuk
                                </Button>
                            </Link>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
