export function MaskLine({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span className={`block overflow-hidden py-[0.06em] -my-[0.06em] ${className}`}>
      <span className="js-out block will-change-transform">
        <span className="js-in block">{children}</span>
      </span>
    </span>
  );
}