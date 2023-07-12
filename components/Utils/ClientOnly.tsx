import useMounted from "hooks/useMounted";
import { FCWithChildren } from "interface/webComponent";
import React from "react";

function ClientOnly({ children }: FCWithChildren) {
    const mounted = useMounted();
    if (!mounted) return null;
    return <>{children}</>;
}

export default ClientOnly;
