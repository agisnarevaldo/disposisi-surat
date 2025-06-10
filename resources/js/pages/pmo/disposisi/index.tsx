import React, { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
    FileEdit, 
    Clock, 
    Users, 
    CheckCircle, 
    Eye,
    Send,
    Calendar,
    Search,
    Filter,
    User,
    Mail,
    FileText,
    Download,
    Maximize2,
    Minimize2,
    X
} from 'lucide-react';
import { BreadcrumbItem } from '@/types';

interface SuratMasuk {
    id: number;
    nomor_surat: string;
    asal_surat: string;
    perihal: string;
    tanggal_masuk: string;
    status_disposisi: string;
    disposisi_at?: string;
    admin?: { name: string };
    kepala?: { name: string };
    pmo?: { name: string };
    pegawai?: { name: string };
}

interface DisposisiIndexProps {
    auth: {
        user: {
            id: number;
            name: string;
            email: string;
            role: string;
        };
    };
    suratMasuk: SuratMasuk[];
    flash?: {
        success?: string;
        error?: string;
    };
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Disposisi Surat Masuk',
        href: '/pmo/disposisi',
    },
    {
        title: 'Dashboard PMO',
        href: '/pmo/dashboard',
    },
];

export default function DisposisiIndex({ auth, suratMasuk, flash }: DisposisiIndexProps) {
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [showPdfPreview, setShowPdfPreview] = useState(false);
    const [selectedSurat, setSelectedSurat] = useState<SuratMasuk | null>(null);
    const [isPreviewExpanded, setIsPreviewExpanded] = useState(false);

    // Filter surat berdasarkan pencarian dan status
    const filteredSurat = suratMasuk.filter(surat => {
        const matchesSearch = 
            (surat.nomor_surat?.toLowerCase().includes(searchTerm.toLowerCase()) || false) ||
            (surat.asal_surat?.toLowerCase().includes(searchTerm.toLowerCase()) || false) ||
            (surat.perihal?.toLowerCase().includes(searchTerm.toLowerCase()) || false);
        
        const matchesStatus = statusFilter === '' || surat.status_disposisi === statusFilter;
        
        return matchesSearch && matchesStatus;
    });

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'pmo':
                return <Badge variant="default" className="bg-yellow-50 text-yellow-700 border-yellow-200">
                    <Clock className="w-3 h-3 mr-1" />
                    Menunggu Disposisi
                </Badge>;
            case 'pegawai':
                return <Badge variant="default" className="bg-indigo-50 text-indigo-700 border-indigo-200">
                    <User className="w-3 h-3 mr-1" />
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

    // Hitung statistik
    const stats = {
        total: suratMasuk.length,
        menunggu: suratMasuk.filter(s => s.status_disposisi === 'pmo').length,
        proses: suratMasuk.filter(s => s.status_disposisi === 'pegawai').length,
        selesai: suratMasuk.filter(s => s.status_disposisi === 'selesai').length,
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Disposisi Surat Masuk - PMO" />
            
            <div className="container flex flex-col gap-4 p-4">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Disposisi Surat Masuk</h1>
                        <p className="text-gray-600">Kelola disposisi surat yang diteruskan kepada pegawai</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <Link href={route('pmo.dashboard')}>
                            <Button variant="outline">
                                Kembali ke Dashboard
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
                                    <p className="text-2xl font-bold">{stats.total}</p>
                                </div>
                                <FileEdit className="h-8 w-8 text-blue-600" />
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600">Menunggu Disposisi</p>
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
                                    <p className="text-sm text-gray-600">Dalam Proses</p>
                                    <p className="text-2xl font-bold text-blue-600">{stats.proses}</p>
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
                                    <p className="text-2xl font-bold text-green-600">{stats.selesai}</p>
                                </div>
                                <CheckCircle className="h-8 w-8 text-green-600" />
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Search and Filter */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Filter className="h-5 w-5" />
                            Filter & Pencarian
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-col sm:flex-row gap-4">
                            <div className="flex-1">
                                <div className="relative">
                                    <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                    <Input
                                        placeholder="Cari berdasarkan nomor surat, asal surat, atau perihal..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="pl-10"
                                    />
                                </div>
                            </div>
                            <div className="w-full sm:w-48">
                                <Select value={statusFilter} onValueChange={setStatusFilter}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Semua Status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="pmo">Menunggu Disposisi</SelectItem>
                                        <SelectItem value="pegawai">Dengan Pegawai</SelectItem>
                                        <SelectItem value="selesai">Selesai</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Surat List */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Mail className="h-5 w-5" />
                            Daftar Surat ({filteredSurat.length})
                        </CardTitle>
                        <CardDescription>
                            Surat masuk yang memerlukan atau telah didisposisi
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {filteredSurat.length > 0 ? (
                            <div className="space-y-4">
                                {filteredSurat.map((surat) => (
                                    <div key={surat.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                                        <div className="flex items-start justify-between">
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-3 mb-2">
                                                    <h3 className="font-semibold text-gray-900">
                                                        {surat.nomor_surat}
                                                    </h3>
                                                    {getStatusBadge(surat.status_disposisi)}
                                                </div>
                                                
                                                <p className="text-gray-700 mb-2">{surat.perihal}</p>
                                                <p className="text-sm text-gray-600 mb-3">Dari: {surat.asal_surat}</p>
                                                
                                                <div className="flex items-center gap-4 text-sm text-gray-500">
                                                    <span className="flex items-center gap-1">
                                                        <Calendar className="w-3 h-3" />
                                                        Diterima: {new Date(surat.tanggal_masuk).toLocaleDateString('id-ID')}
                                                    </span>
                                                    {surat.disposisi_at && (
                                                        <span className="flex items-center gap-1">
                                                            <Clock className="w-3 h-3" />
                                                            Disposisi: {new Date(surat.disposisi_at).toLocaleDateString('id-ID')}
                                                        </span>
                                                    )}
                                                </div>

                                                {/* Status Chain */}
                                                <div className="flex items-center gap-2 text-xs mt-2">
                                                    {surat.admin && (
                                                        <Badge variant="outline" className="text-xs">
                                                            Admin: {surat.admin.name}
                                                        </Badge>
                                                    )}
                                                    {surat.kepala && (
                                                        <>
                                                            <span>→</span>
                                                            <Badge variant="outline" className="text-xs">
                                                                Kepala: {surat.kepala.name}
                                                            </Badge>
                                                        </>
                                                    )}
                                                    {surat.pmo && (
                                                        <>
                                                            <span>→</span>
                                                            <Badge variant="outline" className="text-xs bg-blue-50">
                                                                PMO: {surat.pmo.name}
                                                            </Badge>
                                                        </>
                                                    )}
                                                    {surat.pegawai && (
                                                        <>
                                                            <span>→</span>
                                                            <Badge variant="outline" className="text-xs">
                                                                Pegawai: {surat.pegawai.name}
                                                            </Badge>
                                                        </>
                                                    )}
                                                </div>
                                            </div>
                                            
                                            <div className="flex items-center gap-2 ml-4">
                                                <Button 
                                                    size="sm" 
                                                    variant="outline"
                                                    onClick={() => {
                                                        setSelectedSurat(surat);
                                                        setShowPdfPreview(true);
                                                    }}
                                                >
                                                    <FileText className="h-4 w-4 mr-2" />
                                                    Preview PDF
                                                </Button>
                                                <Link href={route('pmo.disposisi.show', surat.id)}>
                                                    <Button size="sm" variant="outline">
                                                        <Eye className="h-4 w-4 mr-2" />
                                                        Lihat Detail
                                                    </Button>
                                                </Link>
                                                {surat.status_disposisi === 'pmo' && (
                                                    <Link href={route('pmo.disposisi.show', surat.id)}>
                                                        <Button size="sm">
                                                            <Send className="h-4 w-4 mr-2" />
                                                            Disposisi
                                                        </Button>
                                                    </Link>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-12">
                                <Mail className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                                <h3 className="text-lg font-medium text-gray-900 mb-2">Tidak ada surat ditemukan</h3>
                                <p className="text-gray-600">
                                    {searchTerm || statusFilter ? 
                                        'Coba ubah kriteria pencarian atau filter.' : 
                                        'Belum ada surat masuk yang perlu didisposisi.'
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
