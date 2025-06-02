import React from 'react';
import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
    FileEdit, 
    Clock, 
    Users, 
    CheckCircle, 
    ArrowRight,
    TrendingUp,
    Calendar,
    Mail
} from 'lucide-react';
import { BreadcrumbItem } from '@/types';

interface DashboardData {
    totalSurat: number;
    suratMenunggu: number;
    suratProses: number;
    suratSelesai: number;
    recentSurat: Array<{
        id: number;
        nomor_surat: string;
        perihal: string;
        tanggal_masuk: string;
        status_disposisi: string;
        kepala?: { name: string };
        pegawai?: { name: string };
    }>;
}

interface DashboardProps {
    auth: {
        user: {
            id: number;
            name: string;
            email: string;
            role: string;
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
        title: 'Dashboard PMO',
        href: '/dashboard/pmo',
    }
];

export default function PMODashboard({ auth, flash, dashboardData }: DashboardProps) {
    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'pmo':
                return <Badge variant="default" className="bg-blue-50 text-blue-700 border-blue-200">
                    <Clock className="w-3 h-3 mr-1" />
                    Menunggu Disposisi
                </Badge>;
            case 'pegawai':
                return <Badge variant="default" className="bg-indigo-50 text-indigo-700 border-indigo-200">
                    <Users className="w-3 h-3 mr-1" />
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

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard PMO" />
            
            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Dashboard PMO</h1>
                        <p className="text-gray-600">Selamat datang, {auth.user.name}</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <Link href={route('pmo.disposisi.index')}>
                            <Button>
                                <FileEdit className="h-4 w-4 mr-2" />
                                Kelola Disposisi
                            </Button>
                        </Link>
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
                                    <p className="text-sm text-gray-600">Total Surat</p>
                                    <p className="text-2xl font-bold">{dashboardData.totalSurat}</p>
                                </div>
                                <Mail className="h-8 w-8 text-blue-600" />
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600">Menunggu Disposisi</p>
                                    <p className="text-2xl font-bold text-yellow-600">{dashboardData.suratMenunggu}</p>
                                </div>
                                <Clock className="h-8 w-8 text-yellow-600" />
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600">Dalam Proses</p>
                                    <p className="text-2xl font-bold text-blue-600">{dashboardData.suratProses}</p>
                                </div>
                                <Users className="h-8 w-8 text-blue-600" />
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600">Selesai</p>
                                    <p className="text-2xl font-bold text-green-600">{dashboardData.suratSelesai}</p>
                                </div>
                                <CheckCircle className="h-8 w-8 text-green-600" />
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Quick Actions */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Recent Surat */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <TrendingUp className="h-5 w-5" />
                                Surat Terbaru
                            </CardTitle>
                            <CardDescription>
                                Surat yang memerlukan tindakan dari Anda
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {dashboardData.recentSurat.length > 0 ? (
                                    dashboardData.recentSurat.slice(0, 5).map((surat) => (
                                        <div key={surat.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 transition-colors">
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <p className="text-sm font-medium text-gray-900 truncate">
                                                        {surat.nomor_surat}
                                                    </p>
                                                    {getStatusBadge(surat.status_disposisi)}
                                                </div>
                                                <p className="text-sm text-gray-600 truncate">{surat.perihal}</p>
                                                <div className="flex items-center gap-4 text-xs text-gray-500 mt-1">
                                                    <span className="flex items-center gap-1">
                                                        <Calendar className="w-3 h-3" />
                                                        {new Date(surat.tanggal_masuk).toLocaleDateString('id-ID')}
                                                    </span>
                                                    {surat.kepala && (
                                                        <span>Dari: {surat.kepala.name}</span>
                                                    )}
                                                </div>
                                            </div>
                                            <Link 
                                                href={route('pmo.disposisi.show', surat.id)}
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
                                        <p>Tidak ada surat yang memerlukan tindakan</p>
                                    </div>
                                )}
                            </div>
                            {dashboardData.recentSurat.length > 5 && (
                                <div className="mt-4 pt-4 border-t">
                                    <Link href={route('pmo.disposisi.index')}>
                                        <Button variant="outline" className="w-full">
                                            Lihat Semua Surat
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
                                <Users className="h-5 w-5" />
                                Menu Cepat
                            </CardTitle>
                            <CardDescription>
                                Akses cepat ke fitur utama
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                <Link href={route('pmo.disposisi.index')}>
                                    <Button variant="outline" className="w-full justify-start">
                                        <FileEdit className="h-4 w-4 mr-2" />
                                        Kelola Disposisi Surat
                                    </Button>
                                </Link>
                                
                                <Link href={route('pmo.laporan.index')}>
                                    <Button variant="outline" className="w-full justify-start">
                                        <TrendingUp className="h-4 w-4 mr-2" />
                                        Laporan & Monitoring
                                    </Button>
                                </Link>

                                <div className="pt-4 border-t">
                                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                        <h4 className="font-medium text-blue-900 mb-2">Tips PMO</h4>
                                        <p className="text-sm text-blue-700">
                                            Pastikan untuk mendisposisi surat ke pegawai yang tepat sesuai dengan bidang kerja dan beban tugas mereka.
                                        </p>
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
