import {ServiceCardType} from "../../../types/service-card.type";
import {ServiceTypesUrlEnum} from "../../../enums/service-types-url.enum";

export const servicesTypes: ServiceCardType[] = [
  {
    image: '../../../../assets/images/main/service_1.png',
    imageAlt: 'Website development',
    title: 'Создание сайтов',
    description: 'В краткие сроки мы создадим качественный и самое главное продающий сайт для продвижения Вашего бизнеса!',
    price : 7500,
    serviceType: ServiceTypesUrlEnum.development
  },
  {
    image: '../../../../assets/images/main/service_2.png',
    imageAlt: 'Promotion',
    title: 'Продвижение',
    description: 'Вам нужен качественный SMM-специалист или грамотный таргетолог? Мы готовы оказать Вам услугу “Продвижения” на наивысшем уровне!',
    price : 3500,
    serviceType: ServiceTypesUrlEnum.smm
  },
  {
    image: '../../../../assets/images/main/service_3.png',
    imageAlt: 'Advertisement',
    title: 'Реклама',
    description: 'Без рекламы не может обойтись ни один бизнес или специалист. Обращаясь к нам, мы гарантируем быстрый прирост клиентов за счёт правильно настроенной рекламы.',
    price : 1000,
    serviceType: ServiceTypesUrlEnum.advertisement
  },
  {
    image: '../../../../assets/images/main/service_4.png',
    imageAlt: 'Copyrighting',
    title: 'Копирайтинг',
    description: 'Наши копирайтеры готовы написать Вам любые продающие текста, которые не только обеспечат рост охватов, но и помогут выйти на новый уровень в продажах.',
    price : 750,
    serviceType: ServiceTypesUrlEnum.copyright
  },
];
