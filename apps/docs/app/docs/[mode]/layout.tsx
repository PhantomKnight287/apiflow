import { ReactNode } from "react";
import { getTree } from "@/utils/page-tree";
import { DocsLayout } from "next-docs-ui/layout";
import { cn } from "@/utils/cn";

export default function Layout({
    params,
    children,
}: {
    params: { mode: string };
    children: ReactNode;
}) {
    const filteredTree = getTree(params.mode);

    return (
        <DocsLayout tree={filteredTree} nav={false}>
            <div className="absolute inset-0 -z-[1] overflow-hidden">
                <div
                    className={cn(
                        "absolute top-0 left-0 w-full h-[500px] bg-gradient-to-br from-purple-400/20 to-background to-50%",
                        params.mode === "ui" && "from-blue-400/30"
                    )}
                />
            </div>
            {children}
        </DocsLayout>
    );
}

export function generateStaticParams() {
    return [
        {
            mode: "ui",
        },
        {
            mode: "headless",
        },
    ];
}