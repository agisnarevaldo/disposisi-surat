import React from "react";
import { Link, usePage, router } from "@inertiajs/react";
import { Head } from "@inertiajs/react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import AppLayout from "@/layouts/app-layout";
import { ArrowLeft, Download, Edit, Send, Trash2 } from "lucide-react";
import { BreadcrumbItem } from "@/types";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";

type User = {
    id: number;
    name: string;
    email: string;
    role: string;
};

type SuratMasuk = {
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
    disposisi_at?: string;
    admin?: User;
    kepala?: User;
    pmo?: User;
    pegawai?: User;
    created_at: string;
    updated_at: string;
};

type ShowProps = {
    suratMasuk: SuratMasuk;
};

const getStatusBadge = (status: string) => {
    const variants: Record<string, { variant: "default" | "secondary" | "destructive" | "outline"; label: string; color: string }> = {
        'draft': { variant: 'outline', label: 'Draft', color: 'text-gray-600' },
        'diajukan': { variant: 'secondary', label: 'Diajukan', color: 'text-blue-600' },
        'kepala': { variant: 'default', label: 'Di Kepala', color: 'text-purple-600' },
        'pmo': { variant: 'default', label: 'Di PMO', color: 'text-orange-600' },
        'pegawai': { variant: 'default', label: 'Di Pegawai', color: 'text-indigo-600' },
        'selesai': { variant: 'secondary', label: 'Selesai', color: 'text-white' },
    };
    
    const config = variants[status] || { variant: 'outline', label: status, color: 'text-gray-600' };
    return <Badge variant={config.variant} className={config.color}>{config.label}</Badge>;
};

export default function Show() {
    const { props } = usePage<ShowProps>();
    const { suratMasuk } = props;

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: '/admin/dashboard' },
        { title: 'Surat Masuk', href: '/admin/surat-masuk' },
        { title: suratMasuk.no_surat, href: `/admin/surat-masuk/${suratMasuk.id}` },
    ];

    const handleDelete = () => {
        router.delete(`/admin/surat-masuk/${suratMasuk.id}`, {
            onSuccess: () => {
                router.visit('/admin/surat-masuk');
            }
        });
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('id-ID', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const formatDateTime = (dateString: string) => {
        return new Date(dateString).toLocaleString('id-ID', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Detail Surat - ${suratMasuk.no_surat}`} />
            
            <div className="container flex flex-col gap-4 mx-auto p-4">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link href="/admin/surat-masuk" className="flex items-center justify-center w-10 h-10 rounded-lg border hover:bg-gray-50">
                            <ArrowLeft className="h-5 w-5" />
                        </Link>
                        <div>
                            <h1 className="text-2xl font-bold">Detail Surat Masuk</h1>
                            <p className="text-gray-600">{suratMasuk.no_surat}</p>
                        </div>
                    </div>
                    
                    <div className="flex gap-2">
                        {/* Download */}
                        <a
                            href={`/admin/surat-masuk/${suratMasuk.id}/download`}
                            className="inline-flex items-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700"
                        >
                            <Download className="h-4 w-4" />
                            Download
                        </a>
                        
                        {/* Edit - hanya jika masih draft atau diajukan */}
                        {['draft', 'diajukan'].includes(suratMasuk.status_disposisi) && (
                            <Link
                                href={`/admin/surat-masuk/${suratMasuk.id}/edit`}
                                className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                            >
                                <Edit className="h-4 w-4" />
                                Edit
                            </Link>
                        )}
                        
                        {/* Ajukan ke Kepala - hanya jika status draft */}
                        {suratMasuk.status_disposisi === 'draft' && (
                            <Link
                                href={`/admin/surat-masuk/${suratMasuk.id}/ajukan`}
                                className="inline-flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                            >
                                <Send className="h-4 w-4" />
                                Ajukan ke Kepala
                            </Link>
                        )}
                        
                        {/* Delete - hanya jika masih draft */}
                        {suratMasuk.status_disposisi === 'draft' && (
                            <AlertDialog>
                                <AlertDialogTrigger asChild>
                                    <Button variant="destructive" className="gap-2">
                                        <Trash2 className="h-4 w-4" />
                                        Hapus
                                    </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                    <AlertDialogHeader>
                                        <AlertDialogTitle>Hapus Surat Masuk?</AlertDialogTitle>
                                        <AlertDialogDescription>
                                            Apakah Anda yakin ingin menghapus surat masuk "{suratMasuk.no_surat}"? 
                                            Tindakan ini tidak dapat dibatalkan.
                                        </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                        <AlertDialogCancel>Batal</AlertDialogCancel>
                                        <AlertDialogAction
                                            onClick={handleDelete}
                                            className="bg-red-600 hover:bg-red-700"
                                        >
                                            Hapus
                                        </AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>
                        )}
                    </div>
                </div>

                {/* Status Badge */}
                <div className="flex items-center gap-4">
                    {getStatusBadge(suratMasuk.status_disposisi)}
                    <Badge variant={suratMasuk.status_baca === 'dibaca' ? 'default' : 'destructive'}>
                        {suratMasuk.status_baca}
                    </Badge>
                </div>

                {/* Detail Cards */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Informasi Surat */}
                    <div className="bg-white rounded-lg shadow p-6">
                        <h2 className="text-lg font-semibold mb-4">Informasi Surat</h2>
                        <div className="space-y-3">
                            <div>
                                <label className="block text-sm font-medium text-gray-500">No Agenda</label>
                                <p className="text-base">{suratMasuk.no_agenda}</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-500">No Surat</label>
                                <p className="text-base font-medium">{suratMasuk.no_surat}</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-500">Tanggal Surat</label>
                                <p className="text-base">{formatDate(suratMasuk.tanggal_surat)}</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-500">Tanggal Diterima</label>
                                <p className="text-base">{formatDate(suratMasuk.tanggal_diterima)}</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-500">Pengirim</label>
                                <p className="text-base">{suratMasuk.pengirim}</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-500">Jenis Surat</label>
                                <p className="text-base">{suratMasuk.jenis_surat}</p>
                            </div>
                        </div>
                    </div>

                    {/* Konten Surat */}
                    <div className="bg-white rounded-lg shadow p-6">
                        <h2 className="text-lg font-semibold mb-4">Konten Surat</h2>
                        <div className="space-y-3">
                            <div>
                                <label className="block text-sm font-medium text-gray-500">Hal/Perihal</label>
                                <p className="text-base">{suratMasuk.hal_surat}</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-500">Tujuan Surat</label>
                                <p className="text-base">{suratMasuk.tujuan_surat}</p>
                            </div>
                            {suratMasuk.pesan_tambahan && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-500">Pesan Tambahan</label>
                                    <p className="text-base">{suratMasuk.pesan_tambahan}</p>
                                </div>
                            )}
                            <div>
                                <label className="block text-sm font-medium text-gray-500">File Surat</label>
                                <a
                                    href={`/admin/surat-masuk/${suratMasuk.id}/download`}
                                    className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800"
                                >
                                    <Download className="h-4 w-4" />
                                    {suratMasuk.file_surat.split('/').pop()}
                                </a>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Timeline Disposisi */}
                <div className="bg-white rounded-lg shadow p-6">
                    <h2 className="text-lg font-semibold mb-4">Timeline Disposisi</h2>
                    <div className="space-y-4">
                        {/* Admin */}
                        <div className="flex items-start gap-4">
                            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                                <span className="text-blue-600 font-semibold text-sm">A</span>
                            </div>
                            <div>
                                <p className="font-medium">Dibuat oleh Admin</p>
                                <p className="text-sm text-gray-600">{suratMasuk.admin?.name}</p>
                                <p className="text-xs text-gray-500">{formatDateTime(suratMasuk.created_at)}</p>
                            </div>
                        </div>

                        {/* Kepala */}
                        {suratMasuk.kepala && (
                            <div className="flex items-start gap-4">
                                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                                    <span className="text-purple-600 font-semibold text-sm">K</span>
                                </div>
                                <div>
                                    <p className="font-medium">Diajukan ke Kepala</p>
                                    <p className="text-sm text-gray-600">{suratMasuk.kepala.name}</p>
                                    {suratMasuk.disposisi_at && (
                                        <p className="text-xs text-gray-500">{formatDateTime(suratMasuk.disposisi_at)}</p>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* PMO */}
                        {suratMasuk.pmo && (
                            <div className="flex items-start gap-4">
                                <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                                    <span className="text-orange-600 font-semibold text-sm">P</span>
                                </div>
                                <div>
                                    <p className="font-medium">Diteruskan ke PMO</p>
                                    <p className="text-sm text-gray-600">{suratMasuk.pmo.name}</p>
                                </div>
                            </div>
                        )}

                        {/* Pegawai */}
                        {suratMasuk.pegawai && (
                            <div className="flex items-start gap-4">
                                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                                    <span className="text-green-600 font-semibold text-sm">P</span>
                                </div>
                                <div>
                                    <p className="font-medium">Diteruskan ke Pegawai</p>
                                    <p className="text-sm text-gray-600">{suratMasuk.pegawai.name}</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Informasi Sistem */}
                <div className="bg-gray-50 rounded-lg p-4">
                    <h3 className="text-sm font-medium text-gray-700 mb-2">Informasi Sistem</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                        <div>
                            <span className="font-medium">Dibuat:</span> {formatDateTime(suratMasuk.created_at)}
                        </div>
                        <div>
                            <span className="font-medium">Terakhir diperbarui:</span> {formatDateTime(suratMasuk.updated_at)}
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
