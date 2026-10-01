"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

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
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="max-w-6xl mx-auto px-6 md:px-12 py-32 min-h-screen">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-5xl md:text-7xl font-sans font-light text-foreground mb-24 max-w-4xl leading-[0.9] tracking-tighter">
          Soluciones arquitectónicas pensadas para construir y perdurar.
        </h1>

        <div className="flex flex-col mb-32 pt-12 border-t border-foreground/10">
          {services.map((service, i) => {
            const isOpen = openIndex === i;
            return (
              <div key={i} className="border-b border-foreground/10">
                <button
                  onClick={() => setOpenIndex(isOpen ? null : i)}
                  className="w-full py-8 flex items-center justify-between focus:outline-none group text-left"
                >
                  <div className="flex items-baseline space-x-6 md:space-x-12">
                    <span className="font-sans font-light text-xl text-foreground/40 w-8">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <h3 className="text-2xl md:text-4xl font-sans font-light text-foreground group-hover:text-foreground/70 transition-colors">
                      {service.title}
                    </h3>
                  </div>
                  <div className="text-3xl font-light text-acento transition-transform duration-300">
                    <motion.div
                      animate={{ rotate: isOpen ? 180 : 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      {isOpen ? '×' : '+'}
                    </motion.div>
                  </div>
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.4, ease: "easeInOut" }}
                      className="overflow-hidden"
                    >
                      <div className="pb-12 pl-14 md:pl-20">
                        <p className="text-foreground/80 font-sans leading-relaxed text-lg max-w-3xl mb-8">
                          {service.description}
                        </p>
                        <div className="mt-4">
                          <span className="font-mono text-xs uppercase tracking-widest text-acento block mb-2">Comencemos un proyecto</span>
                          <a href="mailto:hola@agustinfabrizio.com" className="font-sans font-light text-xl text-foreground hover:text-acento transition-colors">
                            Solicitar cotización <span className="text-acento">&rarr;</span>
                          </a>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>

        <div className="pt-12">
          <h2 className="text-2xl md:text-3xl font-mono uppercase tracking-widest text-foreground mb-16">Metodología de Visualización</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-0">
            {methodology.map((item, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.1 + 0.4, duration: 0.4 }}
                className="bg-transparent p-8 flex flex-col justify-between min-h-[320px] group hover:bg-foreground hover:text-background transition-colors"
              >
                <span className="font-mono text-xs uppercase tracking-widest text-acento group-hover:text-background/60 block mb-8">
                  [ Paso {item.step} ]
                </span>
                <div>
                  <h4 className="text-3xl font-sans font-light text-foreground group-hover:text-background mb-4 leading-none tracking-tight">{item.title}</h4>
                  <p className="text-foreground/80 group-hover:text-background/80 font-sans text-sm">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Final CTA Block */}
        <div className="mt-32 p-12 md:p-24 text-center bg-foreground text-background flex flex-col items-center">
          <span className="font-mono text-xs uppercase tracking-widest text-background/60 block mb-6">¿Tenés un proyecto en mente?</span>
          <h2 className="text-5xl md:text-7xl font-sans font-light mb-12 tracking-tighter leading-none">Hagámoslo realidad.</h2>
          <div className="flex gap-6">
            <a href="mailto:hola@agustinfabrizio.com" className="px-8 py-4 text-background font-mono text-sm uppercase tracking-widest hover:bg-background hover:text-foreground transition-colors">
              Enviar Email
            </a>
            <a href="https://wa.me/1234567890" className="px-8 py-4 bg-acento text-background font-mono text-sm uppercase tracking-widest hover:bg-background hover:text-foreground transition-colors">
              WhatsApp
            </a>
          </div>
        </div>

      </motion.div>
    </div>
  );
}



