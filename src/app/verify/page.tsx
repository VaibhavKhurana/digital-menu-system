export const dynamic = "force-dynamic";

import { Suspense } from "react";
import VerifyPageClient from "./page";

export default function VerifyPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <VerifyPageClient />
    </Suspense>
  );
}
