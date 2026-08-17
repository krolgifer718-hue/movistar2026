export function Footer() {
  return (
    <footer className="bg-[#0b2739] text-white py-8 px-4">
      <div className="max-w-md mx-auto">
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <svg 
            aria-hidden="true"
            focusable="false"
            viewBox="0 0 31 25" 
            className="w-14 h-10 text-[#019df4]"
            fill="currentColor"
          >
            <path d="M5.64103 3.66661C4.25318 3.68712 1.68491 4.39994 0.514369 9.36917C0.000714888 11.5384 -0.196844 13.7948 0.242725 16.482C0.642783 18.964 1.35894 21.1025 1.84296 22.282C2.01088 22.6871 2.26771 23.1128 2.46527 23.3743C3.03325 24.123 3.98647 24.0769 4.38653 23.8717C4.82116 23.6512 5.32494 23.1128 5.1422 21.882C5.05329 21.2871 4.80141 20.4205 4.65818 19.9384C4.22355 18.4564 3.64075 16.6717 3.59136 15.3999C3.52221 13.6974 4.16922 13.4769 4.59891 13.3794C5.32 13.2153 5.9275 14.0358 6.50042 15.0666C7.18694 16.2974 8.36241 18.4769 9.32058 20.1435C10.1849 21.6461 11.7851 23.2564 14.3485 23.1487C16.9661 23.0358 18.8923 21.9999 19.8851 18.7384C20.6259 16.2974 21.1346 14.4717 21.9496 12.6051C22.888 10.4563 24.1375 9.30763 25.1895 9.65635C26.1674 9.98455 26.4095 10.9743 26.4243 12.4307C26.4342 13.723 26.2909 15.1435 26.1773 16.1897C26.1378 16.5692 26.0637 17.3333 26.0934 17.7538C26.1526 18.5846 26.4984 19.4153 27.4022 19.5487C28.3653 19.6922 29.1358 18.8922 29.442 17.9281C29.5655 17.5487 29.6692 16.964 29.7235 16.5538C30.005 14.4666 30.0791 13.0666 29.9507 10.9333C29.8025 8.44097 29.3333 6.16404 28.5135 4.19481C27.7282 2.31276 26.4687 1.10763 24.8537 0.999939C23.0658 0.88199 21.0112 2.11276 19.9345 4.50763C18.9417 6.71276 18.1465 8.9743 17.6675 10.1281C17.1785 11.2974 16.4623 12.0205 15.356 12.1435C14.0077 12.2922 12.8421 11.2717 11.9926 9.82045C11.2517 8.55379 9.7799 6.14866 8.98967 5.3384C8.24882 4.58455 7.40425 3.63584 5.64103 3.66661Z" />
          </svg>
        </div>
        
        {/* Links */}
        <nav className="grid grid-cols-2 gap-4 text-sm mb-8">
          <a href="#" className="text-gray-300 hover:text-[#019df4] transition-colors">Términos y Condiciones</a>
          <a href="#" className="text-gray-300 hover:text-[#019df4] transition-colors">Políticas de Privacidad</a>
          <a href="#" className="text-gray-300 hover:text-[#019df4] transition-colors">Libro de Reclamaciones</a>
          <a href="#" className="text-gray-300 hover:text-[#019df4] transition-colors">Contáctanos</a>
        </nav>
        
        {/* Social */}
        <div className="flex justify-center gap-4 mb-6">
          <a href="#" className="w-10 h-10 bg-[#019df4] rounded-full flex items-center justify-center hover:bg-[#0186d0] transition-colors" aria-label="Facebook">
            <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
              <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c5.05-.5 9-4.76 9-9.95z"/>
            </svg>
          </a>
          <a href="#" className="w-10 h-10 bg-[#019df4] rounded-full flex items-center justify-center hover:bg-[#0186d0] transition-colors" aria-label="Twitter">
            <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
              <path d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z"/>
            </svg>
          </a>
          <a href="#" className="w-10 h-10 bg-[#019df4] rounded-full flex items-center justify-center hover:bg-[#0186d0] transition-colors" aria-label="Instagram">
            <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
              <path d="M7.8 2h8.4C19.4 2 22 4.6 22 7.8v8.4a5.8 5.8 0 0 1-5.8 5.8H7.8C4.6 22 2 19.4 2 16.2V7.8A5.8 5.8 0 0 1 7.8 2m-.2 2A3.6 3.6 0 0 0 4 7.6v8.8C4 18.39 5.61 20 7.6 20h8.8a3.6 3.6 0 0 0 3.6-3.6V7.6C20 5.61 18.39 4 16.4 4H7.6m9.65 1.5a1.25 1.25 0 0 1 1.25 1.25A1.25 1.25 0 0 1 17.25 8 1.25 1.25 0 0 1 16 6.75a1.25 1.25 0 0 1 1.25-1.25M12 7a5 5 0 0 1 5 5 5 5 0 0 1-5 5 5 5 0 0 1-5-5 5 5 0 0 1 5-5m0 2a3 3 0 0 0-3 3 3 3 0 0 0 3 3 3 3 0 0 0 3-3 3 3 0 0 0-3-3z"/>
            </svg>
          </a>
          <a href="#" className="w-10 h-10 bg-[#019df4] rounded-full flex items-center justify-center hover:bg-[#0186d0] transition-colors" aria-label="YouTube">
            <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
              <path d="M10 15l5.19-3L10 9v6m11.56-7.83c.13.47.22 1.1.28 1.9.07.8.1 1.49.1 2.09L22 12c0 2.19-.16 3.8-.44 4.83-.25.9-.83 1.48-1.73 1.73-.47.13-1.33.22-2.65.28-1.3.07-2.49.1-3.59.1L12 19c-4.19 0-6.8-.16-7.83-.44-.9-.25-1.48-.83-1.73-1.73-.13-.47-.22-1.1-.28-1.9-.07-.8-.1-1.49-.1-2.09L2 12c0-2.19.16-3.8.44-4.83.25-.9.83-1.48 1.73-1.73.47-.13 1.33-.22 2.65-.28 1.3-.07 2.49-.1 3.59-.1L12 5c4.19 0 6.8.16 7.83.44.9.25 1.48.83 1.73 1.73z"/>
            </svg>
          </a>
        </div>
        
        {/* Copyright */}
        <p className="text-center text-xs text-gray-400">
          © 2024 Telefónica del Perú S.A.A. Todos los derechos reservados.
        </p>
      </div>
    </footer>
  )
}
