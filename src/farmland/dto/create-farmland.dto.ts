import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsNumber, Min } from 'class-validator';

export class CreateFarmlandDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  farmName: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  city: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  state: string;

  @ApiProperty()
  @IsNumber()
  @Min(0)
  totalAreaInHectares: number;

  @ApiProperty()
  @IsNumber()
  @Min(0)
  arableAreaInHectares: number;

  @ApiProperty()
  @IsNumber()
  @Min(0)
  vegetationAreaInHectares: number;

  @ApiProperty({ description: 'ID do produtor ao qual esta fazenda pertence' })
  @IsNotEmpty()
  @IsString()
  producerId: string;
}
