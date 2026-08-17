import { ChevronRight } from "lucide-react"

export function Breadcrumb() {
  return (
    <nav className="px-4 py-3 bg-white border-b border-gray-100">
      <ol className="flex items-center gap-2 text-sm">
        <li>
          <a href="#" className="text-[#86888c] hover:text-[#019df4] transition-colors">
            Inicio
          </a>
        </li>
        <li>
          <ChevronRight className="w-4 h-4 text-[#86888c]" />
        </li>
        <li>
          <span className="text-[#86888c]">App Mi Movistar</span>
        </li>
      </ol>
    </nav>
  )
}
