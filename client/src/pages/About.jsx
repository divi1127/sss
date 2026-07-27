import { Link } from 'react-router-dom';
import { Target, Eye, Star, Sparkles, Shield, Award, Heart, Leaf, Check, ChevronRight, Phone, Mail, MessageCircle, Camera, Factory, FlaskConical, Microscope, Sprout } from 'lucide-react';

export default function About() {
  return (
    <div>
      <section className="relative text-white py-20 overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1563453392212-326f5e854473?w=1600)' }}></div>
        <div className="absolute inset-0 bg-green-900/80"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center animate-fade-in-up">
          <span className="text-brand-200 font-semibold text-sm tracking-wider uppercase">About S CUBE</span>
          <h1 className="text-4xl sm:text-5xl font-bold mt-2 mb-4">Cleaning Beyond Ordinary</h1>
          <p className="text-lg text-brand-100 max-w-2xl mx-auto">Welcome to S CUBE, a trusted home-care brand committed to making everyday cleaning easier, smarter, and more effective.</p>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="animate-fade-in-left">
            <span className="text-accent-600 font-semibold text-sm tracking-wider uppercase">Welcome</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 mt-2 mb-6">Cleaning Beyond Ordinary</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              Welcome to S CUBE, a trusted home-care brand committed to making everyday cleaning easier, smarter, and more effective. We believe that every home deserves cleaning products that deliver outstanding performance without compromising on quality, safety, or value.
            </p>
            <p className="text-gray-600 leading-relaxed mb-4">
              Our journey began with a simple vision: to create cleaning solutions that Indian families can trust every day. Whether it's removing stubborn kitchen grease or caring for traditional brass and copper pooja vessels, S CUBE is designed to meet the unique cleaning needs of every household.
            </p>
            <p className="text-gray-600 leading-relaxed">
              At S CUBE, we understand that a clean home is more than just appearance. It reflects care, hygiene, tradition, and the well-being of your family. That's why every product we develop is created with attention to quality, performance, and customer satisfaction.
            </p>
          </div>
          <div className="animate-fade-in-right">
            <div className="bg-gradient-to-br from-brand-50 to-accent-50 rounded-2xl p-8 shadow-lg">
              <img src="/logo.png" alt="S CUBE" className="w-48 h-48 object-contain mx-auto mb-4" />
              <p className="text-center text-lg font-bold text-gray-800">S CUBE — Cleaning Beyond Ordinary.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 animate-fade-in-up">
            <span className="text-accent-600 font-semibold text-sm tracking-wider uppercase">The Meaning</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 mt-2">The Meaning Behind S CUBE</h2>
            <p className="text-gray-500 mt-3 max-w-2xl mx-auto">The name S CUBE (S³) represents our commitment to delivering excellence through three powerful promises.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: Sparkles, title: 'Sparkle', desc: 'Every wash should leave utensils looking bright, clean, and fresh.', color: 'text-highlight-500' },
              { icon: Star, title: 'Shine', desc: 'Our products help maintain the beauty of your everyday kitchen utensils and traditional household items.', color: 'text-accent-500' },
              { icon: Shield, title: 'Sanitize', desc: 'We believe a clean kitchen contributes to a healthier home through effective everyday cleaning.', color: 'text-green-500' },
            ].map((m, i) => (
              <div key={i} className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-all animate-fade-in-up border border-gray-100" style={{ animationDelay: `${i * 0.15}s` }}>
                <div className={`${m.color} mb-4`}><m.icon className="w-12 h-12" /></div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">{m.title}</h3>
                <p className="text-gray-600 leading-relaxed">{m.desc}</p>
              </div>
            ))}
          </div>
          <div className="mt-8 bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-700 text-center mb-3">Alternative Positioning: Safe • Strong • Smart</h3>
            <div className="grid md:grid-cols-3 gap-4 text-sm">
              <div className="bg-green-50 p-4 rounded-lg"><strong className="text-green-700">Safe</strong><br /><span className="text-gray-600">Designed for regular household use when used according to the instructions.</span></div>
              <div className="bg-blue-50 p-4 rounded-lg"><strong className="text-blue-700">Strong</strong><br /><span className="text-gray-600">Powerful cleaning performance that tackles grease and food residue effectively.</span></div>
              <div className="bg-orange-50 p-4 rounded-lg"><strong className="text-orange-700">Smart</strong><br /><span className="text-gray-600">Concentrated formulas that provide excellent cleaning while offering great value for money.</span></div>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="animate-fade-in-left order-2 md:order-1">
            <div className="bg-gradient-to-br from-brand-50 to-highlight-50 rounded-2xl p-8 shadow-lg">
              <Award className="w-20 h-20 text-brand-600 mx-auto mb-4" />
              <p className="text-2xl font-bold text-gray-800 text-center">RAJES SOLUTIONS</p>
              <p className="text-gray-500 text-center">Building a trusted home-care brand</p>
            </div>
          </div>
          <div className="animate-fade-in-right order-1 md:order-2">
            <span className="text-accent-600 font-semibold text-sm tracking-wider uppercase">Our Story</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 mt-2 mb-6">Our Story</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              Every successful brand starts with a purpose. S CUBE was created with one simple goal: to develop high-quality home-care products that combine effective cleaning performance with affordability.
            </p>
            <p className="text-gray-600 leading-relaxed mb-4">
              Many households struggle to find products that remove stubborn grease efficiently while remaining suitable for everyday utensils. We saw an opportunity to create a product that delivers reliable cleaning performance and meets the practical needs of Indian families.
            </p>
            <p className="text-gray-600 leading-relaxed mb-4">
              Inspired by the traditions of Indian kitchens, where both modern cookware and treasured brass and copper pooja vessels are used every day, S CUBE was developed to offer a cleaning solution that supports these diverse household needs.
            </p>
            <p className="text-gray-600 leading-relaxed">
              What began as a vision under RAJES SOLUTIONS is growing into a trusted home-care brand focused on quality, innovation, and customer satisfaction. Every bottle of S CUBE reflects our commitment to delivering products that make everyday cleaning easier, faster, and more enjoyable.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 animate-fade-in-up">
            <span className="text-accent-600 font-semibold text-sm tracking-wider uppercase">Vision & Mission</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 mt-2">Building a Cleaner Tomorrow</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: Eye, title: 'Our Vision', desc: 'To become one of India\'s most trusted and respected home-care brands by delivering innovative, high-quality, and affordable cleaning solutions that improve everyday life.', color: 'text-accent-500' },
              { icon: Target, title: 'Our Mission', desc: 'To create cleaning products that combine powerful performance, dependable quality, and excellent value through innovative solutions and consistent product quality.', color: 'text-highlight-500' },
              { icon: Heart, title: 'Our Core Values', desc: 'Quality First, Customer Satisfaction, Innovation, Trust, Value for Money, and Responsibility drive everything we do.', color: 'text-green-500' },
            ].map((m, i) => (
              <div key={i} className={`bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-all animate-fade-in-up border border-gray-100`} style={{ animationDelay: `${i * 0.15}s` }}>
                <div className={`${m.color} mb-4`}><m.icon className="w-10 h-10" /></div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">{m.title}</h3>
                <p className="text-gray-600 leading-relaxed">{m.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12 animate-fade-in-up">
          <span className="text-accent-600 font-semibold text-sm tracking-wider uppercase">Values</span>
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 mt-2">Our Core Values</h2>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            { icon: Award, title: 'Quality First', desc: 'We believe quality is never optional. Every product is developed with care and attention.' },
            { icon: Heart, title: 'Customer Satisfaction', desc: 'Our customers are at the heart of everything we do. We continuously improve based on feedback.' },
            { icon: FlaskConical, title: 'Innovation', desc: 'We embrace new ideas, better formulations, and modern manufacturing practices.' },
            { icon: Shield, title: 'Trust', desc: 'We strive to build lasting relationships through honesty, transparency, and dependable products.' },
            { icon: Star, title: 'Value for Money', desc: 'We believe high-quality cleaning products should be affordable and accessible to every household.' },
            { icon: Leaf, title: 'Responsibility', desc: 'We are committed to responsible business practices, customer safety, and continuous improvement.' },
          ].map((v, i) => (
            <div key={i} className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-all border border-gray-100 animate-fade-in-up" style={{ animationDelay: `${i * 0.08}s` }}>
              <div className="text-brand-600 mb-3"><v.icon className="w-8 h-8" /></div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">{v.title}</h3>
              <p className="text-gray-600 text-sm leading-relaxed">{v.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="animate-fade-in-left">
              <span className="text-accent-600 font-semibold text-sm tracking-wider uppercase">Quality Promise</span>
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 mt-2 mb-6">Our Quality Promise</h2>
              <p className="text-gray-600 leading-relaxed mb-6">
                Quality is the foundation of the S CUBE brand. From selecting carefully sourced raw materials to maintaining hygienic manufacturing processes, we focus on delivering products that meet high standards of performance and reliability.
              </p>
              <div className="space-y-3">
                {[
                  'Carefully selected ingredients', 'Consistent product quality',
                  'Hygienic manufacturing practices', 'Quality checks before packaging',
                  'Secure and durable packaging', 'Continuous product improvement',
                ].map((q, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <Check className="w-4 h-4 text-brand-500 flex-shrink-0" />
                    <span className="text-gray-700">{q}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="animate-fade-in-right">
              <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { icon: Factory, label: 'Quality Manufacturing' },
                    { icon: FlaskConical, label: 'Food-Grade Ingredients' },
                    { icon: Microscope, label: 'Dermatologically Tested' },
                    { icon: Sprout, label: '100% Biodegradable' },
                  ].map((q, i) => (
                    <div key={i} className="text-center p-4 bg-gray-50 rounded-xl">
                      <q.icon className="w-8 h-8 mx-auto mb-2 text-brand-600" />
                      <p className="text-sm font-medium text-gray-700">{q.label}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12 animate-fade-in-up">
          <span className="text-accent-600 font-semibold text-sm tracking-wider uppercase">Commitment</span>
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 mt-2">Our Commitment to Indian Homes</h2>
          <p className="text-gray-500 mt-3 max-w-2xl mx-auto">Indian kitchens are unique, and S CUBE products are developed with these everyday household needs in mind.</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 animate-fade-in-up">
          {[
            'Reliable cleaning performance', 'Consistent product quality',
            'Fresh and pleasant fragrance', 'Economical concentrated formulas',
            'Suitable for everyday household cleaning', 'Products designed with Indian homes in mind',
            'A growing range of trusted home-care solutions',
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-2 bg-white border border-gray-100 rounded-lg p-3 shadow-sm">
              <Check className="w-4 h-4 text-brand-500 flex-shrink-0" />
              <span className="text-sm text-gray-700">{item}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-brand-600 py-16" id="distributors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center animate-fade-in-up">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">Looking Ahead</h2>
          <p className="text-brand-100 text-lg max-w-3xl mx-auto mb-6">
            S CUBE is more than a single product — it's the beginning of a complete home-care brand. With every new product, our promise remains the same:
          </p>
          <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-8 max-w-3xl mx-auto">
            <p className="text-2xl font-bold text-highlight-300">Powerful Performance. Trusted Quality. Everyday Value.</p>
          </div>
          <div className="mt-8 flex flex-wrap gap-4 justify-center">
            <Link to="/products" className="inline-flex items-center bg-white text-brand-700 px-8 py-3.5 rounded-xl font-bold hover:bg-brand-50 transition-all shadow-xl">
              Explore Our Products <ChevronRight className="w-5 h-5 ml-2" />
            </Link>
            <Link to="/" className="inline-flex items-center bg-highlight-500 text-white px-8 py-3.5 rounded-xl font-bold hover:bg-highlight-600 transition-all shadow-xl">
              Become a Distributor
            </Link>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12 animate-fade-in-up">
          <span className="text-accent-600 font-semibold text-sm tracking-wider uppercase">Brand Promise</span>
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 mt-2">Our Brand Promise</h2>
          <p className="text-gray-500 mt-3 max-w-3xl mx-auto">
            At S CUBE, we promise to deliver products that combine quality, performance, and value. We are committed to helping every household enjoy a cleaner kitchen, brighter utensils, and a better cleaning experience through products you can trust every day.
          </p>
          <div className="mt-6">
            <span className="text-xl font-bold text-brand-600">S CUBE — Cleaning Beyond Ordinary.</span>
          </div>
          <div className="mt-8">
            <Link to="/products" className="inline-flex items-center bg-brand-600 text-white px-10 py-4 rounded-xl font-bold text-lg hover:bg-brand-700 transition-all shadow-xl border border-brand-500">
              Discover the S CUBE Difference <ChevronRight className="w-5 h-5 ml-2" />
            </Link>
          </div>
        </div>
      </section>

      <section className="bg-gray-50 py-16" id="contact">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 animate-fade-in-up">
            <span className="text-accent-600 font-semibold text-sm tracking-wider uppercase">Contact</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 mt-2">Get In Touch</h2>
            <p className="text-gray-500 mt-3">Whether you have questions about our products, dealership opportunities, or customer support, our team is here to help.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Phone, title: 'Phone', value: '+91 88257 33129', action: 'tel:+918825733129', color: 'text-highlight-500' },
              { icon: Mail, title: 'Email', value: 'info@scube.in', action: 'mailto:info@scube.in', color: 'text-accent-500' },
              { icon: MessageCircle, title: 'WhatsApp', value: '+91 88257 33129', action: 'https://wa.me/918825733129', color: 'text-green-500' },
              { icon: Camera, title: 'Instagram', value: '@scubeofficial', action: 'https://instagram.com/scubeofficial', color: 'text-highlight-500' },
            ].map((c, i) => (
              <a key={i} href={c.action} target="_blank" rel="noopener noreferrer" className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-all text-center animate-fade-in-up border border-gray-100" style={{ animationDelay: `${i * 0.1}s` }}>
                <div className={`${c.color} mb-3 flex justify-center`}><c.icon className="w-8 h-8" /></div>
                <h3 className="font-semibold text-gray-800">{c.title}</h3>
                <p className="text-gray-500 text-sm mt-1">{c.value}</p>
              </a>
            ))}
          </div>
          <div className="text-center mt-8">
            <p className="text-gray-500 text-sm">Corporate Office: <strong className="text-gray-700">RAJES SOLUTIONS</strong></p>
          </div>
        </div>
      </section>

      <section className="bg-gradient-to-r from-brand-600 to-brand-700 py-12">
        <div className="max-w-4xl mx-auto px-4 text-center animate-fade-in-up">
          <h2 className="text-3xl font-bold text-white mb-4">Experience the S CUBE Difference</h2>
          <p className="text-brand-100 mb-8">Cleaning solutions designed for modern households, built on quality, innovation, and trust.</p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link to="/products" className="inline-flex items-center bg-white text-brand-700 px-10 py-4 rounded-xl font-bold text-lg hover:bg-brand-50 transition-all shadow-xl">
              Explore Our Products <ChevronRight className="w-5 h-5 ml-2" />
            </Link>
            <Link to="/about#distributors" className="inline-flex items-center bg-highlight-500 text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-highlight-600 transition-all shadow-xl border border-highlight-400">
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
