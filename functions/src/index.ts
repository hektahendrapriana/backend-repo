import * as functions from 'firebase-functions';
// import * as admin from 'firebase-admin';
import * as bodyParser from 'body-parser';
import * as dotenv from "dotenv";
import morgan from "morgan";
import compression from "compression";
import helmet from "helmet";
import cors from "cors";
import passport from "passport";
import userRoutes from "./routes/userRoutes";
import authRoutes from './routes/authRoutes';
// import * as serviceAccount from "./config/firebaseConfig.json";
import express, { Express } from "express";

dotenv.config();

// const ServiceAccountPARAMS = {
//     type: serviceAccount.type,
//     projectId: serviceAccount.project_id,
//     privateKeyId: serviceAccount.private_key_id,
//     privateKey: serviceAccount.private_key,
//     clientEmail: serviceAccount.client_email,
//     clientId: serviceAccount.client_id,
//     authUri: serviceAccount.auth_uri,
//     tokenUri: serviceAccount.token_uri,
//     authProviderX509CertUrl: serviceAccount.auth_provider_x509_cert_url,
//     clientC509CertUrl: serviceAccount.client_x509_cert_url,
// };


// admin.initializeApp({
//   credential: admin.credential.cert(ServiceAccountPARAMS)
// })

const app: Express = express();
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'))
}

app.use(
  bodyParser.json({
    limit: '2000mb'
  })
);

app.use(
  bodyParser.urlencoded({
    limit: '2000mb',
    extended: true
  })
);

app.use(cors());
app.use(passport.initialize());
app.use(compression());
app.use(helmet());
app.use("/v1", userRoutes);
app.use("/v1", authRoutes);

app.get('/hello-world',(req: any,res: any) =>{
    return res.status(200).json({message:'hello world'})
})

export const api = functions.https.onRequest(app)

