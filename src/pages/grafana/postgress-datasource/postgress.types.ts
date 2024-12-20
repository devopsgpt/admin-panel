import { z as zod } from 'zod';

export interface PostgresResponse {
  output: string;
}

export interface PostgresBody {
  name: string;
  url: string;
  user: string;
  editable: boolean;
  database: string;
  sslmode: string;
  password: string;
  maxOpenConns: number;
  maxIdleConnsAuto: boolean;
  connMaxLifetime: number;
  postgresVersion: number;
  timescaledb: boolean;
}

export const postgresSchema = zod.object({
  name: zod.string().min(1, 'Name is required'),
  url: zod.string().min(1, 'URL is required'),
  user: zod.string().min(1, 'User is required'),
  editable: zod.boolean(),
  database: zod.string().min(1, 'Database is required'),
  sslmode: zod.string().min(1, 'SSL Mode is required'),
  password: zod.string().min(1, 'Password is required'),
  maxOpenConns: zod.number().min(1, 'Max Open Conns is required'),
  maxIdleConnsAuto: zod.boolean(),
  connMaxLifetime: zod.number().min(1, 'Conn Max Lifetime is required'),
  postgresVersion: zod.number().min(1, 'Postgres Version is required'),
  timescaledb: zod.boolean(),
});

export type PostgresSchema = zod.infer<typeof postgresSchema>;

export interface postgresValidationError {
  detail: [
    {
      type: string;
      loc: string[];
      msg: string;
      input: null;
    },
  ];
}
