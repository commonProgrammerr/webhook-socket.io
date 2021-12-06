import {MigrationInterface, QueryRunner, Table} from "typeorm";

export class createAlets1636990841270 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        queryRunner.createTable(new Table({
            name: 'alerts',
            columns: [
                {
                    name: 'id',
                    type: 'varchar',
                    generationStrategy: 'uuid',
                    isPrimary: true
                },
                {
                    name: 'alert_status',
                    type: 'integer',
                },
                {
                    name: 'device_mac',
                    type: 'varchar'
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
        queryRunner.dropTable('alerts')
    }

}
