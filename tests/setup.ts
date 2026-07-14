import { loadEnvConfig } from "@next/env";

process.env.NODE_ENV = "development";
loadEnvConfig(process.cwd());
