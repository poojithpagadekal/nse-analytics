export function Spinner({ size = 28 }: { size?: number }) {
  return (
    <div
      style={{ width: size, height: size }}
      className="border-2 border-emerald-500 border-t-transparent rounded-full animate-spin"
    />
  );
}
