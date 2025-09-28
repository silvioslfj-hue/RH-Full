
/**
 * Import function triggers from their respective submodules:
 *
 * import {onCall} from "firebase-functions/v2/https";
 * import {onDocumentWritten} from "firebase-functions/v2/firestore";
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

import {setGlobalOptions} from "firebase-functions/v2";
import {onCall, HttpsError} from "firebase-functions/v2/https";
import * as logger from "firebase-functions/logger";
import * as admin from "firebase-admin";

// Dependencies for eSocial integration
import * as convert from "xml-js";
import * as forge from "node-forge";
import axios from "axios";

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
 * Fetches a secret from Google Cloud Secret Manager.
 * @param {string} secretName The name of the secret to fetch.
 * @return {Promise<string>} The secret's value.
 */
async function getSecret(secretName: string): Promise<string> {
    const projectId = process.env.GCLOUD_PROJECT;
    if (!projectId) {
        throw new Error("Google Cloud project ID not available.");
    }

    const name = `projects/${projectId}/secrets/${secretName}/versions/latest`;

    try {
        const [version] = await secretManagerClient.accessSecretVersion({
            name: name,
        });

        const payload = version.payload?.data?.toString();
        if (!payload) {
            throw new Error(`Secret ${secretName} has no payload.`);
        }
        return payload;
    } catch (error) {
        logger.error(`Failed to access secret ${secretName}`, error);
        throw new HttpsError("internal", `Could not access secret for ${secretName}.`);
    }
}


/**
 * Handles the transmission of an eSocial event.
 * This function is triggered by a call from the client-side application.
 */
export const transmitirEventoESocial = onCall(async (request) => {
    // 1. Authentication and Authorization
    if (!request.auth) {
      throw new HttpsError("unauthenticated", "A função deve ser chamada por um usuário autenticado.");
    }
    // TODO: Add role-based access control (check if the user is an admin)
    // For example: const user = await admin.auth().getUser(request.auth.uid);
    // if (user.customClaims?.role !== 'admin') { ... }

    const eventId = request.data.eventId;
    if (!eventId) {
        throw new HttpsError("invalid-argument", "O ID do evento é obrigatório.");
    }

    const db = admin.firestore();
    const eventRef = db.collection("esocialEvents").doc(eventId);

    try {
        logger.info(`Processing eSocial event: ${eventId}`, {structuredData: true});
        await eventRef.update({status: "Processando"});

        // 2. Fetch Event and Related Data
        const eventDoc = await eventRef.get();
        if (!eventDoc.exists) {
            throw new HttpsError("not-found", `Evento com ID ${eventId} não foi encontrado.`);
        }
        const eventData = eventDoc.data();
        if (!eventData) {
            throw new HttpsError("not-found", "Dados do evento não encontrados.");
        }
        
        // In a real scenario, you'd re-run the AI generation here for security,
        // or trust the data generated and stored by the client-side flow.
        // For this example, we assume the AI already generated the necessary data.
        const jsonData = eventData.details; // Assuming JSON is in 'details'

        // 4. Convert JSON to XML
        logger.info("Converting JSON to XML", { eventId });
        const xmlString = convert.json2xml(jsonData, { compact: true, spaces: 4 });
        logger.info("XML content generated:", { eventId, xml: xmlString });


        // 5. Fetch Certificate and Sign the XML
        const companyId = eventData.companyId; // Assuming companyId is stored in the event
        const certSecretName = `CERT_PASS_${companyId}`;
        logger.info(`Fetching certificate for company ${companyId} and secret ${certSecretName}`, { eventId });
        
        // TODO: Implement logic to download certificate from Firebase Storage.
        // const certName = `certs/${companyId}.pfx`;
        // const certBuffer = await admin.storage().bucket().file(certName).download();
        
        // Fetch the certificate password from Secret Manager
        const certPassword = await getSecret(certSecretName);
        
        // TODO: Implement logic to sign the XML
        // const signedXml = signXml(xmlString, certBuffer, certPassword);
        logger.info("TODO: Sign XML using fetched certificate and password", { eventId, certPassword: "[REDACTED]" });
        const signedXml = `<xml>Simulated SIGNED XML content with password ${certPassword.substring(0,2)}...</xml>`; // Placeholder

        // 6. Transmit to eSocial API
        // TODO: Implement the API call to the eSocial webservice.
        // const esocialEndpoint = "https://webservices.producao.esocial.gov.br/...";
        // const response = await axios.post(esocialEndpoint, signedXml, { headers: { 'Content-Type': 'application/xml' } });
        logger.info("TODO: Transmit to eSocial API", { eventId });
        const receiptId = `mock_receipt_${Date.now()}`; // Placeholder

        // 7. Update Firestore with the result
        await eventRef.update({status: "Enviado", receiptId: receiptId, sentAt: new Date()});
        logger.info(`Event ${eventId} successfully sent.`, { receiptId });

        return {success: true, message: "Evento enviado com sucesso!", receiptId: receiptId};

    } catch (error) {
        logger.error(`Failed to process event ${eventId}`, error);
        await eventRef.update({status: "Erro", errorMessage: (error as Error).message});
        
        if (error instanceof HttpsError) {
            throw error;
        } else {
            throw new HttpsError("internal", `Ocorreu um erro inesperado ao processar o evento ${eventId}.`);
        }
    }
});


/**
 * Creates or updates a secret in Google Cloud Secret Manager for a company's certificate.
 */
export const setupCompanySecrets = onCall(async (request) => {
    // 1. Authentication and Authorization
    if (!request.auth) {
        throw new HttpsError("unauthenticated", "A função deve ser chamada por um usuário autenticado.");
    }
    // TODO: Verify if the user is an admin.

    const { companyId, certificatePassword } = request.data;
    if (!companyId || !certificatePassword) {
        throw new HttpsError("invalid-argument", "O ID da empresa e a senha do certificado são obrigatórios.");
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
            await secretManagerClient.getSecret({ name: secretPath });
            logger.info(`Secret ${secretName} already exists. Adding new version.`);
        } catch (error: any) {
            if (error.code === 5) { // NOT_FOUND
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
                data: Buffer.from(certificatePassword, 'utf8'),
            },
        });

        logger.info(`Added secret version ${version.name}`);
        return { success: true, message: `Senha do certificado para ${companyId} salva com sucesso.` };

    } catch (error) {
        logger.error(`Failed to set up secret for company ${companyId}`, error);
        throw new HttpsError("internal", "Não foi possível salvar a senha do certificado.");
    }
});

    