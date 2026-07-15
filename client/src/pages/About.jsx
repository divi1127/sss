import { Link } from 'react-router-dom';
import { Target, Eye, Star, Factory, FlaskConical, Microscope, Sprout, Phone, Mail, MessageCircle, Camera } from 'lucide-react';

export default function About() {
  return (
    <div>
      <section className="relative text-white py-20 overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: 'url(https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQW6lkf9bYJoTky23wnKgtDNCM-SBSyAYes42rWDLMGAg&s=10)' }}></div>
        <div className="absolute inset-0 bg-green-900/70"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center animate-fade-in-up">
          <span className="text-brand-200 font-semibold text-sm tracking-wider uppercase">About Us</span>
          <h1 className="text-4xl sm:text-5xl font-bold mt-2 mb-4">Our Story</h1>
          <p className="text-lg text-brand-100 max-w-2xl mx-auto">Clean vessels shouldn't come at the cost of a polluted planet.</p>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="animate-fade-in-left">
            <div className="relative">
              <div className="w-full h-80 bg-gray-100 rounded-2xl flex items-center justify-center overflow-hidden shadow-lg">
                <img src="https://i.pinimg.com/736x/d4/7c/f0/d47cf0c565c59b74d10aaa611f7b0a68.jpg" alt="Person cleaning vessels" className="w-full h-full object-cover" />
              </div>
              {/* <div className="absolute -bottom-4 -right-4 bg-accent-600 text-white px-6 py-3 rounded-xl shadow-lg">
                <p className="text-2xl font-bold">2020</p>
                <p className="text-sm text-brand-200">Founded</p>
              </div> */}
            </div>
          </div>
          <div className="animate-fade-in-right">
            <span className="text-accent-600 font-semibold text-sm tracking-wider uppercase">Who We Are</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 mt-2 mb-6">The S cube Story</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              S cube was born in 2020 from a simple belief — that clean vessels shouldn't come at the cost of a polluted planet. 
              Our founders, passionate about sustainability and tired of harsh chemical-laden products, set out to create something different.
            </p>
            <p className="text-gray-600 leading-relaxed mb-4">
              After months of research and countless formulations, we developed a vessel washing liquid that is 
              <strong> tough on grease, gentle on hands, and kind to the environment.</strong> Today, we serve thousands of happy customers across India.
            </p>
            <div className="flex items-center space-x-4 text-sm text-gray-500 mt-6">
              <span className="flex items-center"><svg className="w-4 h-4 mr-1.5 text-green-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>100% Biodegradable</span>
              <span className="flex items-center"><svg className="w-4 h-4 mr-1.5 text-accent-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>Dermatologically Tested</span>
              <span className="flex items-center"><svg className="w-4 h-4 mr-1.5 text-highlight-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>Never Tested on Animals</span>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 animate-fade-in-up">
            <span className="text-accent-600 font-semibold text-sm tracking-wider uppercase">Our Mission</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 mt-2">What Drives Us</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: Target, title: 'Our Mission', desc: 'To provide every Indian kitchen with a washing liquid that is tough on grease, gentle on hands, and kind to the environment.', color: 'text-highlight-500' },
              { icon: Eye, title: 'Our Vision', desc: 'A world where sustainability is accessible to all. We envision a plastic-neutral future with zero chemical pollution.', color: 'text-accent-500' },
              { icon: Star, title: 'Our Values', desc: 'Quality, transparency, and environmental responsibility guide everything we do — from sourcing to production to delivery.', color: 'text-green-500' },
            ].map((m, i) => (
              <div key={i} className={`bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-all animate-fade-in-up`} style={{ animationDelay: `${i * 0.15}s` }}>
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
          <span className="text-accent-600 font-semibold text-sm tracking-wider uppercase">Quality</span>
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 mt-2">Quality You Can Trust</h2>
        </div>
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="animate-fade-in-left order-2 md:order-1">
            <div className="space-y-6">
              {[
                { icon: Factory, title: 'GMP-Certified Facility', desc: 'Manufactured in a state-of-the-art GMP-certified facility with strict quality controls.', color: 'text-highlight-500' },
                { icon: FlaskConical, title: 'Food-Grade Ingredients', desc: 'Only food-grade, safe ingredients used. No harsh chemicals, no harmful toxins.', color: 'text-accent-500' },
                { icon: Microscope, title: 'Dermatologically Tested', desc: 'Our formula is tested by dermatologists to ensure it is gentle on your skin.', color: 'text-green-500' },
                { icon: Sprout, title: '100% Biodegradable', desc: 'Our formula breaks down naturally, leaving no harmful residue in our water systems.', color: 'text-highlight-500' },
              ].map((q, i) => (
                <div key={i} className={`flex items-start space-x-4 animate-fade-in-up`} style={{ animationDelay: `${i * 0.1}s` }}>
                  <div className={`${q.color} flex-shrink-0`}><q.icon className="w-8 h-8" /></div>
                  <div>
                    <h3 className="font-semibold text-gray-800">{q.title}</h3>
                    <p className="text-gray-600 text-sm">{q.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="animate-fade-in-right order-1 md:order-2">
            <div className="bg-gray-100 rounded-2xl h-80 flex items-center justify-center shadow-lg">
              <div className="text-center p-8">
                <FlaskConical className="w-20 h-20 mx-auto mb-4 text-gray-400" />
                <p className="text-gray-500 font-medium">Quality & Innovation</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-gray-50 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 animate-fade-in-up">
            <span className="text-accent-600 font-semibold text-sm tracking-wider uppercase">Contact</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 mt-2">Get In Touch</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Phone, title: 'Phone', value: '+91 88257 33129', action: 'tel:+918825733129', color: 'text-highlight-500' },
              { icon: Mail, title: 'Email', value: 'info@scube.in', action: 'mailto:info@scube.in', color: 'text-accent-500' },
              { icon: MessageCircle, title: 'WhatsApp', value: '+91 88257 33129', action: 'https://wa.me/918825733129', color: 'text-green-500' },
              { icon: Camera, title: 'Instagram', value: '@scubeofficial', action: 'https://instagram.com/scubeofficial', color: 'text-highlight-500' },
            ].map((c, i) => (
              <a key={i} href={c.action} target="_blank" rel="noopener noreferrer" className={`bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-all text-center animate-fade-in-up`} style={{ animationDelay: `${i * 0.1}s` }}>
                <div className={`${c.color} mb-3 flex justify-center`}><c.icon className="w-8 h-8" /></div>
                <h3 className="font-semibold text-gray-800">{c.title}</h3>
                <p className="text-gray-500 text-sm mt-1">{c.value}</p>
              </a>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-green-400 py-12">
        <div className="max-w-4xl mx-auto px-4 text-center animate-fade-in-up">
          <h2 className="text-3xl font-bold text-white mb-4">Experience the S cube Difference</h2>
          <p className="text-brand-100 mb-8">Join thousands of satisfied customers. Order now and see the difference for yourself.</p>
          <Link to="/products" className="inline-flex items-center bg-highlight-500 text-white px-10 py-4 rounded-xl font-bold text-lg hover:bg-highlight-600 transition-all shadow-xl hover:shadow-2xl">
            Browse Products
            <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
          </Link>
        </div>
      </section>
    </div>
  );
}
