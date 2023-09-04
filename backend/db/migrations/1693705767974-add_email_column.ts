import { MigrationInterface, QueryRunner } from "typeorm";

export class AddEmailColumn1693705767974 implements MigrationInterface {
    name = 'AddEmailColumn1693705767974'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user\` ADD \`email\` varchar(255) NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user\` DROP COLUMN \`email\``);
    }

}
