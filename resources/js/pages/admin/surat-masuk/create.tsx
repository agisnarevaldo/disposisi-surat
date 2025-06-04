import React, { useEffect } from "react";
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
    jabatan?: string;
};

type CreateProps = {
    usersCanDispose: User[];
};

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/admin/dashboard' },
    { title: 'Surat Masuk', href: '/admin/surat-masuk' },
    { title: 'Tambah', href: '/admin/surat-masuk/create' },
];

export default function Create() {
    const { props } = usePage<CreateProps>();
    const { usersCanDispose } = props;

    const { data, setData, post, processing, errors } = useForm({
        no_agenda: "",
        no_surat: "",
        tanggal_surat: "",
        tanggal_diterima: "",
        pengirim: "",
        hal_surat: "",
        jenis_surat: "",
        file_surat: null as File | null,
        tujuan_surat: "",
        pesan_tambahan: "",
        user_id: "", // untuk pengajuan langsung ke user dengan privilege
    });

    // Generate default no agenda saat component mount
    useEffect(() => {
        const generateNoAgenda = () => {
            const currentYear = new Date().getFullYear();
            const currentMonth = String(new Date().getMonth() + 1).padStart(2, '0');
            const randomNumber = Math.floor(Math.random() * 900) + 100; // 3 digit random
            return `${randomNumber}/${currentMonth}/${currentYear}`;
        };

        if (!data.no_agenda) {
            setData("no_agenda", generateNoAgenda());
        }
    }, []);

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post("/admin/surat-masuk", {
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
            <Head title="Tambah Surat Masuk - Admin" />
            
            <div className="flex flex-col gap-6 p-4">
                <div className="flex items-center gap-4">
                    <Link href="/admin/surat-masuk" className="flex items-center justify-center w-10 h-10 rounded-lg border hover:bg-accent">
                        <ArrowLeft className="h-5 w-5" />
                    </Link>
                    <h1 className="text-2xl font-bold">Tambah Surat Masuk</h1>
                </div>

                <div className="container mx-auto p-6">
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
                                    placeholder="Contoh: 001/01/2025"
                                />
                                <p className="text-xs text-gray-500">
                                    No agenda akan di-generate otomatis, tetapi bisa diubah manual
                                </p>
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
                            <Label htmlFor="file_surat">File Surat * (PDF, DOC, DOCX, ODT - Max 10MB)</Label>
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

                        {/* Pengajuan Langsung ke User dengan Privilege */}
                        <div className="space-y-2 border-t pt-4">
                            <h3 className="text-lg font-semibold">Pengajuan (Opsional)</h3>
                            <p className="text-sm text-gray-600">
                                Jika dipilih, surat akan langsung diajukan ke user yang dipilih. 
                                Jika tidak, surat akan disimpan sebagai draft.
                            </p>
                            
                            <div className="space-y-2">
                                <Label htmlFor="user_id">Ajukan ke User</Label>
                                <Select value={data.user_id} onValueChange={(value) => setData("user_id", value)}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Pilih user (opsional)" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="draft">Simpan sebagai draft</SelectItem>
                                        {usersCanDispose.map((user) => (
                                            <SelectItem key={user.id} value={user.id.toString()}>
                                                {user.name} ({user.role.toUpperCase()}) - {user.email}
                                                {user.jabatan && ` - ${user.jabatan}`}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {errors.user_id && (
                                    <p className="text-sm text-red-500">{errors.user_id}</p>
                                )}
                            </div>
                        </div>

                        {/* Submit Buttons */}
                        <div className="flex gap-4 pt-4">
                            <Button type="submit" disabled={processing}>
                                {processing ? "Menyimpan..." : (data.user_id && data.user_id !== "draft") ? "Simpan & Ajukan" : "Simpan sebagai Draft"}
                            </Button>
                            <Link href="/admin/surat-masuk">
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
