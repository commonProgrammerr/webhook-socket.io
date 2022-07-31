import { MigrationInterface, QueryRunner, Table } from "typeorm";
import { TableColumnOptions } from "typeorm/schema-builder/options/TableColumnOptions";
const name = 'dispositivos'
const columns: TableColumnOptions[] = [
    {
        name: 'id',
        type: 'varchar',
        generationStrategy: 'uuid',
        isPrimary: true,
    },
    {
        name: 'nome',
        type: 'varchar',
        isNullable: false,
    },
    {
        name: 'mac',
        type: 'varchar',
        isNullable: false,
        isUnique: true
    },
    {
        name: 'box',
        type: 'varchar',
        isNullable: true,
    },
    {
        name: 'piso',
        type: 'varchar',
        isNullable: true,
    },
    {
        name: 'local',
        type: 'varchar',
        isNullable: true,
    },
    {
        name: 'zone_id',
        type: 'varchar',
        isNullable: false,
        isUnique: true
    },
    {
        name: 'created_at',
        type: 'timestamp',
    },
    {
        name: 'updated_at',
        type: 'timestamp',
        isNullable: true,
    },
    {
        name: 'deleted_at',
        type: 'timestamp',
        isNullable: true,
    }
]
export class createDispistivosTable1659297789402 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(new Table({
            name,
            columns
        }), true)

    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable(name)
    }

}
