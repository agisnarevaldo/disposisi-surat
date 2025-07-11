import React from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import {
    Search,
    Download,
    RotateCcw,
    BarChart3,
    FileText,
    TrendingUp,
    CheckCircle,
    Clock,
    Filter
} from 'lucide-react';

interface SuratMasuk {
    id: number;
    no_surat: string;
    pengirim: string;
    hal_surat: string;
    tanggal_diterima: string;
    tanggal_surat: string;
    status_disposisi: string;
    disposisi_at?: string;
    admin?: { name: string };
    kepala?: { name: string };
    pmo?: { name: string };
    pegawai?: { name: string };
    assignedUser?: { name: string };
}

interface Statistics {
    total: number;
    status: {
        diajukan: number;
        pmo: number;
        pegawai: number;
        selesai: number;
    };
    monthly: Record<string, number>;
}

interface RekapSuratProps {
    suratMasuks: SuratMasuk[];
    filters: {
        tanggal_mulai?: string;
        tanggal_selesai?: string;
        status?: string;
        pengirim?: string;
    };
    statistics: Statistics;
}

export default function RekapSurat({ suratMasuks, filters, statistics }: RekapSuratProps) {
    const { data, setData, processing } = useForm({
        tanggal_mulai: filters.tanggal_mulai || '',
        tanggal_selesai: filters.tanggal_selesai || '',
        status: filters.status === '' ? 'all' : (filters.status || 'all'),
        pengirim: filters.pengirim || '',
    });

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        // Buat URL dengan query parameters
        const params = new URLSearchParams();
        
        if (data.tanggal_mulai) {
            params.append('tanggal_mulai', data.tanggal_mulai);
        }
        if (data.tanggal_selesai) {
            params.append('tanggal_selesai', data.tanggal_selesai);
        }
        if (data.status && data.status !== 'all') {
            params.append('status', data.status);
        }
        if (data.pengirim) {
            params.append('pengirim', data.pengirim);
        }
        
        const queryString = params.toString();
        const url = queryString ? `/admin/rekap-surat?${queryString}` : '/admin/rekap-surat';
        
        window.location.href = url;
    };

    const handleExport = () => {
        const exportData = {
            tanggal_mulai: data.tanggal_mulai,
            tanggal_selesai: data.tanggal_selesai,
            status: data.status === 'all' ? '' : data.status,
            pengirim: data.pengirim,
        };
        const params = new URLSearchParams(exportData as Record<string, string>).toString();
        window.open(`/admin/rekap-surat/export?${params}`, '_blank');
    };

    const getStatusBadge = (status: string) => {
        const variants: Record<string, { variant: "default" | "secondary" | "destructive" | "outline"; label: string }> = {
            'draft': { variant: 'outline', label: 'Draft' },
            'diajukan': { variant: 'secondary', label: 'Diajukan' },
            'kepala': { variant: 'default', label: 'Di Kepala' },
            'pmo': { variant: 'default', label: 'Di PMO' },
            'pegawai': { variant: 'default', label: 'Di Pegawai' },
            'selesai': { variant: 'default', label: 'Selesai' },
        };

        const config = variants[status] || { variant: 'outline', label: status };
        return <Badge variant={config.variant}>{config.label}</Badge>;
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('id-ID', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    };

    const clearFilters = () => {
        // Reset form data untuk UI
        setData({
            tanggal_mulai: '',
            tanggal_selesai: '',
            status: 'all',
            pengirim: '',
        });
        
        // Redirect ke halaman rekap tanpa query parameters
        window.location.href = '/admin/rekap-surat';
    };

    return (
        <AppLayout>
            <Head title="Rekap Surat Masuk" />
            
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Rekap & Laporan Surat Masuk</h1>
                        <p className="text-gray-600">Analisis dan laporan data surat masuk</p>
                    </div>
                    <div className="flex gap-2">
                        <Button onClick={handleExport} variant="outline">
                            <Download className="h-4 w-4 mr-2" />
                            Export CSV
                        </Button>
                        <Link href="/admin/surat-masuk">
                            <Button variant="outline">
                                Kembali ke Daftar
                            </Button>
                        </Link>
                    </div>
                </div>

                {/* Statistik Section */}
                <div className="space-y-4">
                    <div className="flex items-center gap-2 mb-4">
                        <BarChart3 className="h-5 w-5 text-blue-600" />
                        <h2 className="text-xl font-semibold">Statistik Surat Masuk</h2>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Total Surat</CardTitle>
                                <FileText className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{statistics.total}</div>
                                <p className="text-xs text-muted-foreground">Total keseluruhan</p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Diajukan</CardTitle>
                                <Clock className="h-4 w-4 text-blue-600" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold text-blue-600">{statistics.status.diajukan}</div>
                                <p className="text-xs text-muted-foreground">Menunggu disposisi</p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Dalam Proses</CardTitle>
                                <TrendingUp className="h-4 w-4 text-orange-600" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold text-orange-600">
                                    {statistics.status.pmo + statistics.status.pegawai}
                                </div>
                                <p className="text-xs text-muted-foreground">PMO & Pegawai</p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Selesai</CardTitle>
                                <CheckCircle className="h-4 w-4 text-green-600" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold text-green-600">{statistics.status.selesai}</div>
                                <p className="text-xs text-muted-foreground">Sudah ditindaklanjuti</p>
                            </CardContent>
                        </Card>
                    </div>

                    
                </div>

                {/* Filter Section */}
                <div className="space-y-4">
                    <div className="flex items-center gap-2 mb-4">
                        <Filter className="h-5 w-5 text-blue-600" />
                        <h2 className="text-xl font-semibold">Filter Data</h2>
                    </div>
                    
                    <Card>
                        <CardHeader>
                            <CardTitle>Filter & Pencarian</CardTitle>
                            <CardDescription>Gunakan filter di bawah untuk menyaring data surat masuk</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSearch} className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="tanggal_mulai">Tanggal Mulai</Label>
                                        <Input
                                            id="tanggal_mulai"
                                            type="date"
                                            value={data.tanggal_mulai}
                                            onChange={(e) => setData('tanggal_mulai', e.target.value)}
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="tanggal_selesai">Tanggal Selesai</Label>
                                        <Input
                                            id="tanggal_selesai"
                                            type="date"
                                            value={data.tanggal_selesai}
                                            onChange={(e) => setData('tanggal_selesai', e.target.value)}
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="status">Status Disposisi</Label>
                                        <Select value={data.status} onValueChange={(value) => setData('status', value)}>
                                            <SelectTrigger className='w-full'>
                                                <SelectValue placeholder="Semua Status" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="all">Semua Status</SelectItem>
                                                <SelectItem value="diajukan">Diajukan</SelectItem>
                                                <SelectItem value="pmo">PMO</SelectItem>
                                                <SelectItem value="pegawai">Pegawai</SelectItem>
                                                <SelectItem value="selesai">Selesai</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="pengirim">Pengirim</Label>
                                        <Input
                                            id="pengirim"
                                            placeholder="Cari pengirim..."
                                            value={data.pengirim}
                                            onChange={(e) => setData('pengirim', e.target.value)}
                                        />
                                    </div>
                                </div>

                                <div className="flex gap-2 pt-4">
                                    <Button type="submit" disabled={processing}>
                                        <Search className="h-4 w-4 mr-2" />
                                        {processing ? 'Memfilter...' : 'Filter'}
                                    </Button>
                                    <Button type="button" variant="outline" onClick={clearFilters}>
                                        <RotateCcw className="h-4 w-4 mr-2" />
                                        Reset
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                </div>

                {/* Data Section */}
                <div className="space-y-4">
                    <div className="flex items-center gap-2 mb-4">
                        <FileText className="h-5 w-5 text-blue-600" />
                        <h2 className="text-xl font-semibold">Data Surat Masuk</h2>
                    </div>
                    
                    <Card>
                        <CardHeader>
                            <CardTitle>Daftar Surat</CardTitle>
                            <CardDescription>
                                Menampilkan {suratMasuks.length} surat dari total {statistics.total} surat
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="overflow-x-auto">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>No</TableHead>
                                            <TableHead>Nomor Surat</TableHead>
                                            <TableHead>Pengirim</TableHead>
                                            <TableHead>Perihal</TableHead>
                                            <TableHead>Tanggal Diterima</TableHead>
                                            <TableHead>Status</TableHead>
                                            <TableHead>Kepala</TableHead>
                                            <TableHead>PMO</TableHead>
                                            <TableHead>Pegawai</TableHead>
                                            <TableHead>Aksi</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {suratMasuks.length === 0 ? (
                                            <TableRow>
                                                <TableCell colSpan={10} className="text-center text-gray-500 py-8">
                                                    Tidak ada data sesuai filter yang dipilih.
                                                </TableCell>
                                            </TableRow>
                                        ) : (
                                            suratMasuks.map((surat, index) => (
                                                <TableRow key={surat.id}>
                                                    <TableCell>{index + 1}</TableCell>
                                                    <TableCell className="font-medium">
                                                        {surat.no_surat}
                                                    </TableCell>
                                                    <TableCell>{surat.pengirim}</TableCell>
                                                    <TableCell className="max-w-xs truncate">
                                                        {surat.hal_surat}
                                                    </TableCell>
                                                    <TableCell>
                                                        {formatDate(surat.tanggal_diterima)}
                                                    </TableCell>
                                                    <TableCell>
                                                        {getStatusBadge(surat.status_disposisi)}
                                                    </TableCell>
                                                    <TableCell>
                                                        {surat.kepala?.name || '-'}
                                                    </TableCell>
                                                    <TableCell>
                                                        {surat.pmo?.name || '-'}
                                                    </TableCell>
                                                    <TableCell>
                                                        {surat.pegawai?.name || '-'}
                                                    </TableCell>
                                                    <TableCell>
                                                        <Link
                                                            href={`/admin/surat-masuk/${surat.id}`}
                                                            className="text-blue-600 hover:text-blue-800"
                                                        >
                                                            Detail
                                                        </Link>
                                                    </TableCell>
                                                </TableRow>
                                            ))
                                        )}
                                    </TableBody>
                                </Table>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <Card>
                        <CardHeader>
                            <CardTitle>Distribusi Status Surat</CardTitle>
                            <CardDescription>Ringkasan status surat masuk berdasarkan kategori</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <span>Diajukan</span>
                                    <div className="flex items-center gap-2">
                                        <div className="w-32 bg-gray-200 rounded-full h-2">
                                            <div 
                                                className="bg-blue-600 h-2 rounded-full" 
                                                style={{ width: `${statistics.total > 0 ? (statistics.status.diajukan / statistics.total) * 100 : 0}%` }}
                                            ></div>
                                        </div>
                                        <span className="text-sm font-medium">{statistics.status.diajukan}</span>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span>PMO</span>
                                    <div className="flex items-center gap-2">
                                        <div className="w-32 bg-gray-200 rounded-full h-2">
                                            <div 
                                                className="bg-purple-600 h-2 rounded-full" 
                                                style={{ width: `${statistics.total > 0 ? (statistics.status.pmo / statistics.total) * 100 : 0}%` }}
                                            ></div>
                                        </div>
                                        <span className="text-sm font-medium">{statistics.status.pmo}</span>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span>Pegawai</span>
                                    <div className="flex items-center gap-2">
                                        <div className="w-32 bg-gray-200 rounded-full h-2">
                                            <div 
                                                className="bg-orange-600 h-2 rounded-full" 
                                                style={{ width: `${statistics.total > 0 ? (statistics.status.pegawai / statistics.total) * 100 : 0}%` }}
                                            ></div>
                                        </div>
                                        <span className="text-sm font-medium">{statistics.status.pegawai}</span>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span>Selesai</span>
                                    <div className="flex items-center gap-2">
                                        <div className="w-32 bg-gray-200 rounded-full h-2">
                                            <div 
                                                className="bg-green-600 h-2 rounded-full" 
                                                style={{ width: `${statistics.total > 0 ? (statistics.status.selesai / statistics.total) * 100 : 0}%` }}
                                            ></div>
                                        </div>
                                        <span className="text-sm font-medium">{statistics.status.selesai}</span>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
            </div>
        </AppLayout>
    );
}
