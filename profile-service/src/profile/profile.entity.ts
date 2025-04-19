import { Node } from "neo4j-driver";

export class Profile {
    constructor(private readonly node: Node) { }

    getId(): string {
        return (<Record<string, any>>this.node.properties).id
    }

    getUserId(): number {
        return (<Record<string, any>>this.node.properties).userid
    }

    getFullName(): string {
        return (<Record<string, any>>this.node.properties).fullname
    }

    getDob(): string {
        return (<Record<string, any>>this.node.properties).dob
    }

    getGender(): string {
        return (<Record<string, any>>this.node.properties).gender
    }

    getAvatar(): string {
        return (<Record<string, any>>this.node.properties).avatar
    }

    getCoverphoto(): string {
        return (<Record<string, any>>this.node.properties).coverphoto
    }

    getPhone(): string {
        return (<Record<string, any>>this.node.properties).phone
    }

    getCurrentResidence(): string {
        return (<Record<string, any>>this.node.properties).currentResidence
    }

    getHometown(): string {
        return (<Record<string, any>>this.node.properties).hometown
    }

    getSchool(): string {
        return (<Record<string, any>>this.node.properties).school
    }

    getWorkPlace(): string {
        return (<Record<string, any>>this.node.properties).workPlace
    }

    getRelationship(): string {
        return (<Record<string, any>>this.node.properties).relationship
    }

    toJson(): Record<string, any> {
        const {
            avatar,
            fullname,
            dob,
            gender,
            userid,
            id,
            coverphoto,
            phone,
            currentResidence,
            hometown,
            school,
            workPlace,
            relationship
        } = <Record<string, any>>this.node.properties
        return {
            avatar: avatar,
            fullname: fullname,
            dob: dob,
            gender: gender,
            coverphoto: coverphoto,
            phone: phone,
            currentResidence: currentResidence,
            hometown: hometown,
            school: school,
            workPlace: workPlace,
            relationship: relationship,
            userid: userid,
            id: id
        };
    }
}