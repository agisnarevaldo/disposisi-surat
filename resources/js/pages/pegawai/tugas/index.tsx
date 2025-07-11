import React, { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
    Search, 
    Calendar,
    User,
    Clock,
    CheckCircle,
    Mail,
    Eye,
    FileText
} from 'lucide-react';

interface SuratMasuk {
    id: number;
    nomor_surat: string;
    asal_surat: string;
    perihal: string;
    tanggal_masuk: string;
    tanggal_surat: string;
    status_disposisi: string;
    disposisi_at?: string;
    admin?: { name: string };
    kepala?: { name: string };
    pmo?: { name: string };
    pegawai?: { name: string };
    assignments?: Array<{
        id: number;
        user: {
            id: number;
            name: string;
            email: string;
        };
        status: string;
        catatan_assignment?: string;
        created_at: string;
    }>;
}

interface TugasIndexProps {
    auth: any;
    suratMasuk: SuratMasuk[];
    flash?: {
        success?: string;
        error?: string;
    };
}

export default function TugasIndex({ auth, suratMasuk, flash }: TugasIndexProps) {
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');

    const breadcrumbs = [
        { title: 'Dashboard', name: 'Dashboard', href: route('pegawai.dashboard') },
        { title: 'Tugas Disposisi', name: 'Tugas Disposisi', href: route('pegawai.tugas.index'), current: true }
    ];

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'pegawai':
                return <Badge variant="default" className="bg-yellow-50 text-yellow-700 border-yellow-200">
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

    const getPriorityClass = (tanggalMasuk: string) => {
        const daysDiff = Math.floor((new Date().getTime() - new Date(tanggalMasuk).getTime()) / (1000 * 3600 * 24));
        if (daysDiff > 5) return 'border-l-4 border-l-red-500';
        if (daysDiff > 3) return 'border-l-4 border-l-yellow-500';
        return 'border-l-4 border-l-blue-500';
    };

    // Filter dan search
    const filteredSurat = suratMasuk.filter(surat => {
        const matchesSearch = 
            (surat.nomor_surat?.toLowerCase().includes(searchTerm.toLowerCase()) || false) ||
            (surat.perihal?.toLowerCase().includes(searchTerm.toLowerCase()) || false) ||
            (surat.asal_surat?.toLowerCase().includes(searchTerm.toLowerCase()) || false);
        
        const matchesStatus = statusFilter === 'all' || surat.status_disposisi === statusFilter;
        
        return matchesSearch && matchesStatus;
    });

    // Hitung statistik
    const stats = {
        total: suratMasuk.length,
        menunggu: suratMasuk.filter(s => s.status_disposisi === 'pegawai').length,
        selesai: suratMasuk.filter(s => s.status_disposisi === 'selesai').length,
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Tugas Disposisi" />
            
            <div className="container mx-auto p-4">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Tugas Disposisi</h1>
                        <p className="text-gray-600">Kelola tugas disposisi surat yang diberikan kepada Anda</p>
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
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card>
                        <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600">Total Tugas</p>
                                    <p className="text-2xl font-bold">{stats.total}</p>
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
                                    <p className="text-2xl font-bold text-yellow-600">{stats.menunggu}</p>
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
                                    <p className="text-2xl font-bold text-green-600">{stats.selesai}</p>
                                </div>
                                <CheckCircle className="h-8 w-8 text-green-600" />
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Filters */}
                <Card>
                    <CardContent className="p-6">
                        <div className="flex flex-col md:flex-row gap-4">
                            <div className="flex-1">
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                    <Input
                                        placeholder="Cari berdasarkan nomor surat, perihal, atau asal surat..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="pl-10"
                                    />
                                </div>
                            </div>
                            <div className="md:w-48">
                                <Select value={statusFilter} onValueChange={setStatusFilter}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Filter Status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">Semua Status</SelectItem>
                                        <SelectItem value="pegawai">Perlu Ditangani</SelectItem>
                                        <SelectItem value="selesai">Selesai</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Tugas List */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <FileText className="h-5 w-5" />
                            Daftar Tugas Disposisi
                        </CardTitle>
                        <CardDescription>
                            {filteredSurat.length} dari {suratMasuk.length} tugas
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {filteredSurat.length > 0 ? (
                            <div className="space-y-4">
                                {filteredSurat.map((surat) => (
                                    <div 
                                        key={surat.id} 
                                        className={`p-4 border rounded-lg hover:bg-gray-50 transition-colors ${getPriorityClass(surat.tanggal_masuk)}`}
                                    >
                                        <div className="flex items-start justify-between">
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-3 mb-2">
                                                    <h3 className="text-lg font-semibold text-gray-900">
                                                        {surat.nomor_surat}
                                                    </h3>
                                                    {getStatusBadge(surat.status_disposisi)}
                                                </div>
                                                
                                                <p className="text-gray-700 mb-2">{surat.perihal}</p>
                                                
                                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                                                    <div className="flex items-center gap-2">
                                                        <Calendar className="w-4 h-4" />
                                                        <span>Masuk: {new Date(surat.tanggal_masuk).toLocaleDateString('id-ID')}</span>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <Mail className="w-4 h-4" />
                                                        <span>Asal: {surat.asal_surat}</span>
                                                    </div>
                                                    {surat.pmo && (
                                                        <div className="flex items-center gap-2">
                                                            <User className="w-4 h-4" />
                                                            <span>Dari PMO: {surat.pmo.name}</span>
                                                        </div>
                                                    )}
                                                </div>
                                                
                                                {/* Tampilkan pegawai yang ditugaskan */}
                                                {surat.assignments && surat.assignments.length > 0 && (
                                                    <div className="mt-3 p-3 bg-gray-50 rounded-md">
                                                        <p className="text-sm font-medium text-gray-700 mb-2">Pegawai yang ditugaskan:</p>
                                                        <div className="flex flex-wrap gap-2">
                                                            {surat.assignments.map((assignment, index) => (
                                                                <Badge key={index} variant="outline" className="text-xs">
                                                                    {assignment.user.name}
                                                                </Badge>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                            
                                            <div className="flex items-center gap-2 ml-4">
                                                <Link href={route('pegawai.tugas.show', surat.id)}>
                                                    <Button size="sm" variant="outline">
                                                        <Eye className="h-4 w-4 mr-1" />
                                                        Detail
                                                    </Button>
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-12">
                                <Mail className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                                <h3 className="text-lg font-medium text-gray-900 mb-2">Tidak ada tugas</h3>
                                <p className="text-gray-600">
                                    {searchTerm || statusFilter ? 
                                        'Tidak ada tugas yang cocok dengan filter yang dipilih.' :
                                        'Anda belum memiliki tugas disposisi.'
                                    }
                                </p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
