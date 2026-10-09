import Image from "next/image";
import { cn } from "@/lib/cn";

// Official BVMAC medal and wordmark (without the flags row).
// "light" = brown wordmark for light grounds, "dark" = ivory wordmark for dark grounds.
export function Logo({
  variant = "light",
  className,
  priority,
  alt = "BVMAC – Bourse des Valeurs Mobilières de l’Afrique Centrale",
}: {
  variant?: "light" | "dark" | "medal";
  className?: string;
  priority?: boolean;
  alt?: string;
}) {
  if (variant === "medal") {
    return <Image src="/brand/bvmac-medal.png" alt={alt} width={419} height={419} className={cn("size-10", className)} priority={priority} />;
  }
  return (
    <Image
      src={variant === "light" ? "/brand/bvmac-logo-light.png" : "/brand/bvmac-logo-dark.png"}
      alt={alt}
      width={1271}
      height={419}
      className={cn("h-11 w-auto", className)}
      priority={priority}
    />
  );
}
