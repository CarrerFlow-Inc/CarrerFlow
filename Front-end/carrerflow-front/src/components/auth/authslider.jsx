import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, EffectFade } from "swiper/modules";
import { Briefcase, LineChart, Calendar } from "lucide-react";
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';


const Slide = ({ icon, title, text }) => (
  <div className="h-full flex flex-col items-center justify-center gap-4 text-white/90 px-8 md:px-12">
    <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-white/15">
      {icon}
    </div>
    <div className="max-w-xl text-center">
      <h3 className="text-3xl md:text-4xl font-bold leading-tight text-white">{title}</h3>
      <p className="mt-2 text-base md:text-lg">{text}</p>
    </div>
  </div>
);

export default function AuthSlider() {
  return (
    <div
      className="relative h-full w-full overflow-hidden"
      style={{
        '--swiper-theme-color': '#ffffff',
        '--swiper-pagination-bullet-inactive-color': 'rgba(255,255,255,0.35)',
        '--swiper-pagination-bullet-inactive-opacity': 1,
        '--swiper-pagination-bullet-size': '8px',
        '--swiper-pagination-bullet-horizontal-gap': '6px',
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-gray-950 via-[#111827] to-black" />
      <div className="absolute -top-24 -left-24 w-80 h-80 rounded-full bg-white/10 blur-2xl" />
      <div className="absolute -bottom-24 -right-24 w-96 h-96 rounded-full bg-white/10 blur-3xl" />

      <Swiper
        modules={[Autoplay, Pagination, EffectFade]}
        autoplay={{ delay: 4000, disableOnInteraction: false }}
        pagination={{ clickable: true }}
        loop
        className="h-full"
      >
        <SwiperSlide>
          <Slide
            icon={<Briefcase className="w-6 h-6" />}
            title="Organize suas candidaturas"
            text="Centralize vagas, empresas e contatos em um único lugar. Acompanhe cada etapa até a contratação."
          />
        </SwiperSlide>
        <SwiperSlide>
          <Slide
            icon={<LineChart className="w-6 h-6" />}
            title="Tenha insights acionáveis"
            text="Visualize métricas de conversão e performance para focar no que realmente traz resultados."
          />
        </SwiperSlide>
        <SwiperSlide>
          <Slide
            icon={<Calendar className="w-6 h-6" />}
            title="Nunca perca um prazo"
            text="Receba lembretes para entrevistas, follow-ups e prazos de candidatura no momento certo."
          />
        </SwiperSlide>
      </Swiper>
    </div>
  );
}
