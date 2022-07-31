import { MigrationInterface, QueryRunner, Table } from "typeorm";
import { TableColumnOptions } from "typeorm/schema-builder/options/TableColumnOptions";
const name = 'predios'
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
        name: 'local',
        type: 'varchar',
        isNullable: false,
        isUnique: true
    },
    {
        name: 'map_path',
        type: 'varchar',
        isNullable: false,
    },
    {
        name: 'tipo',
        type: 'varchar',
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

export class createPrediosTable1659295044913 implements MigrationInterface {

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
