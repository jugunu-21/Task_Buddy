// import { PrismaClient } from '@prisma/client';

// const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

// const prisma = globalForPrisma.prisma || new PrismaClient({
//   log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
//   datasources: {
//     db: {
//       url: process.env.DATABASE_URL
//     },
//   },
// });

// if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

// export default prisma;

import { PrismaClient } from '@prisma/client'

const prismaClientSingleton = () => {
    return new PrismaClient()
}

declare const globalThis: {
    prismaGlobal: ReturnType<typeof prismaClientSingleton>;
} & typeof global;

const prismadb = globalThis.prismaGlobal ?? prismaClientSingleton()

export default prismadb

if (process.env.NODE_ENV !== 'production') globalThis.prismaGlobal = prismadb