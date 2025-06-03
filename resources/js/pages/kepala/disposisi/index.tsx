import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
    Search, 
    Filter, 
    Eye, 
    FileEdit, 
    Clock,
    AlertCircle,
    CheckCircle,
    Calendar,
    User,
    Building
} from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/kepala/dashboard',
    },
    {
        title: 'Disposisi Surat',
        href: '/kepala/disposisi',
    },
];

interface SuratMasuk {
    id: number;
    no_agenda: string;
    no_surat: string;
    tanggal_surat: string;
    tanggal_diterima: string;
    pengirim: string;
    hal_surat: string;
    jenis_surat: string;
    status_disposisi: string;
    admin?: {
        id: number;
        name: string;
    };
    kepala?: {
        id: number;
        name: string;
    };
    pmo?: {
        id: number;
        name: string;
    };
    pegawai?: {
        id: number;
        name: string;
    };
    disposisi_at?: string;
    created_at: string;
}

interface DisposisiIndexProps {
    auth: {
        user: {
            name: string;
            role: string;
        };
    };
    suratMasuk: SuratMasuk[];
}

export default function DisposisiIndex({ auth, suratMasuk }: DisposisiIndexProps) {
    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'diajukan':
                return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
                    <Clock className="w-3 h-3 mr-1" />
                    Menunggu
                </Badge>;
            case 'kepala':
                return <Badge variant="default" className="bg-blue-50 text-blue-700 border-blue-200">
                    <AlertCircle className="w-3 h-3 mr-1" />
                    Proses Kepala
                </Badge>;
            case 'pmo':
                return <Badge variant="default" className="bg-purple-50 text-purple-700 border-purple-200">
                    <FileEdit className="w-3 h-3 mr-1" />
                    Proses PMO
                </Badge>;
            case 'pegawai':
                return <Badge variant="default" className="bg-indigo-50 text-indigo-700 border-indigo-200">
                    <User className="w-3 h-3 mr-1" />
                    Proses Pegawai
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
        menunggu: suratMasuk.filter(s => s.status_disposisi === 'diajukan').length,
        proses: suratMasuk.filter(s => ['kepala', 'pmo', 'pegawai'].includes(s.status_disposisi)).length,
        selesai: suratMasuk.filter(s => s.status_disposisi === 'selesai').length,
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Disposisi Surat Masuk" />

            <div className="container mx-auto p-4 space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Disposisi Surat Masuk</h1>
                        <p className="text-gray-600">Kelola dan disposisi surat masuk yang memerlukan tindakan</p>
                    </div>
                </div>

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
                                    <p className="text-sm text-gray-600">Menunggu</p>
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
                                <AlertCircle className="h-8 w-8 text-blue-600" />
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
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Filter className="h-5 w-5" />
                            Filter & Pencarian
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex gap-4">
                            <div className="flex-1">
                                <div className="relative">
                                    <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                    <Input 
                                        placeholder="Cari berdasarkan nomor surat, pengirim, atau perihal..." 
                                        className="pl-10"
                                    />
                                </div>
                            </div>
                            <Button variant="outline">
                                <Filter className="h-4 w-4 mr-2" />
                                Filter Status
                            </Button>
                            <Button variant="outline">
                                <Calendar className="h-4 w-4 mr-2" />
                                Filter Tanggal
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                {/* Surat Masuk List */}
                <Card>
                    <CardHeader>
                        <CardTitle>Daftar Surat Masuk</CardTitle>
                        <CardDescription>
                            Total {suratMasuk.length} surat masuk ditemukan
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {suratMasuk.map((surat) => (
                                <div key={surat.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1 space-y-2">
                                            <div className="flex items-center gap-3">
                                                <h4 className="font-semibold text-lg">{surat.no_surat}</h4>
                                                {getStatusBadge(surat.status_disposisi)}
                                            </div>
                                            
                                            <div>
                                                <p className="font-medium text-gray-900">{surat.hal_surat}</p>
                                                <p className="text-sm text-gray-600 flex items-center gap-1">
                                                    <Building className="w-4 h-4" />
                                                    Pengirim: {surat.pengirim}
                                                </p>
                                            </div>
                                            
                                            <div className="flex items-center gap-4 text-xs text-gray-500">
                                                <span className="flex items-center gap-1">
                                                    <Calendar className="w-3 h-3" />
                                                    Diterima: {new Date(surat.tanggal_diterima).toLocaleDateString('id-ID')}
                                                </span>
                                                {surat.admin && (
                                                    <span className="flex items-center gap-1">
                                                        <User className="w-3 h-3" />
                                                        Admin: {surat.admin.name}
                                                    </span>
                                                )}
                                                {surat.disposisi_at && (
                                                    <span className="flex items-center gap-1">
                                                        <Clock className="w-3 h-3" />
                                                        Disposisi: {new Date(surat.disposisi_at).toLocaleDateString('id-ID')}
                                                    </span>
                                                )}
                                            </div>

                                            {/* Status Chain */}
                                            <div className="flex items-center gap-2 text-xs">
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
                                                        <Badge variant="outline" className="text-xs">
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
                                            <Link href={route('kepala.disposisi.show', surat.id)}>
                                                <Button size="sm" variant="outline">
                                                    <Eye className="h-4 w-4 mr-2" />
                                                    Lihat Detail
                                                </Button>
                                            </Link>
                                            {surat.status_disposisi === 'diajukan' && (
                                                <Link href={route('kepala.disposisi.show', surat.id)}>
                                                    <Button size="sm">
                                                        <FileEdit className="h-4 w-4 mr-2" />
                                                        Disposisi
                                                    </Button>
                                                </Link>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        
                        {suratMasuk.length === 0 && (
                            <div className="text-center py-12">
                                <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                                <h3 className="text-lg font-medium text-gray-900 mb-2">Tidak ada surat masuk</h3>
                                <p className="text-gray-600">Belum ada surat masuk yang perlu didisposisi.</p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
