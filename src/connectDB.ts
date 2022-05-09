import { MongoClient, Collection, MongoDBNamespace } from 'mongodb';
import crypto from "crypto";
import * as fs from "fs";
import * as dotenv from 'dotenv';
import { sendEmail } from './sendEmail';
import { loginQuery, registerQuery } from './types'
import e from 'express';
dotenv.config();

const createHash = (plain: string) => {
    return crypto.createHash("sha256").update(plain).digest("base64");
};
const base64Encode = (plain: string) => {
    return Buffer.from(plain, "utf8").toString('base64').replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_')
}
const base64Decode = (encoded: string) => {
    return Buffer.from(encoded.replace(/-/g, '+').replace(/_/g, '/'), "base64").toString('utf8')
}

const client = new MongoClient(process.env.DBURL);

// const dbMap = new Map<string, Collection<any>>();
// (async () => {

// })();

const login = async (obj: loginQuery) => {
    await client.connect();
    const db = client.db('dimitube');
    let userCollection = db.collection('user')

    let hashedPassword = createHash(process.env.HASHSALT + obj.password)
    const arr = await userCollection.find({ id: obj.id, password: hashedPassword }).toArray();
    if (arr.length == 0) {
        console.log('검색결과 없음')
        return false
    } else {
        await client.close();
        return arr[0]
    }
}

const checkSameAccount = async (userCollection: Collection, obj: registerQuery) => {
    const arr = await userCollection.find({ $or: [{ id: obj.id }, { email: obj.email }] }).toArray();
    console.log(arr)
    if (arr.length == 0) {
        return true
    } else {
        return false
    }
}

const register = async (obj: registerQuery) => {
    await client.connect();
    const db = client.db('dimitube');
    let userCollection = db.collection('user')

    let check = await checkSameAccount(userCollection, obj)
    await client.close();
    if (check) {
        let hashedPassword = createHash(process.env.HASHSALT + obj.password)
        let hashedEmail = createHash(process.env.EMAILSALT + obj.email)
        let info = JSON.stringify({ id: obj.id, password: hashedPassword, email: obj.email })
        fs.appendFile('./src/unverified/list.txt', `${hashedEmail}::${info}\n`, (err) => {
            if (err) throw err;
            console.log('Data Appended!');
            sendEmail(obj.email, hashedEmail)
        })

        return true
    } else {
        return false
    }

}

const createUser = async (obj: registerQuery) => {
    await client.connect();
    const db = client.db('dimitube');
    const userCollection = db.collection('user')
    const channelCollection = db.collection('channel')
    const sessionHash = createHash(obj.id + obj.password)

    //여기서 받는 obj에는 이미 password가 암호화 되어있음.
    await userCollection.insertOne({ id: obj.id, password: obj.password, email: obj.email, sessionHash: sessionHash });
    await channelCollection.insertOne({ sessionHash: sessionHash, channelName: obj.id, channelId: base64Encode(obj.id), videoList: [] });
    console.log('유저 생성 완료')
    await client.close();
}

const verify = async (sessionHash: string) => {
    await client.connect();
    const db = client.db('dimitube');
    const userCollection = db.collection('user')

    const arr = await userCollection.find({ sessionHash: sessionHash }).toArray();
    await client.close();
    if (arr.length == 0) {
        return false
    } else {
        return arr[0]
    }
}

const getChannel = async (channel: string) => {
    await client.connect();
    const db = client.db('dimitube');
    const channelCollection = db.collection('channel')

    const arr = await channelCollection.find({ channelId: channel }).toArray();
    await client.close();
    if (arr.length == 0) {
        return false
    } else {
        return arr[0]
    }
}

export { login, register, createUser, verify, getChannel };