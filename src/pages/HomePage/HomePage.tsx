import React from "react";
import { FilterSection } from "./sections/FilterSection";
import { FormSection } from "./sections/FormSection";
import { PhrasesSection } from "./sections/PhraseSection";
import { StatsSection } from "./sections/StatsSection";

export const HomePage: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <StatsSection />
      <FormSection />
      <FilterSection />
      <PhrasesSection />
    </div>
  );
};
