/**
 * Figma da har bo'lim `px-[320px]` bilan chizilgan: 1920 - 320*2 = 1280.
 * Shuning uchun ichki kenglik 1280px, kichik ekranlarda esa chetdan 32px.
 */
export function Container({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`mx-auto w-full max-w-[1280px] px-8 ${className}`}>
      {children}
    </div>
  );
}
