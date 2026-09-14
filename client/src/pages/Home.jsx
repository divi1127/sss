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
    api.get('/products').then(res => setProducts(res.data.slice(0, 4))).catch(() => {});
  }, []);

  useEffect(() => {
    const timer = setInterval(nextSlide, 6000);
    return () => clearInterval(timer);
  }, [nextSlide]);

  return (
    <div>
      <section className="relative overflow-hidden min-h-[92vh] flex items-center">
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

        {/* Subtle dark-tinted overlay for video depth */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-black/20 to-transparent z-0 pointer-events-none" />

        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
          {/* Frosted glass card with dark typography */}
          <div className="max-w-2xl bg-white/90 backdrop-blur-md p-6 sm:p-10 md:p-12 rounded-3xl shadow-2xl border border-white/80 transition-all duration-500 animate-fade-in-up">
            <div key={currentSlide} className="transition-all duration-500">
              <span className="inline-block bg-brand-100 text-brand-900 px-4 py-1.5 rounded-full text-xs sm:text-sm font-bold mb-4 border border-brand-200 animate-fade-in">
                {slides[currentSlide].tagline}
              </span>

              <h1 className="text-3xl sm:text-5xl font-extrabold text-gray-900 mb-4 leading-tight tracking-tight">
                {slides[currentSlide].heading}
              </h1>

              <p className="text-base sm:text-lg text-gray-700 mb-3 leading-relaxed font-medium">
                {slides[currentSlide].description}
              </p>

              <p className="text-sm sm:text-base text-gray-600 mb-8 leading-normal">
                {slides[currentSlide].description2}
              </p>

              <div className="flex flex-wrap gap-3 sm:gap-4">
                <Link
                  to="/products"
                  className="inline-flex items-center bg-brand-600 text-white px-7 py-3.5 rounded-xl font-bold text-base hover:bg-brand-700 transition-all shadow-lg hover:shadow-xl hover:scale-105"
                >
                  Buy Now <ChevronRight className="w-5 h-5 ml-1" />
                </Link>
                <Link
                  to="/about#distributors"
                  className="inline-flex items-center bg-gray-900 text-white px-6 py-3.5 rounded-xl font-semibold text-sm sm:text-base hover:bg-gray-800 transition-all shadow-md hover:scale-105"
                >
                  Become a Distributor
                </Link>
                <Link
                  to="/about#contact"
                  className="inline-flex items-center bg-white border-2 border-gray-300 text-gray-800 px-6 py-3.5 rounded-xl font-semibold text-sm sm:text-base hover:bg-gray-100 transition-all shadow-sm hover:scale-105"
                >
                  Contact Us
                </Link>
              </div>

              {/* Dark Styled Stats Row */}
              <div className="grid grid-cols-3 gap-3 sm:gap-4 mt-8 pt-6 border-t border-gray-200/80">
                {[
                  { value: '500+', label: 'Happy Customers' },
                  { value: '100%', label: 'Quality Assured' },
                  { value: '3+', label: 'Product Sizes' },
                ].map((s, i) => (
                  <div key={i} className="bg-gray-50/80 border border-gray-200/60 p-2.5 sm:p-3 rounded-xl text-center">
                    <p className="text-lg sm:text-xl font-black text-brand-700">{s.value}</p>
                    <p className="text-[11px] sm:text-xs text-gray-600 font-semibold">{s.label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Slider Dots */}
            <div className="flex items-center gap-2 mt-6 justify-between">
              <div className="flex gap-2">
                {slides.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentSlide(i)}
                    aria-label={`Slide ${i + 1}`}
                    className={`h-2 rounded-full transition-all duration-300 ${
                      i === currentSlide ? 'bg-brand-600 w-8' : 'bg-gray-300 hover:bg-gray-400 w-2'
                    }`}
                  />
                ))}
              </div>

              <div className="flex gap-1">
                <button
                  onClick={prevSlide}
                  aria-label="Previous slide"
                  className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-700 transition-colors"
                >
                  <ChevronLeftIcon className="w-4 h-4" />
                </button>
                <button
                  onClick={nextSlide}
                  aria-label="Next slide"
                  className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-700 transition-colors"
                >
                  <ChevronRightIcon className="w-4 h-4" />
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

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12 animate-fade-in-up">
          <span className="text-accent-600 font-semibold text-sm tracking-wider uppercase">One Product. Many Uses.</span>
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 mt-2">Versatile Cleaning Solution</h2>
          <p className="text-gray-500 mt-3 max-w-2xl mx-auto">S CUBE Dishwash Liquid is suitable for cleaning a variety of household utensils.</p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 animate-fade-in-up">
          {[
            'Stainless Steel Utensils', 'Brass Vessels', 'Brass Lamps', 'Brass Bells',
            'Brass Statues', 'Copper Utensils', 'Aluminium Utensils', 'Glassware',
            'Ceramic Plates*', 'Melamine Utensils*', 'Kitchen Cookware', 'Dining Plates',
            'Bowls', 'Spoons', 'Serving Dishes',
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-2 bg-white border border-gray-100 rounded-lg p-3 shadow-sm hover:shadow-md transition-all">
              <Check className="w-4 h-4 text-brand-500 flex-shrink-0" />
              <span className="text-sm text-gray-700">{item}</span>
            </div>
          ))}
        </div>
        <p className="text-xs text-gray-400 mt-3 text-center">*Always follow the manufacturer's care instructions where applicable.</p>
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

      <section className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 animate-fade-in-up">
            <span className="text-accent-600 font-semibold text-sm tracking-wider uppercase">Pack Sizes</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 mt-2">Available Pack Sizes</h2>
            <p className="text-gray-500 mt-3">Choose the size that best fits your needs.</p>
          </div>
          <div className="overflow-x-auto animate-fade-in-up">
            <table className="w-full max-w-2xl mx-auto bg-white rounded-xl shadow-sm border border-gray-100">
              <thead className="bg-brand-50">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Size</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Suitable For</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {[
                  ['250 ml', 'Individual & Small Families'],
                  ['500 ml', 'Regular Household Use'],
                  ['750 ml', 'Medium Families'],
                  ['1 Litre', 'Value Pack'],
                  ['2 Litre', 'Refill Pack'],
                  ['5 Litre', 'Hotels, Restaurants & Commercial Use'],
                ].map(([size, use], i) => (
                  <tr key={i} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 font-semibold text-gray-800">{size}</td>
                    <td className="px-6 py-4 text-gray-600">{use}</td>
                  </tr>
                ))}
              </tbody>
            </table>
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
