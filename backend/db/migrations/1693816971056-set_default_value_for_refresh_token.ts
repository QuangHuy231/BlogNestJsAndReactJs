import { MigrationInterface, QueryRunner } from "typeorm";

export class SetDefaultValueForRefreshToken1693816971056 implements MigrationInterface {
    name = 'SetDefaultValueForRefreshToken1693816971056'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user\` CHANGE \`refreshToken\` \`refreshToken\` varchar(255) NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user\` CHANGE \`refreshToken\` \`refreshToken\` varchar(255) NOT NULL`);
    }

}
