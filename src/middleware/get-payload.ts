import dotenv from 'dotenv';
import path from 'path';
import nodemailer from 'nodemailer';

import type { InitOptions } from 'payload/config';
import payload, { Payload } from 'payload';

dotenv.config({
    path: path.resolve(__dirname, '../../.env'),
})

const transporter = nodemailer.createTransport({
    host: 'smtp.resend.com',
    secure: true,
    port: 465,
    auth: {
        user: 'resend',
        pass: process.env.RESEND_API_KEY,
    },
})

let cached = (global as any).payload

if (!cached) {
    cached = (global as any).payload = {
        client: null,
        promise: null,
    }
}

interface Args {
    initOptions?: Partial<InitOptions>
}

export const getPayloadClient = async ({initOptions,}: Args = {}): Promise<Payload> => {
    console.log(process.env.PAYLOAD_SECRET)
    if (!process.env.PAYLOAD_SECRET) {
        throw new Error('PAYLOAD_SECRET is missing')
    }

    if (cached.client) {
        return cached.client
    }

    if (!cached.promise) {
        cached.promise = payload.init({
            email: {
                transport: transporter,
                fromAddress: 'bang@digital.com',
                fromName: 'DigitalHippo',
            },
            secret: process.env.PAYLOAD_SECRET,
            local: !initOptions?.express,
            ...(initOptions || {}),
        })
    }

    try {
        cached.client = await cached.promise
    } catch (e: unknown) {
        cached.promise = null
        throw e
    }

    return cached.client
}
