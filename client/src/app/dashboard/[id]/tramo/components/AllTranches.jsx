// SWIPER
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';

import { getUncertaintyLabel } from '@/lib/mappers/uncertainty';

export default function AllTranches({ navigationArrows = true, initialSlide = 0, elements}){

    return(
        <Swiper
                  modules={[Navigation]}
                  initialSlide={initialSlide}
                  navigation={true}
                  spaceBetween={16}
                  slidesPerView={3}
                  breakpoints={{
                    320: {
                      slidesPerView: 1.05,
                    },
                    640: {
                      slidesPerView: 2,
                    },
                    1024: {
                      slidesPerView: 3,
                    },
                    1400: {
                      slidesPerView: 4.05,
                    },
                  }}
                  className="overflow-visible!"
                >
                  {elements.map((e, i) => (
                    <SwiperSlide key={e.id} className="h-auto!">
                      <div  key={e.id} className={`text-lg text-center text-(--text-primary) ${e.isCurrent && !elements[i + 1].isUnlocked ? "glass-effect" : e.isUnlocked ? "glass-effect-green" : "glass-effect-red"} border-glass rounded-2xl p-4 h-full flex flex-col justify-between`}>
                        <div className="glass-effect-dark border-glass rounded-2xl p-2 flex flex-col items-center justify-between">
                            <div>{e.code} - {e.name}</div>
                            <div className='text-(--text-tertiary)'>{e.isCurrent && !elements[i + 1].isUnlocked ? "En proceso" : e.isUnlocked ? "Completado" : "Pendiente"}</div>
                        </div>
                        <div className='font-bold'>Incertidumbre</div>
                        <div className='text-(--text-secondary) p-4 glass-effect-dark border-glass rounded-2xl'>{getUncertaintyLabel(e.uncertaintyType)}</div>
                        <div className='font-bold'>Riesgos</div>
                        <div className="flex flex-col gap-2">
                        {e.associatedRisks.map((r, i) => (
                          <div key={i} className="text-(--text-secondary) text-center p-4 glass-effect-dark border-glass rounded-2xl">
                            {r}
                          </div>
                        ))}
                        </div>
                      </div>
                    </SwiperSlide>
                  ))}
                </Swiper>
    )
}