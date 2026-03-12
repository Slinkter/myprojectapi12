/**
 * @file HomeHeader.tsx
 * @description Cabecera principal de la página de inicio con estilo neumórfico.
 * @architecture Presentation Layer - UI Component
 */

import React from "react";

/**
 * Componente que muestra el título y subtítulo de la tienda.
 * @returns {JSX.Element} El componente renderizado.
 */
const HomeHeader: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center gap-4 text-center mb-12">
      <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-foreground animate-fade-in-up">
        MyProject API12
      </h1>
      <p className="text-lg md:text-xl text-muted-foreground font-light max-w-2xl mx-auto italic animate-fade-in-up">
        Experiencia de e-commerce premium con React y Tailwind CSS v4.
      </p>
    </div>
  );
};

export default HomeHeader;
