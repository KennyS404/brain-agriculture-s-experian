import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateCropDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  cropName: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  harvestSeason: string;

  @ApiProperty({ description: 'ID da fazenda (Farmland) à qual esta cultura pertence' })
  @IsNotEmpty()
  @IsString()
  farmlandId: string;
}
