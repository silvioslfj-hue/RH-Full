
/**
 * Import function triggers from their respective submodules:
 *
 * import {onCall} from "firebase-functions/v2/https";
 * import {onDocumentWritten} from "firebase-functions/v2/firestore";
 *
 * See a full list of supported triggers at
 * https://firebase.google.com/docs/functions
 */

import {setGlobalOptions} from "firebase-functions/v2";
import {onCall, HttpsError} from "firebase-functions/v2/https";
import * as logger from "firebase-functions/logger";
import * as admin from "firebase-admin";

// Dependencies for eSocial integration
import * as convert from "xml-js";

// Secret Manager Client
import {SecretManagerServiceClient} from "@google-cloud/secret-manager";

// Initialize Firebase Admin SDK
admin.initializeApp();
const secretManagerClient = new SecretManagerServiceClient();


// For cost control, you can set the maximum number of containers that can be
// running at the same time. This helps mitigate the impact of unexpected
// traffic spikes by instead downgrading performance. This limit is a
// per-function limit. You can override the limit for each function using the
// `maxInstances` option in the function's options, e.g.
// `onRequest({ maxInstances: 5 }, (req, res) => { ... })`.
// NOTE: setGlobalOptions does not apply to functions using the v1 API. V1
// functions should each use functions.runWith({ maxInstances: 10 }) instead.
// In the v1 API, each function can only serve one request per container, so
// this will be the maximum concurrent request count.
setGlobalOptions({maxInstances: 10});

/**
 * Generates an XML file for an eSocial event and saves it to Firestore.
 * This function simulates the entire transmission process but stops after
 * generating the XML and updating the status in Firestore.
 */
export const transmitirEventoESocial = onCall(async (request) => {
  // 1. Authentication and Authorization
  if (!request.auth) {
    const msg = "A função deve ser chamada por um usuário autenticado.";
    throw new HttpsError("unauthenticated", msg);
  }

  const {eventId, jsonData} = request.data;
  if (!eventId || !jsonData) {
    const msg = "O ID do evento e os dados JSON são obrigatórios.";
    throw new HttpsError("invalid-argument", msg);
  }

  const db = admin.firestore();
  const eventRef = db.collection("esocialEvents").doc(eventId);

  try {
    logger.info(`Generating XML for eSocial event: ${eventId}`);
    await eventRef.update({status: "Processando"});

    // 2. Convert JSON to XML
    const loteEventos = {
      _declaration: {_attributes: {version: "1.0", encoding: "UTF-8"}},
      eSocial: {
        ...jsonData,
      },
    };
    const xmlString = convert.js2xml(loteEventos, {compact: true, spaces: 4});
    logger.info("XML content generated", {eventId});

    // 3. Save XML to Firestore and update status
    await eventRef.update({
      status: "XML Gerado",
      xmlContent: xmlString,
      generatedAt: new Date(),
    });

    logger.info(`Event ${eventId} XML successfully generated and saved.`);

    return {success: true, message: "XML do evento gerado com sucesso!"};
  } catch (error) {
    logger.error(`Failed to generate XML for event ${eventId}`, error);
    await eventRef.update({
      status: "Erro",
      errorMessage: (error as Error).message,
    });

    if (error instanceof HttpsError) {
      throw error;
    } else {
      const msg = "Ocorreu um erro inesperado ao gerar o XML.";
      throw new HttpsError("internal", msg);
    }
  }
});


/**
 * Creates or updates a secret in Google Cloud Secret Manager for a
 * company's certificate.
 */
export const setupCompanySecrets = onCall(async (request: unknown) => {
  // 1. Authentication and Authorization
  const req = request as { auth?: { uid: string }, data: any };
  if (!req.auth) {
    const msg = "A função deve ser chamada por um usuário autenticado.";
    throw new HttpsError("unauthenticated", msg);
  }
  // TODO: Verify if the user is an admin.

  const {companyId, certificatePassword} = req.data;
  if (!companyId || !certificatePassword) {
    const msg = "ID da empresa e senha do certificado são obrigatórios.";
    throw new HttpsError("invalid-argument", msg);
  }

  const projectId = process.env.GCLOUD_PROJECT;
  if (!projectId) {
    throw new HttpsError("internal", "Google Cloud project ID not available.");
  }

  const secretName = `CERT_PASS_${companyId}`;
  const parent = `projects/${projectId}`;
  const secretPath = `${parent}/secrets/${secretName}`;

  try {
    logger.info(`Setting up secret for company: ${companyId}`);

    // Check if the secret already exists
    try {
      await secretManagerClient.getSecret({name: secretPath});
      logger.info(`Secret ${secretName} already exists. Adding new version.`);
    } catch (error: unknown) {
      if ((error as {code: number}).code === 5) { // NOT_FOUND
        logger.info(`Secret ${secretName} not found. Creating it.`);
        // Create the secret with replication policy
        await secretManagerClient.createSecret({
          parent: parent,
          secretId: secretName,
          secret: {
            replication: {
              automatic: {},
            },
          },
        });
      } else {
        throw error; // Re-throw other errors
      }
    }

    // Add the new secret version
    const [version] = await secretManagerClient.addSecretVersion({
      parent: secretPath,
      payload: {
        data: Buffer.from(certificatePassword, "utf8"),
      },
    });

    logger.info(`Added secret version ${version.name}`);
    const msg = `Senha do certificado para ${companyId} salva com sucesso.`;
    return {success: true, message: msg};
  } catch (error) {
    logger.error(`Failed to set up secret for company ${companyId}`, error);
    const msg = "Não foi possível salvar a senha do certificado.";
    throw new HttpsError("internal", msg);
  }
});
