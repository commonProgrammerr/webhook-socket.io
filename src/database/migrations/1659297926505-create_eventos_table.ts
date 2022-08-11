import { MigrationInterface, QueryRunner, Table, TableForeignKey } from "typeorm";
import { TableColumnOptions } from "typeorm/schema-builder/options/TableColumnOptions";
const columns: TableColumnOptions[] = [
    {
        name: 'id',
        type: 'varchar',
        generationStrategy: 'uuid',
        isPrimary: true,
    },
    {
        name: 'enable',
        type: 'boolean',
        isNullable: true,
        default: true
    },
    {
        name: 'tipo',
        type: 'integer',
        isNullable: true
    },
    {
        name: 'local',
        type: 'varchar',
        isNullable: true,
    },
    {
        name: 'piso',
        type: 'varchar',
        isNullable: true
    },
    {
        name: 'banheiro',
        type: 'varchar',
        isNullable: true
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
        name: 'inicio',
        type: 'timestamp',
        isNullable: true,
    },
    {
        name: 'fim',
        type: 'timestamp',
        isNullable: true,
    },
    {
        name: 'relatorioId',
        type: 'varchar',
        isNullable: true
    },
    {
        name: 'zonaId',
        type: 'varchar',
        isNullable: true
    },
    {
        name: 'dispositivoId',
        type: 'varchar',
        isNullable: true
    },
    {
        name: 'reporterId',
        type: 'varchar',
        isNullable: true
    },
    {
        name: 'send_at',
        type: 'timestamp',
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
const name = 'eventos'

export class createEventosTable1659297926505 implements MigrationInterface {

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
                columnNames: ["dispositivoId"],
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
