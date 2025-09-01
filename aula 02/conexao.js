import { neon } from '@neondatabase/serverless';

const sql = neon(
  'postgresql://neondb_owner:npg_vw7cHKI3APge@ep-young-mountain-actygjvb-pooler.sa-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require'
);

export default sql;
