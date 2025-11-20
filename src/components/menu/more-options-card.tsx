interface MoreOptionsCardProps {
  category: string
  onCategorySelect: (category: string) => void
}

export function MoreOptionsCard({ category, onCategorySelect }: MoreOptionsCardProps) {
  return (
    <article
      onClick={() => onCategorySelect(category)}
      className="text-center cursor-pointer hover:scale-105 transition-transform duration-200 outline-none focus:outline-none focus-visible:outline-none border-0 hover:border-0 focus:border-0 focus-visible:border-0 ring-0 hover:ring-0 focus:ring-0 focus-visible:ring-0"
    >
      {/* Parte superior con mismo aspect ratio que la imagen */}
      <div className="relative bg-[#004166] aspect-[16/9] rounded-t-3xl flex items-center justify-center border-0">
        <h3 className="text-xl font-bold text-white pt-8 border-0 outline-none">Más opciones...</h3>
      </div>
      {/* Banner inferior igual que los otros cards */}
      <h3 className="bg-[#004166] text-white px-3 py-2 rounded-b-3xl text-sm font-medium border-0">
        &nbsp;
      </h3>
    </article>
  )
}
