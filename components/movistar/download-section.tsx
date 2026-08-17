import Image from "next/image"

export function DownloadSection() {
  return (
    <section className="relative bg-[#019df4] overflow-hidden">
      {/* ───── Desktop ───── */}
      <div className="hidden md:flex items-center min-h-[360px] lg:min-h-[420px]">
        {/* Texto + CTA — izquierda */}
        <div className="flex-shrink-0 w-[44%] pl-14 lg:pl-24 xl:pl-32 py-12">
          <h2 className="text-white text-[2.25rem] lg:text-[2.75rem] xl:text-[3.25rem] font-extrabold leading-[1.1] tracking-tight mb-7">
            Y tú, ¿ya la<br />descargaste?
          </h2>
          <a
            href="#"
            className="inline-flex items-center bg-[#e63780] hover:bg-[#e91e6b] text-white font-bold px-11 py-4 rounded-full transition-all duration-200 shadow-[0_4px_20px_rgba(230,55,128,0.4)] hover:shadow-[0_6px_24px_rgba(230,55,128,0.55)] hover:scale-[1.03] active:scale-[0.98] text-lg lg:text-xl"
          >
            Descárgala aquí
          </a>
        </div>

        {/* Mujer — derecha, pegado al borde */}
        <div className="flex-1 flex justify-end self-stretch">
          <div className="relative w-full h-full flex items-end justify-end">
            <Image
              src="/images/banner-mobile.png"
              alt="Descarga la App Mi Movistar"
              width={1672}
              height={941}
              className="object-cover w-full h-full max-h-[420px] lg:max-h-[480px]"
              priority
              sizes="56vw"
            />
          </div>
        </div>
      </div>

      {/* ───── Mobile ───── */}
      <div className="flex flex-col md:hidden">
        {/* Texto + CTA — arriba */}
        <div className="text-center px-7 pt-14 pb-8">
          <h2 className="text-white text-[1.75rem] font-extrabold leading-tight mb-6">
            Y tú, ¿ya la descargaste?
          </h2>
          <a
            href="#"
            className="inline-flex items-center bg-[#e63780] hover:bg-[#e91e6b] text-white font-bold px-10 py-3.5 rounded-full transition-all duration-200 shadow-[0_4px_20px_rgba(230,55,128,0.4)] active:scale-[0.98] text-base"
          >
            Descárgala aquí
          </a>
        </div>

        {/* Mujer — abajo, full width */}
        <Image
          src="/images/banner-mobile.png"
          alt="Descarga la App Mi Movistar"
          width={1672}
          height={941}
          className="object-cover w-full h-auto"
          priority
          sizes="100vw"
        />
      </div>
    </section>
  )
}
