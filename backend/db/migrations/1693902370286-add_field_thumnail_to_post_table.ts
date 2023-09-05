import { MigrationInterface, QueryRunner } from "typeorm";

export class AddFieldThumnailToPostTable1693902370286 implements MigrationInterface {
    name = 'AddFieldThumnailToPostTable1693902370286'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`post\` ADD \`thumnail\` varchar(255) NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`post\` DROP COLUMN \`thumnail\``);
    }

}
