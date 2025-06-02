import React, { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
    TrendingUp, 
    Calendar, 
    Users, 
    FileEdit, 
    Clock, 
    CheckCircle, 
    ArrowLeft,
    Download,
    Filter,
    BarChart3,
    PieChart,
    User
} from 'lucide-react';
import { BreadcrumbItem } from '@/types';

interface LaporanProps {
    auth: {
        user: {
            id: number;
            name: string;
            email: string;
            role: string;
        };
    };
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Laporan & Monitoring',
        href: '/pmo/laporan',
    },
    {
        title: 'PMO Dashboard',
        href: '/pmo/dashboard',
    }
];

export default function LaporanIndex({ auth }: LaporanProps) {
    const [dateFrom, setDateFrom] = useState('');
    const [dateTo, setDateTo] = useState('');
    const [reportType, setReportType] = useState('');

    // Mock data untuk demo
    const stats = {
        totalSurat: 85,
        suratMenunggu: 12,
        suratProses: 23,
        suratSelesai: 50,
        avgProcessingTime: 3.2
    };

    const monthlyData = [
        { month: 'Jan', masuk: 15, selesai: 12 },
        { month: 'Feb', masuk: 18, selesai: 16 },
        { month: 'Mar', masuk: 22, selesai: 19 },
        { month: 'Apr', masuk: 25, selesai: 23 },
        { month: 'Mei', masuk: 30, selesai: 28 },
        { month: 'Jun', masuk: 20, selesai: 18 }
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Laporan & Monitoring - PMO" />
            
            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Laporan & Monitoring</h1>
                        <p className="text-gray-600">Analisis kinerja dan statistik disposisi surat</p>
                    </div>
                    <Link href={route('pmo.dashboard')}>
                        <Button variant="outline">
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Kembali ke Dashboard
                        </Button>
                    </Link>
                </div>

                {/* Filter Section */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Filter className="h-5 w-5" />
                            Filter Laporan
                        </CardTitle>
                        <CardDescription>
                            Tentukan periode dan jenis laporan yang ingin ditampilkan
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <div>
                                <Label htmlFor="date-from">Tanggal Mulai</Label>
                                <Input
                                    id="date-from"
                                    type="date"
                                    value={dateFrom}
                                    onChange={(e) => setDateFrom(e.target.value)}
                                />
                            </div>
                            <div>
                                <Label htmlFor="date-to">Tanggal Akhir</Label>
                                <Input
                                    id="date-to"
                                    type="date"
                                    value={dateTo}
                                    onChange={(e) => setDateTo(e.target.value)}
                                />
                            </div>
                            <div>
                                <Label htmlFor="report-type">Jenis Laporan</Label>
                                <Select value={reportType} onValueChange={setReportType}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Pilih jenis laporan" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="summary">Ringkasan</SelectItem>
                                        <SelectItem value="detailed">Detail</SelectItem>
                                        <SelectItem value="performance">Kinerja Pegawai</SelectItem>
                                        <SelectItem value="monthly">Bulanan</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="flex items-end gap-2">
                                <Button className="flex-1">
                                    <BarChart3 className="h-4 w-4 mr-2" />
                                    Generate
                                </Button>
                                <Button variant="outline">
                                    <Download className="h-4 w-4 mr-2" />
                                    Export
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Summary Statistics */}
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                    <Card>
                        <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600">Total Surat</p>
                                    <p className="text-2xl font-bold">{stats.totalSurat}</p>
                                </div>
                                <FileEdit className="h-8 w-8 text-blue-600" />
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600">Menunggu</p>
                                    <p className="text-2xl font-bold text-yellow-600">{stats.suratMenunggu}</p>
                                </div>
                                <Clock className="h-8 w-8 text-yellow-600" />
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600">Proses</p>
                                    <p className="text-2xl font-bold text-blue-600">{stats.suratProses}</p>
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
                                    <p className="text-2xl font-bold text-green-600">{stats.suratSelesai}</p>
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
                                    <p className="text-2xl font-bold text-purple-600">{stats.avgProcessingTime}</p>
                                </div>
                                <TrendingUp className="h-8 w-8 text-purple-600" />
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Charts and Analytics */}
                <div className="flex">
                    {/* Monthly Trends */}
                    <Card className='w-full'>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <BarChart3 className="h-5 w-5" />
                                Tren Bulanan
                            </CardTitle>
                            <CardDescription>
                                Perbandingan surat masuk dan selesai per bulan
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {monthlyData.map((data, index) => (
                                    <div key={index} className="flex items-center gap-4">
                                        <div className="w-12 text-sm font-medium">{data.month}</div>
                                        <div className="flex-1">
                                            <div className="flex gap-2">
                                                <div className="flex items-center gap-2 text-sm">
                                                    <div className="w-3 h-3 bg-blue-500 rounded"></div>
                                                    Masuk: {data.masuk}
                                                </div>
                                                <div className="flex items-center gap-2 text-sm">
                                                    <div className="w-3 h-3 bg-green-500 rounded"></div>
                                                    Selesai: {data.selesai}
                                                </div>
                                            </div>
                                            <div className="flex gap-1 mt-1">
                                                <div 
                                                    className="h-2 bg-blue-500 rounded"
                                                    style={{ width: `${(data.masuk / 30) * 100}%` }}
                                                ></div>
                                                <div 
                                                    className="h-2 bg-green-500 rounded"
                                                    style={{ width: `${(data.selesai / 30) * 100}%` }}
                                                ></div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                </div>

                {/* Detailed Reports */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <PieChart className="h-5 w-5" />
                            Laporan Detail
                        </CardTitle>
                        <CardDescription>
                            Informasi detail tentang status dan kinerja disposisi
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {/* Status Distribution */}
                            <div className="space-y-3">
                                <h4 className="font-medium">Distribusi Status</h4>
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm">Menunggu</span>
                                        <Badge variant="outline" className="bg-yellow-50">
                                            {Math.round((stats.suratMenunggu / stats.totalSurat) * 100)}%
                                        </Badge>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm">Proses</span>
                                        <Badge variant="outline" className="bg-blue-50">
                                            {Math.round((stats.suratProses / stats.totalSurat) * 100)}%
                                        </Badge>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm">Selesai</span>
                                        <Badge variant="outline" className="bg-green-50">
                                            {Math.round((stats.suratSelesai / stats.totalSurat) * 100)}%
                                        </Badge>
                                    </div>
                                </div>
                            </div>

                            {/* Processing Time */}
                            <div className="space-y-3">
                                <h4 className="font-medium">Waktu Pemrosesan</h4>
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm">&lt; 2 hari</span>
                                        <Badge variant="outline" className="bg-green-50">25%</Badge>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm">2-5 hari</span>
                                        <Badge variant="outline" className="bg-blue-50">50%</Badge>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm"> 5 hari</span>
                                        <Badge variant="outline" className="bg-yellow-50">25%</Badge>
                                    </div>
                                </div>
                            </div>

                            {/* Workload Distribution */}
                            <div className="space-y-3">
                                <h4 className="font-medium">Distribusi Beban Kerja</h4>
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm">Ringan (1-5)</span>
                                        <Badge variant="outline" className="bg-green-50">2 pegawai</Badge>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm">Sedang (6-15)</span>
                                        <Badge variant="outline" className="bg-blue-50">3 pegawai</Badge>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm">Berat (15)</span>
                                        <Badge variant="outline" className="bg-yellow-50">0 pegawai</Badge>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
