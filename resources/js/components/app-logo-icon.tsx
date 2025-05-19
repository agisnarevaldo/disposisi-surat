import React from 'react';

export default function AppLogoIcon(props: React.ImgHTMLAttributes<HTMLImageElement>) {
    return (
        <img
            {...props}
            src="/bps.svg" // Path ke file gambar
            alt="Logo BPS"
        />
    );
}
