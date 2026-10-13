import { betterAuth } from "better-auth";
import { Pool } from "pg";

const pool = new Pool({
  connectionString:
    process.env.POSTGRES_URL ||
    process.env.DATABASE_URL ||
    "postgresql://postgres:postgres@localhost:5432/scuba_auth",
});

export const auth = betterAuth({
  database: pool,
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    },
    github: {
      clientId: process.env.GITHUB_CLIENT_ID || "",
      clientSecret: process.env.GITHUB_CLIENT_SECRET || "",
    },
  },
  secret: process.env.BETTER_AUTH_SECRET || "default_dev_secret_change_in_production_min_32_chars",
  baseURL: process.env.BETTER_AUTH_URL || "http://localhost:3000",
});
