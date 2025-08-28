import React from "react";
import { utils } from "@/styles/design-system";
import { FilterSection } from "./sections/FilterSection";
import { FormSection } from "./sections/FormSection";
import { PhrasesSection } from "./sections/PhraseSection";
import { StatsSection } from "./sections/StatsSection";

export const HomePage: React.FC = () => {
  return (
    <div
      className={
        utils.responsive.containerMobile +
        " py-4 sm:py-6 md:py-8 space-y-4 sm:space-y-6 md:space-y-8"
      }
    >
      <StatsSection />
      <FormSection />
      <FilterSection />
      <PhrasesSection />
    </div>
  );
};
