import React from "react";
import { Link, useForm, usePage } from "@inertiajs/react";
import { Head } from "@inertiajs/react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import AppLayout from "@/layouts/app-layout";
import { ArrowLeft } from "lucide-react";
import { BreadcrumbItem } from "@/types";

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
};

type EditProps = {
    suratMasuk: SuratMasuk;
    kepalaUsers: User[];
};

export default function Edit() {
    const { props } = usePage<EditProps>();
    const { suratMasuk, kepalaUsers } = props;

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: '/admin/dashboard' },
        { title: 'Surat Masuk', href: '/admin/surat-masuk' },
        { title: suratMasuk.no_surat, href: `/admin/surat-masuk/${suratMasuk.id}` },
        { title: 'Edit', href: `/admin/surat-masuk/${suratMasuk.id}/edit` },
    ];

    const { data, setData, post, processing, errors } = useForm({
        no_agenda: suratMasuk.no_agenda,
        no_surat: suratMasuk.no_surat,
        tanggal_surat: suratMasuk.tanggal_surat,
        tanggal_diterima: suratMasuk.tanggal_diterima,
        pengirim: suratMasuk.pengirim,
        hal_surat: suratMasuk.hal_surat,
        jenis_surat: suratMasuk.jenis_surat,
        file_surat: null as File | null,
        tujuan_surat: suratMasuk.tujuan_surat,
        pesan_tambahan: suratMasuk.pesan_tambahan || "",
        _method: "PUT",
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(`/admin/surat-masuk/${suratMasuk.id}`, {
            forceFormData: true,
        });
    };

    const jenisOptions = [
        "Surat Masuk Biasa",
        "Surat Undangan",
        "Surat Pemberitahuan",
        "Surat Permohonan",
        "Surat Edaran",
        "Surat Tugas",
        "Surat Keputusan",
        "Disposisi",
        "Lainnya"
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Edit Surat - ${suratMasuk.no_surat}`} />
            
            <div className="w-full max-w-4xl mx-auto p-6 space-y-6">
                <div className="flex items-center gap-4">
                    <Link href={`/admin/surat-masuk/${suratMasuk.id}`} className="flex items-center justify-center w-10 h-10 rounded-lg border hover:bg-gray-50">
                        <ArrowLeft className="h-5 w-5" />
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold">Edit Surat Masuk</h1>
                        <p className="text-gray-600">{suratMasuk.no_surat}</p>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                    <form onSubmit={submit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* No Agenda */}
                            <div className="space-y-2">
                                <Label htmlFor="no_agenda">No Agenda *</Label>
                                <Input
                                    id="no_agenda"
                                    type="text"
                                    value={data.no_agenda}
                                    onChange={(e) => setData("no_agenda", e.target.value)}
                                    placeholder="Contoh: 001/2025"
                                />
                                {errors.no_agenda && (
                                    <p className="text-sm text-red-500">{errors.no_agenda}</p>
                                )}
                            </div>

                            {/* No Surat */}
                            <div className="space-y-2">
                                <Label htmlFor="no_surat">No Surat *</Label>
                                <Input
                                    id="no_surat"
                                    type="text"
                                    value={data.no_surat}
                                    onChange={(e) => setData("no_surat", e.target.value)}
                                    placeholder="Contoh: 123/ABC/2025"
                                />
                                {errors.no_surat && (
                                    <p className="text-sm text-red-500">{errors.no_surat}</p>
                                )}
                            </div>

                            {/* Tanggal Surat */}
                            <div className="space-y-2">
                                <Label htmlFor="tanggal_surat">Tanggal Surat *</Label>
                                <Input
                                    id="tanggal_surat"
                                    type="date"
                                    value={data.tanggal_surat}
                                    onChange={(e) => setData("tanggal_surat", e.target.value)}
                                />
                                {errors.tanggal_surat && (
                                    <p className="text-sm text-red-500">{errors.tanggal_surat}</p>
                                )}
                            </div>

                            {/* Tanggal Diterima */}
                            <div className="space-y-2">
                                <Label htmlFor="tanggal_diterima">Tanggal Diterima *</Label>
                                <Input
                                    id="tanggal_diterima"
                                    type="date"
                                    value={data.tanggal_diterima}
                                    onChange={(e) => setData("tanggal_diterima", e.target.value)}
                                />
                                {errors.tanggal_diterima && (
                                    <p className="text-sm text-red-500">{errors.tanggal_diterima}</p>
                                )}
                            </div>

                            {/* Pengirim */}
                            <div className="space-y-2">
                                <Label htmlFor="pengirim">Pengirim *</Label>
                                <Input
                                    id="pengirim"
                                    type="text"
                                    value={data.pengirim}
                                    onChange={(e) => setData("pengirim", e.target.value)}
                                    placeholder="Nama instansi/organisasi pengirim"
                                />
                                {errors.pengirim && (
                                    <p className="text-sm text-red-500">{errors.pengirim}</p>
                                )}
                            </div>

                            {/* Jenis Surat */}
                            <div className="space-y-2">
                                <Label htmlFor="jenis_surat">Jenis Surat *</Label>
                                <div className="space-y-2">
                                    <Select value={data.jenis_surat} onValueChange={(value) => setData("jenis_surat", value)}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Pilih jenis surat atau ketik manual di bawah" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {jenisOptions.map((jenis) => (
                                                <SelectItem key={jenis} value={jenis}>
                                                    {jenis}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <Input
                                        type="text"
                                        value={data.jenis_surat}
                                        onChange={(e) => setData("jenis_surat", e.target.value)}
                                        placeholder="Atau ketik jenis surat manual"
                                    />
                                </div>
                                {errors.jenis_surat && (
                                    <p className="text-sm text-red-500">{errors.jenis_surat}</p>
                                )}
                            </div>
                        </div>

                        {/* Hal Surat */}
                        <div className="space-y-2">
                            <Label htmlFor="hal_surat">Hal/Perihal Surat *</Label>
                            <Input
                                id="hal_surat"
                                type="text"
                                value={data.hal_surat}
                                onChange={(e) => setData("hal_surat", e.target.value)}
                                placeholder="Contoh: Undangan Rapat Koordinasi"
                            />
                            {errors.hal_surat && (
                                <p className="text-sm text-red-500">{errors.hal_surat}</p>
                            )}
                        </div>

                        {/* Tujuan Surat */}
                        <div className="space-y-2">
                            <Label htmlFor="tujuan_surat">Tujuan Surat *</Label>
                            <Input
                                id="tujuan_surat"
                                type="text"
                                value={data.tujuan_surat}
                                onChange={(e) => setData("tujuan_surat", e.target.value)}
                                placeholder="Kepada siapa surat ini ditujukan"
                            />
                            {errors.tujuan_surat && (
                                <p className="text-sm text-red-500">{errors.tujuan_surat}</p>
                            )}
                        </div>

                        {/* File Surat */}
                        <div className="space-y-2">
                            <Label htmlFor="file_surat">File Surat (PDF, DOC, DOCX, ODT - Max 10MB)</Label>
                            <div className="space-y-2">
                                <Input
                                    id="file_surat"
                                    type="file"
                                    accept=".pdf,.doc,.docx,.odt"
                                    onChange={(e) => {
                                        if (e.target.files && e.target.files[0]) {
                                            setData("file_surat", e.target.files[0]);
                                        }
                                    }}
                                />
                                {suratMasuk.file_surat && (
                                    <div className="text-sm text-gray-600">
                                        <p>File saat ini: <span className="font-medium">{suratMasuk.file_surat.split('/').pop()}</span></p>
                                        <a 
                                            href={`/storage/${suratMasuk.file_surat}`} 
                                            target="_blank" 
                                            rel="noopener noreferrer"
                                            className="text-blue-600 hover:underline text-xs"
                                        >
                                            Lihat/Download File
                                        </a>
                                        <p className="text-xs text-gray-500 mt-1">Kosongkan jika tidak ingin mengganti file</p>
                                    </div>
                                )}
                                {!suratMasuk.file_surat && (
                                    <p className="text-sm text-gray-500">
                                        <span className="text-xs">Belum ada file terupload, pilih file untuk mengupload</span>
                                    </p>
                                )}
                            </div>
                            {errors.file_surat && (
                                <p className="text-sm text-red-500">{errors.file_surat}</p>
                            )}
                        </div>

                        {/* Pesan Tambahan */}
                        <div className="space-y-2">
                            <Label htmlFor="pesan_tambahan">Pesan Tambahan (Opsional)</Label>
                            <Textarea
                                id="pesan_tambahan"
                                value={data.pesan_tambahan}
                                onChange={(e) => setData("pesan_tambahan", e.target.value)}
                                placeholder="Catatan atau pesan tambahan"
                                rows={3}
                            />
                            {errors.pesan_tambahan && (
                                <p className="text-sm text-red-500">{errors.pesan_tambahan}</p>
                            )}
                        </div>

                        {/* Status Information */}
                        <div className="bg-gray-50 p-4 rounded-lg">
                            <h3 className="font-medium text-gray-900 mb-2">Informasi Status</h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                                <div>
                                    <span className="text-gray-600">Status Disposisi:</span>
                                    <span className="ml-2 font-medium">{suratMasuk.status_disposisi}</span>
                                </div>
                                <div>
                                    <span className="text-gray-600">Status Baca:</span>
                                    <span className="ml-2 font-medium">{suratMasuk.status_baca}</span>
                                </div>
                                <div>
                                    <span className="text-gray-600">Status Tindak Lanjut:</span>
                                    <span className="ml-2 font-medium">{suratMasuk.status_tindak_lanjut}</span>
                                </div>
                            </div>
                        </div>

                        {/* Submit Buttons */}
                        <div className="flex gap-4 pt-4">
                            <Button type="submit" disabled={processing}>
                                {processing ? "Menyimpan..." : "Simpan Perubahan"}
                            </Button>
                            <Link href={`/admin/surat-masuk/${suratMasuk.id}`}>
                                <Button type="button" variant="outline">
                                    Batal
                                </Button>
                            </Link>
                        </div>
                    </form>
                </div>
            </div>
        </AppLayout>
    );
}
