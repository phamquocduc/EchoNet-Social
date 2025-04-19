import { Injectable } from "@nestjs/common";
import { ProfileCreateDto } from "./dto/profile-create.dto";
import { Neo4jService } from "nest-neo4j/dist";
import { v4 as uuidv4 } from 'uuid';
import { buildSetClause } from "src/helper/neo4j-profile.helper";
import { ProfileUpdateDto } from "./dto/profile-update.dto";

@Injectable()
export class ProfileService {
    constructor(
        private readonly neo4jService: Neo4jService,
    ) { }

    async createProfile(profile: ProfileCreateDto) {
        const id = uuidv4();

        const result = await this.neo4jService.write(
            `
          CREATE (p:Profile {
            id: $id,
            fullname: $fullname,
            dob: $dob,
            gender: $gender,
            avatar: $avatar,
            coverphoto: $coverphoto,
            phone: $phone,
            currentResidence: $currentResidence,
            hometown: $hometown,
            school: $school,
            workPlace: $workPlace,
            relationship: $relationship,
            userid: $userid
          })
          RETURN p
          `,
            {
                id,
                fullname: profile.fullname,
                dob: profile.dob || null,
                gender: profile.gender || null,
                avatar: profile.avatar || 'https://res.cloudinary.com/dhyay1hbw/image/upload/v1731165608/bf8v8xinlqn9fhvge0oy.jpg',
                coverphoto: profile.coverphoto || 'https://res-console.cloudinary.com/dhyay1hbw/thumbnails/v1/image/upload/v1744528263/MV8wMDAwMDAwMC0wMDAwLTAwMDAtMDAwMC0wMDAwMDAwMDAwMDBfUGFnZUNvdmVyX2Jjanl0ZA==/drilldown',
                phone: profile.phone || null,
                currentResidence: profile.currentResidence || null,
                hometown: profile.hometown || null,
                school: profile.school || null,
                workPlace: profile.workPlace || null,
                relationship: profile.relationship || null,
                userid: profile.userid,
            }
        );

        const record = result.records[0];
        const node = record.get('p');
        return node.properties;
    }

    async updateProfile(userId: number, profile: ProfileUpdateDto) {
        const { clause, params } = buildSetClause('p', profile);

        if (!clause) {
            return await this.findProfileByUserId(userId);
        }

        const query = `
            MATCH (p:Profile {userid: $userId})
            ${clause}
            RETURN p
        `;

        const result = await this.neo4jService.write(query, {
            userId,
            ...params,
        });

        const record = result.records[0];
        const node = record.get('p');
        return node.properties;
    }

    async findProfileByUserId(userId: number) {
        const result = await this.neo4jService.read(
            `
          MATCH (p:Profile {userid: $userid})
          RETURN p
          `,
            { userid: userId }
        );

        const record = result.records[0];
        if (!record) {
            return null;
        }
        const node = record.get('p');
        return node.properties;
    }
}

