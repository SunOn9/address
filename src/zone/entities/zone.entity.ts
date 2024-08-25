import { Column, Entity, Index, PrimaryColumn } from 'typeorm'

@Entity({ name: 'zone' })
export class ZoneEntity {
  static tableName = 'zone'

  @PrimaryColumn()
  id: number

  @Column()
  @Index()
  zipcode: number

  @Column({ default: 0 })
  @Index()
  zoneType: number

  @Column({
    nullable: true,
    type: 'text',
  })
  data: string

  @Column({
    nullable: true,
    type: 'text',
  })
  exceptionData: string

  @Column()
  createdDate: number

  @Column()
  updatedDate: number

  @Column({ default: false })
  @Index()
  isDeleted: boolean

  constructor(partial: Partial<ZoneEntity>) {
    Object.assign(this, partial)
  }
}
