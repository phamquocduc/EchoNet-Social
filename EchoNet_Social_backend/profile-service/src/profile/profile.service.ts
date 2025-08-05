import { BadRequestException, Injectable } from "@nestjs/common";
import { ProfileCreateDto } from "./dto/profile-create.dto";
import { Neo4jService } from "nest-neo4j/dist";
import { v4 as uuidv4 } from 'uuid';
import { buildSetClause } from "src/helper/neo4j-profile.helper";
import { ProfileUpdateDto } from "./dto/profile-update.dto";
import { EProfileType } from "src/enum/profile-type.enum";
import { Profile } from "./profile.entity";

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
            profileType: $profileType,
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
                profileType: profile.profileType || EProfileType.PERSONAL_PAGE,
                userid: profile.userid,
            }
        );

        const record = result.records[0];
        const node = record.get('p');
        return node.properties;
    }

    async updateProfile(userId: number, profile: ProfileUpdateDto): Promise<Profile> {
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

    async findProfileByUserId(userId: number): Promise<Profile> {
        const result = await this.neo4jService.read(
            `
          MATCH (p:Profile {userid: $userid})
          RETURN p
          `,
            { userid: userId }
        );

        const record = result.records[0];
        if (!record) {
            throw new BadRequestException('Profile not found');
        }
        const node = record.get('p');
        return node.properties;
    }

    async sendFriendRequest(fromId: number, toId: number): Promise<void> {
        if (await this.areFriends(fromId, toId)) {
            throw new BadRequestException('Already friends');
        }

        if (await this.hasSentFriendRequest(fromId, toId)) {
            throw new BadRequestException('Friend request already sent');
        }

        await this.neo4jService.write(
            `
            MATCH (a:Profile {userid: $fromId}), (b:Profile {userid: $toId})
            MERGE (a)-[:REQUESTED_FRIEND]->(b)
            `,
            { fromId, toId }
        );
    }


    async acceptFriendRequest(fromId: number, toId: number): Promise<void> {
        if (!await this.hasFriendRequest(toId, fromId)) {
            throw new BadRequestException('No friend request to accept');
        }

        const result = await this.neo4jService.write(
            `
            MATCH (a:Profile {userid: $toId})-[r:REQUESTED_FRIEND]->(b:Profile {userid: $fromId})
            DELETE r
            MERGE (a)-[:FRIEND_WITH]->(b)
            MERGE (b)-[:FRIEND_WITH]->(a)
            `,
            { fromId, toId }
        );

        console.log('Friend request accepted:', result);
    }

    async followPage(userId: number, pageId: number): Promise<void> {
        if (await this.isFollowing(userId, pageId)) {
            throw new BadRequestException('Already following this page');
        }

        await this.neo4jService.write(
            `
            MATCH (u:Profile {userid: $userId}), (p:Profile {userid: $pageId})
            WHERE p.profileType = $profileType
            MERGE (u)-[:FOLLOW]->(p)
            `,
            {
                userId,
                pageId,
                profileType: EProfileType.PUBLIC_PAGE
            }
        );
    }

    async unfollowPage(userId: number, pageId: number): Promise<void> {
        const isFollowing = await this.isFollowing(userId, pageId);
        if (!isFollowing) {
            throw new BadRequestException('You are not following this page');
        }

        await this.neo4jService.write(
            `
            MATCH (u:Profile {userid: $userId})-[r:FOLLOW]->(p:Profile {userid: $pageId})
            DELETE r
            `,
            { userId, pageId }
        );
    }


    async rejectFriendRequest(fromId: number, toId: number): Promise<void> {
        const exists = await this.hasFriendRequest(toId, fromId);
        if (!exists) {
            throw new BadRequestException('No friend request to reject');
        }

        await this.neo4jService.write(
            `
            MATCH (a:Profile {userid: $toId})-[r:REQUESTED_FRIEND]->(b:Profile {userid: $fromId})
            DELETE r
            `,
            { fromId, toId }
        );
    }

    async cancelFriendRequest(fromId: number, toId: number): Promise<void> {
        const exists = await this.hasSentFriendRequest(fromId, toId);
        if (!exists) {
            throw new BadRequestException('No friend request to cancel');
        }

        await this.neo4jService.write(
            `
            MATCH (a:Profile {userid: $fromId})-[r:REQUESTED_FRIEND]->(b:Profile {userid: $toId})
            DELETE r
            `,
            { fromId, toId }
        );
    }

    async unfriend(userId1: number, userId2: number): Promise<void> {
        const isFriend = await this.areFriends(userId1, userId2);
        if (!isFriend) {
            throw new BadRequestException('Not friends');
        }

        await this.neo4jService.write(
            `
            MATCH (a:Profile {userid: $userId1})-[r1:FRIEND_WITH]->(b:Profile {userid: $userId2})
            DELETE r1
            WITH a, b
            MATCH (b)-[r2:FRIEND_WITH]->(a)
            DELETE r2
            `,
            { userId1, userId2 }
        );
    }


    async hasSentFriendRequest(fromId: number, toId: number): Promise<boolean> {
        const result = await this.neo4jService.read(
            `
            MATCH (a:Profile {userid: $fromId})-[:REQUESTED_FRIEND]->(b:Profile {userid: $toId})
            RETURN count(*) > 0 as sent
            `,
            { fromId, toId }
        );
        return result.records[0].get('sent');
    }

    async hasFriendRequest(fromId: number, toId: number): Promise<boolean> {
        const result = await this.neo4jService.read(
            `
            MATCH (a:Profile {userid: $fromId})-[:REQUESTED_FRIEND]->(b:Profile {userid: $toId})
            RETURN count(*) > 0 as exists
            `,
            { fromId, toId }
        );
        return result.records[0].get('exists');
    }

    async areFriends(userId1: number, userId2: number): Promise<boolean> {
        const result = await this.neo4jService.read(
            `
            MATCH (a:Profile {userid: $userId1})-[:FRIEND_WITH]->(b:Profile {userid: $userId2})
            RETURN count(*) > 0 as friends
            `,
            { userId1, userId2 }
        );
        return result.records[0].get('friends');
    }

    async isFollowing(userId: number, pageId: number): Promise<boolean> {
        const result = await this.neo4jService.read(
            `
            MATCH (a:Profile {userid: $userId})-[:FOLLOW]->(b:Profile {userid: $pageId})
            RETURN count(*) > 0 as following
            `,
            { userId, pageId }
        );
        return result.records[0].get('following');
    }
}

