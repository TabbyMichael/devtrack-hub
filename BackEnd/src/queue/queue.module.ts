import { Module, Global } from '@nestjs/common';

@Global()
@Module({
    providers: [
        {
            provide: 'BullQueue_email',
            useValue: {
                add: async () => ({ id: 'mock-job-id' }),
                process: () => { },
            },
        },
    ],
    exports: ['BullQueue_email'],
})
export class QueueModule { }
