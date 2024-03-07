import request from 'supertest'
import { app } from '../../app'

// 其它signin类似的测试就不做了，需要了做，唯一注意的是，signin的密码没有长度限制。

// 测试能否登陆成功
it("returns a 200 on successful signin", async () => {
    await  request(app)
        .post("/api/users/signup")
        .send({
            email: "test@test.com",
            password: "password"
        })
        .expect(201)
    return request(app)
        .post("/api/users/signin")
        .send({
            email: "test@test.com",
            password: "password"
        })
        .expect(200)
})

// 测试不存在的user
it("fails when a email that does not exist is supplied", async() => {
    return request(app)
        .post("/api/users/signin")
        .send({
            email: "test@test.com",
            password: "password"
        })
        .expect(400)
})

// 测试错误的密码
it("fails when a incorrect password is supplied", async() => {
    await  request(app)
        .post("/api/users/signup")
        .send({
            email: "test@test.com",
            password: "password"
        })
        .expect(201)
    return request(app)
        .post("/api/users/signin")
        .send({
            email: "test@test.com",
            password: "wrongPassword"
        })
        .expect(400)
})

// 测试登陆之后，header中包含cookie
it('responds with a cookie when given valid credentials', async () => {
    await request(app)
    .post("/api/users/signup")
    .send({
        email: "test@test.com",
        password: "password"
    })
    .expect(201);

    const response = await request(app)
    .post("/api/users/signin")
    .send({
        email: "test@test.com",
        password: "password"
    })
    .expect(200);

    expect(response.get("Set-Cookie")).toBeDefined();
})