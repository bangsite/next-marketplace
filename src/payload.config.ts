import path from 'path';
import dotenv from 'dotenv';

import { buildConfig } from 'payload/config';
import { webpackBundler } from '@payloadcms/bundler-webpack';
import { mongooseAdapter } from '@payloadcms/db-mongodb';
import { slateEditor } from '@payloadcms/richtext-slate';

import { Users } from './collections/Users';
import { Products } from './collections/Products/Products';
import { Media } from './collections/Media';
import { ProductFiles } from './collections/ProductFile';
import { Orders } from './collections/Orders';

dotenv.config({
    path: path.resolve(__dirname, '../../.env'),
})

export default buildConfig({
    serverURL: process.env.NEXT_PUBLIC_SERVER_URL || '',
    collections: [Users, Products, Media, ProductFiles, Orders],
    routes: {
        admin: '/sell',
    },
    admin: {
        user: 'users',
        bundler: webpackBundler(),
        meta: {
            titleSuffix: '- DigitalHippo',
            favicon: '/favicon.ico',
            ogImage: '/thumbnail.jpg',
        },
    },
    rateLimit: {
        max: 2000,
    },
    db: mongooseAdapter({
        url: process.env.MONGODB_URL!,
    }),
    editor:slateEditor({}),
    typescript: {
        outputFile: path.resolve(__dirname, './types/payload-types.ts'),
    },

})
