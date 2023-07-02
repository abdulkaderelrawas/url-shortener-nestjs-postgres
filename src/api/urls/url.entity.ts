import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
} from 'typeorm';
import { User } from '../user/user.entity';

@Entity()
export class Url {
  @PrimaryGeneratedColumn('uuid')
  public id!: number;

  @ManyToOne(() => User, (user: User) => user.urls)
  public user: User;

  @Column({ type: 'varchar', length: 150 })
  public longUrl: string;

  @Column({ type: 'varchar', length: 150 })
  public shortUrl: string;

  @Column({ type: 'varchar', length: 150 })
  public urlCode: string;

  @Column({ type: 'int' })
  public count: number;

  @Column({ type: 'boolean', default: false })
  public isDeleted: boolean;

  /*
   * Create and Update Date Columns
   */

  @CreateDateColumn({ type: 'timestamp' })
  public createdAt!: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  public updatedAt!: Date;
}
