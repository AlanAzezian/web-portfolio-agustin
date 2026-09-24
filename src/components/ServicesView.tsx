"use client";

import { motion } from "framer-motion";

const services = [
  {
    title: "Desarrollo Frontend",
    description: "Creación de interfaces web dinámicas, rápidas y accesibles utilizando las últimas tecnologías como React, Next.js y Tailwind CSS."
  },
  {
    title: "Diseño UI/UX",
    description: "Diseño de experiencias centradas en el usuario, interfaces limpias, sistemas de diseño y prototipado de alta fidelidad."
  },
  {
    title: "Animación Web",
    description: "Microinteracciones y animaciones fluidas con Framer Motion para dar vida y sofisticación a los productos digitales."
  }
];

const methodology = [
  { step: "01", title: "Descubrimiento", desc: "Entender el problema, los objetivos y la audiencia." },
  { step: "02", title: "Diseño", desc: "Wireframing, prototipado y validación visual." },
  { step: "03", title: "Desarrollo", desc: "Código limpio, modular y optimizado." },
  { step: "04", title: "Lanzamiento", desc: "Testing, despliegue y monitoreo de calidad." }
];

export default function ServicesView() {
  return (
    <div className="max-w-6xl mx-auto px-6 md:px-12 py-32 min-h-screen">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-4xl md:text-6xl font-bold mb-24 max-w-2xl">
          Soluciones digitales pensadas para escalar y perdurar.
        </h1>

        <div className="grid md:grid-cols-3 gap-12 mb-32">
          {services.map((service, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 + 0.2, duration: 0.5 }}
              className="border-t border-gray-200 pt-8"
            >
              <h3 className="text-2xl font-semibold mb-4">{service.title}</h3>
              <p className="text-gray-600 leading-relaxed">{service.description}</p>
            </motion.div>
          ))}
        </div>

        <div>
          <h2 className="text-2xl md:text-3xl font-bold mb-12">Metodología</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {methodology.map((item, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.1 + 0.4, duration: 0.4 }}
                className="bg-gray-50 p-8 rounded-2xl"
              >
                <span className="text-4xl font-light text-gray-300 block mb-4">{item.step}</span>
                <h4 className="text-xl font-medium mb-2">{item.title}</h4>
                <p className="text-gray-500 text-sm">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
