import Image from "next/image";

export default function LoginIllustration() {
  return (
    <Image
      src="/loginIllustration.svg"
      alt="HR Management Illustration"
      width={515}
      height={500}
      loading="eager"
      className="object-contain object-bottom max-h-[55vh]"
      style={{ width: "100%", height: "auto" }}
    />
  );
}
