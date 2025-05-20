import React, { useState } from "react";
import { Head, Link, usePage } from "@inertiajs/react";
import { Button } from "@/components/ui/button";
import AppLayout from "@/layouts/app-layout";
import { BreadcrumbItem } from "@/types";
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "@/components/ui/table";
import { EyeIcon, PencilIcon, Trash2Icon } from "lucide-react";

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
                            <Button className="dark:text-white">+ Tambah Surat</Button>
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
                                            <Link href={`/surat-masuk/${surat.id}`} className="flex items-center text-blue-600 hover:underline px-2 py-1 rounded border border-blue-100 bg-blue-50 text-xs"><EyeIcon /></Link>
                                            <Link href={`/surat-masuk/${surat.id}/edit`} className="flex items-center text-yellow-600 hover:underline px-2 py-1 rounded border border-yellow-100 bg-yellow-50 text-xs"><PencilIcon /></Link>
                                            <Button
                                                variant="destructive"
                                                className="text-red-600 hover:bg-red-100 px-2 py-1 rounded border border-red-100 bg-red-50 text-xs cursor-pointer"
                                                onClick={() => {
                                                    if (confirm("Apakah Anda yakin ingin menghapus surat ini?")) {
                                                        // Call delete function here
                                                    }
                                                }}
                                            >
                                                <Trash2Icon />
                                            </Button>
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
