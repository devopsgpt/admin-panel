import { z as zod } from 'zod';

export interface MySQLResponse {
  output: string;
}

export interface MySQLBody {
  name: string;
  url: string;
  user: string;
  editable: boolean;
  database: string;
  maxOpenConns: number;
  maxIdleConns: number;
  maxIdleConnsAuto: boolean;
  connMaxLifetime: number;
  password: string;
  tls: {
    tlsClientCert: string;
    tlsCACert: string;
    tlsAuth: boolean;
    tlsSkipVerify: boolean;
  } | null;
}

export const mySQLSchema = zod.object({
  name: zod.string().min(1, 'Name is required'),
  url: zod.string().min(1, 'URL is required'),
  user: zod.string().min(1, 'User is required'),
  editable: zod.boolean(),
  database: zod.string().min(1, 'Database is required'),
  maxOpenConns: zod.number().min(1, 'Max Open Conns is required'),
  maxIdleConns: zod.number().min(1, 'Max Idle Conns is required'),
  maxIdleConnsAuto: zod.boolean(),
  connMaxLifetime: zod.number().min(1, 'Max Idle Conns is required'),
  password: zod.string().min(1, 'Password is required'),
  tls: zod.object({
    tlsClientCert: zod.string(),
    tlsCACert: zod.string(),
    tlsAuth: zod.boolean(),
    tlsSkipVerify: zod.boolean(),
  }),
});

export type MySQLSchema = zod.infer<typeof mySQLSchema>;

export interface mySQLValidationError {
  detail: [
    {
      type: string;
      loc: string[];
      msg: string;
      input: null;
    },
  ];
}
