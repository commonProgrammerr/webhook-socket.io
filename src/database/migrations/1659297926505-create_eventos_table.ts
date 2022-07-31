import { MigrationInterface, QueryRunner, Table } from "typeorm";
import { TableColumnOptions } from "typeorm/schema-builder/options/TableColumnOptions";
const columns: TableColumnOptions[] = [
    {
        name: 'id',
        type: 'varchar',
        generationStrategy: 'uuid',
        isPrimary: true,
    },
    {
        name: 'zone_id',
        type: 'varchar',
        isNullable: false
    },
    {
        name: 'grupo_id',
        type: 'varchar',
        isNullable: false
    },
    {
        name: 'reporter_id',
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
        name: 'tipo',
        type: 'integer',
        isNullable: false
    },
    {
        name: 'local',
        type: 'varchar',
        isNullable: false,
    },
    {
        name: 'piso',
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
        isNullable: true,
        type: 'text'
    },
    {
        name: 'payload',
        isNullable: true,
        type: 'text'
    },
    {
        name: 'start',
        type: 'timestamp',
    },
    {
        name: 'end',
        type: 'timestamp',
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
const name = 'events'

export class createEventosTable1659297926505 implements MigrationInterface {

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
