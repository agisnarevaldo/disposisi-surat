import React from "react";
import { Link, useForm } from "@inertiajs/react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import AppLayout from "@/layouts/app-layout";
import { ArrowLeft } from "lucide-react";

export default function Create() {
    const { data, setData, post, processing, errors } = useForm<{
        no_agenda: string;
        no_surat: string;
        tanggal_surat: string;
        tanggal_diterima: string;
        pengirim: string;
        hal_surat: string;
        jenis_surat: string;
        file_surat: string | File;
        tujuan_surat: string;
        pesan_tambahan: string;
    }>({
        no_agenda: "",
        no_surat: "",
        tanggal_surat: "",
        tanggal_diterima: "",
        pengirim: "",
        hal_surat: "",
        jenis_surat: "",
        file_surat: "",
        tujuan_surat: "",
        pesan_tambahan: "",
    });

    const breadcrumbs = [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Surat Masuk', href: '/surat-masuk' },
        { title: 'Tambah', href: '/surat-masuk/create' },
    ];

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post("/surat-masuk", {
            forceFormData: true
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <div className="w-full lg:max-w-2xl mx-auto p-6 space-y-6">
                <div className="flex items-center gap-4">
                    <Link href="/surat-masuk">
                        <ArrowLeft className="md:inline" />
                    </Link>
                    <h1 className="text-2xl font-bold">Tambah Surat Masuk</h1>
                </div>
                <form onSubmit={submit} className="space-y-4" encType="multipart/form-data">
                    {[
                        { label: "No Agenda", name: "no_agenda" },
                        { label: "No Surat", name: "no_surat" },
                        { label: "Tanggal Surat", name: "tanggal_surat", type: "date" },
                        { label: "Tanggal Diterima", name: "tanggal_diterima", type: "date" },
                        { label: "Pengirim", name: "pengirim" },
                        { label: "Hal Surat", name: "hal_surat" },
                        { label: "Jenis Surat", name: "jenis_surat" },
                        { label: "File Surat", name: "file_surat", type: "file" },
                        { label: "Tujuan Surat", name: "tujuan_surat" },
                        { label: "Pesan Tambahan", name: "pesan_tambahan" },
                    ].map(({ label, name, type = "text" }) => (
                        <div key={name}>
                            <Label htmlFor={name}>{label}</Label>
                            <Input
                                id={name}
                                type={type}
                                {...(type === "file"
                                    ? {
                                        onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
                                            if (e.target.files && e.target.files[0]) {
                                                setData(name as keyof typeof data, e.target.files[0]);
                                            }
                                        },
                                    }
                                    : {
                                        value: data[name as keyof typeof data] as string,
                                        onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
                                            setData(name as keyof typeof data, e.target.value),
                                    })}
                            />
                            {errors[name as keyof typeof errors] && (
                                <p className="text-sm text-red-500">
                                    {errors[name as keyof typeof errors]}
                                </p>
                            )}
                        </div>
                    ))}
                    <Button type="submit" disabled={processing}>
                        Simpan
                    </Button>
                </form>
            </div>
        </AppLayout>
    );
}
