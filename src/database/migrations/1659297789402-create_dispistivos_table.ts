import { MigrationInterface, QueryRunner, Table, TableForeignKey } from "typeorm";
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
        isNullable: true,
    },
    {
        name: 'mac',
        type: 'varchar',
        isNullable: true,
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
        name: 'zonaId',
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
export class createDispistivosTable1659297789402 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(new Table({
            name,
            columns
        }), true)
        await queryRunner.createForeignKey(
            name,
            new TableForeignKey({
                columnNames: ["zonaId"],
                referencedColumnNames: ["id"],
                referencedTableName: "zonas",
                onDelete: "CASCADE",
            }),
        )
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable(name)
    }

}
