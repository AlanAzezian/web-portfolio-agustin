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
            Agustín Fabrizio — Arquitecto en formación avanzada / Próximo a graduarse en FADU, UBA. Especializado en visualización arquitectónica y proyecto contemporáneo. Mi enfoque se centra en la representación hiperrealista, la atención al detalle y la creación de atmósferas envolventes.
          </p>
          
          <div className="mb-12">
            <h3 className="text-xl font-semibold mb-4 border-b border-gray-200 pb-2">Stack de Software</h3>
            <ul className="grid grid-cols-2 gap-2 text-gray-600">
              <li>Revit & Archicad</li>
              <li>Rhinoceros</li>
              <li>3ds Max + Corona / V-Ray</li>
              <li>Enscape & Twinmotion</li>
              <li>AutoCAD</li>
              <li>Suite Adobe (Photoshop, Illustrator)</li>
            </ul>
          </div>
          
          <div className="mb-12">
            <h3 className="text-xl font-semibold mb-4 border-b border-gray-200 pb-2">Premios & Reconocimientos</h3>
            <ul className="space-y-4 text-gray-600">
              <li>
                <span className="font-medium text-black">1er Premio</span> - Concurso Nacional Espacio Público (2024)
              </li>
              <li>
                <span className="font-medium text-black">Publicación</span> - Revista Summa+ - Edición 190 (2023)
              </li>
              <li>
                <span className="font-medium text-black">Mención de Honor</span> - Bienal de Arquitectura Joven (2022)
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-xl font-semibold mb-4 border-b border-gray-200 pb-2">Canales Directos</h3>
            <ul className="space-y-2 text-gray-600">
              <li>Mail: <a href="mailto:hola@agustinfabrizio.com" className="hover:text-black transition-colors">hola@agustinfabrizio.com</a></li>
              <li>Behance: <a href="https://behance.net/agustinfabrizio" target="_blank" rel="noreferrer" className="hover:text-black transition-colors">behance.net/agustinfabrizio</a></li>
              <li>WhatsApp: <a href="#" className="hover:text-black transition-colors">+54 9 11 0000-0000</a></li>
            </ul>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-gray-50 p-8 md:p-12 rounded-3xl"
        >
          <h2 className="text-3xl font-bold mb-8">Cotiza tu Proyecto</h2>
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
              <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">Detalles del encargo</label>
              <textarea 
                id="message" 
                rows={4}
                className="w-full bg-white border border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-black transition-shadow resize-none"
                placeholder="¿Necesitas renders, modelado 3D, o ambos? Cuéntame sobre la escala y plazos de tu proyecto..."
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
