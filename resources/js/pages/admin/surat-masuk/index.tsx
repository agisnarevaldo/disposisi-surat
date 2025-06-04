import React, { useState } from "react";
import { Head, Link, router, usePage } from "@inertiajs/react";
import { Button } from "@/components/ui/button";
import AppLayout from "@/layouts/app-layout";
import { BreadcrumbItem } from "@/types";
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "@/components/ui/table";
import { EyeIcon, PencilIcon, Trash2Icon, Send, Download, CheckCircle, XCircle } from "lucide-react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/admin/dashboard' },
    { title: 'Surat Masuk', href: '/admin/surat-masuk' },
];

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

export default function Index() {
    const { props } = usePage();
    const suratMasuks: SuratMasuk[] = (props.suratMasuks ?? []) as SuratMasuk[];
    const [statusFilter, setStatusFilter] = useState<string>("all");
    const [jenisFilter, setJenisFilter] = useState<string>("all");

    // Ambil opsi filter yang unik
    const statusOptions = Array.from(new Set(suratMasuks.map(s => s.status_disposisi).filter(Boolean)));
    const jenisOptions = Array.from(new Set(suratMasuks.map(s => s.jenis_surat).filter(Boolean)));

    // Filter data
    const filtered = suratMasuks.filter(surat => {
        const statusMatch = statusFilter === "all" || surat.status_disposisi === statusFilter;
        const jenisMatch = jenisFilter === "all" || surat.jenis_surat === jenisFilter;
        return statusMatch && jenisMatch;
    });

    const handleDelete = (id: number) => {
        router.delete(`/admin/surat-masuk/${id}`, {
            preserveScroll: true,
            onSuccess: () => {
                // Optional: Show success message
            }
        });
    };

    const handleMarkAsRead = (id: number) => {
        router.post(`/admin/surat-masuk/${id}/mark-as-read`, {}, { preserveScroll: true });
    };

    const handleMarkAsUnread = (id: number) => {
        router.post(`/admin/surat-masuk/${id}/mark-as-unread`, {}, { preserveScroll: true });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Surat Masuk - Admin" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
                    <h1 className="text-2xl font-bold">Daftar Surat Masuk</h1>
                    <div className="flex gap-2 items-center">
                        {/* Filter status disposisi */}
                        <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value)}>
                            <SelectTrigger>
                                <SelectValue placeholder="Semua Status Surat" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Semua Status Surat</SelectItem>
                                {statusOptions.map((opt) => (
                                    <SelectItem key={opt} value={opt}>
                                        Status Surat: {opt.toUpperCase()}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <Select value={jenisFilter} onValueChange={(value) => setJenisFilter(value)}>
                            <SelectTrigger>
                                <SelectValue placeholder="Pilih Jenis Surat" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Semua Jenis Surat</SelectItem>
                                {jenisOptions.map((opt) => (
                                    <SelectItem key={opt} value={opt}>
                                        {opt}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        <Link href="/admin/surat-masuk/create">
                            <Button>+ Tambah Surat</Button>
                        </Link>
                    </div>
                </div>

                <div className="rounded-xl shadow p-2 overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>No Agenda</TableHead>
                                <TableHead>No Surat</TableHead>
                                <TableHead>Tanggal Surat</TableHead>
                                <TableHead>Pengirim</TableHead>
                                <TableHead>Hal Surat</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Status Baca</TableHead>
                                <TableHead>Disposisi Ke</TableHead>
                                <TableHead>Aksi</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filtered.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={9} className="text-center text-gray-500 py-8">
                                        Belum ada surat masuk.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                filtered.map((surat) => (
                                    <TableRow key={surat.id}>
                                        <TableCell className="font-medium">{surat.no_agenda}</TableCell>
                                        <TableCell>{surat.no_surat}</TableCell>
                                        <TableCell>{new Date(surat.tanggal_surat).toLocaleDateString('id-ID')}</TableCell>
                                        <TableCell>{surat.pengirim}</TableCell>
                                        <TableCell className="max-w-xs truncate">{surat.hal_surat}</TableCell>
                                        <TableCell>{getStatusBadge(surat.status_disposisi)}</TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                <span className={`text-xs px-2 py-1 rounded ${surat.status_baca === 'dibaca'
                                                    ? 'bg-green-100 text-green-800'
                                                    : 'bg-red-100 text-red-800'
                                                    }`}>
                                                    {surat.status_baca}
                                                </span>
                                                {surat.status_baca === 'dibaca' ? (
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => handleMarkAsUnread(surat.id)}
                                                        className="p-1 h-auto"
                                                    >
                                                        <XCircle className="h-4 w-4" />
                                                    </Button>
                                                ) : (
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => handleMarkAsRead(surat.id)}
                                                        className="p-1 h-auto"
                                                    >
                                                        <CheckCircle className="h-4 w-4" />
                                                    </Button>
                                                )}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            {surat.kepala && (
                                                <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                                                    {surat.kepala.name}
                                                </span>
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex gap-1">
                                                {/* View */}
                                                <Link
                                                    href={`/admin/surat-masuk/${surat.id}`}
                                                    className="text-blue-600 hover:text-blue-800 p-1"
                                                    title="Lihat Detail"
                                                >
                                                    <EyeIcon className="h-4 w-4" />
                                                </Link>

                                                {/* Edit - hanya jika masih draft atau diajukan */}
                                                {['draft', 'diajukan'].includes(surat.status_disposisi) && (
                                                    <Link
                                                        href={`/admin/surat-masuk/${surat.id}/edit`}
                                                        className="text-green-600 hover:text-green-800 p-1"
                                                        title="Edit"
                                                    >
                                                        <PencilIcon className="h-4 w-4" />
                                                    </Link>
                                                )}

                                                {/* Ajukan ke Kepala - hanya jika status draft */}
                                                {surat.status_disposisi === 'draft' && (
                                                    <Link
                                                        href={`/admin/surat-masuk/${surat.id}/ajukan`}
                                                        className="text-purple-600 hover:text-purple-800 p-1"
                                                        title="Ajukan ke Kepala"
                                                    >
                                                        <Send className="h-4 w-4" />
                                                    </Link>
                                                )}

                                                {/* Download */}
                                                <a
                                                    href={`/admin/surat-masuk/${surat.id}/download`}
                                                    className="text-orange-600 hover:text-orange-800 p-1"
                                                    title="Download File"
                                                >
                                                    <Download className="h-4 w-4" />
                                                </a>

                                                {/* Delete - hanya jika masih draft */}
                                                {surat.status_disposisi === 'draft' && (
                                                    <AlertDialog>
                                                        <AlertDialogTrigger asChild>
                                                            <button
                                                                className="text-red-600 hover:text-red-800 p-1"
                                                                title="Hapus"
                                                            >
                                                                <Trash2Icon className="h-4 w-4" />
                                                            </button>
                                                        </AlertDialogTrigger>
                                                        <AlertDialogContent>
                                                            <AlertDialogHeader>
                                                                <AlertDialogTitle>Hapus Surat Masuk?</AlertDialogTitle>
                                                                <AlertDialogDescription>
                                                                    Apakah Anda yakin ingin menghapus surat masuk "{surat.no_surat}"?
                                                                    Tindakan ini tidak dapat dibatalkan.
                                                                </AlertDialogDescription>
                                                            </AlertDialogHeader>
                                                            <AlertDialogFooter>
                                                                <AlertDialogCancel>Batal</AlertDialogCancel>
                                                                <AlertDialogAction
                                                                    onClick={() => handleDelete(surat.id)}
                                                                    className="bg-red-600 hover:bg-red-700"
                                                                >
                                                                    Hapus
                                                                </AlertDialogAction>
                                                            </AlertDialogFooter>
                                                        </AlertDialogContent>
                                                    </AlertDialog>
                                                )}
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>

                {/* Stats Summary */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4">
                    <Card className="">
                        <CardContent>
                            <h3 className="text-sm font-medium text-gray-500">Total Surat</h3>
                            <p className="text-2xl font-bold">{suratMasuks.length}</p>
                        </CardContent>
                    </Card>
                    <Card className="">
                        <CardContent>
                            <h3 className="text-sm font-medium text-gray-500">Draft</h3>
                            <p className="text-2xl font-bold text-gray-600">
                                {suratMasuks.filter(s => s.status_disposisi === 'draft').length}
                            </p>
                        </CardContent>
                    </Card>
                    <Card className="">
                        <CardContent>
                            <h3 className="text-sm font-medium text-gray-500">Diajukan</h3>
                            <p className="text-2xl font-bold text-blue-600">
                                {suratMasuks.filter(s => s.status_disposisi === 'diajukan').length}
                            </p>
                        </CardContent>
                    </Card>
                    <Card className="">
                        <CardContent>
                            <h3 className="text-sm font-medium text-gray-500">Proses</h3>
                            <p className="text-2xl font-bold text-green-600">
                                {suratMasuks.filter(s => ['kepala', 'pmo', 'pegawai'].includes(s.status_disposisi)).length}
                            </p>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}
