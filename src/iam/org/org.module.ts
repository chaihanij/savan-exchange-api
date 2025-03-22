import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Org, OrgSchema } from './schemas/org.schema';
import { OrgService } from './org.service';
import { OrgController } from './org.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Org.name,
        schema: OrgSchema,
      },
    ]),
  ],
  providers: [OrgService],
  controllers: [OrgController],
})
export class OrgModule {}
