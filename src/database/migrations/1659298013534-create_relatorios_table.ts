import { MigrationInterface, QueryRunner, Table, TableForeignKey } from "typeorm";
import { TableColumnOptions } from "typeorm/schema-builder/options/TableColumnOptions";
const name = 'relatorios'
const columns: TableColumnOptions[] = [
    {
        name: 'id',
        type: 'varchar',
        generationStrategy: 'uuid',
        isPrimary: true,
    },
    {
        name: 'ferramenta',
        type: 'varchar',
        isNullable: true,
    },
    {
        name: 'atividades',
        type: 'varchar',
        isNullable: true,
    },
    {
        name: 'description',
        type: 'text',
        isNullable: true,
    },
    {
        name: 'payload',
        type: 'text',
        isNullable: true,
    },
    {
        name: 'zonaId',
        type: 'varchar',
        isNullable: false,
    },
    {
        name: 'reporterId',
        type: 'varchar',
        isNullable: false,
    },
    {
        name: 'eventoId',
        type: 'varchar',
        isNullable: false,
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
export class createRelatoriosTable1659298013534 implements MigrationInterface {

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
        await queryRunner.createForeignKey(
            name,
            new TableForeignKey({
                columnNames: ["eventoId"],
                referencedColumnNames: ["id"],
                referencedTableName: "dispositivos",
                onDelete: "CASCADE",
            }),
        )
        await queryRunner.createForeignKey(
            name,
            new TableForeignKey({
                columnNames: ["reporterId"],
                referencedColumnNames: ["id"],
                referencedTableName: "usuarios",
                onDelete: "CASCADE",
            }),
        )
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable(name)
    }
}
