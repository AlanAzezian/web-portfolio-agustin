"use client";

import { motion } from "framer-motion";

const services = [
  {
    title: "Visualización Arquitectónica & Renders",
    description: "Creación de imágenes fotorrealistas de alta calidad que comunican la esencia y la atmósfera de cada proyecto arquitectónico."
  },
  {
    title: "Modelado 3D BIM",
    description: "Estudio detallado de volumetrías, análisis de asoleamiento y documentación técnica integral utilizando metodologías BIM."
  },
  {
    title: "Desarrollo de Anteproyecto",
    description: "Diseño conceptual desde cero, exploración de alternativas de distribución espacial y planimetría inicial."
  },
  {
    title: "Diseño de Interiores",
    description: "Definición minuciosa de materialidad, esquemas de iluminación y selección de mobiliario para espacios funcionales y estéticos."
  },
  {
    title: "Asistencia Freelance a Estudios",
    description: "Apoyo técnico externo a estudios de arquitectura en fases de diseño, documentación visual y representación 3D."
  }
];

const methodology = [
  { step: "01", title: "Briefing & Conceptualización", desc: "Análisis profundo de los requerimientos y el entorno." },
  { step: "02", title: "Modelado Blanco", desc: "Definición de volumetría, proporciones y encuadres de cámara." },
  { step: "03", title: "Materialidad & Iluminación", desc: "Aplicación de texturas realistas y estudio lumínico (natural/artificial)." },
  { step: "04", title: "Render Final & Post-producción", desc: "Ajuste de detalles, ambientación, color grading y entrega en alta resolución." }
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
          Soluciones arquitectónicas pensadas para construir y perdurar.
        </h1>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-12 mb-32">
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
          <h2 className="text-2xl md:text-3xl font-bold mb-12">Metodología de Visualización</h2>
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
