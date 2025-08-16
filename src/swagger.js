import swaggerUi from "swagger-ui-express";
import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import yaml from "js-yaml";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Read and parse the OpenAPI specification file
const openApiSpecPath = join(__dirname, "../docs/openapi.yaml");
const openApiSpecContent = readFileSync(openApiSpecPath, "utf8");
const openApiSpec = yaml.load(openApiSpecContent);

export const swaggerMiddleware = [
  swaggerUi.serve,
  swaggerUi.setup(openApiSpec, {
    explorer: true,
    customCss: ".swagger-ui .topbar { display: none }",
    customSiteTitle: "SubSentry API Documentation",
    customfavIcon: "/favicon.ico",
    swaggerOptions: {
      displayRequestDuration: true,
      filter: true,
      showExtensions: true,
      showCommonExtensions: true,
    },
  }),
];

export default openApiSpec;
