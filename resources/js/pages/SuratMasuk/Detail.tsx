import React, { useEffect, useState } from "react";
import { Head, Link, usePage, router } from "@inertiajs/react";
import { Button } from "@/components/ui/button";
import AppLayout from "@/layouts/app-layout";
import { BreadcrumbItem } from "@/types";

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
            <div className="flex flex-col gap-4 p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <table className="w-full text-sm">
                            <tbody>
                                <tr><td className="font-semibold w-40">No Agenda</td><td>{surat.no_agenda}</td></tr>
                                <tr><td className="font-semibold">No Surat</td><td>{surat.no_surat}</td></tr>
                                <tr><td className="font-semibold">Tanggal Surat</td><td>{surat.tanggal_surat}</td></tr>
                                <tr><td className="font-semibold">Tanggal Diterima</td><td>{surat.tanggal_diterima}</td></tr>
                                <tr><td className="font-semibold">Pengirim</td><td>{surat.pengirim}</td></tr>
                                <tr><td className="font-semibold">Tujuan Surat</td><td>{surat.tujuan_surat}</td></tr>
                                <tr><td className="font-semibold">Hal Surat</td><td>{surat.hal_surat}</td></tr>
                                <tr><td className="font-semibold">Jenis Surat</td><td>{surat.jenis_surat}</td></tr>
                                <tr><td className="font-semibold">Status Baca</td><td>{marked ? 'dibaca' : surat.status_baca}</td></tr>
                                <tr><td className="font-semibold">Status Tindak Lanjut</td><td>{surat.status_tindak_lanjut}</td></tr>
                                {surat.pesan_tambahan && <tr><td className="font-semibold">Pesan Tambahan</td><td>{surat.pesan_tambahan}</td></tr>}
                            </tbody>
                        </table>
                    </div>
                    <div>
                        <div className="mb-2 font-semibold">Preview Surat (PDF):</div>
                        <div className="border rounded shadow overflow-hidden w-full h-96 bg-gray-50">
                            <iframe
                                src={surat.file_surat.startsWith('http') ? surat.file_surat : `/storage/${surat.file_surat}`}
                                title="Preview Surat"
                                className="w-full h-full"
                                frameBorder={0}
                            />
                        </div>
                        <a
                            href={surat.file_surat.startsWith('http') ? surat.file_surat : `/storage/${surat.file_surat}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mt-2 inline-block text-blue-600 hover:underline text-xs"
                            download
                        >
                            Download Surat (PDF)
                        </a>
                    </div>
                </div>
                <div className="flex gap-2 mt-4">
                    <Link href={`/surat-masuk/${surat.id}/edit`}>
                        <Button variant="secondary">Edit</Button>
                    </Link>
                    <Button
                        variant="destructive"
                        onClick={() => {
                            if (confirm('Yakin ingin menghapus surat ini?')) {
                                router.delete(`/surat-masuk/${surat.id}`, {
                                    onSuccess: () => router.visit('/surat-masuk'),
                                });
                            }
                        }}
                    >
                        Hapus
                    </Button>
                </div>
            </div>
        </AppLayout>
    );
}
