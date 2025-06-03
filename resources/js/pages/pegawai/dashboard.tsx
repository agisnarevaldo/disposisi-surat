import React from 'react';
import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
    FileEdit, 
    Clock, 
    CheckCircle, 
    ArrowRight,
    TrendingUp,
    Calendar,
    Mail,
    User,
    AlertCircle
} from 'lucide-react';
import { BreadcrumbItem } from '@/types';

interface DashboardData {
    totalTugas: number;
    tugasMenunggu: number;
    tugasSelesai: number;
    avgCompletionTime: number;
    recentTugas: Array<{
        id: number;
        nomor_surat: string;
        perihal: string;
        tanggal_masuk: string;
        status_disposisi: string;
        pmo?: { name: string };
        disposisi_at?: string;
    }>;
}

interface DashboardProps {
    auth: {
        user: {
            id: number;
            name: string;
            email: string;
            role: string;
            can_dispose: boolean;
        };
    };
    flash?: {
        success?: string;
        error?: string;
    };
    dashboardData: DashboardData;
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard Pegawai',
        href: '/dashboard/pegawai',
    }
];

export default function PegawaiDashboard({ auth, flash, dashboardData }: DashboardProps) {
    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'pegawai':
                return <Badge variant="default" className="bg-blue-50 text-blue-700 border-blue-200">
                    <Clock className="w-3 h-3 mr-1" />
                    Perlu Ditangani
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

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard Pegawai" />

            <div className="container mx-auto p-4 space-y-4">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Dashboard Pegawai</h1>
                        <p className="text-gray-600">Selamat datang, {auth.user.name}</p>
                    </div>
                    <div className="flex items-center gap-3">
                        {auth.user.can_dispose ? (
                            <Link href={route('pegawai.tugas.index')}>
                                <Button>
                                    <FileEdit className="h-4 w-4 mr-2" />
                                    Kelola Tugas
                                </Button>
                            </Link>
                        ) : (
                            <Link href={route('tugas-saya.index')}>
                                <Button>
                                    <FileEdit className="h-4 w-4 mr-2" />
                                    Tugas Saya
                                </Button>
                            </Link>
                        )}
                    </div>
                </div>

                {/* Flash Messages */}
                {flash?.success && (
                    <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-md">
                        {flash.success}
                    </div>
                )}
                {flash?.error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
                        {flash.error}
                    </div>
                )}

                {/* Statistics Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <Card>
                        <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600">Total Tugas</p>
                                    <p className="text-2xl font-bold">{dashboardData.totalTugas}</p>
                                </div>
                                <Mail className="h-8 w-8 text-blue-600" />
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600">Perlu Ditangani</p>
                                    <p className="text-2xl font-bold text-yellow-600">{dashboardData.tugasMenunggu}</p>
                                </div>
                                <Clock className="h-8 w-8 text-yellow-600" />
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600">Selesai</p>
                                    <p className="text-2xl font-bold text-green-600">{dashboardData.tugasSelesai}</p>
                                </div>
                                <CheckCircle className="h-8 w-8 text-green-600" />
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600">Rata-rata (hari)</p>
                                    <p className="text-2xl font-bold text-purple-600">{dashboardData.avgCompletionTime}</p>
                                </div>
                                <TrendingUp className="h-8 w-8 text-purple-600" />
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Quick Actions */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Recent Tugas */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <TrendingUp className="h-5 w-5" />
                                Tugas Terbaru
                            </CardTitle>
                            <CardDescription>
                                Tugas yang memerlukan tindakan dari Anda
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {dashboardData.recentTugas.length > 0 ? (
                                    dashboardData.recentTugas.slice(0, 5).map((tugas) => (
                                        <div key={tugas.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 transition-colors">
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <p className="text-sm font-medium text-gray-900 truncate">
                                                        {tugas.nomor_surat}
                                                    </p>
                                                    {getStatusBadge(tugas.status_disposisi)}
                                                </div>
                                                <p className="text-sm text-gray-600 truncate">{tugas.perihal}</p>
                                                <div className="flex items-center gap-4 text-xs text-gray-500 mt-1">
                                                    <span className="flex items-center gap-1">
                                                        <Calendar className="w-3 h-3" />
                                                        {new Date(tugas.tanggal_masuk).toLocaleDateString('id-ID')}
                                                    </span>
                                                    {tugas.pmo && (
                                                        <span>Dari: {tugas.pmo.name}</span>
                                                    )}
                                                </div>
                                            </div>
                                            <Link 
                                                href={auth.user.can_dispose ? route('pegawai.tugas.show', tugas.id) : route('tugas-saya.show', tugas.id)}
                                                className="ml-3"
                                            >
                                                <Button size="sm" variant="outline">
                                                    <ArrowRight className="h-4 w-4" />
                                                </Button>
                                            </Link>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-center py-6 text-gray-500">
                                        <Mail className="h-8 w-8 mx-auto mb-2 opacity-50" />
                                        <p>Tidak ada tugas yang perlu ditangani</p>
                                    </div>
                                )}
                            </div>
                            {dashboardData.recentTugas.length > 5 && (
                                <div className="mt-4 pt-4 border-t">
                                    <Link href={auth.user.can_dispose ? route('pegawai.tugas.index') : route('tugas-saya.index')}>
                                        <Button variant="outline" className="w-full">
                                            Lihat Semua Tugas
                                            <ArrowRight className="h-4 w-4 ml-2" />
                                        </Button>
                                    </Link>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Quick Links */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <User className="h-5 w-5" />
                                Menu Cepat
                            </CardTitle>
                            <CardDescription>
                                Akses cepat ke fitur utama
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                {auth.user.can_dispose ? (
                                    <>
                                        <Link href={route('pegawai.tugas.index')}>
                                            <Button variant="outline" className="w-full justify-start">
                                                <FileEdit className="h-4 w-4 mr-2" />
                                                Kelola Tugas Disposisi
                                            </Button>
                                        </Link>
                                        
                                        {dashboardData.tugasMenunggu > 0 && (
                                            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <AlertCircle className="h-4 w-4 text-yellow-600" />
                                                    <h4 className="font-medium text-yellow-900">Perhatian!</h4>
                                                </div>
                                                <p className="text-sm text-yellow-700">
                                                    Anda memiliki {dashboardData.tugasMenunggu} tugas yang perlu segera ditangani atau didelegasikan.
                                                </p>
                                                <Link href={route('pegawai.tugas.index')} className="mt-2 inline-block">
                                                    <Button size="sm" variant="outline" className="border-yellow-300 hover:bg-yellow-100">
                                                        Kelola Tugas
                                                    </Button>
                                                </Link>
                                            </div>
                                        )}

                                        <div className="pt-4 border-t">
                                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                                <h4 className="font-medium text-blue-900 mb-2">Tips Pegawai dengan Privilege</h4>
                                                <p className="text-sm text-blue-700">
                                                    Sebagai pegawai dengan privilege disposisi, Anda dapat menyelesaikan tugas sendiri atau mendelegasikannya ke pegawai lain. Prioritaskan berdasarkan urgensi dan beban kerja tim.
                                                </p>
                                            </div>
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <Link href={route('tugas-saya.index')}>
                                            <Button variant="outline" className="w-full justify-start">
                                                <FileEdit className="h-4 w-4 mr-2" />
                                                Lihat Tugas Saya
                                            </Button>
                                        </Link>
                                        
                                        {dashboardData.tugasMenunggu > 0 && (
                                            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <AlertCircle className="h-4 w-4 text-yellow-600" />
                                                    <h4 className="font-medium text-yellow-900">Perhatian!</h4>
                                                </div>
                                                <p className="text-sm text-yellow-700">
                                                    Anda memiliki {dashboardData.tugasMenunggu} tugas yang perlu segera diselesaikan.
                                                </p>
                                                <Link href={route('tugas-saya.index')} className="mt-2 inline-block">
                                                    <Button size="sm" variant="outline" className="border-yellow-300 hover:bg-yellow-100">
                                                        Lihat Tugas
                                                    </Button>
                                                </Link>
                                            </div>
                                        )}

                                        <div className="pt-4 border-t">
                                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                                <h4 className="font-medium text-blue-900 mb-2">Tips Pegawai</h4>
                                                <p className="text-sm text-blue-700">
                                                    Prioritaskan tugas berdasarkan urgensi dan tanggal masuk surat. Jangan lupa untuk menandai tugas sebagai selesai setelah Anda menyelesaikannya.
                                                </p>
                                            </div>
                                        </div>
                                    </>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}
