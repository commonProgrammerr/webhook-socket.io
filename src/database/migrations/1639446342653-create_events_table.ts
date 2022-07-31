import { MigrationInterface, QueryRunner, Table, getConnection } from "typeorm";
import { TableColumnOptions } from "typeorm/schema-builder/options/TableColumnOptions";
import { type } from '../../../ormconfig'

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
        isNullable: true,
        type: 'varchar'
    },
    {
        name: 'piso',
        type: 'varchar',
        isNullable: false
    },
    {
        name: 'box',
        type: 'varchar',
        isNullable: true
    },
    {
        name: 'banheiro',
        type: 'varchar',
        isNullable: false
    },
    {
        name: 'mac',
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
        name: 'requisitor',
        type: 'timestamp',
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

export class createEventsTable1639446342653 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(new Table({
            name,
            columns
        }))

        if (type === 'postgres') {
            for (const colunm of columns.filter(col => col.isNullable)) {
                await queryRunner.query(`ALTER TABLE "${name}" ALTER COLUMN "${colunm.name}" DROP NOT NULL`)
            }
        }

    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        queryRunner.dropTable(name)
    }

}
