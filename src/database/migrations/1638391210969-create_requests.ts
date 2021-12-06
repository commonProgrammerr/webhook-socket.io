import {MigrationInterface, QueryRunner, Table} from "typeorm";

export class createRequests1638391210969 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        queryRunner.createTable(new Table({
            name: 'requests',
            columns: [
                {
                    name: 'id',
                    type: 'varchar',
                    generationStrategy: 'uuid',
                    isPrimary: true
                },
                {
                    name: 'type',
                    type: 'integer',
                    isNullable: false
                },
                {
                    name: 'local',
                    type: 'varchar',
                    isNullable: false
                },
                {
                    name: 'piso',
                    type: 'varchar',
                    isNullable: false
                },
                {
                    name: 'box',
                    type: 'integer',
                    isNullable: false
                },
                {
                    name: 'genero',
                    type: 'varchar',
                    isNullable: false
                },
                {
                    name: 'description',
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
        queryRunner.dropTable('requests')
    }

}
