import React, { useEffect, useState } from "react";
import { Head, Link, usePage, router } from "@inertiajs/react";
import AppLayout from "@/layouts/app-layout";
import { BreadcrumbItem } from "@/types";
import { ArrowLeft } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import DetailInfoItem from "@/components/detail-info-item";

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Surat Masuk', href: '/surat-masuk' },
    { title: 'Detail Surat Masuk', href: '#' },
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

export default function Detail() {
    const { props } = usePage();
    const surat: SuratMasuk = props.suratMasuk as SuratMasuk;
    const [marked, setMarked] = useState(false);

    useEffect(() => {
        if (surat.status_baca !== 'dibaca' && !marked) {
            router.post(`/surat-masuk/${surat.id}/mark-as-read`, {}, {
                preserveScroll: true,
                onSuccess: () => setMarked(true),
            });
        }
    }, [surat.id, surat.status_baca, marked]);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Detail Surat Masuk - ${surat.no_surat}`} />
            <div className="w-full mx-auto p-6 space-y-6">
                <div className="flex items-center gap-4">
                    <Link href="/surat-masuk">
                        <ArrowLeft className="md:inline" />
                    </Link>
                    <h1 className="text-2xl font-bold">Detail Surat Masuk</h1>
                </div>

                <Card>
                    <CardContent className="flex flex-col gap-4 pb-2">
                        <div className="flex items-center justify-between">
                            <h2 className="font-semibold">Informasi Surat</h2>
                            <div className="flex gap-2">
                                <Link href={`/surat-masuk/${surat.id}/edit`} className="text-blue-500 hover:underline">
                                    Edit
                                </Link>
                                {/* Hapus */}
                                <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                        <span className="text-red-500 cursor-pointer hover:underline">
                                            Hapus
                                        </span>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                        <AlertDialogHeader>
                                            <AlertDialogTitle>Hapus Surat Masuk?</AlertDialogTitle>
                                            <AlertDialogDescription>
                                                Apakah Anda yakin ingin menghapus surat masuk ini? Tindakan ini tidak dapat dibatalkan.
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
                            </div>
                        </div>
                    </CardContent>
                    <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-4">
                        <DetailInfoItem label="No Agenda" value={surat.no_agenda} />
                        <DetailInfoItem label="No Surat" value={surat.no_surat} />
                        <DetailInfoItem label="Tanggal Surat" value={surat.tanggal_surat} />
                        <DetailInfoItem label="Tanggal Diterima" value={surat.tanggal_diterima} />
                        <DetailInfoItem label="Pengirim" value={surat.pengirim} />
                        <DetailInfoItem label="Tujuan Surat" value={surat.tujuan_surat} />
                        <DetailInfoItem label="Hal Surat" value={surat.hal_surat} />
                        <DetailInfoItem label="Jenis Surat" value={surat.jenis_surat} />
                        <DetailInfoItem label="Status Baca" value={marked ? 'dibaca' : surat.status_baca} />
                        <DetailInfoItem label="Status Tindak Lanjut" value={surat.status_tindak_lanjut} />
                        {surat.pesan_tambahan && <DetailInfoItem label="Pesan Tambahan" value={surat.pesan_tambahan} />}
                    </CardContent>
                </Card>
                <div className="mt-6">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="font-semibold mb-2">Preview Dokumen</h2>
                        {/* <Link
                            href={surat.file_surat.startsWith('http') ? surat.file_surat : `/storage/${surat.file_surat}`}
                            className="mt-2 inline-block text-blue-600 hover:underline text-xs"
                        >
                            <ArrowUpRight className="w-4 h-4 inline" />
                        </Link> */}
                    </div>
                    {surat.file_surat && (
                        <iframe
                            src={surat.file_surat.startsWith('http') ? surat.file_surat : `/storage/${surat.file_surat}`}
                            title="Preview Surat"
                            className="w-full h-96 border rounded shadow"
                            frameBorder={0}
                        />
                    )}
                    {!surat.file_surat && (
                        <div className="text-center text-gray-500">
                            Belum ada file surat yang diunggah.
                        </div>
                    )}
                </div>

            </div>
        </AppLayout>
    );
}
