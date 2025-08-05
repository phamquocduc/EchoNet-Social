import { Injectable, OnModuleInit } from "@nestjs/common";
import { Neo4jService } from "nest-neo4j/dist";

@Injectable()
export class ProfileServiceOnInit implements OnModuleInit {
    constructor(private readonly neo4jService: Neo4jService) { }

    async onModuleInit() {
        const session = this.neo4jService.getWriteSession(); // hoặc getSession()
        try {
            await session.run(`
        CREATE CONSTRAINT unique_userid IF NOT EXISTS
        FOR (p:Profile)
        REQUIRE p.userid IS UNIQUE
      `);
        } finally {
            await session.close();
        }
    }
}
