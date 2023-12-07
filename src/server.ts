import express from 'express';
import path from 'path';
import bodyParser from "body-parser";
import { parse } from 'url';
import {IncomingMessage} from "http";

import {getPayloadClient} from "@/middleware/get-payload";
import {nextApp, nextHandler} from "@/middleware/next-utils";
import * as trpcExpress from '@trpc/server/adapters/express'
import nextBuild from 'next/dist/build';
import {inferAsyncReturnType} from "@trpc/server";


const app = express();
const PORT = Number(process.env.PORT) || 3309;

const createContext = ({req, res,}: trpcExpress.CreateExpressContextOptions) => ({req, res,})

export type ExpressContext = inferAsyncReturnType<
    typeof createContext
>

export type WebhookRequest = IncomingMessage & {
    rawBody: Buffer
}

const start = async () => {
    const webhookMiddleware = bodyParser.json({
        verify: (req: WebhookRequest, _, buffer) => {
            req.rawBody = buffer
        },
    })

    const payload = await getPayloadClient({
        initOptions: {
            express: app,
            onInit: async (cms) => {
                cms.logger.info(`Admin url ${cms.getAdminURL()}`)
            }
        }
    });

    app.use((req, res) => nextHandler(req, res))

    nextApp.prepare().then(() => {
        payload.logger.info('Next.js started');

        app.listen(PORT, async () => {
            payload.logger.info(`Next.js App URL: ${process.env.NEXT_PUBLIC_SERVER_URL}`);
        })
    })


}

start();
