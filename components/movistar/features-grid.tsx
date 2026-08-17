import { 
  Smartphone, 
  FileText, 
  Wrench, 
  Receipt, 
  Signal,
  Star
} from "lucide-react"

const features = [
  {
    icon: Smartphone,
    title: "Adquirir",
    highlight: "productos adicionales",
    description: ""
  },
  {
    icon: FileText,
    title: "Consultar tu",
    highlight: "plan y/o mejorarlo",
    description: ""
  },
  {
    icon: Wrench,
    title: "Diagnosticar y realizar seguimiento a una",
    highlight: "Avería",
    description: ""
  },
  {
    icon: Receipt,
    title: "Revisar el detalle de tu",
    highlight: "recibo y pagar",
    description: ""
  },
  {
    icon: Signal,
    title: "Actualizate a la",
    highlight: "Red 5G",
    description: "",
    isDisney: false
  },
  {
    icon: Star,
    title: "Acceder al",
    highlight: "Club Mi Movistar",
    description: "",
    isClub: true
  }
]

export function FeaturesGrid() {
  return (
    <section className="bg-white px-4 py-6">
      <div className="grid grid-cols-3 gap-4 max-w-md mx-auto">
        {features.map((feature, index) => (
          <div key={index} className="flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-xl border-2 border-[#019df4] flex items-center justify-center mb-2 bg-white">
              {feature.isDisney ? (
                <div className="w-10 h-10 bg-[#0b2739] rounded-lg flex items-center justify-center">
                  <span className="text-white text-xs font-bold">D+</span>
                </div>
              ) : feature.isClub ? (
                <div className="text-[#019df4] text-xs font-bold italic">
                  Club<br/>Movistar
                </div>
              ) : (
                <feature.icon className="w-8 h-8 text-[#019df4]" strokeWidth={1.5} />
              )}
            </div>
            <p className="text-xs text-[#0b2739] leading-tight">
              {feature.title}{" "}
              <span className="font-bold">{feature.highlight}</span>
            </p>
          </div>
        ))}
      </div>
    </section>
  )
}
