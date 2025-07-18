import React, { useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import {
    User,
    FileText,
    CheckCircle,
    Clock,
    ArrowLeft,
    History,
    Send,
    Printer,
    Users,
    Forward,
    Download,
    Eye,
    Maximize2,
    Minimize2
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

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

interface DisposisiLog {
    id: number;
    status_lama: string;
    status_baru: string;
    catatan?: string;
    created_at: string;
    changed_by: { name: string };
    disposisi_ke_user?: { name: string };
}

interface TugasShowProps {
    auth: {
        user: {
            id: number;
            name: string;
            role: string;
            can_dispose: boolean;
        };
    };
    surat: SuratMasuk;
    disposisiLogs: DisposisiLog[];
    pegawaiTanpaPrivilege?: Array<{
        id: number;
        name: string;
        email: string;
    }>;
    flash?: {
        success?: string;
        error?: string;
    };
}

export default function TugasShow({ auth, surat, disposisiLogs, pegawaiTanpaPrivilege = [], flash }: TugasShowProps) {
    const [isCompleting, setIsCompleting] = useState(false);
    const [isDelegating, setIsDelegating] = useState(false);
    const [isPreviewExpanded, setIsPreviewExpanded] = useState(false);

    const breadcrumbs = [
        { title: 'Dashboard', name: 'Dashboard', href: route('pegawai.dashboard') },
        { title: 'Tugas Disposisi', name: 'Tugas Disposisi', href: route('pegawai.tugas.index') },
        { title: 'Detail Tugas', name: 'Detail Tugas', href: '#', current: true }
    ];

    const { data, setData, post, processing, errors } = useForm({
        catatan_selesai: ''
    });

    const { data: delegasiData, setData: setDelegasiData, post: postDelegasi, processing: processingDelegasi, errors: delegasiErrors, reset: resetDelegasi } = useForm({
        pegawai_ids: [] as number[],
        catatan: ''
    });

    const handleComplete = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('pegawai.tugas.selesaikan', surat.id), {
            onSuccess: () => {
                setIsCompleting(false);
            }
        });
    };

    const handleDelegasi = (e: React.FormEvent) => {
        e.preventDefault();
        postDelegasi(route('pegawai.tugas.delegasi', surat.id), {
            onSuccess: () => {
                resetDelegasi();
                setIsDelegating(false);
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

            <div className="container mx-auto p-4">
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-4">
                        <Link href={route('pegawai.dashboard')}>
                            <Button variant="outline" size="sm">
                                <ArrowLeft className="h-4 w-4 mr-1" />
                                Kembali
                            </Button>
                        </Link>
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">{surat.nomor_surat}</h1>
                            <p className="text-gray-600">Detail tugas disposisi surat</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <Link href={route('pegawai.tugas.cetak', surat.id)}>
                            <Button variant="outline">
                                <Printer className="h-4 w-4 mr-2" />
                                Cetak Disposisi
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

                {/* Main Content - Tabs Layout */}
                <Tabs defaultValue="preview" className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="preview" className="flex items-center gap-2">
                            <Eye className="h-4 w-4" />
                            Preview Dokumen
                        </TabsTrigger>
                        <TabsTrigger value="details" className="flex items-center gap-2">
                            <FileText className="h-4 w-4" />
                            Detail & Tugas
                        </TabsTrigger>
                    </TabsList>

                    {/* PDF Preview Tab */}
                    <TabsContent value="preview" className="space-y-4">
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="flex items-center gap-2">
                                    <FileText className="h-5 w-5" />
                                    Preview Dokumen: {surat.nomor_surat}
                                </CardTitle>
                                <div className="flex items-center gap-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => setIsPreviewExpanded(!isPreviewExpanded)}
                                        className="gap-2"
                                    >
                                        {isPreviewExpanded ? (
                                            <>
                                                <Minimize2 className="h-4 w-4" />
                                                Minimize
                                            </>
                                        ) : (
                                            <>
                                                <Maximize2 className="h-4 w-4" />
                                                Expand
                                            </>
                                        )}
                                    </Button>
                                    <Button variant="outline" size="sm" asChild>
                                        <a href={`/pegawai/surat/${surat.id}/view`} target="_blank" rel="noopener noreferrer">
                                            <Download className="h-4 w-4 mr-2" />
                                            Download
                                        </a>
                                    </Button>
                                </div>
                            </CardHeader>
                            <CardContent className="p-0">
                                <div className={`bg-gray-100 rounded-lg ${isPreviewExpanded ? 'h-screen' : 'h-96 md:h-[600px]'} transition-all duration-300`}>
                                    <iframe
                                        src={`/pegawai/surat/${surat.id}/view`}
                                        title={`Preview ${surat.nomor_surat}`}
                                        className="w-full h-full rounded-lg border-0"
                                        loading="lazy"
                                    />
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Details & Tugas Tab */}
                    <TabsContent value="details" className="space-y-6">
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
                                            <p className="text-gray-900 mt-1 p-3 bg-gray-50 rounded-md">{surat.perihal}</p>
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
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-4">
                                            {disposisiLogs.map((log, index) => (
                                                <div key={log.id} className="flex gap-4">
                                                    <div className="flex flex-col items-center">
                                                        <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                                                        {index < disposisiLogs.length - 1 && (
                                                            <div className="w-px h-full bg-gray-300 mt-2"></div>
                                                        )}
                                                    </div>
                                                    <div className="flex-1 pb-4">
                                                        <div className="flex items-center gap-2 mb-1">
                                                            <p className="font-medium text-gray-900">
                                                                {getStatusDisplay(log.status_baru)}
                                                            </p>
                                                            <span className="text-sm text-gray-500">
                                                                {new Date(log.created_at).toLocaleDateString('id-ID')}
                                                            </span>
                                                        </div>
                                                        <p className="text-sm text-gray-600">
                                                            Oleh: {log.changed_by.name}
                                                            {log.disposisi_ke_user && (
                                                                <> → {log.disposisi_ke_user.name}</>
                                                            )}
                                                        </p>
                                                        {log.catatan && (
                                                            <p className="text-sm text-gray-700 mt-1 p-2 bg-gray-50 rounded">
                                                                {log.catatan}
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>

                            {/* Sidebar */}
                            <div className="space-y-6">
                                {/* Informasi Disposisi */}
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2 text-lg">
                                            <User className="h-5 w-5" />
                                            Alur Disposisi
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-3">
                                        <div className="space-y-3">
                                            {surat.admin && (
                                                <div className="flex items-center gap-2 text-sm">
                                                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                                    <span className="text-gray-600">Admin:</span>
                                                    <span className="font-medium">{surat.admin.name}</span>
                                                </div>
                                            )}
                                            {surat.kepala && (
                                                <div className="flex items-center gap-2 text-sm">
                                                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                                    <span className="text-gray-600">Kepala:</span>
                                                    <span className="font-medium">{surat.kepala.name}</span>
                                                </div>
                                            )}
                                            {surat.pmo && (
                                                <div className="flex items-center gap-2 text-sm">
                                                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                                    <span className="text-gray-600">PMO:</span>
                                                    <span className="font-medium">{surat.pmo.name}</span>
                                                </div>
                                            )}
                                            {surat.pegawai && (
                                                <div className="flex items-center gap-2 text-sm">
                                                    <div className={`w-2 h-2 rounded-full ${surat.status_disposisi === 'selesai' ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
                                                    <span className="text-gray-600">Pegawai:</span>
                                                    <span className="font-medium">{surat.pegawai.name}</span>
                                                    {surat.status_disposisi === 'pegawai' && (
                                                        <Badge variant="secondary" className="text-xs">Anda</Badge>
                                                    )}
                                                </div>
                                            )}
                                            
                                            {/* Tampilkan semua pegawai yang ditugaskan */}
                                            {surat.assignments && surat.assignments.length > 0 && (
                                                <div className="mt-3 p-3 bg-gray-50 rounded-md">
                                                    <p className="text-sm font-medium text-gray-700 mb-2">Pegawai yang ditugaskan:</p>
                                                    <div className="space-y-2">
                                                        {surat.assignments.map((assignment, index) => (
                                                            <div key={index} className="flex items-center gap-2 text-sm">
                                                                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                                                <span className="font-medium">{assignment.user.name}</span>
                                                                <span className="text-gray-500">({assignment.user.email})</span>
                                                                {assignment.user.id === auth.user.id && (
                                                                    <Badge variant="secondary" className="text-xs">Anda</Badge>
                                                                )}
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* Form Delegasi untuk Pegawai Privileged */}
                                {surat.status_disposisi === 'pegawai' && auth.user.can_dispose && pegawaiTanpaPrivilege.length > 0 && (
                                    <Card>
                                        <CardHeader>
                                            <CardTitle className="flex items-center gap-2 text-lg">
                                                <Forward className="h-5 w-5" />
                                                Delegasikan Tugas
                                            </CardTitle>
                                            <CardDescription>
                                                Tugaskan kepada pegawai lain untuk menyelesaikan
                                            </CardDescription>
                                        </CardHeader>
                                        <CardContent>
                                            {!isDelegating ? (
                                                <Button
                                                    onClick={() => setIsDelegating(true)}
                                                    variant="outline"
                                                    className="w-full"
                                                >
                                                    <Users className="h-4 w-4 mr-2" />
                                                    Delegasikan ke Pegawai Lain
                                                </Button>
                                            ) : (
                                                <form onSubmit={handleDelegasi} className="space-y-4">
                                                    <div>
                                                        <Label htmlFor="pegawai_ids">Pilih Pegawai *</Label>
                                                        <div className="flex gap-2 mt-2 mb-2">
                                                            <Button
                                                                type="button"
                                                                variant="outline"
                                                                size="sm"
                                                                onClick={() => {
                                                                    const allIds = pegawaiTanpaPrivilege.map(p => p.id);
                                                                    setDelegasiData('pegawai_ids', allIds);
                                                                }}
                                                            >
                                                                Pilih Semua
                                                            </Button>
                                                            <Button
                                                                type="button"
                                                                variant="outline"
                                                                size="sm"
                                                                onClick={() => setDelegasiData('pegawai_ids', [])}
                                                            >
                                                                Bersihkan
                                                            </Button>
                                                        </div>
                                                        <div className="mt-2 space-y-2 border rounded-md p-3 max-h-48 overflow-y-auto">
                                                            {pegawaiTanpaPrivilege.length === 0 ? (
                                                                <p className="text-gray-500 text-sm">Tidak ada pegawai tanpa privilege yang tersedia</p>
                                                            ) : (
                                                                pegawaiTanpaPrivilege.map((pegawai) => (
                                                                    <div key={pegawai.id} className="flex items-center space-x-2">
                                                                        <Checkbox
                                                                            id={`pegawai-${pegawai.id}`}
                                                                            checked={delegasiData.pegawai_ids.includes(pegawai.id)}
                                                                            onCheckedChange={(checked) => {
                                                                                if (checked) {
                                                                                    setDelegasiData('pegawai_ids', [...delegasiData.pegawai_ids, pegawai.id]);
                                                                                } else {
                                                                                    setDelegasiData('pegawai_ids', delegasiData.pegawai_ids.filter(id => id !== pegawai.id));
                                                                                }
                                                                            }}
                                                                        />
                                                                        <Label htmlFor={`pegawai-${pegawai.id}`} className="cursor-pointer">
                                                                            <div>
                                                                                <div className="font-medium">{pegawai.name}</div>
                                                                                <div className="text-sm text-gray-500">{pegawai.email}</div>
                                                                            </div>
                                                                        </Label>
                                                                    </div>
                                                                ))
                                                            )}
                                                        </div>
                                                        <div className="text-sm text-gray-600 mt-2">
                                                            {delegasiData.pegawai_ids.length} pegawai dipilih
                                                        </div>
                                                        {delegasiErrors.pegawai_ids && (
                                                            <p className="text-red-600 text-sm mt-1">{delegasiErrors.pegawai_ids}</p>
                                                        )}
                                                    </div>
                                                    <div>
                                                        <Label htmlFor="catatan">Catatan Delegasi</Label>
                                                        <Textarea
                                                            id="catatan"
                                                            placeholder="Berikan instruksi atau catatan untuk pegawai..."
                                                            value={delegasiData.catatan}
                                                            onChange={(e) => setDelegasiData('catatan', e.target.value)}
                                                            rows={3}
                                                        />
                                                        {delegasiErrors.catatan && (
                                                            <p className="text-red-600 text-sm mt-1">{delegasiErrors.catatan}</p>
                                                        )}
                                                    </div>
                                                    <div className="flex gap-2">
                                                        <Button
                                                            type="submit"
                                                            disabled={processingDelegasi || delegasiData.pegawai_ids.length === 0}
                                                            className="flex-1"
                                                        >
                                                            <Forward className="h-4 w-4 mr-2" />
                                                            {processingDelegasi ? 'Memproses...' : `Delegasikan ke ${delegasiData.pegawai_ids.length} Pegawai`}
                                                        </Button>
                                                        <Button
                                                            type="button"
                                                            variant="outline"
                                                            onClick={() => setIsDelegating(false)}
                                                        >
                                                            Batal
                                                        </Button>
                                                    </div>
                                                </form>
                                            )}
                                        </CardContent>
                                    </Card>
                                )}

                                {/* Form Penyelesaian */}
                                {surat.status_disposisi === 'pegawai' && (
                                    <Card>
                                        <CardHeader>
                                            <CardTitle className="flex items-center gap-2 text-lg">
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
                                                        <textarea
                                                            id="catatan_selesai"
                                                            value={data.catatan_selesai}
                                                            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setData('catatan_selesai', e.target.value)}
                                                            placeholder="Berikan catatan tentang bagaimana tugas ini diselesaikan..."
                                                            rows={4}
                                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                                                            {processing ? 'Memproses...' : 'Selesaikan'}
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
                                        <CardContent className="p-4">
                                            <div className="text-center">
                                                <CheckCircle className="h-12 w-12 mx-auto text-green-600 mb-2" />
                                                <h3 className="font-medium text-green-900">Tugas Selesai</h3>
                                                <p className="text-sm text-green-700">
                                                    Tugas disposisi ini telah diselesaikan
                                                </p>
                                            </div>
                                        </CardContent>
                                    </Card>
                                )}
                            </div>
                        </div>
                    </TabsContent>
                </Tabs>
            </div>
        </AppLayout>
    );
}
