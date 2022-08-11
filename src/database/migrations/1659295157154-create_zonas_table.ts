import { MigrationInterface, QueryRunner, Table, TableForeignKey } from "typeorm";
import { TableColumnOptions } from "typeorm/schema-builder/options/TableColumnOptions";
const name = 'zonas'
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
        isNullable: true,
    },
    {
        name: 'local',
        type: 'varchar',
        isNullable: true,
    },
    {
        name: 'piso',
        type: 'varchar',
        isNullable: true,
    },
    {
        name: 'map_path',
        type: 'varchar',
        isNullable: true,
    },
    {
        name: 'tipo',
        type: 'varchar',
        isNullable: true,
    },
    {
        name: 'predioId',
        type: 'varchar',
        isNullable: true,
    },
    {
        name: 'grupoId',
        type: 'varchar',
        isNullable: true,
    },
    {
        name: 'created_at',
        type: 'timestamp',
        isNullable: true,
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

export class createZonasTable1659295157154 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(new Table({
            name,
            columns
        }), true)
        await queryRunner.createForeignKey(
            name,
            new TableForeignKey({
                columnNames: ["predioId"],
                referencedColumnNames: ["id"],
                referencedTableName: "predios",
                onDelete: "CASCADE",
            }),
        )
        await queryRunner.createForeignKey(
            name,
            new TableForeignKey({
                columnNames: ["grupoId"],
                referencedColumnNames: ["id"],
                referencedTableName: "grupos",
                onDelete: "CASCADE",
            }),
        )

    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable(name)
    }

}
