import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class createEventsTable1639446342653 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        queryRunner.createTable(new Table({
            name: 'events',
            columns: [
                {
                    name: 'id',
                    type: 'varchar',
                    generationStrategy: 'uuid',
                    isPrimary: true
                },
                {
                    name: 'zone_id',
                    type: 'varchar',
                    isNullable: false
                },
                {
                    name: 'enable',
                    type: 'boolean',
                    isNullable: false,
                    default: true
                },
                {
                    name: 'type',
                    type: 'integer',
                    isNullable: false
                },
                {
                    name: 'local',
                    type: 'varchar',
                    isNullable: false,
                },
                {
                    name: 'local_photo',
                    type: 'varchar',
                    isNullable: true
                },
                {
                    name: 'piso',
                    type: 'varchar',
                    isNullable: false
                },
                {
                    name: 'box',
                    type: 'varchar',
                    isNullable: false
                },
                {
                    name: 'banheiro',
                    type: 'varchar',
                    isNullable: false
                },
                {
                    name: 'description',
                    type: 'text',
                    isNullable: true
                },
                {
                    name: 'tool',
                    type: 'text',
                    isNullable: true
                },
                {
                    name: 'suport_type',
                    type: 'text',
                    isNullable: true
                },
                {
                    name: 'created_at',
                    type: 'timestamp',
                    isNullable: false,
                },
                {
                    name: 'updated_at',
                    type: 'timestamp',
                    isNullable: true,
                }
            ]
        }))
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        queryRunner.dropTable('events')
    }

}
