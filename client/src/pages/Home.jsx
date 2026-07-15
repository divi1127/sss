import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Leaf, Feather, DollarSign, Globe, FlaskConical, Star, Sparkles, Droplets } from 'lucide-react';
import api from '../api/axios';
import ProductCard from '../components/ProductCard';

export default function Home() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    api.get('/products').then(res => setProducts(res.data.slice(0, 4))).catch(() => {});
  }, []);

  return (
    <div>
      <section className="relative text-white overflow-hidden min-h-screen flex items-center">
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: 'url(https://i.pinimg.com/1200x/e5/58/2d/e5582d028e94af1fcfe4a416a31439d1.jpg)' }}></div>
        <div className="absolute inset-0 bg-gradient-to-br from-green-900/90 via-green-700/70 to-white/20"></div>
        <div className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="animate-fade-in-left">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-4 leading-tight">
                Clean Vessels,<br /><span className="text-brand-200">Green Planet</span>
              </h1>
              <p className="text-lg sm:text-xl text-brand-100 mb-8 max-w-lg">Premium eco-friendly vessel washing liquid that's tough on grease, gentle on hands, and kind to nature.</p>
              <div className="flex flex-wrap gap-4">
                <Link to="/products" className="inline-flex items-center bg-highlight-500 text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-highlight-600 transition-all shadow-xl hover:shadow-2xl">
                  Shop Now
                  <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
                </Link>
                <Link to="/about" className="inline-flex items-center bg-white/20 backdrop-blur-sm border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white/30 transition-all shadow-xl">
                  Learn More
                  <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                </Link>
              </div>
              <div className="flex items-center space-x-6 mt-8 text-sm text-brand-200">
                <span className="flex items-center"><Leaf className="w-4 h-4 mr-1.5" />100% Eco-Friendly</span>
                <span className="flex items-center"><Droplets className="w-4 h-4 mr-1.5" />Free Shipping</span>
                <span className="flex items-center"><Sparkles className="w-4 h-4 mr-1.5" />Secure Payment</span>
              </div>
            </div>
            <div className="hidden md:flex justify-center animate-fade-in-right">
              <div className="relative">
                <div className="w-72 h-72 lg:w-96 lg:h-96 rounded-full bg-white/10 flex items-center justify-center">
                  <img src="/logo.png" alt="S cube" className="w-48 h-48 lg:w-64 lg:h-64 object-contain animate-bounce-slow" />
                </div>
                <div className="absolute -top-4 -right-4 bg-highlight-500 text-white text-sm font-bold px-4 py-2 rounded-full shadow-lg animate-pulse-slow">New!</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12 animate-fade-in-up">
          <span className="text-accent-600 font-semibold text-sm tracking-wider uppercase">Our Products</span>
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 mt-2">Featured Products</h2>
          <p className="text-gray-500 mt-3 max-w-lg mx-auto">Discover our range of premium vessel washing liquids crafted for every kitchen.</p>
        </div>
        {products.length === 0 ? (
          <div className="text-center py-12 animate-fade-in">
            <FlaskConical className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <p className="text-gray-500 text-lg">No products yet. Check back soon!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((p, i) => (
              <div key={p.id} className={`animate-fade-in-up`} style={{ animationDelay: `${i * 0.1}s` }}>
                <ProductCard product={p} />
              </div>
            ))}
          </div>
        )}
        <div className="text-center mt-10 animate-fade-in">
          <Link to="/products" className="inline-flex items-center text-accent-600 hover:text-accent-700 font-semibold text-lg group">
            View All Products
            <svg className="w-5 h-5 ml-1 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
          </Link>
        </div>
      </section>

      <section className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 animate-fade-in-up">
            <span className="text-accent-600 font-semibold text-sm tracking-wider uppercase">Why Choose Us</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 mt-2">Why S cube?</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { icon: Leaf, title: 'Eco-Friendly', desc: 'Biodegradable ingredients safe for your family and the planet.', delay: '0', color: 'text-green-500' },
              { icon: Feather, title: 'Highly Effective', desc: 'Powerful grease-cutting formula that cleans even the toughest stains.', delay: '100', color: 'text-accent-500' },
              { icon: DollarSign, title: 'Affordable', desc: 'Premium quality at prices that won\'t burn a hole in your pocket.', delay: '200', color: 'text-green-500' },
              { icon: FlaskConical, title: 'Lab Tested', desc: 'Dermatologically tested and certified safe for daily use.', delay: '300', color: 'text-accent-500' },
              { icon: Globe, title: 'Sustainable', desc: 'Plastic-neutral packaging with refill options to reduce waste.', delay: '400', color: 'text-green-500' },
              { icon: Star, title: 'Trusted by Thousands', desc: 'Loved by families across India for consistent quality.', delay: '500', color: 'text-highlight-500' },
            ].map((f, i) => (
              <div key={i} className={`bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-all group animate-fade-in-up`} style={{ animationDelay: `${f.delay}ms` }}>
                <div className={`${f.color} mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <f.icon className="w-10 h-10" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">{f.title}</h3>
                <p className="text-gray-600 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12 animate-fade-in-up">
          <span className="text-accent-600 font-semibold text-sm tracking-wider uppercase">Testimonials</span>
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 mt-2">What Our Customers Say</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { name: 'Priya S.', text: 'Best dish wash I have ever used! A little goes a long way. My kitchen has never been cleaner.', rating: 5, location: 'Mumbai' },
            { name: 'Rahul M.', text: 'Love that it is eco-friendly. Works great and smells amazing. Highly recommend switching!', rating: 5, location: 'Delhi' },
            { name: 'Anita K.', text: 'Switched from a leading brand and never looked back. My hands feel so much softer now.', rating: 5, location: 'Bangalore' },
          ].map((t, i) => (
            <div key={i} className={`bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all animate-fade-in-up`} style={{ animationDelay: `${i * 0.15}s` }}>
              <div className="flex text-yellow-400 mb-3">
                {[...Array(t.rating)].map((_, j) => (
                  <svg key={j} className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                ))}
              </div>
              <p className="text-gray-600 mb-4 italic leading-relaxed">"{t.text}"</p>
              <div className="flex items-center justify-between">
                <p className="font-semibold text-gray-800">— {t.name}</p>
                <span className="text-xs text-gray-400">{t.location}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-green-400 py-12">
        <div className="max-w-4xl mx-auto px-4 text-center animate-fade-in-up">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">Ready to Make the Switch?</h2>
          <p className="text-brand-100 text-lg mb-8">Join thousands of happy customers. Order your first S cube bottle today.</p>
          <Link to="/products" className="inline-flex items-center bg-highlight-500 text-white px-10 py-4 rounded-xl font-bold text-lg hover:bg-highlight-600 transition-all shadow-xl hover:shadow-2xl">
            Shop Now
            <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
          </Link>
        </div>
      </section>
    </div>
  );
}
