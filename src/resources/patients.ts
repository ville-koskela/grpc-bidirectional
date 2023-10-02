import { Patient } from '../generated/oh/my/v1/patient';

const givenNames = [
  'Maija',
  'Matti',
  'Liisa',
  'Esko',
  'Ville',
  'Janina',
  'Elisa',
  'Mauri',
  'Pekka',
  'Salla',
  'Eveliina',
  'Kari',
  'Teuvo',
  'Teppo',
  'Siiri',
  'Suvi',
  'Veera',
  'Mirka',
  'Antti',
  'Iiro',
  'Petteri',
  'Marika',
];

const familyNames = [
  'Virtanen',
  'Koskela',
  'Korhonen',
  'Aarnio',
  'Suvinen',
  'Andersson',
  'Mäkinen',
  'Mäkelä',
  'Koskivuori',
  'Hämäläinen',
  'Laine',
  'Heikkinen',
  'Nieminen',
];

function getName(names: Array<string>): string {
  return names[Math.floor(Math.random() * names.length)] as string;
}

export function getPatients(num: number): Array<Patient> {
  const patients: Array<Patient> = [];
  for (let i = 0; i < num; i++) {
    if (Math.floor(Math.random() * 10) === 1) {
      continue;
    }
    const given = getName(givenNames);
    const family = getName(familyNames);
    patients.push({
      id: {
        patientId: String(i),
      },
      name: {
        given,
        family,
        text: `${given} ${family}`,
      },
    });
  }

  return patients;
}
