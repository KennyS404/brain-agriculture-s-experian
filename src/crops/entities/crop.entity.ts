

import { Farmland } from '../../farmland/entities/farmland.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';


@Entity()
export class Crop {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  cropName: string;

  @Column()
  harvestSeason: string; 

  @ManyToOne(() => Farmland, (farmland) => farmland.crops, {
    onDelete: 'CASCADE',
  })
  farmland: Farmland;
}
