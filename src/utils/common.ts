//Core
import { v4 as uuidv4 } from 'uuid';

// Enum containing environment variable names.
export enum ENV {
  PORT,
  DATABASE_URL,
  JWT_ACCESS,
  JWT_REFRESH,
}

// Enum containing Auth strategy names
export enum STRATEGY {
  ACCESS = 'JWT-ACCESS',
  REFRESH = 'JWT-REFRESH',
}

export function getUUID(): string {
  return uuidv4();
}
