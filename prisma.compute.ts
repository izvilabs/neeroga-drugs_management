import { defineComputeConfig } from "@prisma/compute-sdk/config";

export default defineComputeConfig({
  app: {
    name: "neeroga-drugs_management",
    framework: "nextjs",
    env: ".env",
  },
});
