import { Metadata, credentials } from '@grpc/grpc-js';
import prompts from 'prompts';

import {
  GetPatientRequest,
  PatientServiceClient,
} from './generated/oh/my/v1/patient';

async function wait(): Promise<void> {
  const ms = Math.floor(Math.random() * 5000);
  return new Promise((resolv) => {
    setTimeout(resolv, ms);
  });
}

const client = new PatientServiceClient(
  'localhost:5005',
  credentials.createInsecure()
);

const clientId = `client${Math.floor(Math.random() * 1000000)}`;
const metadata = new Metadata();
metadata.add('clientId', clientId);
const call = client.getPatient(metadata);

call.on('data', (patient) => {
  console.log('got patient: ', patient);
});

call.on('end', () => {
  console.log('server closed the connection');
});

call.on('error', (error) => {
  console.error('error:', error);
});

async function requestPatient(id: string, audience: string): Promise<void> {
  // await wait();
  const request: GetPatientRequest = {
    patientId: {
      patientId: String(id),
    },
    audience: {
      audienceId: audience,
    },
  };

  console.log('Requesting patient with id: ', id);
  call.write(request);
}

const questions: Array<prompts.PromptObject> = [
  { type: 'text', name: 'id', message: 'Input patient id: ' },
  {
    type: 'select',
    name: 'audience',
    message: 'Choose response audience: ',
    choices: [
      { title: 'self', value: clientId },
      { title: 'everyone', value: '*' },
    ],
    initial: 0,
  },
];

if (process.argv[2] === 'cli') {
  (async () => {
    let keepGoing = true;
    while (keepGoing) {
      const response = await prompts(questions);
      if (response['id'] === 'random') {
        for (let i = 0; i < 100; i++) {
          const id = Math.floor(Math.random() * 100 + 1);
          requestPatient(String(id), response['audience']);
        }
      }
      if (response['id'] === 'quit') {
        console.log('exiting...');
        process.exit();
      }
      requestPatient(response['id'], response['audience']);
    }
  })();
} else if (process.argv[2] === 'silent') {
  console.log('client started and listening');
} else {
  for (let i = 0; i < 100; i++) {
    // const id = Math.floor(Math.random() * 100 + 1);
    requestPatient(String(i), '*');
  }
}
/*
for (let i = 0; i < 100; i++) {
  requestPatient();
}
*/
