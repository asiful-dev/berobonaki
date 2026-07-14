import { envSchema } from "@/lib/validation/env.schema";

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error(
    "Invalid environment variables: please check your .env file and ensure all required variables are set correctly.",
  );
  console.error(parsed.error.flatten().fieldErrors);
  throw new Error(
    "Invalid environment variables detected. Please check the console for details.",
  );
}

export const env = parsed.data;
