import React, { useState } from "react";
import { Head, Link, router, usePage } from "@inertiajs/react";
import { Button } from "@/components/ui/button";
import AppLayout from "@/layouts/app-layout";
import { BreadcrumbItem } from "@/types";
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "@/components/ui/table";
import { EyeIcon, PencilIcon, Trash2Icon } from "lucide-react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Surat Masuk', href: '/surat-masuk' },
];

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
    pesan_tambahan?: string;
};

export default function Index() {
    const { props } = usePage();
    const suratMasuks: SuratMasuk[] = (props.suratMasuks ?? []) as SuratMasuk[];
    const [statusBaca, setStatusBaca] = useState<string>("all");
    const [jenis, setJenis] = useState<string>("all");

    // Ambil semua jenis unik dari data
    const jenisOptions = Array.from(new Set(suratMasuks.map(s => s.jenis_surat).filter(Boolean)));
    const statusBacaOptions = Array.from(new Set(suratMasuks.map(s => s.status_baca).filter(Boolean)));

    // Filter data client-side
    const filtered = suratMasuks.filter(surat => {
        const statusMatch = statusBaca === "all" || surat.status_baca === statusBaca;
        const jenisMatch = jenis === "all" || surat.jenis_surat === jenis;
        return statusMatch && jenisMatch;
    });

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Surat Masuk" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
                    <h1 className="text-2xl font-bold">Daftar Surat Masuk</h1>
                    <div className="flex gap-2 items-center">
                        {/* Filter status baca */}
                        <select value={statusBaca} onChange={e => setStatusBaca(e.target.value)} className="border rounded px-2 py-1">
                            <option value="all">Semua Status Baca</option>
                            {statusBacaOptions.map(opt => (
                                <option key={opt} value={opt}>{opt}</option>
                            ))}
                        </select>
                        {/* Filter jenis surat */}
                        <select value={jenis} onChange={e => setJenis(e.target.value)} className="border rounded px-2 py-1">
                            <option value="all">Semua Jenis</option>
                            {jenisOptions.map(opt => (
                                <option key={opt} value={opt}>{opt}</option>
                            ))}
                        </select>
                        <Link href="/surat-masuk/create">
                            <Button className="dark:text-white cursor-pointer">+ Tambah Surat</Button>
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
                                <TableHead>Tanggal Diterima</TableHead>
                                <TableHead>Pengirim</TableHead>
                                <TableHead>Status Baca</TableHead>
                                <TableHead>Jenis Surat</TableHead>
                                <TableHead>Tujuan Surat</TableHead>
                                <TableHead>Aksi</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filtered.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={8} className="text-center text-gray-500">Belum ada surat masuk.</TableCell>
                                </TableRow>
                            ) : (
                                filtered.map((surat) => (
                                    <TableRow key={surat.id}>
                                        <TableCell>{surat.no_agenda}</TableCell>
                                        <TableCell>{surat.no_surat}</TableCell>
                                        <TableCell>{surat.tanggal_surat}</TableCell>
                                        <TableCell>{surat.tanggal_diterima}</TableCell>
                                        <TableCell>{surat.pengirim}</TableCell>
                                        <TableCell>{surat.status_baca}</TableCell>
                                        <TableCell>{surat.jenis_surat}</TableCell>
                                        <TableCell>{surat.tujuan_surat}</TableCell>
                                        <TableCell className="flex gap-2">
                                            <Link
                                                href={`/surat-masuk/${surat.id}`}
                                                className="text-secondary bg-secondary/10 hover:bg-secondary/20 px-2 py-1 rounded border text-xs"
                                            >
                                                <EyeIcon />
                                            </Link>
                                            <Link
                                                href={`/surat-masuk/${surat.id}/edit`}
                                                className="text-accent bg-accent/10 hover:bg-accent/20 px-2 py-1 rounded border border-blue-10 text-xs"
                                            >
                                                <PencilIcon />
                                            </Link>
                                            <AlertDialog>
                                                <AlertDialogTrigger asChild>
                                                    <Button
                                                        variant="destructive"
                                                        className="px-2 py-1 rounded bordertext-xs cursor-pointer"
                                                    >
                                                        <Trash2Icon />
                                                    </Button>
                                                </AlertDialogTrigger>
                                                <AlertDialogContent>
                                                    <AlertDialogHeader>
                                                        <AlertDialogTitle>Hapus Surat Keluar?</AlertDialogTitle>
                                                        <AlertDialogDescription>
                                                            Apakah Anda yakin ingin menghapus surat keluar ini? Tindakan ini tidak dapat dibatalkan.
                                                        </AlertDialogDescription>
                                                    </AlertDialogHeader>
                                                    <AlertDialogFooter>
                                                        <AlertDialogCancel className="cursor-pointer">Batal</AlertDialogCancel>
                                                        <AlertDialogAction
                                                            className="bg-destructive text-neutral-50 hover:bg-destructive/90 cursor-pointer"
                                                            onClick={() => router.delete(`/surat-masuk/${surat.id}`, { preserveScroll: true })}
                                                        >
                                                            Hapus
                                                        </AlertDialogAction>
                                                    </AlertDialogFooter>
                                                </AlertDialogContent>
                                            </AlertDialog>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>
            </div>
        </AppLayout>
    );
}
