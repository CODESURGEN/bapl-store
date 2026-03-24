import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="bg-brand-dark text-white pt-16 sm:pt-20 pb-8 sm:pb-10 border-t-[6px] border-gold">
      <div className="max-w-[1370px] mx-auto px-5 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 sm:gap-12 mb-12 sm:mb-16">
          <div className="lg:col-span-2 lg:pr-8">
            <Link href="/" className="inline-flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-white/20 bg-white flex items-center justify-center">
                <Image src="/assets/BKH.png" alt="Bandaru Agrotech Logo" width={48} height={48} className="w-full h-full object-cover" />
              </div>
              <div>
                <h2 className="font-heading text-xl font-semibold text-white leading-tight">Bandaru Agrotech</h2>
                <p className="text-[0.65rem] font-bold tracking-[0.2em] text-gold uppercase">Private Limited</p>
              </div>
            </Link>
            <p className="text-gray-400 leading-relaxed text-sm max-w-sm mb-8">
              Two decades of trust in every grain. Premium rice milling and manufacturing from the heart of Miryalaguda, serving India with purity and excellence.
            </p>
            <div className="flex gap-4">
              <a href="#" aria-label="Instagram" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-gold hover:bg-gold hover:text-brand transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" /></svg>
              </a>
              <a href="#" aria-label="Twitter" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-gold hover:bg-gold hover:text-brand transition-colors">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z" /></svg>
              </a>
              <a href="#" aria-label="Facebook" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-gold hover:bg-gold hover:text-brand transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" /></svg>
              </a>
              <a href="#" aria-label="YouTube" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-gold hover:bg-gold hover:text-brand transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path fillRule="evenodd" d="M19.812 5.418c.861.23 1.538.907 1.768 1.768C21.998 8.746 22 12 22 12s0 3.255-.418 4.814a2.504 2.504 0 0 1-1.768 1.768c-1.56.419-7.814.419-7.814.419s-6.255 0-7.814-.419a2.505 2.505 0 0 1-1.768-1.768C2 15.255 2 12 2 12s0-3.255.417-4.814a2.507 2.507 0 0 1 1.768-1.768C5.744 5 11.998 5 11.998 5s6.255 0 7.814.418ZM15.194 12 10 15V9l5.194 3Z" clipRule="evenodd" /></svg>
              </a>
            </div>
          </div>
          <div>
            <h4 className="text-sm font-bold tracking-widest text-white uppercase mb-6 font-heading">Quick Links</h4>
            <ul className="space-y-4 text-sm text-gray-400">
              <li><Link href="/#process" className="hover:text-gold transition-colors block">Our Process</Link></li>
              <li><Link href="/products" className="hover:text-gold transition-colors block">Our Product Range</Link></li>
              <li><Link href="/#faq" className="hover:text-gold transition-colors block">FAQ</Link></li>
              <li><Link href="/#contact" className="hover:text-gold transition-colors block">Contact Information</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-bold tracking-widest text-white uppercase mb-6 font-heading">Our Varieties</h4>
            <ul className="space-y-4 text-sm text-gray-400">
              <li><Link href="/products/sona-masoori" className="hover:text-gold transition-colors block">Sona Masoori</Link></li>
              <li><Link href="/products/bpt-samba-mahsuri" className="hover:text-gold transition-colors block">BPT (Samba Mahsuri)</Link></li>
              <li><Link href="/products/hmt-rice" className="hover:text-gold transition-colors block">HMT Rice</Link></li>
              <li><Link href="/products/kolam-rice" className="hover:text-gold transition-colors block">Kolam Rice</Link></li>
            </ul>
          </div>
        </div>

        <a href="https://maps.app.goo.gl/5DYDpSPKPQ7awcKY7" target="_blank" rel="noopener noreferrer" className="block rounded-2xl overflow-hidden mb-12 sm:mb-16 border border-white/10 hover:border-gold/40 transition-colors group">
          <div className="relative">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3820.123!2d79.5672!3d16.8731!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a3510f7a12345%3A0xabcdef!2sMiryalaguda%2C%20Telangana!5e0!3m2!1sen!2sin!4v1"
              width="100%"
              height="200"
              style={{ border: 0, pointerEvents: "none" }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="w-full h-[180px] sm:h-[220px] opacity-70 group-hover:opacity-90 transition-opacity"
            />
            <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/10 transition-colors">
              <div className="bg-gold/95 backdrop-blur-sm px-5 py-3 rounded-full flex items-center gap-2 shadow-lg group-hover:scale-105 transition-transform">
                <span className="material-symbols-outlined text-brand text-xl">location_on</span>
                <span className="font-heading font-semibold text-brand text-sm">View on Google Maps</span>
              </div>
            </div>
          </div>
        </a>

        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-500">
          <p>&copy; {new Date().getFullYear()} Bandaru Agrotech Private Limited. All rights reserved.</p>
          <div className="flex gap-6">
            <Link href="#" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="#" className="hover:text-white transition-colors">Terms &amp; Conditions</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
