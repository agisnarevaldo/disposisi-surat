import React, { useState } from "react";
import { Head, Link, usePage, router } from "@inertiajs/react";
import { Button } from "@/components/ui/button";
import AppLayout from "@/layouts/app-layout";
import { BreadcrumbItem } from "@/types";
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "@/components/ui/table";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Surat Keluar', href: '/surat-keluar' },
];

type SuratKeluar = {
    id: number;
    no_surat: string;
    tanggal_surat: string;
    kepada: string;
    status: string;
    jenis_surat?: string;
    pembuat?: { name: string };
};

export default function Index() {
    const { props } = usePage();
    const suratKeluars: SuratKeluar[] = (props.suratKeluars ?? []) as SuratKeluar[];
    const [status, setStatus] = useState<string>("all");
    const [jenis, setJenis] = useState<string>("all");

    // Ambil semua jenis unik dari data
    const jenisOptions = Array.from(new Set(suratKeluars.map(s => s.jenis_surat).filter((v): v is string => typeof v === "string")));
    const statusOptions = Array.from(new Set(suratKeluars.map(s => s.status).filter((v): v is string => typeof v === "string")));

    // Filter data client-side
    const filtered = suratKeluars.filter(surat => {
        const statusMatch = status === "all" || surat.status === status;
        const jenisMatch = jenis === "all" || surat.jenis_surat === jenis;
        return statusMatch && jenisMatch;
    });

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Surat Keluar" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
                    <h1 className="text-2xl font-bold">Daftar Surat Keluar</h1>
                    <div className="flex gap-2 items-center">
                        <Select value={status} onValueChange={setStatus}>
                            <SelectTrigger className="w-[140px]">
                                <SelectValue placeholder="Status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Semua Status</SelectItem>
                                {statusOptions.map(opt => (
                                    <SelectItem key={opt} value={opt}>{opt}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <Select value={jenis} onValueChange={setJenis}>
                            <SelectTrigger className="w-[140px]">
                                <SelectValue placeholder="Jenis Surat" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Semua Jenis</SelectItem>
                                {jenisOptions.map(opt => (
                                    <SelectItem key={opt} value={opt}>{opt}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <Link href="/surat-keluar/create">
                            <Button className="dark:text-white">+ Tambah Surat</Button>
                        </Link>
                    </div>
                </div>
                <div className="rounded-xl shadow p-2 overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>No Surat</TableHead>
                                <TableHead>Tanggal</TableHead>
                                <TableHead>Kepada</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Jenis Surat</TableHead>
                                <TableHead>Dibuat oleh</TableHead>
                                <TableHead>Aksi</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filtered.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={8} className="text-center text-gray-500">Belum ada surat keluar.</TableCell>
                                </TableRow>
                            ) : (
                                filtered.map((surat) => (
                                    <TableRow key={surat.id}>
                                        <TableCell>{surat.no_surat}</TableCell>
                                        <TableCell>{surat.tanggal_surat}</TableCell>
                                        <TableCell>{surat.kepada}</TableCell>
                                        <TableCell>
                                            <Select
                                                value={surat.status}
                                                onValueChange={val => {
                                                    if (val !== surat.status) {
                                                        router.post(`/surat-keluar/${surat.id}/status`, { status: val }, { preserveScroll: true });
                                                    }
                                                }}
                                            >
                                                <SelectTrigger className="w-[120px]">
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="pending">Pending</SelectItem>
                                                    <SelectItem value="ditindaklanjuti">Ditindaklanjuti</SelectItem>
                                                    <SelectItem value="selesai">Selesai</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </TableCell>
                                        <TableCell>{surat.jenis_surat ?? '-'}</TableCell>
                                        <TableCell>{surat.pembuat?.name ?? '—'}</TableCell>
                                        <TableCell>
                                            <Link
                                                href={`/surat-keluar/${surat.id}`}
                                                className="text-blue-600 hover:underline px-2 py-1 rounded border border-blue-100 bg-blue-50 text-xs"
                                            >
                                                Detail
                                            </Link>
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
