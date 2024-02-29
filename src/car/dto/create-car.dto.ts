import {
  IsArray,
  IsIn,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateCarDto {
  @IsNotEmpty()
  @IsIn(['Sedan', 'Wagon', 'Hatchback', 'Suv', 'Van'])
  bodyType: string;

  @IsNotEmpty()
  @IsIn([
    'VOLKSWAGEN',
    'AUDI',
    'SKODA',
    'BMW',
    'DACIA',
    'DAEWOO',
    'FIAT',
    'FORD',
    'GEELY',
    'HONDA',
    'HYUNDAI',
    'JEEP',
    'KIA',
    'MAZDA',
    'MERCEDES',
    'MITSUBISHI',
    'NISSAN',
    'OPEL',
    'PEUGEOT',
    'RENAULT',
    'SUBARU',
    'TOYOTA',
    'VOLVO',
    'МОСКВИЧ',
    'AC',
    'ACURA',
    'Aion',
    'AIXAM',
    'ALFA ROMEO',
    'ARO',
    'ASIA',
    'ASTON MARTIN',
    'AUSTIN',
    'AVIA',
    'BAIC',
    'BARKAS',
    'BAW',
    'BENTLEY',
    'BRILLIANCE',
    'BUICK',
    'BYD',
    'CADILLAC',
    'CAMC',
    'CHANA',
    'CHANGAN',
    'CHANGHE',
    'CHEVROLET',
    'CHRYSLER',
    'CITROEN',
    'Cupra',
    'DADI',
    'DAF',
    'DAIHATSU',
    'Datsun',
    'DODGE',
    'DONGFENG',
    'DS',
    'DVL BOVA',
    'EAGLE',
    'EOS',
    'FAW',
    'FERRARI',
    'FOTON',
    'FREIGHTLINER',
    'FSO',
    'FUQI',
    'Ginaf',
    'GMC',
    'GONOW',
    'GREAT WALL',
    'GROZ',
    'HAFEI',
    'Haval',
    'HDC',
    'Hozon',
    'HUABEI',
    'HUANGHAI',
    'HUMMER',
    'I-VAN',
    'IFA',
    'IKARUS',
    'INFINITI',
    'INNOCENTI',
    'INTERNATIONAL',
    'ISUZU',
    'IVECO',
    'JAC',
    'JAGUAR',
    'Jetour',
    'JIANGNAN',
    'JONWAY',
    'KAROSA',
    'KARSAN',
    'KENWORTH',
    'LANCIA',
    'LAND ROVER',
    'LANDWIND',
    'LDV',
    'Lesheng',
    'LEXUS',
    'LIAZ',
    'LIFAN',
    'LINCOLN',
    'MAN',
    'MASERATI',
    'Maxus',
    'MERCURY',
    'MG',
    'MINI',
    'Modern',
    'MUDAN',
    'Mustang',
    'NEOPLAN',
    'NYSA',
    'OLDSMOBILE',
    'ORA',
    'PLYMOUTH',
    'Polestar',
    'PONTIAC',
    'PORSCHE',
    'PROTON',
    'Ravon',
    'Raysince',
    'ROBUR',
    'ROVER',
    'SAAB',
    'SAIPA',
    'SAMAND',
    'SAMSUNG',
    'SATURN',
    'SCANIA',
    'SCION',
    'SEAT',
    'Seres',
    'SETRA',
    'SHAANXI',
    'SHAOLIN',
    'SHUANGHUAN',
    'Skywell',
    'SMA',
    'SMART',
    'SOUEAST',
    'SSANGYONG',
    'SUZUKI',
    'TAGAZ',
    'TALBOT',
    'TARPAN',
    'TATA',
    'TATRA',
    'TEMSA',
    'Tesla',
    'TIANMA',
    'TRABANT',
    'VANHOOL',
    'VEV',
    'WARTBURG',
    'Weltmeister',
    'WULING',
    'XINKAI',
    'YOUYI',
    'YUEJIN',
    'YUTONG',
    'ZASTAVA',
    'Zeekr',
    'ZHONGTONG',
    'Zotye',
    'ZUK',
    'ZXAUTO',
    'АВІАТЕХНІКА',
    'БАЗ',
    'БЕЛАЗ',
    'БОГДАН',
    'ВАЗ',
    'ВОДНИЙ ТР.',
    'ГАЗ',
    'ЕрАЗ',
    'ЗАЗ',
    'ЗІЛ',
    'ІЖ',
    'КАВЗ',
    'КАЗ',
    'КАМАЗ',
    'КРАЗ',
    'ЛАЗ',
    'ЛіАЗ',
    'МАЗ',
    'МОТО',
    'НефАЗ',
    'ПАЗ',
    'ПРИЧІП',
    'РАФ',
    'РЕТРО',
    'СПЕЦТЕХНІКА',
    'УАЗ',
    'УРАЛ',
    'ХАЗ',
  ])
  carMake: string;

  @IsNotEmpty()
  @IsIn([
    '2024',
    '2023',
    '2022',
    '2021',
    '2020',
    '2019',
    '2018',
    '2017',
    '2016',
    '2015',
    '2014',
    '2013',
    '2012',
    '2011',
    '2010',
    '2009',
    '2008',
    '2007',
    '2006',
    '2005',
    '2004',
    '2003',
    '2002',
    '2001',
    '2000',
    '1999',
    '1998',
    '1997',
    '1996',
    '1995',
    '1994',
    '1993',
    '1992',
    '1991',
    '1990',
    '1989',
    '1988',
    '1987',
    '1986',
    '1985',
  ])
  year: string;

  @IsNotEmpty()
  price: number;

  @IsNotEmpty()
  mileage: number;

  @IsNotEmpty()
  @IsIn(['Petrol', 'Diesel', 'LPG', 'LPG/Petrol', 'E-fuel', 'Hybrid'])
  fuelType: string;

  @IsNotEmpty()
  city: string;

  @IsNotEmpty()
  desc: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  imageUrls?: string[];
}