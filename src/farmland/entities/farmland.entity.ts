import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm';
import { Producer } from '../../producers/entities/producer.entity';
import { Crop } from '../../crops/entities/crop.entity';

@Entity()
export class Farmland {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  farmName: string;

  @Column()
  city: string;

  @Column()
  state: string;

  @Column('decimal', { precision: 10, scale: 2 })
  totalAreaInHectares: number;

  @Column('decimal', { precision: 10, scale: 2 })
  arableAreaInHectares: number;

  @Column('decimal', { precision: 10, scale: 2 })
  vegetationAreaInHectares: number;

  @ManyToOne(() => Producer, (producer) => producer.farmlands, {
    onDelete: 'CASCADE',
  })
  producer: Producer;

  @OneToMany(() => Crop, (crop) => crop.farmland, { cascade: true })
  crops: Crop[];
}
