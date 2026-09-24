"use client";

import { motion } from "framer-motion";

export default function BioContactView() {
  return (
    <div className="max-w-6xl mx-auto px-6 md:px-12 py-32 min-h-screen">
      <div className="grid md:grid-cols-2 gap-24">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-8">Sobre Mí</h1>
          <p className="text-lg text-gray-600 mb-6 leading-relaxed">
            Soy Agustín Fabrizio, estudiante avanzado y próximo a graduarme. Me apasiona fusionar el diseño con la tecnología para crear experiencias digitales memorables. Mi enfoque se centra en la atención al detalle, la performance y la estética limpia.
          </p>
          
          <div className="mb-12">
            <h3 className="text-xl font-semibold mb-4 border-b border-gray-200 pb-2">Stack Tecnológico</h3>
            <ul className="grid grid-cols-2 gap-2 text-gray-600">
              <li>Next.js / React</li>
              <li>TypeScript</li>
              <li>Tailwind CSS</li>
              <li>Framer Motion</li>
              <li>Figma</li>
              <li>Node.js</li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-xl font-semibold mb-4 border-b border-gray-200 pb-2">Premios & Reconocimientos</h3>
            <ul className="space-y-4 text-gray-600">
              <li>
                <span className="font-medium text-black">Awwwards</span> - Honorable Mention (2024)
              </li>
              <li>
                <span className="font-medium text-black">Behance</span> - Featured in UI/UX (2023)
              </li>
            </ul>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-gray-50 p-8 md:p-12 rounded-3xl"
        >
          <h2 className="text-3xl font-bold mb-8">Trabajemos juntos</h2>
          <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">Nombre</label>
              <input 
                type="text" 
                id="name" 
                className="w-full bg-white border border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-black transition-shadow"
                placeholder="Tu nombre"
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <input 
                type="email" 
                id="email" 
                className="w-full bg-white border border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-black transition-shadow"
                placeholder="tu@email.com"
              />
            </div>
            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">Mensaje</label>
              <textarea 
                id="message" 
                rows={4}
                className="w-full bg-white border border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-black transition-shadow resize-none"
                placeholder="Cuéntame sobre tu proyecto..."
              ></textarea>
            </div>
            <button 
              type="submit"
              className="w-full bg-black text-white rounded-lg px-6 py-4 font-medium hover:bg-gray-800 transition-colors"
            >
              Enviar Mensaje
            </button>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
