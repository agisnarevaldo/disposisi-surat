import AppLayout from "@/layouts/app-layout";
import { BreadcrumbItem } from "@/types";
import { Head } from "@inertiajs/react";

export default function SuratKeluarLayout({
    children,
    breadcrumbs
}: {
    children: React.ReactNode;
    breadcrumbs: BreadcrumbItem[];
}) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Surat Keluar" />
            {children}
        </AppLayout>
    );
}
