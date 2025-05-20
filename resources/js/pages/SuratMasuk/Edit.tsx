import React from "react";
import { Head, useForm, usePage, router } from "@inertiajs/react";
import { Button } from "@/components/ui/button";
import AppLayout from "@/layouts/app-layout";
import { BreadcrumbItem } from "@/types";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Surat Masuk', href: '/surat-masuk' },
    { title: 'Edit Surat Masuk', href: '#' },
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

export default function Edit() {
    const { props } = usePage();
    const surat: SuratMasuk = props.suratMasuk as SuratMasuk;
    const { data, setData, processing } = useForm({
        no_agenda: surat.no_agenda,
        no_surat: surat.no_surat,
        tanggal_surat: surat.tanggal_surat,
        tanggal_diterima: surat.tanggal_diterima,
        pengirim: surat.pengirim,
        hal_surat: surat.hal_surat,
        jenis_surat: surat.jenis_surat,
        tujuan_surat: surat.tujuan_surat,
        status_tindak_lanjut: surat.status_tindak_lanjut,
        pesan_tambahan: surat.pesan_tambahan || '',
        file_surat: undefined as File | undefined,
    });

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        const formData = new FormData();
        Object.entries(data).forEach(([key, value]) => {
            if (value !== undefined && value !== null) {
                if (value instanceof File) {
                    formData.append(key, value);
                } else {
                    formData.append(key, String(value));
                }
            }
        });
        formData.append('_method', 'PUT');
        router.post(`/surat-masuk/${surat.id}`, formData, {
            forceFormData: true,
        });
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Edit Surat Masuk" />
            <div className="flex flex-col gap-4 p-4">
                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-2">
                        <Label>No Agenda</Label>
                        <Input type="text" value={data.no_agenda} onChange={e => setData('no_agenda', e.target.value)} className="Input" />
                        <Label>No Surat</Label>
                        <Input type="text" value={data.no_surat} onChange={e => setData('no_surat', e.target.value)} className="Input" />
                        <Label>Tanggal Surat</Label>
                        <Input type="date" value={data.tanggal_surat} onChange={e => setData('tanggal_surat', e.target.value)} className="Input" />
                        <Label>Tanggal Diterima</Label>
                        <Input type="date" value={data.tanggal_diterima} onChange={e => setData('tanggal_diterima', e.target.value)} className="Input" />
                        <Label>Pengirim</Label>
                        <Input type="text" value={data.pengirim} onChange={e => setData('pengirim', e.target.value)} className="Input" />
                        <Label>Tujuan Surat</Label>
                        <Input type="text" value={data.tujuan_surat} onChange={e => setData('tujuan_surat', e.target.value)} className="Input" />
                        <Label>Hal Surat</Label>
                        <Input type="text" value={data.hal_surat} onChange={e => setData('hal_surat', e.target.value)} className="Input" />
                        <Label>Jenis Surat</Label>
                        <Input type="text" value={data.jenis_surat} onChange={e => setData('jenis_surat', e.target.value)} className="Input" />
                        <Label>Status Tindak Lanjut</Label>
                        <Input type="text" value={data.status_tindak_lanjut} onChange={e => setData('status_tindak_lanjut', e.target.value)} className="Input" />
                        <Label>Pesan Tambahan</Label>
                        <Input type="text" value={data.pesan_tambahan} onChange={e => setData('pesan_tambahan', e.target.value)} className="Input" />
                    </div>
                    <div className="flex flex-col gap-2">
                        <Label>File Surat (PDF, kosongkan jika tidak diganti)</Label>
                        <Input type="file" accept="application/pdf" onChange={e => setData('file_surat', e.target.files?.[0])} />
                        {surat.file_surat && (
                            <a href={surat.file_surat.startsWith('http') ? surat.file_surat : `/storage/${surat.file_surat}`} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-600 hover:underline mt-1">Lihat File Saat Ini</a>
                        )}
                        <Button type="submit" className="mt-4" disabled={processing}>Simpan Perubahan</Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
