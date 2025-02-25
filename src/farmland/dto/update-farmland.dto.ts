import { PartialType } from '@nestjs/swagger';
import { CreateFarmlandDto } from './create-farmland.dto';

export class UpdateFarmlandDto extends PartialType(CreateFarmlandDto) {}
