import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
    Calendar, 
    User, 
    Building, 
    FileText,
    CheckCircle,
    Clock,
    ArrowRight
} from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/kepala/dashboard',
    },
    {
        title: 'Riwayat Disposisi',
        href: '/kepala/riwayat',
    },
];

interface RiwayatDisposisi {
    id: number;
    no_surat: string;
    hal_surat: string;
    pengirim: string;
    tanggal_diterima: string;
    status_disposisi: string;
    disposisi_at: string;
    pmo?: {
        id: number;
        name: string;
    };
    pegawai?: {
        id: number;
        name: string;
    };
    created_at: string;
}

interface RiwayatIndexProps {
    auth: {
        user: {
            id: number;
            name: string;
            role: string;
        };
    };
    riwayatDisposisi: RiwayatDisposisi[];
}

export default function RiwayatIndex({ auth, riwayatDisposisi }: RiwayatIndexProps) {
    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'pmo':
                return <Badge variant="default" className="bg-purple-50 text-purple-700 border-purple-200">
                    <User className="w-3 h-3 mr-1" />
                    Didisposisi ke PMO
                </Badge>;
            case 'pegawai':
                return <Badge variant="default" className="bg-indigo-50 text-indigo-700 border-indigo-200">
                    <User className="w-3 h-3 mr-1" />
                    Didisposisi ke Pegawai
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
            <Head title="Riwayat Disposisi" />
            
            <div className="container mx-auto p-6 space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Riwayat Disposisi</h1>
                        <p className="text-gray-600">Surat yang telah Anda disposisi</p>
                    </div>
                    <div className="flex items-center space-x-2">
                        <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                            <User className="w-3 h-3 mr-1" />
                            Kepala
                        </Badge>
                    </div>
                </div>

                {/* Statistics */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <Card>
                        <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600">Total Disposisi</p>
                                    <p className="text-2xl font-bold text-blue-600">{riwayatDisposisi.length}</p>
                                </div>
                                <FileText className="h-8 w-8 text-blue-600" />
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600">Ke PMO</p>
                                    <p className="text-2xl font-bold text-purple-600">
                                        {riwayatDisposisi.filter(item => item.status_disposisi === 'pmo' || item.pmo).length}
                                    </p>
                                </div>
                                <User className="h-8 w-8 text-purple-600" />
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600">Ke Pegawai</p>
                                    <p className="text-2xl font-bold text-indigo-600">
                                        {riwayatDisposisi.filter(item => item.status_disposisi === 'pegawai' || item.pegawai).length}
                                    </p>
                                </div>
                                <User className="h-8 w-8 text-indigo-600" />
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600">Selesai</p>
                                    <p className="text-2xl font-bold text-green-600">
                                        {riwayatDisposisi.filter(item => item.status_disposisi === 'selesai').length}
                                    </p>
                                </div>
                                <CheckCircle className="h-8 w-8 text-green-600" />
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Riwayat List */}
                <Card>
                    <CardHeader>
                        <CardTitle>Daftar Surat yang Telah Didisposisi</CardTitle>
                        <CardDescription>
                            Total {riwayatDisposisi.length} surat telah didisposisi oleh Anda
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {riwayatDisposisi.map((item) => (
                                <div key={item.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1 space-y-2">
                                            <div className="flex items-center gap-3">
                                                <h4 className="font-semibold text-lg">{item.no_surat}</h4>
                                                {getStatusBadge(item.status_disposisi)}
                                            </div>
                                            
                                            <div>
                                                <p className="font-medium text-gray-900">{item.hal_surat}</p>
                                                <p className="text-sm text-gray-600 flex items-center gap-1">
                                                    <Building className="w-4 h-4" />
                                                    Pengirim: {item.pengirim}
                                                </p>
                                            </div>
                                            
                                            <div className="flex items-center gap-4 text-xs text-gray-500">
                                                <span className="flex items-center gap-1">
                                                    <Calendar className="w-3 h-3" />
                                                    Diterima: {new Date(item.tanggal_diterima).toLocaleDateString('id-ID')}
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <Clock className="w-3 h-3" />
                                                    Disposisi: {new Date(item.disposisi_at).toLocaleDateString('id-ID')}
                                                </span>
                                            </div>

                                            {/* Disposition Flow */}
                                            <div className="flex items-center gap-2 text-sm bg-gray-50 p-2 rounded">
                                                <Badge variant="outline" className="text-xs">
                                                    Kepala: {auth.user.name}
                                                </Badge>
                                                <ArrowRight className="w-3 h-3 text-gray-400" />
                                                {item.pmo && (
                                                    <Badge variant="outline" className="text-xs">
                                                        PMO: {item.pmo.name}
                                                    </Badge>
                                                )}
                                                {item.pegawai && (
                                                    <Badge variant="outline" className="text-xs">
                                                        Pegawai: {item.pegawai.name}
                                                    </Badge>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        
                        {riwayatDisposisi.length === 0 && (
                            <div className="text-center py-12">
                                <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                                <h3 className="text-lg font-medium text-gray-900 mb-2">Belum ada riwayat disposisi</h3>
                                <p className="text-gray-600">Anda belum pernah melakukan disposisi surat.</p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
