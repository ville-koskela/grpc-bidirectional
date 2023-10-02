import path from 'path';

export * from '../generated/patient';

export const PROTO_ROOT = path.resolve(__dirname, '../../proto');
export const PROTO_PATH = path.resolve(
  __dirname,
  '../../proto/oh/my/v1/patient.proto'
);
