'use client';

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function PrefetchHomeClient() {
	const router = useRouter();

	useEffect(() => {
		try {
			if (typeof router.prefetch === "function") {
				router.prefetch("/");
			}
		} catch (_error) {
			// Ignore prefetch errors silently
		}
	}, [router]);

	return null;
}


