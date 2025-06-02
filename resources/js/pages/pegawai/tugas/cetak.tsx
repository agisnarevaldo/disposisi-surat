import React from 'react';
import { Head } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Printer, Download, Calendar, User, FileText, CheckCircle, Clock } from 'lucide-react';

interface SuratMasuk {
    id: number;
    nomor_surat: string;
    asal_surat: string;
    perihal: string;
    tanggal_masuk: string;
    tanggal_surat: string;
    status_disposisi: string;
    disposisi_at?: string;
    admin?: { name: string };
    kepala?: { name: string };
    pmo?: { name: string };
    pegawai?: { name: string };
}

interface DisposisiLog {
    id: number;
    status_lama: string;
    status_baru: string;
    catatan?: string;
    created_at: string;
    changed_by: { name: string };
    disposisi_ke_user?: { name: string };
}

interface CetakProps {
    auth: any;
    surat: SuratMasuk;
    disposisiLogs: DisposisiLog[];
}

export default function TugasCetak({ auth, surat, disposisiLogs }: CetakProps) {
    const handlePrint = () => {
        window.print();
    };

    const getStatusDisplay = (status: string) => {
        const statusMap: { [key: string]: string } = {
            'diajukan': 'Diajukan Admin',
            'kepala': 'Dengan Kepala',
            'pmo': 'Dengan PMO',
            'pegawai': 'Dengan Pegawai',
            'selesai': 'Selesai'
        };
        return statusMap[status] || status;
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'diajukan':
                return 'bg-gray-100 text-gray-800';
            case 'kepala':
                return 'bg-blue-100 text-blue-800';
            case 'pmo':
                return 'bg-purple-100 text-purple-800';
            case 'pegawai':
                return 'bg-yellow-100 text-yellow-800';
            case 'selesai':
                return 'bg-green-100 text-green-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <>
            <Head title={`Cetak - ${surat.nomor_surat}`} />
            
            {/* Print Controls - Hidden when printing */}
            <div className="print:hidden fixed top-4 right-4 z-50 space-y-2">
                <Button onClick={handlePrint} className="w-full">
                    <Printer className="h-4 w-4 mr-2" />
                    Cetak
                </Button>
            </div>

            {/* Print Content */}
            <div className="max-w-4xl mx-auto p-8 bg-white">
                {/* Header */}
                <div className="text-center border-b-2 border-gray-300 pb-6 mb-8">
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">
                        LAPORAN DISPOSISI SURAT MASUK
                    </h1>
                    <h2 className="text-xl font-semibold text-gray-700">
                        {surat.nomor_surat}
                    </h2>
                    <p className="text-gray-600 mt-2">
                        Dicetak pada: {new Date().toLocaleDateString('id-ID')} oleh {auth.user.name}
                    </p>
                </div>

                {/* Informasi Surat */}
                <div className="mb-8">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 border-b border-gray-200 pb-2">
                        INFORMASI SURAT
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Nomor Surat:</p>
                            <p className="text-gray-900 font-semibold">{surat.nomor_surat}</p>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-600">Status:</p>
                            <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getStatusBadge(surat.status_disposisi)}`}>
                                {getStatusDisplay(surat.status_disposisi)}
                            </span>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-600">Asal Surat:</p>
                            <p className="text-gray-900">{surat.asal_surat}</p>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-600">Tanggal Surat:</p>
                            <p className="text-gray-900">
                                {new Date(surat.tanggal_surat).toLocaleDateString('id-ID')}
                            </p>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-600">Tanggal Masuk:</p>
                            <p className="text-gray-900">
                                {new Date(surat.tanggal_masuk).toLocaleDateString('id-ID')}
                            </p>
                        </div>
                        {surat.disposisi_at && (
                            <div>
                                <p className="text-sm font-medium text-gray-600">Tanggal Disposisi:</p>
                                <p className="text-gray-900">
                                    {new Date(surat.disposisi_at).toLocaleDateString('id-ID')}
                                </p>
                            </div>
                        )}
                    </div>
                    <div className="mt-4">
                        <p className="text-sm font-medium text-gray-600">Perihal:</p>
                        <p className="text-gray-900 mt-1 p-3 bg-gray-50 rounded border">
                            {surat.perihal}
                        </p>
                    </div>
                </div>

                {/* Alur Disposisi */}
                <div className="mb-8">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 border-b border-gray-200 pb-2">
                        ALUR DISPOSISI
                    </h3>
                    <div className="space-y-3">
                        {surat.admin && (
                            <div className="flex items-center gap-3">
                                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                                <span className="text-gray-600">Admin:</span>
                                <span className="font-medium">{surat.admin.name}</span>
                            </div>
                        )}
                        {surat.kepala && (
                            <div className="flex items-center gap-3">
                                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                                <span className="text-gray-600">Kepala:</span>
                                <span className="font-medium">{surat.kepala.name}</span>
                            </div>
                        )}
                        {surat.pmo && (
                            <div className="flex items-center gap-3">
                                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                                <span className="text-gray-600">PMO:</span>
                                <span className="font-medium">{surat.pmo.name}</span>
                            </div>
                        )}
                        {surat.pegawai && (
                            <div className="flex items-center gap-3">
                                <div className={`w-3 h-3 rounded-full ${surat.status_disposisi === 'selesai' ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
                                <span className="text-gray-600">Pegawai:</span>
                                <span className="font-medium">{surat.pegawai.name}</span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Riwayat Disposisi */}
                <div className="mb-8">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 border-b border-gray-200 pb-2">
                        RIWAYAT DISPOSISI
                    </h3>
                    <div className="space-y-4">
                        {disposisiLogs.map((log, index) => (
                            <div key={log.id} className="border-l-2 border-gray-200 pl-4">
                                <div className="flex items-center gap-2 mb-1">
                                    <p className="font-medium text-gray-900">
                                        {getStatusDisplay(log.status_baru)}
                                    </p>
                                    <span className="text-sm text-gray-500">
                                        {new Date(log.created_at).toLocaleDateString('id-ID')} {new Date(log.created_at).toLocaleTimeString('id-ID')}
                                    </span>
                                </div>
                                <p className="text-sm text-gray-600 mb-2">
                                    Oleh: {log.changed_by.name}
                                    {log.disposisi_ke_user && (
                                        <> → {log.disposisi_ke_user.name}</>
                                    )}
                                </p>
                                {log.catatan && (
                                    <p className="text-sm text-gray-700 p-2 bg-gray-50 rounded border">
                                        {log.catatan}
                                    </p>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Summary */}
                <div className="border-t-2 border-gray-300 pt-6">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Total Langkah Disposisi:</p>
                            <p className="text-xl font-bold text-gray-900">{disposisiLogs.length}</p>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-600">Status Terakhir:</p>
                            <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getStatusBadge(surat.status_disposisi)}`}>
                                {getStatusDisplay(surat.status_disposisi)}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="mt-8 text-center text-sm text-gray-500 border-t border-gray-200 pt-4">
                    <p>Sistem Disposisi Surat - Dicetak pada {new Date().toLocaleString('id-ID')}</p>
                </div>
            </div>

            {/* Print Styles */}
            <style>{`
                @media print {
                    body {
                        margin: 0;
                        padding: 0;
                        font-size: 12pt;
                        line-height: 1.4;
                    }
                    
                    .print\\:hidden {
                        display: none !important;
                    }
                    
                    * {
                        -webkit-print-color-adjust: exact !important;
                        color-adjust: exact !important;
                    }
                    
                    .bg-gray-50, .bg-gray-100 {
                        background-color: #f9fafb !important;
                    }
                    
                    .bg-green-100 {
                        background-color: #dcfce7 !important;
                    }
                    
                    .bg-blue-100 {
                        background-color: #dbeafe !important;
                    }
                    
                    .bg-yellow-100 {
                        background-color: #fef3c7 !important;
                    }
                    
                    .bg-purple-100 {
                        background-color: #f3e8ff !important;
                    }
                    
                    @page {
                        margin: 1cm;
                        size: A4;
                    }
                }
            `}</style>
        </>
    );
}
