import { Link } from 'react-router-dom';
import { useEffect, useState, useCallback } from 'react';
import { Sparkles, Droplets, Leaf, Star, Shield, Check, ChevronRight, Package, Award, Heart, Users, Building2, Utensils, Coffee, Briefcase, Phone, MessageCircle, Mail, HeadphonesIcon, ChevronLeft as ChevronLeftIcon, ChevronRight as ChevronRightIcon } from 'lucide-react';
import api from '../api/axios';
import ProductCard from '../components/ProductCard';

const slides = [
  {
    tagline: 'Powerful Cleaning. Brilliant Shine. Trusted Every Day.',
    heading: <>S CUBE <span className="text-brand-700">Dishwash</span> Liquid</>,
    description: 'Experience the perfect combination of powerful cleaning and everyday care with S CUBE Dishwash Liquid. Specially formulated to remove stubborn grease, oil, and food residue, S CUBE helps keep your utensils sparkling clean with every wash.',
    description2: 'Designed for modern kitchens and suitable for everyday household use, it is also suitable for cleaning traditional brass and copper pooja vessels when used as directed.',
  },
  {
    tagline: 'Rich Foam. Fresh Fragrance. Everyday Care.',
    heading: <>Cleaning <span className="text-brand-700">Beyond</span> Ordinary</>,
    description: 'Every Indian kitchen is unique. S CUBE is developed keeping everyday cleaning needs in mind, offering powerful grease removal together with suitability for a wide range of household utensils.',
    description2: 'From stainless steel cookware to traditional brass and copper pooja items, S CUBE delivers effective cleaning, rich foam, and a fresh fragrance that makes dishwashing easier and more enjoyable.',
  },
  {
    tagline: 'Trusted by Families Across India.',
    heading: <>One Product. <span className="text-brand-700">Many</span> Uses.</>,
    description: 'S CUBE Dishwash Liquid is suitable for cleaning stainless steel, brass, copper, aluminium, glassware, and more. A concentrated formula that goes a long way, providing excellent value for every household.',
    description2: 'Quality checked, manufactured under hygienic conditions, and designed to make your kitchen cleaning quicker, easier, and more efficient.',
  },
];

export default function Home() {
  const [products, setProducts] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);

  const nextSlide = useCallback(() => setCurrentSlide(s => (s + 1) % slides.length), []);
  const prevSlide = useCallback(() => setCurrentSlide(s => (s - 1 + slides.length) % slides.length), []);

  useEffect(() => {
    api.get('/products').then(res => setProducts(res.data.slice(0, 4))).catch(() => { });
  }, []);

  useEffect(() => {
    const timer = setInterval(nextSlide, 6000);
    return () => clearInterval(timer);
  }, [nextSlide]);

  return (
    <div>
      <section className="relative overflow-hidden min-h-screen flex items-center">
        {/* Background Video */}
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover z-0"
        >
          <source src="/Kitchen_liquid.mp4" type="video/mp4" />
        </video>

        {/* Soft natural fade on left side for text readability (no hard card box) */}
        <div className="absolute inset-0 bg-gradient-to-r from-white/90 via-white/50 to-transparent z-0 pointer-events-none w-full md:w-2/3" />

        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
          {/* Simple left-aligned content without white card frame */}
          <div className="max-w-xl transition-all duration-500 animate-fade-in">
            <div key={currentSlide} className="transition-all duration-500">
              <span className="inline-block bg-brand-100/90 text-brand-900 px-3.5 py-1 rounded-full text-xs font-bold mb-3 border border-brand-200">
                {slides[currentSlide].tagline}
              </span>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-900 mb-3 leading-tight tracking-tight">
                {slides[currentSlide].heading}
              </h1>

              <p className="text-sm sm:text-base text-gray-800 mb-2 leading-relaxed font-medium">
                {slides[currentSlide].description}
              </p>

              <p className="text-xs sm:text-sm text-gray-600 mb-6 leading-relaxed">
                {slides[currentSlide].description2}
              </p>

              <div className="flex flex-wrap items-center gap-3">
                <Link
                  to="/products"
                  className="inline-flex items-center bg-brand-600 text-white px-6 py-3 rounded-xl font-bold text-sm hover:bg-brand-700 transition-all shadow-md hover:shadow-lg hover:scale-105"
                >
                  Buy Now <ChevronRight className="w-4 h-4 ml-1" />
                </Link>
                <Link
                  to="/about#distributors"
                  className="inline-flex items-center bg-gray-900 text-white px-5 py-3 rounded-xl font-semibold text-sm hover:bg-gray-800 transition-all shadow-md hover:scale-105"
                >
                  Become a Distributor
                </Link>
                <Link
                  to="/about#contact"
                  className="inline-flex items-center bg-white/90 border border-gray-300 text-gray-800 px-5 py-3 rounded-xl font-semibold text-sm hover:bg-white transition-all shadow-sm hover:scale-105"
                >
                  Contact Us
                </Link>
              </div>

              {/* Simple subtle stats line */}
              <div className="flex items-center gap-6 mt-6 pt-5 border-t border-gray-300/60">
                {[
                  { value: '500+', label: 'Happy Customers' },
                  { value: '100%', label: 'Quality Assured' },
                  { value: '3+', label: 'Sizes Available' },
                ].map((s, i) => (
                  <div key={i}>
                    <p className="text-base sm:text-lg font-extrabold text-brand-800">{s.value}</p>
                    <p className="text-[11px] text-gray-600 font-medium">{s.label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Slider Dots & Navigation */}
            <div className="flex items-center gap-3 mt-5">
              <div className="flex gap-1.5">
                {slides.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentSlide(i)}
                    aria-label={`Slide ${i + 1}`}
                    className={`h-1.5 rounded-full transition-all duration-300 ${i === currentSlide ? 'bg-brand-600 w-6' : 'bg-gray-400/60 hover:bg-gray-600 w-1.5'
                      }`}
                  />
                ))}
              </div>

              <div className="flex gap-1 ml-2">
                <button
                  onClick={prevSlide}
                  aria-label="Previous slide"
                  className="w-7 h-7 rounded-full bg-white/80 hover:bg-white border border-gray-300 flex items-center justify-center text-gray-700 transition-all shadow-sm"
                >
                  <ChevronLeftIcon className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={nextSlide}
                  aria-label="Next slide"
                  className="w-7 h-7 rounded-full bg-white/80 hover:bg-white border border-gray-300 flex items-center justify-center text-gray-700 transition-all shadow-sm"
                >
                  <ChevronRightIcon className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { icon: Sparkles, text: 'Powerful Grease Removal' },
              { icon: Droplets, text: 'Rich & Long-Lasting Foam' },
              { icon: Leaf, text: 'Fresh Pleasant Fragrance' },
              { icon: Star, text: 'Gentle on Hands' },
              { icon: Check, text: 'Fast & Easy Rinsing' },
              { icon: Package, text: 'Concentrated Formula' },
              { icon: Shield, text: 'Suitable for Brass, Copper, Steel & More' },
              { icon: Heart, text: 'Ideal for Daily Kitchen Cleaning' },
            ].map((h, i) => (
              <div key={i} className="flex items-center gap-2 bg-white p-3 rounded-lg shadow-sm animate-fade-in-up" style={{ animationDelay: `${i * 0.05}s` }}>
                <div className="bg-brand-100 p-1.5 rounded-full flex-shrink-0">
                  <h.icon className="w-4 h-4 text-brand-600" />
                </div>
                <span className="text-xs sm:text-sm font-medium text-gray-700">{h.text}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="animate-fade-in-left">
            <span className="text-accent-600 font-semibold text-sm tracking-wider uppercase">Welcome to S CUBE</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 mt-2 mb-4">Cleaning Beyond Ordinary</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              At S CUBE, we believe that cleaning should be simple, effective, and reliable. Every household deserves a dishwash liquid that not only removes stubborn grease but also cares for the utensils that are part of everyday life.
            </p>
            <p className="text-gray-600 leading-relaxed">
              Our mission is to create high-quality home-care products that deliver outstanding cleaning performance while offering excellent value for money. From everyday cooking utensils to traditional brass and copper pooja items, S CUBE is designed to help every home stay clean, fresh, and shining.
            </p>
          </div>
          <div className="animate-fade-in-right">
            <div className="bg-gradient-to-br from-brand-50 to-accent-50 rounded-2xl p-8 shadow-lg">
              <img src="/logo.png" alt="S CUBE" className="w-48 h-48 object-contain mx-auto" />
            </div>
          </div>
        </div>
      </section>

      <section className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 animate-fade-in-up">
            <span className="text-accent-600 font-semibold text-sm tracking-wider uppercase">Why Choose S CUBE</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 mt-2">Why Choose S CUBE?</h2>
            <p className="text-gray-500 mt-3 max-w-2xl mx-auto">Choosing the right dishwash liquid makes everyday kitchen cleaning easier and more efficient. S CUBE is developed to provide powerful grease-cutting performance while remaining economical for daily use.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: Sparkles, title: 'Powerful Grease Removal', desc: 'Cuts through stubborn oil, grease, and food stains quickly, making dishwashing faster and easier.' },
              { icon: Droplets, title: 'Rich Foam Formula', desc: 'Creates thick, long-lasting foam that spreads evenly across utensils for effective cleaning with less effort.' },
              { icon: Star, title: 'Helps Keep Utensils Looking Bright', desc: 'Regular cleaning helps maintain the clean appearance of your everyday utensils.' },
              { icon: Shield, title: 'Suitable for Kitchen & Pooja Essentials', desc: 'Designed for cleaning a wide range of household utensils, including stainless steel, brass, copper, aluminium, and glassware.' },
              { icon: Heart, title: 'Gentle on Hands', desc: 'Designed for regular household use when used according to the instructions.' },
              { icon: Leaf, title: 'Fresh Fragrance', desc: 'Leaves utensils smelling fresh and clean after every wash.' },
              { icon: Package, title: 'Economical Concentrated Formula', desc: 'A small quantity goes a long way, helping every bottle last longer and providing excellent value.' },
            ].map((f, i) => (
              <div key={i} className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-all group animate-fade-in-up" style={{ animationDelay: `${i * 0.08}s` }}>
                <div className="text-brand-600 mb-3 group-hover:scale-110 transition-transform duration-300">
                  <f.icon className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">{f.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── One Product. Many Uses. (Versatile Cleaning Solution UI) ─── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-14 animate-fade-in-up">
          <span className="inline-block bg-brand-100 text-brand-800 text-xs sm:text-sm font-bold tracking-wider uppercase px-4 py-1.5 rounded-full border border-brand-200 mb-3">
            One Product. Many Uses.
          </span>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-gray-900 tracking-tight">
            Versatile Cleaning Solution
          </h2>
          <p className="text-gray-600 mt-4 max-w-2xl mx-auto text-base sm:text-lg leading-relaxed">
            One concentrated formula engineered for traditional Indian homes. From tough cookware grease to delicate brass pooja lamps.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              title: 'Pooja Essentials',
              badge: 'Traditional Care',
              badgeColor: 'bg-amber-100 text-amber-900 border-amber-200',
              icon: '🪔',
              desc: 'Restores golden glow and shines brass & copper without harsh tarnishing.',
              items: ['Brass Lamps (Deepam)', 'Copper Vessels (Chembu)', 'Pooja Bells & Plates', 'Brass Statues & Idols'],
              bg: 'from-amber-50/70 to-orange-50/40',
              accent: 'border-amber-200/80',
            },
            {
              title: 'Heavy Cookware',
              badge: 'Tough On Grease',
              badgeColor: 'bg-emerald-100 text-emerald-900 border-emerald-200',
              icon: '🍳',
              desc: 'Instantly dissolves burnt food, heavy curry oil, and stubborn stains.',
              items: ['Stainless Steel Pots', 'Pressure Cookers', 'Cast Iron / Tawa', 'Aluminium Kadai'],
              bg: 'from-emerald-50/70 to-teal-50/40',
              accent: 'border-emerald-200/80',
            },
            {
              title: 'Daily Dining',
              badge: 'Sparkling Fresh',
              badgeColor: 'bg-blue-100 text-blue-900 border-blue-200',
              icon: '🍽️',
              desc: 'Rich foam spreads quickly, leaving plates sparkling clean and fragrant.',
              items: ['Dining Plates & Thali', 'Curry Bowls & Spoons', 'Stainless Steel Tumblers', 'Serving Dishes'],
              bg: 'from-blue-50/70 to-sky-50/40',
              accent: 'border-blue-200/80',
            },
            {
              title: 'Glass & Crockery',
              badge: 'Streak-Free',
              badgeColor: 'bg-purple-100 text-purple-900 border-purple-200',
              icon: '🍷',
              desc: 'Gentle on delicate surfaces, rinses completely with zero water spots.',
              items: ['Glassware & Tumblers', 'Ceramic Dinnerware', 'Melamine Plates', 'Coffee & Tea Cups'],
              bg: 'from-purple-50/70 to-violet-50/40',
              accent: 'border-purple-200/80',
            },
          ].map((cat, i) => (
            <div
              key={i}
              className={`rounded-2xl p-6 bg-gradient-to-b ${cat.bg} border ${cat.accent} shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1.5 flex flex-col justify-between`}
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-3xl">{cat.icon}</span>
                  <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full border ${cat.badgeColor}`}>
                    {cat.badge}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{cat.title}</h3>
                <p className="text-xs sm:text-sm text-gray-600 mb-5 leading-relaxed">{cat.desc}</p>
                <div className="space-y-2">
                  {cat.items.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-xs sm:text-sm text-gray-700 bg-white/70 backdrop-blur-sm px-3 py-1.5 rounded-lg border border-white/80">
                      <Check className="w-3.5 h-3.5 text-brand-600 flex-shrink-0" />
                      <span className="font-medium">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
        <p className="text-xs text-gray-400 mt-6 text-center italic">* Always follow manufacturer care guidelines for delicate ceramics.</p>
      </section>

      <section className="bg-brand-600 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 animate-fade-in-up">
            <span className="text-brand-200 font-semibold text-sm tracking-wider uppercase">Product Highlights</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mt-2">Everything You Need in a Dishwash Liquid</h2>
            <p className="text-brand-100 mt-3 max-w-2xl mx-auto">S CUBE combines advanced cleaning performance with everyday convenience.</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {[
              'Powerful grease-cutting action', 'Rich foam for effective cleaning', 'Quick and easy rinsing',
              'Pleasant long-lasting fragrance', 'Concentrated formula', 'Gentle on hands',
              'Suitable for multiple utensil materials', 'Easy-to-use liquid formula', 'Quality checked before packing',
              'Manufactured under hygienic conditions',
            ].map((item, i) => (
              <div key={i} className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-4 text-center animate-fade-in-up" style={{ animationDelay: `${i * 0.05}s` }}>
                <Check className="w-6 h-6 text-highlight-400 mx-auto mb-2" />
                <p className="text-white text-sm font-medium">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 animate-fade-in-up">
            <span className="text-accent-600 font-semibold text-sm tracking-wider uppercase">Perfect for Every Home</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 mt-2">Who Uses S CUBE?</h2>
            <p className="text-gray-500 mt-3 max-w-2xl mx-auto">Whether you live alone or have a large family, S CUBE is designed to meet your daily dishwashing needs.</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
            {[
              { icon: Building2, label: 'Homes' },
              { icon: Building2, label: 'Apartments' },
              { icon: Building2, label: 'Villas' },
              { icon: Utensils, label: 'Restaurants' },
              { icon: Building2, label: 'Hotels' },
              { icon: Coffee, label: 'Cafeterias' },
              { icon: Users, label: 'Catering Services' },
              { icon: Building2, label: 'Temples' },
              { icon: Briefcase, label: 'Office Pantries' },
              { icon: Users, label: 'Hostels' },
            ].map((item, i) => (
              <div key={i} className="bg-white rounded-xl p-4 text-center shadow-sm hover:shadow-md transition-all animate-fade-in-up border border-gray-100" style={{ animationDelay: `${i * 0.05}s` }}>
                <div className="text-brand-600 mb-2"><item.icon className="w-8 h-8 mx-auto" /></div>
                <p className="text-gray-700 font-medium text-sm">{item.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="animate-fade-in-left">
            <span className="text-accent-600 font-semibold text-sm tracking-wider uppercase">Made for Indian Homes</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 mt-2 mb-4">Why Indian Families Love S CUBE</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              Every Indian kitchen is unique. Along with everyday utensils, many homes regularly clean brass and copper pooja items that require extra care.
            </p>
            <p className="text-gray-600 leading-relaxed">
              S CUBE is developed keeping these everyday cleaning needs in mind, offering powerful grease removal together with suitability for a wide range of household utensils. Our goal is to make kitchen cleaning quicker, easier, and more efficient, so you spend less time washing and more time enjoying time with your family.
            </p>
          </div>
          <div className="animate-fade-in-right">
            <div className="bg-gradient-to-br from-highlight-50 to-brand-50 rounded-2xl p-8 shadow-lg text-center">
              <Award className="w-20 h-20 text-brand-600 mx-auto mb-4" />
              <p className="text-2xl font-bold text-gray-800">Trusted by Families</p>
              <p className="text-gray-500">Across India</p>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Available Pack Sizes (Modern Card Showcase UI) ─── */}
      <section className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14 animate-fade-in-up">
            <span className="inline-block bg-brand-100 text-brand-800 text-xs sm:text-sm font-bold tracking-wider uppercase px-4 py-1.5 rounded-full border border-brand-200 mb-3">
              Pack Sizes
            </span>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-gray-900 tracking-tight">
              Available Pack Sizes
            </h2>
            <p className="text-gray-600 mt-4 max-w-2xl mx-auto text-base sm:text-lg">
              Choose the perfect size for your household or commercial kitchen needs.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                size: '250 ml',
                badge: 'TRIAL PACK',
                badgeStyle: 'bg-gray-100 text-gray-700 border-gray-200',
                ideal: 'Individuals & Small Families',
                desc: 'Compact and easy to handle by the sink. Great for first-time users.',
                features: ['Up to 50 Washes', 'Ergonomic Grip Bottle', 'Zero Wastage Cap'],
                highlight: false,
              },
              {
                size: '500 ml',
                badge: 'MOST POPULAR',
                badgeStyle: 'bg-brand-600 text-white border-brand-500 shadow-sm',
                ideal: 'Regular Household Use (3–4 Members)',
                desc: 'The daily kitchen favorite. Perfect balance of quantity, convenience, and value.',
                features: ['Up to 120 Washes', 'Push-Pull Dispenser Cap', 'Rich Concentrated Foam'],
                highlight: true,
              },
              {
                size: '750 ml',
                badge: 'FAMILY PACK',
                badgeStyle: 'bg-emerald-100 text-emerald-800 border-emerald-300',
                ideal: 'Medium to Large Families',
                desc: 'Designed for daily Indian cooking with heavy oil and turmeric cleaning needs.',
                features: ['Up to 180 Washes', 'Economical Daily Use', 'Long-lasting Lemon Freshness'],
                highlight: false,
              },
              {
                size: '1 Litre',
                badge: 'VALUE PACK',
                badgeStyle: 'bg-blue-100 text-blue-800 border-blue-300',
                ideal: 'Maximum Household Savings',
                desc: 'Extra quantity at a lower cost per wash. Lasts several weeks for busy homes.',
                features: ['Up to 260 Washes', 'Best Price Per ml', 'Easy Refill Ready'],
                highlight: false,
              },
              {
                size: '2 Litre',
                badge: 'MEGA SAVER',
                badgeStyle: 'bg-purple-100 text-purple-800 border-purple-300',
                ideal: 'Refill Pack For All Dispensers',
                desc: 'Economical bulk pack with built-in carry handle for easy bottle refills.',
                features: ['Convenient Pour Spout', 'Heavy Duty Handle', 'Eco-friendly Refill Option'],
                highlight: false,
              },
              {
                size: '5 Litre',
                badge: 'COMMERCIAL BULK',
                badgeStyle: 'bg-amber-100 text-amber-900 border-amber-300',
                ideal: 'Hotels, Catering & Restaurants',
                desc: 'Heavy-duty volume for professional kitchens, canteens, temples, and large events.',
                features: ['Commercial Grade Formula', 'Industrial Sturdy Can', 'Bulk Wholesale Pricing'],
                highlight: false,
              },
            ].map((pack, i) => (
              <div
                key={i}
                className={`relative rounded-2xl p-7 transition-all duration-300 hover:-translate-y-2 flex flex-col justify-between ${
                  pack.highlight
                    ? 'bg-white border-2 border-brand-500 shadow-xl ring-4 ring-brand-500/10'
                    : 'bg-white border border-gray-200 shadow-md hover:shadow-xl'
                }`}
              >
                {pack.highlight && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-brand-600 to-brand-700 text-white font-black text-[11px] uppercase tracking-widest px-4 py-1 rounded-full shadow-md">
                    ★ Best Seller ★
                  </div>
                )}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className={`text-[11px] font-bold px-3 py-1 rounded-full border ${pack.badgeStyle}`}>
                      {pack.badge}
                    </span>
                    <span className="text-2xl">🧴</span>
                  </div>

                  <h3 className="text-3xl font-extrabold text-gray-900 mb-1">{pack.size}</h3>
                  <p className="text-sm font-semibold text-brand-700 mb-3">{pack.ideal}</p>
                  <p className="text-xs sm:text-sm text-gray-600 mb-6 leading-relaxed">{pack.desc}</p>

                  <div className="space-y-2.5 pt-4 border-t border-gray-100 mb-6">
                    {pack.features.map((f, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-xs sm:text-sm text-gray-700">
                        <Check className="w-4 h-4 text-brand-600 flex-shrink-0" />
                        <span>{f}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <Link
                  to="/products"
                  className={`w-full py-3 rounded-xl font-bold text-sm text-center transition-all flex items-center justify-center gap-1.5 shadow-sm ${
                    pack.highlight
                      ? 'bg-brand-600 text-white hover:bg-brand-700 shadow-md hover:shadow-lg'
                      : 'bg-gray-100 text-gray-800 hover:bg-brand-600 hover:text-white'
                  }`}
                >
                  Order {pack.size} <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12 animate-fade-in-up">
          <span className="text-accent-600 font-semibold text-sm tracking-wider uppercase">Product Family</span>
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 mt-2">Our Growing Product Family</h2>
          <p className="text-gray-500 mt-3 max-w-2xl mx-auto">S CUBE is more than a dishwash liquid. We are building a complete range of home-care products for modern households.</p>
        </div>
        <div className="grid md:grid-cols-2 gap-8 animate-fade-in-up">
          <div className="bg-white border-2 border-brand-200 rounded-xl p-6 shadow-sm">
            <h3 className="text-xl font-bold text-brand-700 mb-4 flex items-center gap-2"><Check className="w-5 h-5 text-brand-500" /> Available Today</h3>
            <div className="flex items-center gap-3 p-3 bg-brand-50 rounded-lg">
              <div className="w-10 h-10 bg-brand-600 rounded-full flex items-center justify-center">
                <Package className="w-5 h-5 text-white" />
              </div>
              <span className="font-semibold text-gray-800">S CUBE Dishwash Liquid</span>
            </div>
          </div>
          <div className="bg-white border-2 border-gray-200 rounded-xl p-6 shadow-sm">
            <h3 className="text-xl font-bold text-gray-700 mb-4 flex items-center gap-2"><Package className="w-5 h-5 text-accent-500" /> Coming Soon</h3>
            <div className="grid grid-cols-2 gap-2">
              {['Dishwash Gel', 'Steel Shiner', 'Brass & Copper Cleaner', 'Floor Cleaner', 'Kitchen Cleaner', 'Glass Cleaner', 'Bathroom Cleaner', 'Toilet Cleaner', 'Hand Wash', 'Liquid Detergent', 'Fabric Conditioner'].map((item, i) => (
                <div key={i} className="flex items-center gap-1.5 text-sm text-gray-600">
                  <span className="w-1.5 h-1.5 bg-accent-400 rounded-full" />
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 animate-fade-in-up">
            <span className="text-accent-600 font-semibold text-sm tracking-wider uppercase">Customer Satisfaction</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 mt-2">Why Customers Choose S CUBE</h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
            {[
              { icon: Sparkles, label: 'Effective Cleaning' },
              { icon: Star, label: 'Excellent Value' },
              { icon: Leaf, label: 'Fresh Fragrance' },
              { icon: Heart, label: 'Easy to Use' },
              { icon: Shield, label: 'Reliable Quality' },
              { icon: Heart, label: 'Suitable for Everyday Homes' },
            ].map((c, i) => (
              <div key={i} className="bg-white rounded-xl p-4 text-center shadow-sm border border-gray-100 animate-fade-in-up" style={{ animationDelay: `${i * 0.08}s` }}>
                <div className="text-highlight-500 mb-2"><c.icon className="w-7 h-7 mx-auto" /></div>
                <p className="text-gray-700 font-medium text-sm">{c.label}</p>
              </div>
            ))}
          </div>
          <p className="text-center text-gray-400 text-sm mt-6 italic">Replace with genuine customer reviews after launch.</p>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16" id="distributors">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="animate-fade-in-left">
            <span className="text-accent-600 font-semibold text-sm tracking-wider uppercase">Partner With Us</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 mt-2 mb-4">Become Our Dealer or Distributor</h2>
            <p className="text-gray-600 leading-relaxed mb-6">
              Grow your business with a fast-growing home-care brand. We are expanding our dealer and distributor network across India and welcome enquiries from:
            </p>
            <div className="grid grid-cols-2 gap-2 mb-6">
              {['Super Stockists', 'Distributors', 'Dealers', 'Retailers', 'Wholesalers', 'Institutional Buyers', 'Export Partners', 'OEM & Private Label Partners'].map((role, i) => (
                <div key={i} className="flex items-center gap-2 text-sm text-gray-700">
                  <Check className="w-4 h-4 text-brand-500 flex-shrink-0" /> {role}
                </div>
              ))}
            </div>
            <div className="bg-brand-50 rounded-xl p-4 border border-brand-100">
              <p className="font-semibold text-brand-800 mb-1">Benefits of Partnering with S CUBE</p>
              <div className="grid grid-cols-2 gap-1 text-sm text-gray-600">
                {['Attractive Business Opportunities', 'Marketing Support', 'Reliable Product Supply', 'High-Quality Products', 'Long-Term Growth Potential'].map((b, i) => (
                  <div key={i} className="flex items-center gap-1"><Check className="w-3 h-3 text-brand-500" /> {b}</div>
                ))}
              </div>
            </div>
            <Link to="/about#contact" className="inline-flex items-center bg-highlight-500 text-white px-8 py-3.5 rounded-xl font-bold mt-6 hover:bg-highlight-600 transition-all shadow-lg border border-highlight-400">
              Become a Distributor <ChevronRight className="w-4 h-4 ml-1" />
            </Link>
          </div>
          <div className="animate-fade-in-right">
            <div className="bg-gradient-to-br from-brand-50 to-accent-50 rounded-2xl p-8 shadow-lg text-center">
              <Users className="w-24 h-24 text-brand-600 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-gray-800">Grow With Us</h3>
              <p className="text-gray-500">Expand your business with India's trusted home-care brand</p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-gray-50 py-16" id="contact">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 animate-fade-in-up">
            <span className="text-accent-600 font-semibold text-sm tracking-wider uppercase">Get in Touch</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 mt-2">We're Here to Help</h2>
            <p className="text-gray-500 mt-3 max-w-2xl mx-auto">Whether you have questions about our products, dealership opportunities, or customer support, our team is here to help.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Phone, title: 'Phone', value: '04322 222646', action: 'tel:0432222646' },
              { icon: MessageCircle, title: 'WhatsApp', value: '+91 88257 33129', action: 'https://wa.me/918825733129' },
              { icon: Mail, title: 'Email', value: 'info@scube.in', action: 'mailto:info@scube.in' },
              { icon: HeadphonesIcon, title: 'Business Hours', value: 'Mon-Sat, 9AM-6PM', action: '#' },
            ].map((c, i) => (
              <a key={i} href={c.action} target={c.action !== '#' ? '_blank' : ''} rel="noopener noreferrer" className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-all text-center animate-fade-in-up border border-gray-100" style={{ animationDelay: `${i * 0.1}s` }}>
                <div className="text-brand-600 mb-3"><c.icon className="w-8 h-8 mx-auto" /></div>
                <h3 className="font-semibold text-gray-800">{c.title}</h3>
                <p className="text-gray-500 text-sm mt-1">{c.value}</p>
              </a>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-gradient-to-r from-brand-600 to-brand-700 py-12">
        <div className="max-w-4xl mx-auto px-4 text-center animate-fade-in-up">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">Experience the S CUBE Difference</h2>
          <p className="text-brand-100 text-lg mb-8">Cleaning solutions designed for modern households, built on quality, innovation, and trust.</p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link to="/products" className="inline-flex items-center bg-white text-brand-700 px-10 py-4 rounded-xl font-bold text-lg hover:bg-brand-50 transition-all shadow-xl border border-white">
              Explore Our Products <ChevronRight className="w-5 h-5 ml-2" />
            </Link>
            <Link to="/about#distributors" className="inline-flex items-center bg-highlight-500 text-white px-10 py-4 rounded-xl font-bold text-lg hover:bg-highlight-600 transition-all shadow-xl border border-highlight-400">
              Become a Distributor
            </Link>
            <Link to="/about#contact" className="inline-flex items-center bg-white/15 backdrop-blur-sm border-2 border-white/40 text-white px-8 py-4 rounded-xl font-semibold hover:bg-white/25 transition-all">
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
