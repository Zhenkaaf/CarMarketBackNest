import { Type } from 'class-transformer';
import {
  IsArray,
  IsIn,
  IsNotEmpty,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  MinLength,
  ValidateNested,
} from 'class-validator';

class PhotoToDeleteDto {
  @IsString()
  id: string;

  @IsString()
  url: string;
}

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
    'MOSKVICH',
    'AC',
    'ACURA',
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
    'CUPRA',
    'DADI',
    'DAF',
    'DAIHATSU',
    'DATSUN',
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
    'GMC',
    'GONOW',
    'GREAT WALL',
    'GROZ',
    'HAFEI',
    'HDC',
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
    'JIANGNAN',
    'JONWAY',
    'KAROSA',
    'KARSAN',
    'KENWORTH',
    'LANCIA',
    'LAND ROVER',
    'LANDWIND',
    'LDV',
    'LEXUS',
    'LIAZ',
    'LIFAN',
    'LINCOLN',
    'MAN',
    'MASERATI',
    'MERCURY',
    'MG',
    'MINI',
    'MUDAN',
    'MUSTANG',
    'NEOPLAN',
    'NYSA',
    'OLDSMOBILE',
    'ORA',
    'PLYMOUTH',
    'POLESTAR',
    'PONTIAC',
    'PORSCHE',
    'PROTON',
    'RAVON',
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
    'SETRA',
    'SHAANXI',
    'SHAOLIN',
    'SHUANGHUAN',
    'SKYWELL',
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
    'TESLA',
    'TIANMA',
    'TRABANT',
    'VANHOOL',
    'VEV',
    'WARTBURG',
    'WULING',
    'XINKAI',
    'YOUYI',
    'YUEJIN',
    'YUTONG',
    'ZASTAVA',
    'ZHONGTONG',
    'ZUK',
    'ZXAUTO',
    'BAZ',
    'BELAZ',
    'BOGDAN',
    'VAZ',
    'GAZ',
    'ZAZ',
    'ZIL',
    'IJ',
    'KAMAZ',
    'KRAZ',
    'LAZ',
    'LIAZ',
    'MAZ',
    'MOTO',
    'PAZ',
    'RAF',
    'UAZ',
    'URAL',
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
  @MinLength(2, { message: 'Minimum 2 characters' })
  @MaxLength(16, { message: 'Maximum 15 characters' })
  model: string;

  @IsNotEmpty()
  price: number;

  @IsNotEmpty()
  @Max(999, { message: 'Mileage must be no more than 999' })
  mileage: number;

  @IsNotEmpty()
  @IsIn(['Petrol', 'Diesel', 'LPG', 'LPG/Petrol', 'E-fuel', 'Hybrid'])
  fuelType: string;

  @IsNotEmpty()
  @MinLength(2, { message: 'Minimum 2 characters' })
  @MaxLength(16, { message: 'Maximum 15 characters' })
  city: string;

  @IsOptional()
  desc: string;

  /*   @IsArray()
  @IsString({ each: true })
  @IsOptional()
  //@ArrayMaxSize(7, { message: 'The maximum number of images allowed is 7' })
  photoUrls?: string[]; */
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => Object)
  photos?: { id: string; url: string }[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PhotoToDeleteDto)
  photosToDelete?: PhotoToDeleteDto[];
}
