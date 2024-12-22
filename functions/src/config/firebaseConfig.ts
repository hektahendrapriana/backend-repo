// import * as admin from 'firebase-admin';
import { initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { getAuth } from "firebase-admin/auth";
import * as serviceAccount from "./firebaseConfig.json";
import * as webAccount from "./firebaseConfigWeb.json";

const ServiceAccountPARAMS = {
    type: serviceAccount.type,
    projectId: serviceAccount.project_id,
    privateKeyId: serviceAccount.private_key_id,
    privateKey: serviceAccount.private_key,
    clientEmail: serviceAccount.client_email,
    clientId: serviceAccount.client_id,
    authUri: serviceAccount.auth_uri,
    tokenUri: serviceAccount.token_uri,
    authProviderX509CertUrl: serviceAccount.auth_provider_x509_cert_url,
    clientC509CertUrl: serviceAccount.client_x509_cert_url,
};

const firebaseConfig = {
    apiKey: webAccount.apiKey,
    authDomain: webAccount.authDomain,
    projectId: webAccount.projectId,
    appId: webAccount.appId,
};

export const firebaseConfigWeb = firebaseConfig;
export const adminFirebase = initializeApp(ServiceAccountPARAMS);
export const db = getFirestore(adminFirebase);
export const authDb = getAuth(adminFirebase);