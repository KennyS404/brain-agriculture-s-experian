import { Farmland } from '../../farmland/entities/farmland.entity';

import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';


@Entity()
export class Producer {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  cpfOrCnpj: string;

  @Column()
  producerName: string;

  @OneToMany(() => Farmland, (farmland) => farmland.producer, { cascade: true })
  farmlands: Farmland[];
}
