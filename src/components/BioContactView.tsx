"use client";

import { motion } from "framer-motion";

export default function BioContactView() {
  return (
    <div className="max-w-6xl mx-auto px-6 md:px-12 py-32 min-h-screen">
      <div className="grid md:grid-cols-2 gap-24 items-start">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-6xl md:text-8xl font-sans font-light leading-[0.9] text-foreground mb-12 tracking-tighter">Sobre<br/>Mí</h1>
          <p className="text-xl text-foreground/80 font-sans mb-16 leading-relaxed">
            Agustín Fabrizio — Arquitecto en formación avanzada / Próximo a graduarse en FADU, UBA. Especializado en visualización arquitectónica y proyecto contemporáneo. Mi enfoque se centra en la representación hiperrealista, la atención al detalle y la creación de atmósferas envolventes.
          </p>
          
          <div className="mb-16 border-t-rule border-foreground pt-4">
            <h3 className="font-mono text-sm uppercase tracking-widest text-foreground/50 mb-8">Stack de Software</h3>
            <ul className="flex flex-col text-foreground font-sans text-sm">
              <li className="flex justify-between border-b-hairline border-foreground/20 py-2">
                <span className="font-mono uppercase">BIM</span>
                <span>Revit & Archicad</span>
              </li>
              <li className="flex justify-between border-b-hairline border-foreground/20 py-2">
                <span className="font-mono uppercase">Modelado</span>
                <span>Rhinoceros & AutoCAD</span>
              </li>
              <li className="flex justify-between border-b-hairline border-foreground/20 py-2">
                <span className="font-mono uppercase">Render</span>
                <span>3ds Max + Corona / V-Ray</span>
              </li>
              <li className="flex justify-between border-b-hairline border-foreground/20 py-2">
                <span className="font-mono uppercase">Tiempo Real</span>
                <span>Enscape & Twinmotion</span>
              </li>
              <li className="flex justify-between border-b-hairline border-foreground/20 py-2">
                <span className="font-mono uppercase">Post</span>
                <span>Suite Adobe</span>
              </li>
            </ul>
          </div>
          
          <div className="mb-16 border-t-rule border-foreground pt-4">
            <h3 className="font-mono text-sm uppercase tracking-widest text-foreground/50 mb-8">Premios & Reconocimientos</h3>
            <ul className="flex flex-col text-foreground font-sans text-sm">
              <li className="flex justify-between items-start md:items-center border-b-hairline border-foreground/20 py-2 gap-4">
                <span className="font-mono uppercase shrink-0">1er Premio</span>
                <span className="text-right">Concurso Nacional Espacio Público (2024)</span>
              </li>
              <li className="flex justify-between items-start md:items-center border-b-hairline border-foreground/20 py-2 gap-4">
                <span className="font-mono uppercase shrink-0">Publicación</span>
                <span className="text-right">Revista Summa+ - Edición 190 (2023)</span>
              </li>
              <li className="flex justify-between items-start md:items-center border-b-hairline border-foreground/20 py-2 gap-4">
                <span className="font-mono uppercase shrink-0">Mención</span>
                <span className="text-right">Bienal de Arquitectura Joven (2022)</span>
              </li>
            </ul>
          </div>
          
          <div className="border-t-rule border-foreground pt-4">
            <h3 className="font-mono text-sm uppercase tracking-widest text-foreground/50 mb-8">Canales Directos</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <a href="mailto:hola@agustinfabrizio.com" className="block border-rule border-foreground p-4 text-center font-mono text-sm uppercase tracking-widest hover:bg-foreground hover:text-background transition-colors">
                Email
              </a>
              <a href="https://behance.net/agustinfabrizio" target="_blank" rel="noreferrer" className="block border-rule border-foreground p-4 text-center font-mono text-sm uppercase tracking-widest hover:bg-foreground hover:text-background transition-colors">
                Behance
              </a>
              <a href="#" className="block border-rule border-foreground p-4 text-center font-mono text-sm uppercase tracking-widest hover:bg-foreground hover:text-background transition-colors md:col-span-2">
                WhatsApp
              </a>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="border-rule border-foreground p-8 md:p-12 bg-background sticky top-32"
        >
          <h2 className="text-4xl font-sans font-light text-foreground mb-12 tracking-tight">Cotiza tu Proyecto</h2>
          <form className="flex flex-col gap-8" onSubmit={(e) => e.preventDefault()}>
            <div className="relative border-b-rule border-foreground">
              <input 
                type="text" 
                id="name" 
                className="w-full bg-transparent px-0 py-2 focus:outline-none font-sans text-lg peer placeholder-transparent"
                placeholder="Tu nombre"
                required
              />
              <label htmlFor="name" className="absolute left-0 -top-6 text-xs font-mono uppercase tracking-widest text-foreground/50 transition-all peer-placeholder-shown:text-base peer-placeholder-shown:top-2 peer-focus:-top-6 peer-focus:text-xs peer-focus:text-foreground">Nombre</label>
            </div>
            
            <div className="relative border-b-rule border-foreground mt-4">
              <input 
                type="email" 
                id="email" 
                className="w-full bg-transparent px-0 py-2 focus:outline-none font-sans text-lg peer placeholder-transparent"
                placeholder="tu@email.com"
                required
              />
              <label htmlFor="email" className="absolute left-0 -top-6 text-xs font-mono uppercase tracking-widest text-foreground/50 transition-all peer-placeholder-shown:text-base peer-placeholder-shown:top-2 peer-focus:-top-6 peer-focus:text-xs peer-focus:text-foreground">Email</label>
            </div>
            
            <div className="relative border-b-rule border-foreground mt-4">
              <textarea 
                id="message" 
                rows={4}
                className="w-full bg-transparent px-0 py-2 focus:outline-none font-sans text-lg peer resize-none placeholder-transparent"
                placeholder="Detalles"
                required
              ></textarea>
              <label htmlFor="message" className="absolute left-0 -top-6 text-xs font-mono uppercase tracking-widest text-foreground/50 transition-all peer-placeholder-shown:text-base peer-placeholder-shown:top-2 peer-focus:-top-6 peer-focus:text-xs peer-focus:text-foreground">Detalles del encargo</label>
            </div>
            
            <button 
              type="submit"
              className="w-full border-rule border-acento bg-acento text-background uppercase font-mono tracking-widest text-sm px-6 py-4 hover:bg-transparent hover:text-acento transition-colors mt-8"
            >
              Enviar Mensaje
            </button>
          </form>
        </motion.div>
      </div>
    </div>
  );
}

