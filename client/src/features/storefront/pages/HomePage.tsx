import { useEffect, useMemo, useState } from 'react';
import { ChevronLeft, ChevronRight, Gift, ShieldCheck, Sparkles } from 'lucide-react';
import { CATEGORIES, EDITORIAL_ASSETS, HERO_SLIDES } from '../data/editorial';
import { fetchHighlights } from '../services/products';
import { colors } from '../theme';
import type { Product } from '../types';
import { useStorefront } from '../context/StorefrontContext';
import { ProductCard } from '../components/product/ProductCard';

export function HomePage() {
  const [highlights, setHighlights] = useState<Product[]>([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [currentHighlightPage, setCurrentHighlightPage] = useState(0);
  const [isProductZooming, setIsProductZooming] = useState(false);
  const { browseCategory, isAdmin, navigateTo } = useStorefront();

  const visibleHighlights = useMemo(
    () => highlights.filter((product) => isAdmin || !product.inativo),
    [highlights, isAdmin],
  );

  const highlightPages = useMemo(() => {
    const pages: Product[][] = [];

    for (let index = 0; index < visibleHighlights.length; index += 4) {
      pages.push(visibleHighlights.slice(index, index + 4));
    }

    return pages;
  }, [visibleHighlights]);

  useEffect(() => {
    fetchHighlights()
      .then(setHighlights)
      .catch((error) => {
        console.error(error);
        setHighlights([]);
      });
  }, []);

  useEffect(() => {
    const timer = setInterval(
      () => setCurrentSlide((previous) => (previous === HERO_SLIDES.length - 1 ? 0 : previous + 1)),
      5000,
    );

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    setCurrentHighlightPage(0);
  }, [highlightPages.length]);

  useEffect(() => {
    if (highlightPages.length <= 1 || isProductZooming) return undefined;

    const timer = setInterval(
      () => setCurrentHighlightPage((previous) => (previous === highlightPages.length - 1 ? 0 : previous + 1)),
      5000,
    );

    return () => clearInterval(timer);
  }, [highlightPages.length, isProductZooming]);

  return (
    <div className="luxury-page md:!max-w-[1640px] md:!px-8 md:!pt-0 2xl:!px-10 animate-fadeIn">
      <div tabIndex={0} className="home-hero-fade relative overflow-hidden rounded-[1.35rem] min-h-[360px] sm:min-h-[420px] md:left-1/2 md:w-screen md:-translate-x-1/2 md:rounded-none md:min-h-[640px] lg:min-h-[680px] group bg-[#FAF8F4]">
        <div className="flex transition-transform duration-700 ease-in-out h-full absolute inset-0" style={{ transform: `translateX(-${currentSlide * 100}%)` }}>
          {HERO_SLIDES.map((slide, index) => (
            <div key={index} className="min-w-full h-full relative flex items-end sm:items-center p-5 pb-9 sm:p-16 overflow-hidden">
              <img src={slide.image} alt="Editorial de semijoias Yara Souza" className="absolute inset-0 h-full w-full object-cover object-[64%_center] saturate-[0.92] contrast-[0.96] brightness-[0.94] md:object-[68%_center] md:saturate-100 md:contrast-100 md:brightness-100" />
              <div className="absolute inset-0 bg-[#FAF8F4]/30 backdrop-blur-[1.5px] md:hidden" />
              <div className="absolute inset-y-0 left-0 hidden w-[58%] bg-gradient-to-r from-[#FAF8F4]/96 via-[#FAF8F4]/66 to-transparent md:block" />
              <div className="absolute left-5 top-5 sm:left-8 sm:top-8 h-14 w-14 sm:h-20 sm:w-20 rounded-full border border-[#B88A2E]/35" />
              <div className="relative z-10 max-w-[78%] border-l border-[#B88A2E]/45 pl-3 sm:max-w-lg sm:pl-8">
                <span className="text-[10px] sm:text-xs uppercase tracking-[0.32em] text-[#8F6720] font-semibold">{slide.eyebrow}</span>
                <h1 className={`text-[2.35rem] sm:text-5xl md:text-6xl font-serif ${colors.textNavy} mt-3 mb-3 sm:mb-4 leading-[0.96]`} dangerouslySetInnerHTML={{ __html: slide.title }} />
                <p className={`${colors.textNavy} text-sm sm:text-lg mb-6 sm:mb-8 max-w-md opacity-75 pr-2 sm:pr-0 leading-relaxed`}>{slide.desc}</p>
                <button onClick={() => navigateTo('products')} className="rounded-full border border-[#B88A2E]/35 bg-[#F7F2E8] px-7 py-3 text-sm font-semibold tracking-[0.04em] text-[#8F6720] shadow-sm transition-[background-color,border-color,color,box-shadow,transform] hover:border-[#B88A2E]/55 hover:bg-[#EFE6D4] hover:text-[#6F4A16] hover:shadow-md active:scale-95 sm:px-9">
                  {slide.btn}
                </button>
              </div>
            </div>
          ))}
        </div>
        <button onClick={() => setCurrentSlide((previous) => (previous === 0 ? HERO_SLIDES.length - 1 : previous - 1))} className="mobile-touch-pop absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/85 sm:bg-white/55 sm:backdrop-blur-sm hover:bg-white flex items-center justify-center text-[#8F6720] opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-[opacity,transform,background-color] active:scale-95 z-20 shadow-sm">
          <ChevronLeft className="w-6 h-6" />
        </button>
        <button onClick={() => setCurrentSlide((previous) => (previous === HERO_SLIDES.length - 1 ? 0 : previous + 1))} className="mobile-touch-pop absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/85 sm:bg-white/55 sm:backdrop-blur-sm hover:bg-white flex items-center justify-center text-[#8F6720] opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-[opacity,transform,background-color] active:scale-95 z-20 shadow-sm">
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>

      <div className="relative z-10 mt-5 grid grid-cols-3 gap-2 sm:gap-4 md:px-0">
        {[
          { icon: <Sparkles />, title: 'Banhado a ouro', desc: 'Acabamento premium' },
          { icon: <Gift />, title: 'Presenteável', desc: 'Peças selecionadas' },
          { icon: <ShieldCheck />, title: 'Curadoria', desc: 'Semijoias revisadas' },
        ].map((item) => (
          <div key={item.title} className="luxury-card rounded-2xl p-3 sm:p-4 text-center">
            <div className="mx-auto mb-2 flex h-8 w-8 items-center justify-center rounded-full bg-[#F7F2E8] text-[#8F6720] [&_svg]:h-4 [&_svg]:w-4">
              {item.icon}
            </div>
            <p className={`text-xs sm:text-sm font-semibold ${colors.textNavy}`}>{item.title}</p>
            <p className="mt-1 text-[11px] leading-tight text-gray-500 sm:text-xs">{item.desc}</p>
          </div>
        ))}
      </div>

      <section className="mt-12">
        <div className="mb-5 flex items-end justify-between gap-4">
          <div>
            <span className="text-[10px] font-semibold uppercase tracking-[0.28em] text-[#8F6720]">Explore</span>
            <h2 className={`mt-1 text-3xl font-serif ${colors.textNavy}`}>Categorias</h2>
          </div>
          <button type="button" onClick={() => navigateTo('products')} className="text-sm font-semibold text-[#8F6720]">Ver tudo</button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-5">
          {CATEGORIES.filter((category) => category !== 'Todos').map((category, index) => (
            <button key={category} type="button" onClick={() => browseCategory(category)} className="group relative aspect-[1/1.05] overflow-hidden rounded-2xl bg-white text-left shadow-sm">
              <img src={[EDITORIAL_ASSETS.collection, EDITORIAL_ASSETS.productDisplay, EDITORIAL_ASSETS.gift, EDITORIAL_ASSETS.hero][index % 4]} alt={category} className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#1F2428]/70 via-[#1F2428]/16 to-transparent" />
              <span className="absolute bottom-3 left-3 right-3 font-serif text-2xl text-white">{category}</span>
            </button>
          ))}
        </div>
      </section>

      <section id="destaques-da-semana" className="mt-14 scroll-mt-36">
        <div className="mb-6 text-center">
          <span className="text-[10px] font-semibold uppercase tracking-[0.28em] text-[#8F6720]">Curadoria</span>
          <h2 className={`mt-1 text-3xl font-serif ${colors.textNavy}`}>Destaques da Semana</h2>
        </div>
        {highlightPages.length > 0 ? (
          <div className="relative group">
            <div className="overflow-hidden">
              <div className="flex items-start transition-transform duration-500 ease-in-out" style={{ transform: `translateX(-${currentHighlightPage * 100}%)` }}>
                {highlightPages.map((page, pageIndex) => (
                  <div key={pageIndex} className="min-w-full grid grid-cols-2 md:grid-cols-4 items-stretch gap-3.5 sm:gap-6">
                    {page.map((product, index) => (
                      <div key={product.id} className="min-w-0 h-full">
                        <ProductCard product={product} index={index} onZoomChange={setIsProductZooming} />
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>

            {highlightPages.length > 1 && (
              <>
                <div className="mt-5 flex items-center justify-center gap-2">
                  {highlightPages.map((_, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => setCurrentHighlightPage(index)}
                      className={`h-2 rounded-full transition-[width,background-color] ${index === currentHighlightPage ? 'w-6 bg-[#8F6720]' : 'w-2 bg-[#E8E0D3]'}`}
                      title={`Ir para destaques ${index + 1}`}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        ) : (
          <div className="luxury-card rounded-2xl p-8 text-center text-gray-500">
            Nenhum destaque disponível no momento.
          </div>
        )}
      </section>
    </div>
  );
}
