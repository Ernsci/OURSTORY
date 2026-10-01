export function Backdrop() {
  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div className="animate-wash absolute -top-32 -left-24 h-[38rem] w-[38rem] rounded-full bg-rose-100/70 blur-3xl" />
      <div className="animate-wash absolute -right-40 top-1/3 h-[34rem] w-[34rem] rounded-full bg-rose-200/45 blur-3xl [animation-delay:-12s]" />
      <div className="animate-wash absolute -bottom-40 left-1/4 h-[30rem] w-[30rem] rounded-full bg-paper-deep blur-3xl [animation-delay:-22s]" />
      <div className="grain absolute inset-0 opacity-[0.16] mix-blend-multiply" />
    </div>
  )
}