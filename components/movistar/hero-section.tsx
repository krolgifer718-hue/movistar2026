export function HeroSection() {
  return (
    <section className="relative bg-white py-8 px-4 overflow-hidden">
      {/* Decorative blue wave on left */}
      <div className="absolute left-0 top-0 bottom-0 w-8 opacity-20">
        <svg viewBox="0 0 50 400" className="h-full" fill="#019df4">
          <path d="M0,0 Q25,50 10,100 Q-5,150 15,200 Q35,250 5,300 Q-15,350 20,400 L0,400 Z"/>
        </svg>
      </div>
      
      <div className="text-center relative z-10">
        <p className="text-[#0b2739] text-base mb-2">
          ¡Más de 2 millones de usuarios ya la están disfrutando!
        </p>
        <h1 className="text-2xl md:text-3xl font-bold text-[#0b2739] leading-tight">
          ¡Tu <span className="text-[#019df4]">App Mi Movistar</span>
          <br />
          conecta con lo que{" "}
          <span className="text-[#019df4]" style={{ fontFamily: 'Pacifico, cursive' }}>
            te mueve!
          </span>
        </h1>
      </div>
    </section>
  )
}
