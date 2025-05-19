import AppLogoIcon from '@/components/app-logo-icon';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Link } from '@inertiajs/react';
import { type PropsWithChildren } from 'react';

export default function AuthCardLayout({
    children,
    title,
}: PropsWithChildren<{
    name?: string;
    title?: string;
    description?: string;
}>) {
    return (
        <div className="bg-muted flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-8">
            <div className="flex w-full max-w-md flex-col gap-6">
                <Card className="rounded-xl shadow-lg">
                    <CardHeader className="px-10 pt-6 pb-0 text-center">
                        <Link href={route('home')} className="flex items-center justify-center">
                            <div className="flex h-22 w-22 items-center justify-center">
                                <AppLogoIcon className="size-22" />
                            </div>
                        </Link>
                        <CardTitle className="text-xl mb-0 p-0">{title}</CardTitle>
                    </CardHeader>
                    <CardContent className="px-10 py-6">{children}</CardContent>
                </Card>
            </div>
        </div>
    );
}
