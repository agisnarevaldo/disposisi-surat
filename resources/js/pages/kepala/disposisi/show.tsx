import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { 
    FileText, 
    Calendar, 
    User, 
    Building, 
    MessageSquare,
    Send,
    Clock,
    CheckCircle,
    AlertTriangle,
    ArrowRight,
    Download
} from 'lucide-react';
import { useState } from 'react';

interface SuratMasuk {
    id: number;
    no_agenda: string;
    no_surat: string;
    tanggal_surat: string;
    tanggal_diterima: string;
    pengirim: string;
    hal_surat: string;
    jenis_surat: string;
    file_surat: string;
    tujuan_surat: string;
    status_baca: string;
    status_tindak_lanjut: string;
    status_disposisi: string;
    pesan_tambahan?: string;
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
}

interface AvailableUser {
    id: number;
    name: string;
    role: string;
    jabatan?: string;
    email?: string;
}

interface DisposisiLog {
    id: number;
    status_lama: string;
    status_baru: string;
    catatan?: string;
    created_at: string;
    changed_by: {
        id: number;
        name: string;
        role: string;
    };
    disposisi_ke_user?: {
        id: number;
        name: string;
        role: string;
    };
}

interface DisposisiShowProps {
    auth: {
        user: {
            id: number;
            name: string;
            role: string;
            can_dispose?: boolean;
        };
    };
    surat: SuratMasuk;
    availableUsers: AvailableUser[];
    disposisiLogs: DisposisiLog[];
}

export default function DisposisiShow({ auth, surat, availableUsers, disposisiLogs }: DisposisiShowProps) {
    const [isDisposisiMode, setIsDisposisiMode] = useState(false);

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Dashboard',
            href: '/kepala/dashboard',
        },
        {
            title: 'Disposisi Surat',
            href: '/kepala/disposisi',
        },
        {
            title: surat.no_surat,
            href: `/kepala/disposisi/${surat.id}`,
        },
    ];

    const { data, setData, post, processing, errors } = useForm({
        user_id: '',
        catatan: ''
    });

    const handleDisposisi = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('kepala.disposisi.to-user', surat.id), {
            onSuccess: () => {
                setIsDisposisiMode(false);
            }
        });
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'diajukan':
                return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
                    <Clock className="w-3 h-3 mr-1" />
                    Menunggu Disposisi
                </Badge>;
            case 'kepala':
                return <Badge variant="default" className="bg-blue-50 text-blue-700 border-blue-200">
                    <AlertTriangle className="w-3 h-3 mr-1" />
                    Proses Kepala
                </Badge>;
            case 'pmo':
                return <Badge variant="default" className="bg-purple-50 text-purple-700 border-purple-200">
                    <Send className="w-3 h-3 mr-1" />
                    Didisposisi ke PMO
                </Badge>;
            case 'pegawai':
                return <Badge variant="default" className="bg-indigo-50 text-indigo-700 border-indigo-200">
                    <Send className="w-3 h-3 mr-1" />
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

    const getStatusLogBadge = (status: string) => {
        const statusMap: { [key: string]: { label: string; className: string } } = {
            'diajukan': { label: 'Diajukan', className: 'bg-yellow-100 text-yellow-800' },
            'kepala': { label: 'Proses Kepala', className: 'bg-blue-100 text-blue-800' },
            'pmo': { label: 'Disposisi ke PMO', className: 'bg-purple-100 text-purple-800' },
            'pegawai': { label: 'Disposisi ke Pegawai', className: 'bg-indigo-100 text-indigo-800' },
            'selesai': { label: 'Selesai', className: 'bg-green-100 text-green-800' },
        };

        const statusInfo = statusMap[status] || { label: status, className: 'bg-gray-100 text-gray-800' };
        
        return (
            <Badge variant="secondary" className={statusInfo.className}>
                {statusInfo.label}
            </Badge>
        );
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Detail Surat - ${surat.no_surat}`} />
            
            <div className="container mx-auto p-6 space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">{surat.no_surat}</h1>
                        <p className="text-gray-600">{surat.hal_surat}</p>
                    </div>
                    <div className="flex items-center gap-3">
                        {getStatusBadge(surat.status_disposisi)}
                        {surat.status_disposisi === 'diajukan' && auth.user.role === 'kepala' && (
                            <Button 
                                onClick={() => setIsDisposisiMode(!isDisposisiMode)}
                                className="bg-blue-600 hover:bg-blue-700"
                            >
                                <Send className="w-4 h-4 mr-2" />
                                Disposisi Surat
                            </Button>
                        )}
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Detail Surat */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Informasi Surat */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <FileText className="h-5 w-5" />
                                    Informasi Surat
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <Label className="text-sm font-medium text-gray-500">No. Agenda</Label>
                                        <p className="mt-1 text-sm text-gray-900">{surat.no_agenda}</p>
                                    </div>
                                    <div>
                                        <Label className="text-sm font-medium text-gray-500">No. Surat</Label>
                                        <p className="mt-1 text-sm text-gray-900">{surat.no_surat}</p>
                                    </div>
                                    <div>
                                        <Label className="text-sm font-medium text-gray-500">Tanggal Surat</Label>
                                        <p className="mt-1 text-sm text-gray-900 flex items-center gap-1">
                                            <Calendar className="w-4 h-4" />
                                            {new Date(surat.tanggal_surat).toLocaleDateString('id-ID')}
                                        </p>
                                    </div>
                                    <div>
                                        <Label className="text-sm font-medium text-gray-500">Tanggal Diterima</Label>
                                        <p className="mt-1 text-sm text-gray-900 flex items-center gap-1">
                                            <Calendar className="w-4 h-4" />
                                            {new Date(surat.tanggal_diterima).toLocaleDateString('id-ID')}
                                        </p>
                                    </div>
                                    <div>
                                        <Label className="text-sm font-medium text-gray-500">Pengirim</Label>
                                        <p className="mt-1 text-sm text-gray-900 flex items-center gap-1">
                                            <Building className="w-4 h-4" />
                                            {surat.pengirim}
                                        </p>
                                    </div>
                                    <div>
                                        <Label className="text-sm font-medium text-gray-500">Jenis Surat</Label>
                                        <p className="mt-1 text-sm text-gray-900">{surat.jenis_surat}</p>
                                    </div>
                                </div>
                                
                                <div>
                                    <Label className="text-sm font-medium text-gray-500">Perihal</Label>
                                    <p className="mt-1 text-sm text-gray-900">{surat.hal_surat}</p>
                                </div>

                                <div>
                                    <Label className="text-sm font-medium text-gray-500">Tujuan Surat</Label>
                                    <p className="mt-1 text-sm text-gray-900">{surat.tujuan_surat}</p>
                                </div>

                                {surat.pesan_tambahan && (
                                    <div>
                                        <Label className="text-sm font-medium text-gray-500">Pesan Tambahan</Label>
                                        <p className="mt-1 text-sm text-gray-900">{surat.pesan_tambahan}</p>
                                    </div>
                                )}

                                <Separator />

                                <div className="flex items-center gap-4">
                                    <Button variant="outline" className="flex items-center gap-2">
                                        <Download className="w-4 h-4" />
                                        Unduh File Surat
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Form Disposisi */}
                        {isDisposisiMode && surat.status_disposisi === 'diajukan' && auth.user.role === 'kepala' && (
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Send className="h-5 w-5" />
                                        Disposisi Surat
                                    </CardTitle>
                                    <CardDescription>
                                        Pilih user yang akan menangani surat ini
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    {availableUsers.length === 0 ? (
                                        <div className="text-center py-6">
                                            <AlertTriangle className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
                                            <h3 className="text-lg font-medium text-gray-900 mb-2">
                                                Tidak Ada User yang Tersedia
                                            </h3>
                                            <p className="text-gray-600">
                                                Tidak ada user dengan hak disposisi yang tersedia saat ini. 
                                                Hubungi administrator untuk mengatur hak disposisi user.
                                            </p>
                                        </div>
                                    ) : (
                                        <form onSubmit={handleDisposisi} className="space-y-4">
                                        <div>
                                            <Label htmlFor="user_id">Pilih User</Label>
                                            <Select value={data.user_id} onValueChange={(value) => setData('user_id', value)}>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Pilih user untuk disposisi" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {availableUsers.map((user) => (
                                                        <SelectItem key={user.id} value={user.id.toString()}>
                                                            <div>
                                                                <div className="flex items-center gap-2">
                                                                    <p className="font-medium">{user.name}</p>
                                                                    <Badge variant="outline" className="text-xs">
                                                                        {user.role.toUpperCase()}
                                                                    </Badge>
                                                                </div>
                                                                {user.jabatan && (
                                                                    <p className="text-sm text-gray-500">{user.jabatan}</p>
                                                                )}
                                                                {user.email && (
                                                                    <p className="text-xs text-gray-400">{user.email}</p>
                                                                )}
                                                            </div>
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            {errors.user_id && (
                                                <p className="text-sm text-red-600 mt-1">{errors.user_id}</p>
                                            )}
                                        </div>

                                        <div>
                                            <Label htmlFor="catatan">Catatan Disposisi</Label>
                                            <Textarea
                                                id="catatan"
                                                placeholder="Tambahkan catatan atau instruksi untuk user..."
                                                value={data.catatan}
                                                onChange={(e) => setData('catatan', e.target.value)}
                                                rows={3}
                                            />
                                            {errors.catatan && (
                                                <p className="text-sm text-red-600 mt-1">{errors.catatan}</p>
                                            )}
                                        </div>

                                        <div className="flex gap-2">
                                            <Button type="submit" disabled={processing}>
                                                {processing ? 'Memproses...' : 'Disposisi Surat'}
                                            </Button>
                                            <Button 
                                                type="button" 
                                                variant="outline"
                                                onClick={() => setIsDisposisiMode(false)}
                                            >
                                                Batal
                                            </Button>
                                        </div>
                                        </form>
                                    )}
                                </CardContent>
                            </Card>
                        )}
                    </div>

                    {/* Sidebar - Status & Riwayat */}
                    <div className="space-y-6">
                        {/* Status Disposisi */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <User className="h-5 w-5" />
                                    Status Disposisi
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-3">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                                            <User className="w-4 h-4 text-blue-600" />
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-sm font-medium">Admin</p>
                                            <p className="text-xs text-gray-500">
                                                {surat.admin?.name || 'Belum diajukan'}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <ArrowRight className="w-4 h-4 text-gray-400" />
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                                            surat.status_disposisi !== 'diajukan' ? 'bg-green-100' : 'bg-yellow-100'
                                        }`}>
                                            <User className={`w-4 h-4 ${
                                                surat.status_disposisi !== 'diajukan' ? 'text-green-600' : 'text-yellow-600'
                                            }`} />
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-sm font-medium">Kepala</p>
                                            <p className="text-xs text-gray-500">
                                                {surat.status_disposisi === 'diajukan' 
                                                    ? `${auth.user.name} (Menunggu disposisi)` 
                                                    : `${auth.user.name} (Sudah disposisi)`}
                                            </p>
                                        </div>
                                    </div>

                                    {surat.pmo && (
                                        <>
                                            <div className="flex items-center gap-3">
                                                <ArrowRight className="w-4 h-4 text-gray-400" />
                                            </div>

                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                                                    <User className="w-4 h-4 text-purple-600" />
                                                </div>
                                                <div className="flex-1">
                                                    <p className="text-sm font-medium">PMO</p>
                                                    <p className="text-xs text-gray-500">{surat.pmo.name}</p>
                                                </div>
                                            </div>
                                        </>
                                    )}

                                    {surat.pegawai && (
                                        <>
                                            <div className="flex items-center gap-3">
                                                <ArrowRight className="w-4 h-4 text-gray-400" />
                                            </div>

                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center">
                                                    <User className="w-4 h-4 text-indigo-600" />
                                                </div>
                                                <div className="flex-1">
                                                    <p className="text-sm font-medium">Pegawai</p>
                                                    <p className="text-xs text-gray-500">{surat.pegawai.name}</p>
                                                </div>
                                            </div>
                                        </>
                                    )}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Riwayat Disposisi */}
                        {disposisiLogs.length > 0 && (
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <MessageSquare className="h-5 w-5" />
                                        Riwayat Disposisi
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        {disposisiLogs.map((log) => (
                                            <div key={log.id} className="border-l-2 border-gray-200 pl-4 pb-4">
                                                <div className="flex items-center gap-2 mb-2">
                                                    {getStatusLogBadge(log.status_baru)}
                                                    <span className="text-xs text-gray-500">
                                                        {new Date(log.created_at).toLocaleString('id-ID')}
                                                    </span>
                                                </div>
                                                <p className="text-sm font-medium">{log.changed_by.name}</p>
                                                <p className="text-xs text-gray-500">
                                                    {log.status_lama ? `${log.status_lama} → ${log.status_baru}` : `Status: ${log.status_baru}`}
                                                </p>
                                                {log.disposisi_ke_user && (
                                                    <p className="text-xs text-gray-500">
                                                        Ke: {log.disposisi_ke_user.name}
                                                    </p>
                                                )}
                                                {log.catatan && (
                                                    <p className="text-sm text-gray-700 mt-1 italic">"{log.catatan}"</p>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        )}
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
