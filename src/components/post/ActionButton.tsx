import { cn } from "@/lib/utils"

type ActionButtonProps = {
  icon: React.ReactNode
  label: string
  onClick?: () => void
  active?: boolean
  activeColor?: string
}

export function ActionButton({
  icon,
  label,
  onClick,
  active = false,
  activeColor,
}: ActionButtonProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex flex-1 items-center justify-center gap-3 rounded-xl py-3 transition-all",
        "hover:bg-white/[0.04] active:bg-white/[0.08] group/action",
        active && activeColor
      )}
    >
      <span
        className={cn(
          "transition-all",
          "text-neutral-500 group-hover/action:scale-110 group-hover/action:text-white",
          active && "text-white"
        )}
      >
        {icon}
      </span>

      <span
        className={cn(
          "text-[13px] font-black uppercase tracking-[0.12em] transition-colors",
          active ? "text-white" : "text-neutral-500 group-hover/action:text-white"
        )}
      >
        {label}
      </span>
    </button>
  )
}
