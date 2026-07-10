import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#0C1619]/80 backdrop-blur-md border-t border-[#1b282d] pt-16 pb-8 relative z-10 mt-auto">
      <div className="max-w-7xl mx-auto px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          {/* Column 1: Brand */}
          <div className="flex flex-col items-start">
            <Link href="/" className="flex items-center gap-4 group mb-6">
              <Image
                src="/brand/logo-icon-whitestroke.png"
                alt="Ayni Studios"
                width={25}
                height={25}
                unoptimized
              />
              <span className="text-base font-black tracked uppercase text-[#DCE4EB]">
                Ayni Studios
              </span>
            </Link>
            <p className="text-sm text-[#DCE4EB]/60 leading-relaxed max-w-xs">
              Ayni Studios is an international media organization on a mission
              to provide the public unfiltered stories from around the world.
            </p>
          </div>

          {/* Column 2: Explore */}
          <div className="flex flex-col">
            <h4 className="text-[#FEB040] text-[10px] font-bold uppercase tracked mb-6">
              Explore
            </h4>
            <nav className="flex flex-col space-y-3 text-sm font-bold">
              <Link href="/library" className="text-white hover:text-[#FEB040] transition-colors">
                Library
              </Link>
              <Link href="/login" className="text-white hover:text-[#FEB040] transition-colors">
                Client Portal
              </Link>
            </nav>
          </div>

          {/* Column 3: Contact */}
          <div className="flex flex-col md:items-center">
            <div className="flex flex-col space-y-4">
              <h4 className="text-[#FEB040] text-[10px] font-bold uppercase tracked mb-2">
                Contact
              </h4>

              <a
                href="mailto:humanity@ayni-studios.com"
                className="text-sm font-bold text-white hover:text-[#FEB040] transition-colors flex items-center gap-3"
              >
                <svg
                  className="w-5 h-5 text-[#7B878F]"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"
                  />
                </svg>
                humanity@ayni-studios.com
              </a>

              <a
                href="tel:+18185275760"
                className="text-sm font-bold text-white hover:text-[#FEB040] transition-colors flex items-center gap-3"
              >
                <svg
                  className="w-5 h-5 text-[#7B878F]"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-2.896-1.596-5.48-4.18-7.076-7.076l1.293-.97c.362-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z"
                  />
                </svg>
                +1 818 527 5760
              </a>
            </div>
          </div>

          {/* Column 4: Social */}
          <div className="flex flex-col md:items-end">
            <div className="flex flex-col">
              <h4 className="text-[#FEB040] text-[10px] font-bold uppercase tracked mb-6">
                Follow
              </h4>

              <div className="flex items-center gap-4">
                {/* YouTube */}
                <a
                  href="https://www.youtube.com/@ayni-studios"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded bg-[#111A1D] border border-[#1b282d] flex items-center justify-center text-[#7B878F] hover:text-white hover:border-[#FEB040] transition-all hover:scale-110"
                  aria-label="YouTube"
                >
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z" />
                  </svg>
                </a>

                {/* Instagram */}
                <a
                  href="https://www.instagram.com/ayni_studios"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded bg-[#111A1D] border border-[#1b282d] flex items-center justify-center text-[#7B878F] hover:text-white hover:border-[#FEB040] transition-all hover:scale-110"
                  aria-label="Instagram"
                >
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      fillRule="evenodd"
                      d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"
                      clipRule="evenodd"
                    />
                  </svg>
                </a>

                {/* TikTok */}
                <a
                  href="https://www.tiktok.com/@ayni_studios"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded bg-[#111A1D] border border-[#1b282d] flex items-center justify-center text-[#7B878F] hover:text-white hover:border-[#FEB040] transition-all hover:scale-110"
                  aria-label="TikTok"
                >
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M19.321 5.562a5.124 5.124 0 01-.443-.258 6.228 6.228 0 01-1.137-.966c-.849-.971-1.166-1.955-1.285-2.646h.004C16.364 1.104 16.4 1 16.4 1h-3.388v13.102c0 .176 0 .35-.007.522l-.001.064-.002.029v.006a2.866 2.866 0 01-1.444 2.274 2.81 2.81 0 01-1.397.368c-1.566 0-2.836-1.278-2.836-2.854 0-1.576 1.27-2.854 2.836-2.854.297 0 .583.046.852.132V8.337a6.238 6.238 0 00-.852-.058C6.726 8.279 4 11.023 4 14.418c0 2.083 1.025 3.923 2.6 5.047C7.614 20.181 8.76 20.6 10 20.6c3.488 0 6.316-2.744 6.316-6.138V7.76a9.624 9.624 0 005.611 1.793V6.196s-1.398.063-2.606-.634z" />
                  </svg>
                </a>

                {/* WhatsApp */}
                <a
                  href="https://wa.me/18185275760"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded bg-[#111A1D] border border-[#1b282d] flex items-center justify-center text-[#7B878F] hover:text-white hover:border-[#FEB040] transition-all hover:scale-110"
                  aria-label="WhatsApp"
                >
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-[#1b282d] pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-[10px] font-bold uppercase tracked text-[#DCE4EB]/40 text-center md:text-left">
            © {currentYear} Ayni Studios. All Rights Reserved.
          </p>
          <p className="text-[10px] font-bold uppercase tracked text-[#FEB040]/70 text-center md:text-right">
            Los Angeles, CA · Global
          </p>
        </div>
      </div>
    </footer>
  );
}
