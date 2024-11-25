import { MigrationInterface, QueryRunner } from "typeorm";

export class Migrations1732530017024 implements MigrationInterface {
    name = 'Migrations1732530017024'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "user" ("id" integer NOT NULL, "username" character varying NOT NULL, "password" character varying NOT NULL, "email" character varying NOT NULL, "emailVerified" boolean NOT NULL DEFAULT true, "phone" character varying, CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."testimonials_filetype_enum" AS ENUM('image', 'video', 'youtube', 'instagram')`);
        await queryRunner.query(`CREATE TABLE "testimonials" ("id" SERIAL NOT NULL, "authorName" character varying(100) NOT NULL, "content" text NOT NULL, "mediaUrl" text NOT NULL, "fileType" "public"."testimonials_filetype_enum" NOT NULL, "rating" integer NOT NULL DEFAULT '5', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_63b03c608bd258f115a0a4a1060" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."news_feed_filetype_enum" AS ENUM('image', 'video', 'youtube', 'instagram')`);
        await queryRunner.query(`CREATE TABLE "news_feed" ("id" SERIAL NOT NULL, "date" TIMESTAMP NOT NULL, "details" text NOT NULL, "fileType" "public"."news_feed_filetype_enum" NOT NULL, "mediaUrl" character varying NOT NULL, CONSTRAINT "PK_9325de5b82b32b083a96e63d8d8" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."portfolio_filetype_enum" AS ENUM('image', 'video', 'youtube', 'instagram')`);
        await queryRunner.query(`CREATE TABLE "portfolio" ("id" SERIAL NOT NULL, "date" TIMESTAMP NOT NULL, "details" text NOT NULL, "fileType" "public"."portfolio_filetype_enum" NOT NULL, "mediaUrl" character varying NOT NULL, CONSTRAINT "PK_6936bb92ca4b7cda0ff28794e48" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "contacts" ("id" integer NOT NULL, "name" character varying(100) NOT NULL, "email" character varying NOT NULL, "phone" character varying NOT NULL, "message" text NOT NULL, "isRead" boolean NOT NULL DEFAULT false, CONSTRAINT "PK_b99cd40cfd66a99f1571f4f72e6" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "carousel" ("id" integer NOT NULL, "url" character varying(255) NOT NULL, "phoneUrl" character varying(255) NOT NULL DEFAULT '', CONSTRAINT "PK_d59e0674c5a5efe523df247f67b" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "carousel"`);
        await queryRunner.query(`DROP TABLE "contacts"`);
        await queryRunner.query(`DROP TABLE "portfolio"`);
        await queryRunner.query(`DROP TYPE "public"."portfolio_filetype_enum"`);
        await queryRunner.query(`DROP TABLE "news_feed"`);
        await queryRunner.query(`DROP TYPE "public"."news_feed_filetype_enum"`);
        await queryRunner.query(`DROP TABLE "testimonials"`);
        await queryRunner.query(`DROP TYPE "public"."testimonials_filetype_enum"`);
        await queryRunner.query(`DROP TABLE "user"`);
    }

}
