import { Badge } from "./ui/badge";

export default function DetailInfoItem({ label, value }: { label: string; value: string }) {
    return (
        <div className="flex items-baseline border-b border-neutral-300 pb-1">
            <span className="font-medium flex-1">{label}:</span>
            <Badge variant="outline" className="bg-primary/10">{value}</Badge>
        </div>
    );
}
