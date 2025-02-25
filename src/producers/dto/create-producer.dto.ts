import { IsNotEmpty, IsString, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateProducerDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @Matches(/^(\d{11}|\d{14})$/, {
    message: 'O campo cpfOrCnpj deve conter 11 dígitos (CPF) ou 14 dígitos (CNPJ).',
  }) // pequena validação usando a propriedade mattches do classvalidator
  cpfOrCnpj: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  producerName: string;
}
