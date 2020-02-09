import { Entity, OneToMany, ManyToOne, PrimaryColumn } from 'typeorm';
import { User } from '../users/user.entity';

@Entity()
export class JwtBlacklistEntry {
  @ManyToOne(type => User, user => user.jwtBlacklistEntries, {
    onDelete: 'CASCADE',
    primary: true,
  })
  public user: User;

  @PrimaryColumn()
  public token: string;
}
