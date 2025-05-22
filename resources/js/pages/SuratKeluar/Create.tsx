import React from "react";
import { Link, useForm } from "@inertiajs/react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import SuratKeluarLayout from "./Layout";
import { ArrowLeft } from "lucide-react";

export default function Create() {
    const { data, setData, post, processing, errors } = useForm<{
        no_surat: string;
        tanggal_surat: string;
        kepada: string;
        hal_surat: string;
        jenis_surat: string;
        file_surat: string | File;
    }>({
        no_surat: "",
        tanggal_surat: "",
        kepada: "",
        hal_surat: "",
        jenis_surat: "",
        file_surat: "",
    });

    const breadcrumbs = [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Surat Keluar', href: '/surat-keluar' },
        { title: 'Tambah', href: '/surat-keluar/create' },
    ];

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post("/surat-keluar", {
            forceFormData: true
        });
    };

    return (
        <SuratKeluarLayout breadcrumbs={breadcrumbs}>
            <div className="w-full lg:max-w-2xl mx-auto p-6 space-y-6">
                <div className="flex items-center gap-4">
                    <Link href="/surat-masuk">
                        <ArrowLeft className="md:inline" />
                    </Link>
                    <h1 className="text-2xl font-bold">Tambah Surat Keluar</h1>
                </div>
                <form onSubmit={submit} className="space-y-4" encType="multipart/form-data">
                    {[
                        { label: "No Surat", name: "no_surat" },
                        { label: "Tanggal Surat", name: "tanggal_surat", type: "date" },
                        { label: "Kepada", name: "kepada" },
                        { label: "Hal Surat", name: "hal_surat" },
                        { label: "Jenis Surat", name: "jenis_surat" },
                        { label: "File Surat", name: "file_surat", type: "file" },
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
        </SuratKeluarLayout>
    );
}
