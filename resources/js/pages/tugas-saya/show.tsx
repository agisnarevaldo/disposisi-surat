import React, { useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
    Calendar,
    User,
    Mail,
    FileText,
    CheckCircle,
    Clock,
    ArrowLeft,
    History,
    Send,
    Printer
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
    assignedUser?: { name: string };
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

interface TugasSayaShowProps {
    auth: any;
    surat: SuratMasuk;
    disposisiLogs: DisposisiLog[];
    flash?: {
        success?: string;
        error?: string;
    };
}

export default function TugasSayaShow({ auth, surat, disposisiLogs, flash }: TugasSayaShowProps) {
    const [isCompleting, setIsCompleting] = useState(false);

    const breadcrumbs = [
        { title: 'Dashboard', name: 'Dashboard', href: route('dashboard') },
        { title: 'Tugas Saya', name: 'Tugas Saya', href: route('tugas-saya.index') },
        { title: 'Detail Tugas', name: 'Detail Tugas', href: '#', current: true }
    ];

    const { data, setData, post, processing, errors } = useForm({
        catatan_selesai: ''
    });

    const handleComplete = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('tugas-saya.selesaikan', surat.id), {
            onSuccess: () => {
                setIsCompleting(false);
            }
        });
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'diajukan':
                return <Badge variant="default" className="bg-gray-50 text-gray-700 border-gray-200">
                    <FileText className="w-3 h-3 mr-1" />
                    Diajukan
                </Badge>;
            case 'kepala':
                return <Badge variant="default" className="bg-blue-50 text-blue-700 border-blue-200">
                    <User className="w-3 h-3 mr-1" />
                    Dengan Kepala
                </Badge>;
            case 'pmo':
                return <Badge variant="default" className="bg-purple-50 text-purple-700 border-purple-200">
                    <User className="w-3 h-3 mr-1" />
                    Dengan PMO
                </Badge>;
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

    const getStatusDisplay = (status: string) => {
        const statusMap: { [key: string]: string } = {
            'diajukan': 'Diajukan Admin',
            'kepala': 'Dengan Kepala',
            'pmo': 'Dengan PMO',
            'pegawai': 'Dengan Pegawai',
            'selesai': 'Selesai'
        };
        return statusMap[status] || status;
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Detail Tugas - ${surat.nomor_surat}`} />
            
            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link href={route('tugas-saya.index')}>
                            <Button variant="outline" size="sm">
                                <ArrowLeft className="h-4 w-4 mr-1" />
                                Kembali
                            </Button>
                        </Link>
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">{surat.nomor_surat}</h1>
                            <p className="text-gray-600">Detail tugas yang diberikan kepada Anda</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <Link href={route('tugas-saya.cetak', surat.id)}>
                            <Button variant="outline">
                                <Printer className="h-4 w-4 mr-2" />
                                Cetak
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

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Detail Surat */}
                    <div className="lg:col-span-2 space-y-6">
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
                                        <Label className="text-sm font-medium text-gray-600">Nomor Surat</Label>
                                        <p className="text-gray-900 font-semibold">{surat.nomor_surat}</p>
                                    </div>
                                    <div>
                                        <Label className="text-sm font-medium text-gray-600">Status</Label>
                                        <div className="mt-1">
                                            {getStatusBadge(surat.status_disposisi)}
                                        </div>
                                    </div>
                                    <div>
                                        <Label className="text-sm font-medium text-gray-600">Asal Surat</Label>
                                        <p className="text-gray-900">{surat.asal_surat}</p>
                                    </div>
                                    <div>
                                        <Label className="text-sm font-medium text-gray-600">Tanggal Surat</Label>
                                        <p className="text-gray-900">
                                            {new Date(surat.tanggal_surat).toLocaleDateString('id-ID')}
                                        </p>
                                    </div>
                                    <div>
                                        <Label className="text-sm font-medium text-gray-600">Tanggal Masuk</Label>
                                        <p className="text-gray-900">
                                            {new Date(surat.tanggal_masuk).toLocaleDateString('id-ID')}
                                        </p>
                                    </div>
                                    {surat.disposisi_at && (
                                        <div>
                                            <Label className="text-sm font-medium text-gray-600">Tanggal Disposisi</Label>
                                            <p className="text-gray-900">
                                                {new Date(surat.disposisi_at).toLocaleDateString('id-ID')}
                                            </p>
                                        </div>
                                    )}
                                </div>
                                
                                <div>
                                    <Label className="text-sm font-medium text-gray-600">Perihal</Label>
                                    <p className="text-gray-900 mt-1">{surat.perihal}</p>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Riwayat Disposisi */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <History className="h-5 w-5" />
                                    Riwayat Disposisi
                                </CardTitle>
                                <CardDescription>
                                    Jejak alur disposisi surat ini
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                {disposisiLogs.length > 0 ? (
                                    <div className="space-y-4">
                                        {disposisiLogs.map((log, index) => (
                                            <div key={log.id} className="flex gap-4">
                                                <div className="flex flex-col items-center">
                                                    <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
                                                    {index < disposisiLogs.length - 1 && (
                                                        <div className="w-px h-full bg-gray-300 mt-2"></div>
                                                    )}
                                                </div>
                                                <div className="flex-1 pb-4">
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <span className="font-medium text-gray-900">
                                                            {getStatusDisplay(log.status_baru)}
                                                        </span>
                                                        <span className="text-sm text-gray-500">
                                                            oleh {log.changed_by.name}
                                                        </span>
                                                        {log.disposisi_ke_user && (
                                                            <span className="text-sm text-gray-500">
                                                                → ke {log.disposisi_ke_user.name}
                                                            </span>
                                                        )}
                                                    </div>
                                                    <p className="text-sm text-gray-600">
                                                        {new Date(log.created_at).toLocaleDateString('id-ID', {
                                                            year: 'numeric',
                                                            month: 'long',
                                                            day: 'numeric',
                                                            hour: '2-digit',
                                                            minute: '2-digit'
                                                        })}
                                                    </p>
                                                    {log.catatan && (
                                                        <div className="mt-2 p-3 bg-gray-50 rounded-md">
                                                            <p className="text-sm text-gray-700">
                                                                <strong>Catatan:</strong> {log.catatan}
                                                            </p>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-gray-500 text-center py-4">
                                        Belum ada riwayat disposisi
                                    </p>
                                )}
                            </CardContent>
                        </Card>
                    </div>

                    {/* Panel Aksi */}
                    <div className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <User className="h-5 w-5" />
                                    Informasi Penanggung Jawab
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {surat.admin && (
                                    <div>
                                        <Label className="text-sm font-medium text-gray-600">Admin</Label>
                                        <p className="text-gray-900">{surat.admin.name}</p>
                                    </div>
                                )}
                                {surat.kepala && (
                                    <div>
                                        <Label className="text-sm font-medium text-gray-600">Kepala</Label>
                                        <p className="text-gray-900">{surat.kepala.name}</p>
                                    </div>
                                )}
                                {surat.pmo && (
                                    <div>
                                        <Label className="text-sm font-medium text-gray-600">PMO</Label>
                                        <p className="text-gray-900">{surat.pmo.name}</p>
                                    </div>
                                )}
                                {surat.pegawai && (
                                    <div>
                                        <Label className="text-sm font-medium text-gray-600">Ditugaskan Kepada</Label>
                                        <p className="text-gray-900">{surat.pegawai.name}</p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Aksi Tugas */}
                        {surat.status_disposisi === 'pegawai' && (
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <CheckCircle className="h-5 w-5" />
                                        Selesaikan Tugas
                                    </CardTitle>
                                    <CardDescription>
                                        Tandai tugas ini sebagai selesai
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    {!isCompleting ? (
                                        <Button 
                                            onClick={() => setIsCompleting(true)}
                                            className="w-full"
                                        >
                                            <CheckCircle className="h-4 w-4 mr-2" />
                                            Selesaikan Tugas
                                        </Button>
                                    ) : (
                                        <form onSubmit={handleComplete} className="space-y-4">
                                            <div>
                                                <Label htmlFor="catatan_selesai">Catatan Penyelesaian</Label>
                                                <Textarea
                                                    id="catatan_selesai"
                                                    value={data.catatan_selesai}
                                                    onChange={(e) => setData('catatan_selesai', e.target.value)}
                                                    placeholder="Tambahkan catatan penyelesaian tugas (opsional)"
                                                    className="mt-1"
                                                />
                                                {errors.catatan_selesai && (
                                                    <p className="text-red-600 text-sm mt-1">{errors.catatan_selesai}</p>
                                                )}
                                            </div>
                                            <div className="flex gap-2">
                                                <Button 
                                                    type="submit" 
                                                    disabled={processing}
                                                    className="flex-1"
                                                >
                                                    <Send className="h-4 w-4 mr-2" />
                                                    {processing ? 'Menyimpan...' : 'Selesaikan'}
                                                </Button>
                                                <Button 
                                                    type="button"
                                                    variant="outline"
                                                    onClick={() => setIsCompleting(false)}
                                                >
                                                    Batal
                                                </Button>
                                            </div>
                                        </form>
                                    )}
                                </CardContent>
                            </Card>
                        )}

                        {surat.status_disposisi === 'selesai' && (
                            <Card>
                                <CardContent className="pt-6">
                                    <div className="text-center">
                                        <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-2" />
                                        <h3 className="font-medium text-gray-900 mb-1">Tugas Selesai</h3>
                                        <p className="text-sm text-gray-600">
                                            Tugas ini telah diselesaikan
                                        </p>
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
