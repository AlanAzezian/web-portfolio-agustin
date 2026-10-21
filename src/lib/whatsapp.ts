export const WHATSAPP_NUMBER = "5492364714924";

export const getWhatsAppLink = (message: string) =>
  `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;

export const SERVICE_WHATSAPP_MESSAGES: Record<string, string> = {
  "visualizacion-arquitectonica":
    "Hola Agustín, quiero solicitar una cotización para el servicio de Visualización Arquitectónica & Renders.",
  "modelado-3d-bim":
    "Hola Agustín, me comunico para consultar y cotizar el servicio de Modelado 3D BIM.",
  "desarrollo-anteproyecto":
    "Hola Agustín, me gustaría solicitar una cotización para el servicio de Desarrollo de Anteproyecto.",
  "diseno-interiores":
    "Hola Agustín, quiero consultar por el servicio de Diseño de Interiores para mi espacio.",
  "asistencia-freelance":
    "Hola Agustín, me comunico para coordinar una colaboración en Asistencia Freelance a Estudios.",
};
