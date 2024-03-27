import { MongoMemoryServer } from "mongodb-memory-server"
import mongoose from "mongoose"
import jwt from "jsonwebtoken"

declare global {
    var signin: () => string[];
}

// mock nats-wrapper in each test
jest.mock("../nats-wrapper")

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
    // 每次要清除所有mocks记录
    jest.clearAllMocks();
    
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

global.signin = () => {
    // 把id变成随机数，方便测试不同用户
    // Build a JWT payload. {id, email}
    const payload = {
        id: new mongoose.Types.ObjectId().toHexString(),
        email: "test@test.com"
    }

    // create the JWT!
    const token = jwt.sign(payload, process.env.JWT_KEY!);

    // Build session Object. { jwt: MY_JWT }
    const session = {jwt: token};

    // Turn that session into JSON.
    const sessionJSON = JSON.stringify(session);

    // Take JSON and encode it as base64
    const base64 = Buffer.from(sessionJSON).toString("base64")

    // return a string thats the cookie with the encoded data
    // supertest 把cookie放在array中
    const cookie = [`session=${base64}`]

    return cookie
}