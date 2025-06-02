import React, { useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { 
    FileEdit, 
    Clock, 
    Users, 
    CheckCircle, 
    Send,
    Calendar,
    ArrowLeft,
    User,
    Building,
    Mail,
    MessageSquare,
    History,
    AlertCircle
} from 'lucide-react';
import { BreadcrumbItem } from '@/types';

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
}

interface PegawaiUser {
    id: number;
    name: string;
    email: string;
}

interface DisposisiLog {
    id: number;
    status_lama: string;
    status_baru: string;
    catatan?: string;
    created_at: string;
    changed_by: { name: string };
    disposisi_ke_user?: { name: string };
}

interface ShowProps {
    auth: {
        user: {
            id: number;
            name: string;
            email: string;
            role: string;
            can_dispose?: boolean;
        };
    };
    surat: SuratMasuk;
    pegawaiUsers: PegawaiUser[];
    disposisiLogs: DisposisiLog[];
    flash?: {
        success?: string;
        error?: string;
    };
}

export default function DisposisiShow({ auth, surat, pegawaiUsers, disposisiLogs, flash }: ShowProps) {
    const [isDisposing, setIsDisposing] = useState(false);
    
    const { data, setData, post, processing, errors, reset } = useForm({
        pegawai_id: '',
        catatan: ''
    });

   const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Disposisi Surat',
            href: route('pmo.disposisi.index'),
        },
        {
            title: `Detail Surat - ${surat.nomor_surat}`,
            href: route('pmo.disposisi.show', surat.id),
        },
    ];

    const handleDisposisi = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('pmo.disposisi.to-pegawai', surat.id), {
            onSuccess: () => {
                reset();
                setIsDisposing(false);
            }
        });
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'diajukan':
                return <Badge variant="default" className="bg-gray-50 text-gray-700 border-gray-200">
                    <Clock className="w-3 h-3 mr-1" />
                    Diajukan
                </Badge>;
            case 'kepala':
                return <Badge variant="default" className="bg-orange-50 text-orange-700 border-orange-200">
                    <User className="w-3 h-3 mr-1" />
                    Dengan Kepala
                </Badge>;
            case 'pmo':
                return <Badge variant="default" className="bg-yellow-50 text-yellow-700 border-yellow-200">
                    <Clock className="w-3 h-3 mr-1" />
                    Menunggu Disposisi PMO
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

    const getStatusText = (statusLama: string, statusBaru: string) => {
        const statusMap: Record<string, string> = {
            'diajukan': 'Diajukan',
            'kepala': 'Kepala',
            'pmo': 'PMO',
            'pegawai': 'Pegawai',
            'selesai': 'Selesai'
        };
        return `${statusMap[statusLama]} → ${statusMap[statusBaru]}`;
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Detail Surat - ${surat.nomor_surat}`} />
            
            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Detail Surat Masuk</h1>
                        <p className="text-gray-600">Kelola disposisi surat kepada pegawai</p>
                    </div>
                    <Link href={route('pmo.disposisi.index')}>
                        <Button variant="outline">
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Kembali
                        </Button>
                    </Link>
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

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Surat Details */}
                    <div className="lg:col-span-2 space-y-6">
                        <Card>
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <CardTitle className="flex items-center gap-2">
                                        <Mail className="h-5 w-5" />
                                        Informasi Surat
                                    </CardTitle>
                                    {getStatusBadge(surat.status_disposisi)}
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <Label className="text-sm font-medium text-gray-600">Nomor Surat</Label>
                                        <p className="font-semibold">{surat.nomor_surat}</p>
                                    </div>
                                    <div>
                                        <Label className="text-sm font-medium text-gray-600">Asal Surat</Label>
                                        <p className="font-semibold">{surat.asal_surat}</p>
                                    </div>
                                    <div>
                                        <Label className="text-sm font-medium text-gray-600">Tanggal Surat</Label>
                                        <p className="flex items-center gap-1">
                                            <Calendar className="w-4 h-4" />
                                            {new Date(surat.tanggal_surat).toLocaleDateString('id-ID')}
                                        </p>
                                    </div>
                                    <div>
                                        <Label className="text-sm font-medium text-gray-600">Tanggal Masuk</Label>
                                        <p className="flex items-center gap-1">
                                            <Calendar className="w-4 h-4" />
                                            {new Date(surat.tanggal_masuk).toLocaleDateString('id-ID')}
                                        </p>
                                    </div>
                                </div>
                                
                                <div>
                                    <Label className="text-sm font-medium text-gray-600">Perihal</Label>
                                    <p className="font-semibold">{surat.perihal}</p>
                                </div>

                                {/* Workflow Status */}
                                <div className="pt-4 border-t">
                                    <Label className="text-sm font-medium text-gray-600 mb-3 block">Alur Disposisi</Label>
                                    <div className="flex items-center gap-2 text-sm flex-wrap">
                                        {surat.admin && (
                                            <Badge variant="outline">
                                                <Building className="w-3 h-3 mr-1" />
                                                Admin: {surat.admin.name}
                                            </Badge>
                                        )}
                                        {surat.kepala && (
                                            <>
                                                <span>→</span>
                                                <Badge variant="outline">
                                                    <User className="w-3 h-3 mr-1" />
                                                    Kepala: {surat.kepala.name}
                                                </Badge>
                                            </>
                                        )}
                                        {surat.pmo && (
                                            <>
                                                <span>→</span>
                                                <Badge variant="outline" className="bg-blue-50">
                                                    <User className="w-3 h-3 mr-1" />
                                                    PMO: {surat.pmo.name}
                                                </Badge>
                                            </>
                                        )}
                                        {surat.pegawai && (
                                            <>
                                                <span>→</span>
                                                <Badge variant="outline">
                                                    <User className="w-3 h-3 mr-1" />
                                                    Pegawai: {surat.pegawai.name}
                                                </Badge>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Disposisi Form */}
                        {surat.status_disposisi === 'pmo' && 
                         auth.user.role === 'pmo' && 
                         (auth.user.can_dispose !== false) && (
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Send className="h-5 w-5" />
                                        Disposisi ke Pegawai
                                    </CardTitle>
                                    <CardDescription>
                                        Pilih pegawai yang akan menangani surat ini
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    {pegawaiUsers.length === 0 ? (
                                        <div className="text-center py-6">
                                            <AlertCircle className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
                                            <h3 className="text-lg font-medium text-gray-900 mb-2">
                                                Tidak Ada Pegawai yang Tersedia
                                            </h3>
                                            <p className="text-gray-600">
                                                Tidak ada pegawai dengan hak disposisi yang tersedia saat ini. 
                                                Hubungi administrator untuk mengatur hak disposisi pegawai.
                                            </p>
                                        </div>
                                    ) : !isDisposing ? (
                                        <Button onClick={() => setIsDisposing(true)} className="w-full">
                                            <Send className="h-4 w-4 mr-2" />
                                            Mulai Disposisi
                                        </Button>
                                    ) : (
                                        <form onSubmit={handleDisposisi} className="space-y-4">
                                            <div>
                                                <Label htmlFor="pegawai_id">Pilih Pegawai *</Label>
                                                <Select value={data.pegawai_id} onValueChange={(value) => setData('pegawai_id', value)}>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Pilih pegawai yang akan menangani surat" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {pegawaiUsers.map((pegawai) => (
                                                            <SelectItem key={pegawai.id} value={pegawai.id.toString()}>
                                                                <div>
                                                                    <div className="font-medium">{pegawai.name}</div>
                                                                    <div className="text-sm text-gray-500">{pegawai.email}</div>
                                                                </div>
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                                {errors.pegawai_id && <p className="text-sm text-red-600 mt-1">{errors.pegawai_id}</p>}
                                            </div>

                                            <div>
                                                <Label htmlFor="catatan">Catatan Disposisi</Label>
                                                <Textarea
                                                    id="catatan"
                                                    placeholder="Berikan instruksi atau catatan untuk pegawai..."
                                                    value={data.catatan}
                                                    onChange={(e) => setData('catatan', e.target.value)}
                                                    rows={4}
                                                />
                                                {errors.catatan && <p className="text-sm text-red-600 mt-1">{errors.catatan}</p>}
                                            </div>

                                            <div className="flex gap-3">
                                                <Button type="submit" disabled={processing} className="flex-1">
                                                    {processing ? 'Memproses...' : 'Disposisi ke Pegawai'}
                                                </Button>
                                                <Button 
                                                    type="button" 
                                                    variant="outline" 
                                                    onClick={() => setIsDisposing(false)}
                                                    disabled={processing}
                                                >
                                                    Batal
                                                </Button>
                                            </div>
                                        </form>
                                    )}
                                </CardContent>
                            </Card>
                        )}

                        {/* Information for completed dispositions */}
                        {surat.status_disposisi === 'pegawai' && (
                            <Card>
                                <CardContent className="p-4">
                                    <div className="flex items-center gap-3 text-blue-700 bg-blue-50 p-3 rounded-lg">
                                        <AlertCircle className="h-5 w-5" />
                                        <div>
                                            <p className="font-medium">Surat sedang ditangani</p>
                                            <p className="text-sm">Surat ini sedang ditangani oleh {surat.pegawai?.name}</p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        )}

                        {surat.status_disposisi === 'selesai' && (
                            <Card>
                                <CardContent className="p-4">
                                    <div className="flex items-center gap-3 text-green-700 bg-green-50 p-3 rounded-lg">
                                        <CheckCircle className="h-5 w-5" />
                                        <div>
                                            <p className="font-medium">Surat telah selesai</p>
                                            <p className="text-sm">Surat ini telah diselesaikan oleh {surat.pegawai?.name}</p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        )}
                    </div>

                    {/* Riwayat Disposisi */}
                    <div className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <History className="h-5 w-5" />
                                    Riwayat Disposisi
                                </CardTitle>
                                <CardDescription>
                                    Catatan perubahan status surat
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                {disposisiLogs.length > 0 ? (
                                    <div className="space-y-4">
                                        {disposisiLogs.map((log) => (
                                            <div key={log.id} className="border-l-2 border-gray-200 pl-4 pb-4">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <Badge variant="outline" className="text-xs">
                                                        {getStatusText(log.status_lama, log.status_baru)}
                                                    </Badge>
                                                    <span className="text-xs text-gray-500">
                                                        {new Date(log.created_at).toLocaleDateString('id-ID', {
                                                            day: 'numeric',
                                                            month: 'short',
                                                            year: 'numeric',
                                                            hour: '2-digit',
                                                            minute: '2-digit'
                                                        })}
                                                    </span>
                                                </div>
                                                <p className="text-sm text-gray-600 mb-1">
                                                    Oleh: {log.changed_by.name}
                                                </p>
                                                {log.disposisi_ke_user && (
                                                    <p className="text-sm text-gray-600 mb-1">
                                                        Kepada: {log.disposisi_ke_user.name}
                                                    </p>
                                                )}
                                                {log.catatan && (
                                                    <div className="bg-gray-50 p-2 rounded text-sm mt-2">
                                                        <MessageSquare className="w-3 h-3 inline mr-1" />
                                                        {log.catatan}
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-6 text-gray-500">
                                        <History className="h-8 w-8 mx-auto mb-2 opacity-50" />
                                        <p>Belum ada riwayat disposisi</p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
