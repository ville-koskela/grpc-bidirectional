import { Server, ServerCredentials, ServerDuplexStream } from '@grpc/grpc-js';
import {
  GetPatientRequest,
  GetPatientResponse,
  PatientServiceService,
} from './generated/oh/my/v1/patient';

import { getPatients } from './resources/patients';

const patients = getPatients(100);

async function wait(): Promise<void> {
  const ms = Math.floor(Math.random() * 5000);
  return new Promise((resolv) => {
    setTimeout(resolv, ms);
  });
}

const clients = new Map<
  string,
  ServerDuplexStream<GetPatientRequest, GetPatientResponse>
>();

function servePatients(
  call: ServerDuplexStream<GetPatientRequest, GetPatientResponse>
) {
  const clientId = call.metadata.get('clientId');
  if (typeof clientId[0] === 'string') {
    console.log(`new client connected, clientId: ${clientId[0]}`);
    clients.set(clientId[0], call);
  }

  call.on('data', async (request: GetPatientRequest) => {
    console.log(
      `received request with patientId: ${request?.patientId?.patientId}`
    );
    await wait();
    const patient = patients.find((patient) => {
      if (
        patient &&
        patient.id &&
        patient.id.patientId &&
        request &&
        request.patientId
      ) {
        return patient.id.patientId === request.patientId.patientId;
      }
      return false;
    });

    if (patient) {
      if (request.audience && request.audience.audienceId === '*') {
        clients.forEach((clientCall, clientId) => {
          clientCall.write({ patient });
        });
      } else {
        call.write({ patient });
      }
    } else {
      console.error('Patient not found!');
    }
  });

  call.on('end', () => {
    console.log(`${clientId[0]} closed connection`);
    clients.delete(clientId[0] as string);
  });
}

const server = new Server();
server.addService(PatientServiceService, {
  getPatient: servePatients,
});

server.bindAsync('0.0.0.0:5005', ServerCredentials.createInsecure(), () => {
  server.start();

  console.log('server started at port 5005');
});
