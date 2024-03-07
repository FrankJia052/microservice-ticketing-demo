import { MongoMemoryServer } from "mongodb-memory-server"
import mongoose from "mongoose"
import request from "supertest"
import { app } from "../app";

declare global {
    var signin: () => Promise<string[]>;
}

// 存放内存数据库的变量
let mongo: any;

// 处理所有 test 之前的行为
beforeAll( async() => {
    // 添加环境变量, 只要有就行，无需真的。app逻辑里只测试是否存在。
    process.env.JWT_KEY = 'asdfasdf'

    // 配置数据库
    mongo = await MongoMemoryServer.create()
    const mongoUri = mongo.getUri()

    await mongoose.connect(mongoUri, {})
})

// 这里的逻辑，会在每次test执行之前运行
beforeEach( async () => {
    // 重置测试的数据库数据
    const collections = await mongoose.connection.db.collections()

    for(let collection of collections) {
        await collection.deleteMany({})
    }
})

// 这里的逻辑，会在每次test执行后运行
afterAll( async () => {
    // 把数据库服务停止
    if(mongo) {
        await mongo.stop()
    }
    await mongoose.connection.close()
})

global.signin = async () => {
    const email = "test@test.com";
    const password = "password";

    const response = await request(app)
        .post("/api/users/signup")
        .send({email, password})
        .expect(201)
    
    const cookie = response.get("Set-Cookie");

    return cookie
}