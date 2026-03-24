"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { products } from "@/data/products";
import ProductCard from "@/components/product/ProductCard";

const certifications = [
  { icon: "verified", label: "FSSAI Certified" },
  { icon: "eco", label: "ISO 22000:2018" },
  { icon: "shield", label: "AGMARK Graded" },
  { icon: "workspace_premium", label: "GMP Compliant" },
  { icon: "health_and_safety", label: "HACCP Certified" },
  { icon: "public", label: "APEDA Registered" },
  { icon: "star", label: "BIS Certified" },
  { icon: "factory", label: "ISO 9001:2015" },
];

const processSteps = [
  { icon: "agriculture", num: "01", title: "Paddy Procurement", desc: "Direct sourcing from trusted local farmers in Nalgonda district, ensuring the finest raw paddy selection." },
  { icon: "precision_manufacturing", num: "02", title: "Precision Milling", desc: "State-of-the-art machinery for dehusking, polishing, and grading to achieve consistent grain quality." },
  { icon: "palette", num: "03", title: "Color Sorting", desc: "Advanced optical sorting technology removes discolored grains, ensuring pristine visual quality." },
  { icon: "science", num: "04", title: "Quality Testing", desc: "Rigorous lab testing for moisture content, grain length, and purity before packaging." },
  { icon: "inventory_2", num: "05", title: "Hygienic Packaging", desc: "Sealed in food-grade packaging to preserve freshness, aroma, and nutritional value." },
  { icon: "local_shipping", num: "06", title: "Pan-India Delivery", desc: "Reliable logistics network ensuring timely delivery to distributors and retailers across India." },
];

const testimonials = [
  { text: "Bandaru Agrotech has been our primary rice supplier for over 5 years. The consistency in quality and timely deliveries have made them an indispensable partner for our business.", initials: "RK", name: "Rajesh Kumar", role: "Distributor, Hyderabad", color: "bg-brand" },
  { text: "The Sona Masoori from Bandaru is simply the best we've tasted. Our customers always come back asking for it by name. Exceptional aroma and grain quality.", initials: "PS", name: "Priya Sharma", role: "Retail Chain Owner, Bangalore", color: "bg-gold" },
  { text: "We switched to Bandaru Agrotech two years ago and haven't looked back. Their BPT Samba Mahsuri is the go-to choice for our biryani restaurant chain.", initials: "MA", name: "Mohammed Ali", role: "Restaurant Chain, Chennai", color: "bg-brand-light" },
];

const faqs = [
  { q: "What types of rice do you offer?", a: "We offer four premium varieties: Sona Masoori, BPT Samba Mahsuri, HMT Rice, and Kolam Rice. Each variety undergoes rigorous quality testing to ensure you receive only the finest grains." },
  { q: "What is the minimum order quantity for bulk orders?", a: "Our minimum order for bulk/B2B purchases starts at 1 metric ton. For custom quantities or special packaging requirements, please contact our sales team directly." },
  { q: "Do you deliver across India?", a: "Yes, we have a reliable logistics network that covers all major cities and towns across India. We also work with exporters for international orders. Delivery timelines vary by location." },
  { q: "How do you ensure quality?", a: "Every batch goes through a multi-stage quality control process: lab testing for moisture and purity, advanced optical color sorting, and manual inspection before packaging. We maintain 100% quality assurance on all products." },
  { q: "Can I become a distributor?", a: "We're always looking for trusted distribution partners. Please reach out through our contact form or call us directly. Our team will discuss terms, pricing, and territory availability with you." },
];

function useReveal() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const targets = el.querySelectorAll(".reveal");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("active");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -60px 0px" }
    );
    targets.forEach((t) => observer.observe(t));
    return () => observer.disconnect();
  }, []);
  return ref;
}

function Counter({ target, suffix = "" }: { target: number; suffix?: string }) {
  const [value, setValue] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const animated = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !animated.current) {
          animated.current = true;
          const duration = 2200;
          const start = performance.now();
          function update(now: number) {
            const progress = Math.min((now - start) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 4);
            setValue(Math.floor(target * eased));
            if (progress < 1) requestAnimationFrame(update);
            else setValue(target);
          }
          requestAnimationFrame(update);
        }
      },
      { threshold: 0.5 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [target]);

  return (
    <span ref={ref}>
      {value.toLocaleString("en-IN")}{suffix}
    </span>
  );
}

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className={`faq-item bg-soft rounded-2xl border border-gray-100 overflow-hidden ${open ? "open" : ""}`}>
      <button className="w-full flex items-center justify-between p-5 sm:p-6 text-left" onClick={() => setOpen(!open)}>
        <span className="font-heading font-semibold text-brand text-base sm:text-lg pr-4">{q}</span>
        <span className="faq-icon material-symbols-outlined text-gold text-2xl shrink-0">add</span>
      </button>
      <div className="faq-answer px-5 sm:px-6">
        <p className="text-gray-600 pb-5 sm:pb-6 text-sm sm:text-base">{a}</p>
      </div>
    </div>
  );
}

export default function Home() {
  const pageRef = useReveal();
  const featuredProducts = products.slice(0, 4);

  return (
    <div ref={pageRef}>
      <section className="relative min-h-svh flex items-end sm:items-center pb-12 sm:pb-0 pt-32 sm:pt-20 overflow-hidden bg-brand">
        <div className="absolute inset-0 z-0 overflow-hidden">
          <Image src="/assets/HeroSection.jpg" alt="Beautiful Rice Fields" fill className="object-cover opacity-40 animate-slow-zoom" priority />
          <div className="absolute inset-0 bg-gradient-to-t sm:bg-gradient-to-r from-brand via-brand/80 to-transparent" />
        </div>
        <div className="max-w-[1370px] mx-auto px-5 sm:px-6 lg:px-8 relative z-10 w-full">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-10 lg:gap-8">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-gold/30 bg-gold/10 backdrop-blur-md mb-6 animate-fade-in-up">
                <span className="w-2 h-2 rounded-full bg-gold animate-pulse" />
                <span className="text-xs font-bold tracking-widest text-gold uppercase font-heading">Premium Rice Millers</span>
              </div>
              <h2 className="font-heading text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-semibold text-white leading-[1.15] mb-5 sm:mb-6 animate-fade-in-up [animation-delay:100ms]">
                EXCELLENCE IN <br />
                <span className="text-gold font-display italic">Every Grain.</span>
              </h2>
              <p className="text-base sm:text-lg md:text-xl text-gray-300 mb-8 sm:mb-10 leading-relaxed max-w-xl animate-fade-in-up [animation-delay:200ms]">
                Over two decades of heritage in Miryalaguda, delivering the finest quality rice to households and businesses across India.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 animate-fade-in-up [animation-delay:300ms]">
                <Link href="/products" className="cta-btn bg-gold text-brand px-8 py-3.5 rounded-full font-bold hover:bg-gold-light transition-all shadow-lg font-heading inline-flex items-center justify-center gap-2 text-sm sm:text-base">
                  Explore Products <span className="material-symbols-outlined text-lg">arrow_forward</span>
                </Link>
                <a href="#contact" className="bg-white/10 text-white border border-white/20 px-8 py-3.5 rounded-full font-bold hover:bg-white/20 transition-colors backdrop-blur-sm font-heading text-center text-sm sm:text-base">Request Quote</a>
              </div>
            </div>
            <div className="relative w-48 h-48 sm:w-64 sm:h-64 md:w-80 md:h-80 lg:w-[22rem] lg:h-[22rem] shrink-0 animate-fade-in-up hidden sm:block [animation-delay:400ms]">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-36 h-36 sm:w-44 sm:h-44 md:w-52 md:h-52 lg:w-60 lg:h-60 rounded-full overflow-hidden border-2 border-gold/40 bg-white shadow-2xl shadow-black/30">
                  <Image src="/assets/BKH.png" alt="Bandaru Agrotech Legacy Badge" width={240} height={240} className="w-full h-full object-cover" />
                </div>
              </div>
              <svg className="animate-spin-slow absolute inset-0 w-full h-full" viewBox="0 0 300 300" aria-hidden="true">
                <defs>
                  <path id="badge-text-top" d="M 150,150 m -82,0 a 82,82 0 1,1 164,0" fill="none" />
                  <path id="badge-text-bottom" d="M 150,150 m 82,0 a 82,82 0 1,1 -164,0" fill="none" />
                </defs>
                <circle cx="150" cy="150" r="82" fill="none" stroke="#c5a059" strokeWidth="22" />
                <circle cx="150" cy="150" r="71" fill="none" stroke="#a88644" strokeWidth="0.8" />
                <circle cx="150" cy="150" r="93" fill="none" stroke="#a88644" strokeWidth="0.8" />
                <text fill="#1a3622" fontFamily="'Plus Jakarta Sans', sans-serif" fontSize="14" fontWeight="700" letterSpacing="4">
                  <textPath href="#badge-text-top" startOffset="50%" textAnchor="middle">25 YEARS OF LEGACY</textPath>
                </text>
                <text fill="#1a3622" fontFamily="'Plus Jakarta Sans', sans-serif" fontSize="10" fontWeight="700" letterSpacing="5">
                  <textPath href="#badge-text-bottom" startOffset="50%" textAnchor="middle">EST. 2001 • MIRYALAGUDA</textPath>
                </text>
              </svg>
            </div>
          </div>
        </div>
      </section>

      <div className="bg-brand-dark relative z-20">
        <div className="max-w-[1370px] mx-auto px-5 sm:px-6 lg:px-8 py-10 sm:py-14">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-0">
            <div className="stat-card text-center px-2 sm:px-8 reveal">
              <div className="font-heading text-3xl sm:text-5xl font-bold text-gold mb-2 tracking-tight"><Counter target={25} suffix="+" /></div>
              <div className="text-[10px] sm:text-xs font-medium tracking-wider text-gray-400 uppercase font-heading">Years of Legacy</div>
            </div>
            <div className="stat-card text-center px-2 sm:px-8 reveal [transition-delay:100ms]">
              <div className="font-heading text-3xl sm:text-5xl font-bold text-gold mb-2 tracking-tight"><Counter target={47891} /></div>
              <div className="text-[10px] sm:text-xs font-medium tracking-wider text-gray-400 uppercase font-heading">Kg Daily Output</div>
            </div>
            <div className="stat-card text-center px-2 sm:px-8 reveal [transition-delay:200ms]">
              <div className="font-heading text-3xl sm:text-5xl font-bold text-gold mb-2 tracking-tight"><Counter target={1732} suffix="+" /></div>
              <div className="text-[10px] sm:text-xs font-medium tracking-wider text-gray-400 uppercase font-heading">B2B Clients</div>
            </div>
            <div className="stat-card text-center px-2 sm:px-8 reveal [transition-delay:300ms]">
              <div className="font-heading text-3xl sm:text-5xl font-bold text-gold mb-2 tracking-tight"><Counter target={100} suffix="%" /></div>
              <div className="text-[10px] sm:text-xs font-medium tracking-wider text-gray-400 uppercase font-heading">Quality Assured</div>
            </div>
          </div>
        </div>
      </div>

      <div className="pt-16 sm:pt-24 overflow-hidden">
        <div className="marquee-wrapper">
          <div className="marquee-track">
            {[...certifications, ...certifications].map((cert, i) => (
              <div key={i} className="marquee-item">
                <span className="material-symbols-outlined text-gold text-xl sm:text-2xl">{cert.icon}</span>
                <span className="font-heading font-semibold text-brand text-sm sm:text-base">{cert.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <section id="process" className="pt-20 sm:pt-32 px-5 scroll-mt-20">
        <div className="max-w-[1370px] mx-auto bg-soft rounded-3xl sm:rounded-[32px] p-6 sm:p-10 md:p-16 lg:p-20">
          <div className="text-center max-w-[680px] mx-auto mb-10 sm:mb-16 reveal">
            <p className="text-sm font-medium text-gold uppercase tracking-[0.2em] font-heading mb-4">From Farm to Table</p>
            <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl font-semibold text-brand">Our Milling Process</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
            {processSteps.map((step, i) => (
              <div key={step.num} className={`process-card bg-white rounded-2xl p-6 sm:p-8 border border-gray-100 group reveal ${i > 0 ? `[transition-delay:${(i % 3) * 100}ms]` : ""}`}>
                <div className="flex items-center justify-between mb-5">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-gold/10 flex items-center justify-center group-hover:bg-gold/20 transition-colors">
                    <span className="material-symbols-outlined text-gold text-2xl">{step.icon}</span>
                  </div>
                  <span className="text-xs font-heading font-bold text-gray-300">{step.num}</span>
                </div>
                <h3 className="font-heading text-lg sm:text-xl font-semibold text-brand mb-3">{step.title}</h3>
                <p className="text-gray-500 leading-relaxed text-sm sm:text-base">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="section-line max-w-[600px] mx-auto mt-20 sm:mt-32" />

      <section id="products" className="pt-16 sm:pt-24 px-5 scroll-mt-20">
        <div className="max-w-5xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-16 reveal">
            <p className="text-sm font-medium text-gold uppercase tracking-[0.2em] font-heading mb-4">The Harvest</p>
            <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl font-semibold text-brand mb-5">Our Premium Varieties</h2>
            <p className="text-gray-500 text-base sm:text-lg leading-relaxed">Meticulously processed rice for everyday household meals and premium culinary experiences.</p>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
            {featuredProducts.map((product, i) => (
              <div key={product.id} className={`reveal ${i > 0 ? `[transition-delay:${i * 100}ms]` : ""}`}>
                <ProductCard product={product} />
              </div>
            ))}
          </div>
          <div className="text-center mt-10 sm:mt-12 reveal">
            <Link href="/products" className="inline-flex items-center gap-2 bg-brand text-white px-8 py-3.5 rounded-full font-bold hover:bg-brand-light transition-colors font-heading text-sm sm:text-base">
              View All Products <span className="material-symbols-outlined text-lg">arrow_forward</span>
            </Link>
          </div>
        </div>
      </section>

      <section className="pt-20 sm:pt-32 px-5">
        <div className="max-w-[1370px] mx-auto relative rounded-3xl sm:rounded-[32px] overflow-hidden h-[420px] sm:h-[500px] md:h-[700px]">
          <Image src="/assets/HeroSection.jpg" alt="Rice Fields" fill className="object-cover" />
          <div className="absolute inset-0 bg-brand/60" />
          <div className="absolute top-6 left-6 sm:top-12 sm:left-16 inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-white/20 backdrop-blur-md border border-white/30 reveal">
            <span className="w-2 h-2 rounded-full bg-white" />
            <span className="text-xs sm:text-sm font-medium text-white font-heading">25+ Years Experience</span>
          </div>
          <div className="hidden sm:inline-flex absolute top-24 right-20 items-center gap-2 px-4 py-2 rounded-full bg-white/20 backdrop-blur-md border border-white/30 reveal [transition-delay:100ms]">
            <span className="w-2 h-2 rounded-full bg-white" />
            <span className="text-sm font-medium text-white font-heading">100% Quality Assured</span>
          </div>
          <div className="hidden md:inline-flex absolute bottom-40 right-32 items-center gap-2 px-4 py-2 rounded-full bg-white/20 backdrop-blur-md border border-white/30 reveal [transition-delay:200ms]">
            <span className="w-2 h-2 rounded-full bg-white" />
            <span className="text-sm font-medium text-white font-heading">Advanced Technology</span>
          </div>
          <div className="hidden lg:inline-flex absolute bottom-10 right-16 items-center gap-2 px-4 py-2 rounded-full bg-white/20 backdrop-blur-md border border-white/30 reveal [transition-delay:300ms]">
            <span className="w-2 h-2 rounded-full bg-white" />
            <span className="text-sm font-medium text-white font-heading">Pan-India Delivery</span>
          </div>
          <div className="absolute bottom-4 left-4 right-4 sm:bottom-10 sm:left-10 sm:right-auto sm:max-w-[520px] bg-white rounded-2xl sm:rounded-[24px] p-5 sm:p-8 md:p-10 reveal [transition-delay:200ms]">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-soft mb-3 sm:mb-5">
              <span className="text-xs sm:text-sm font-medium text-gray-600 font-heading">Why choose us</span>
            </div>
            <h2 className="font-heading text-xl sm:text-3xl md:text-4xl font-semibold text-brand leading-tight mb-3 sm:mb-5">
              Discover why we&apos;re Telangana&apos;s trusted rice millers.
            </h2>
            <Link href="#contact" className="cta-btn inline-flex items-center gap-2 bg-brand text-white px-5 sm:px-6 py-2.5 sm:py-3 rounded-full font-bold hover:bg-brand-light transition-colors font-heading text-xs sm:text-sm">
              Get Started <span className="material-symbols-outlined text-base sm:text-lg">arrow_forward</span>
            </Link>
          </div>
        </div>
      </section>

      <section className="pt-20 sm:pt-32 px-5">
        <div className="max-w-[1370px] mx-auto bg-brand rounded-3xl sm:rounded-[32px] relative overflow-hidden">
          <div className="relative z-10 text-center py-16 sm:py-20 px-5 sm:px-6 lg:px-8 reveal">
            <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl font-semibold text-white mb-5 sm:mb-6">Looking for Bulk Orders?</h2>
            <p className="text-gray-300 text-base sm:text-lg mb-8 sm:mb-10 max-w-2xl mx-auto">We supply premium rice to distributors, exporters, and large retail chains with strict adherence to quality and delivery timelines.</p>
            <a href="#contact" className="inline-flex items-center gap-3 bg-gold text-brand px-8 sm:px-10 py-3.5 sm:py-4 rounded-full font-bold hover:bg-gold-light transition-all duration-300 hover:scale-105 shadow-xl hover:shadow-gold/20 font-heading text-sm sm:text-base">
              Contact Sales Team <span className="material-symbols-outlined text-xl">arrow_forward</span>
            </a>
          </div>
        </div>
      </section>

      <div className="section-line max-w-[600px] mx-auto mt-20 sm:mt-32" />

      <section className="pt-16 sm:pt-24 px-5">
        <div className="max-w-[1200px] mx-auto">
          <div className="text-center max-w-[754px] mx-auto mb-10 sm:mb-16 reveal">
            <p className="text-sm font-medium text-gold uppercase tracking-[0.2em] font-heading mb-4">Testimonials</p>
            <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl font-semibold text-brand">What Our Clients Say</h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
            {testimonials.map((t, i) => (
              <div key={t.name} className={`testimonial-card bg-soft rounded-2xl sm:rounded-[24px] p-6 sm:p-8 border border-gray-100 reveal ${i > 0 ? `[transition-delay:${i * 100}ms]` : ""}`}>
                <div className="flex gap-1 mb-4 sm:mb-5">
                  {[...Array(5)].map((_, j) => (
                    <span key={j} className="text-gold text-lg sm:text-xl">&#9733;</span>
                  ))}
                </div>
                <p className="text-gray-600 leading-relaxed mb-5 sm:mb-6 text-sm sm:text-base">&ldquo;{t.text}&rdquo;</p>
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full ${t.color} flex items-center justify-center text-white font-heading font-bold text-sm`}>{t.initials}</div>
                  <div>
                    <h4 className="font-heading font-semibold text-brand text-sm">{t.name}</h4>
                    <p className="text-xs text-gray-400">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="section-line max-w-[600px] mx-auto mt-20 sm:mt-32" />

      <section id="faq" className="pt-16 sm:pt-24 px-5 scroll-mt-20">
        <div className="max-w-[1370px] mx-auto">
          <div className="text-center max-w-[754px] mx-auto mb-10 sm:mb-16 reveal">
            <p className="text-sm font-medium text-gold uppercase tracking-[0.2em] font-heading mb-4">Support</p>
            <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl font-semibold text-brand">Frequently Asked Questions</h2>
          </div>
          <div className="max-w-[800px] mx-auto space-y-3 sm:space-y-4 reveal [transition-delay:100ms]">
            {faqs.map((faq) => (
              <FaqItem key={faq.q} q={faq.q} a={faq.a} />
            ))}
          </div>
        </div>
      </section>

      <div className="section-line max-w-[600px] mx-auto mt-20 sm:mt-32" />

      <section id="contact" className="pt-16 sm:pt-24 pb-20 sm:pb-32 px-5 scroll-mt-20">
        <div className="max-w-[1370px] mx-auto">
          <div className="grid lg:grid-cols-5 gap-10 lg:gap-20">
            <div className="lg:col-span-2 reveal">
              <p className="text-sm font-medium text-gold uppercase tracking-[0.2em] font-heading mb-4">Get in Touch</p>
              <h2 className="font-heading text-3xl sm:text-4xl font-semibold text-brand mb-5 sm:mb-6">Start a Conversation</h2>
              <p className="text-gray-600 mb-8 sm:mb-10 text-base sm:text-lg">Whether you are a distributor or looking for bulk supply, our dedicated team is ready to assist you.</p>
              <div className="space-y-6 sm:space-y-8">
                <div className="flex items-start gap-4 group">
                  <div className="w-11 h-11 sm:w-12 sm:h-12 bg-soft rounded-2xl flex items-center justify-center shrink-0 border border-gray-100 text-brand group-hover:bg-gold group-hover:text-white transition-colors">
                    <span className="material-symbols-outlined text-xl sm:text-2xl">location_on</span>
                  </div>
                  <div>
                    <h4 className="font-heading font-bold text-brand mb-1 text-sm sm:text-base">Headquarters &amp; Mill</h4>
                    <p className="text-gray-600 text-xs sm:text-sm leading-relaxed">Miryalaguda, Nalgonda District,<br />Telangana, India</p>
                  </div>
                </div>
                <div className="flex items-start gap-4 group">
                  <div className="w-11 h-11 sm:w-12 sm:h-12 bg-soft rounded-2xl flex items-center justify-center shrink-0 border border-gray-100 text-brand group-hover:bg-gold group-hover:text-white transition-colors">
                    <span className="material-symbols-outlined text-xl sm:text-2xl">call</span>
                  </div>
                  <div>
                    <h4 className="font-heading font-bold text-brand mb-1 text-sm sm:text-base">Phone</h4>
                    <p className="text-gray-600 text-xs sm:text-sm leading-relaxed">+91 98497 11335<br />Mon-Sat, 9AM to 6PM</p>
                  </div>
                </div>
                <div className="flex items-start gap-4 group">
                  <div className="w-11 h-11 sm:w-12 sm:h-12 bg-soft rounded-2xl flex items-center justify-center shrink-0 border border-gray-100 text-brand group-hover:bg-gold group-hover:text-white transition-colors">
                    <span className="material-symbols-outlined text-xl sm:text-2xl">mail</span>
                  </div>
                  <div>
                    <h4 className="font-heading font-bold text-brand mb-1 text-sm sm:text-base">Email</h4>
                    <p className="text-gray-600 text-xs sm:text-sm leading-relaxed">info@bandaruagrotech.com<br />sales@bandaruagrotech.com</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="lg:col-span-3 reveal [transition-delay:200ms]">
              <div className="bg-soft p-6 sm:p-8 md:p-10 rounded-3xl sm:rounded-[32px] border border-gray-100">
                <form className="space-y-5 sm:space-y-6" onSubmit={(e) => { e.preventDefault(); alert("Thank you! Your message has been sent successfully."); }}>
                  <div className="grid sm:grid-cols-2 gap-5 sm:gap-6">
                    <div>
                      <label htmlFor="firstName" className="block text-sm font-semibold text-brand mb-2 font-heading">First Name</label>
                      <input type="text" id="firstName" className="w-full px-4 py-3 rounded-xl bg-white border border-gray-200 focus:border-brand focus:ring-2 focus:ring-brand/20 outline-none transition-all placeholder:text-gray-400" placeholder="John" required />
                    </div>
                    <div>
                      <label htmlFor="lastName" className="block text-sm font-semibold text-brand mb-2 font-heading">Last Name</label>
                      <input type="text" id="lastName" className="w-full px-4 py-3 rounded-xl bg-white border border-gray-200 focus:border-brand focus:ring-2 focus:ring-brand/20 outline-none transition-all placeholder:text-gray-400" placeholder="Doe" required />
                    </div>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-5 sm:gap-6">
                    <div>
                      <label htmlFor="email" className="block text-sm font-semibold text-brand mb-2 font-heading">Email Address</label>
                      <input type="email" id="email" className="w-full px-4 py-3 rounded-xl bg-white border border-gray-200 focus:border-brand focus:ring-2 focus:ring-brand/20 outline-none transition-all placeholder:text-gray-400" placeholder="john@example.com" required />
                    </div>
                    <div>
                      <label htmlFor="phone" className="block text-sm font-semibold text-brand mb-2 font-heading">Phone Number</label>
                      <input type="tel" id="phone" className="w-full px-4 py-3 rounded-xl bg-white border border-gray-200 focus:border-brand focus:ring-2 focus:ring-brand/20 outline-none transition-all placeholder:text-gray-400" placeholder="+91 98765 43210" />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="inquiryType" className="block text-sm font-semibold text-brand mb-2 font-heading">Inquiry Type</label>
                    <select id="inquiryType" className="w-full px-4 py-3 rounded-xl bg-white border border-gray-200 focus:border-brand focus:ring-2 focus:ring-brand/20 outline-none transition-all text-gray-600">
                      <option>Bulk Order / Distributorship</option>
                      <option>General Inquiry</option>
                      <option>Feedback</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="message" className="block text-sm font-semibold text-brand mb-2 font-heading">Message</label>
                    <textarea id="message" className="w-full px-4 py-3 rounded-xl bg-white border border-gray-200 focus:border-brand focus:ring-2 focus:ring-brand/20 outline-none transition-all resize-none h-32 placeholder:text-gray-400" placeholder="Tell us about your requirements..." required />
                  </div>
                  <button type="submit" className="w-full bg-brand text-white py-4 rounded-xl font-bold hover:bg-brand-light transition-colors flex items-center justify-center gap-2 shadow-lg shadow-brand/20 font-heading">
                    Send Message <span className="material-symbols-outlined text-sm">send</span>
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
