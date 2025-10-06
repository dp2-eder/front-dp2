import Image from "next/image"
import { useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"

interface BackButtonProps {
  href?: string
  text?: string
  className?: string
}

export function BackButton({ 
  href = "/menu", 
  text = "Volver Al Menú",
  className = ""
}: BackButtonProps) {
  const router = useRouter()

  const handleClick = () => {
    if (href) {
      router.push(href)
    } else {
      router.back()
    }
  }

  return (
    <Button
      variant="outline"
      onClick={handleClick}
      className={`flex items-center gap-2 text-gray-600 hover:text-gray-800 ${className}`}
    >
      <Image
        src="/chevrons-left.svg"
        alt="Volver"
        width={16}
        height={16}
        className="w-4 h-4"
      />
      {text}
    </Button>
  )
}

export default BackButton
