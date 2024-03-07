import request from 'supertest'
import { app } from "../../app"

// 测试是否能注册成功
it('returns a 201 on successful signup', async() => {
    return request(app)
        .post('/api/users/signup')
        .send({
            email: 'test@test.com',
            password: 'password'
        })
        .expect(201)
});

// 测试错误的email是否能报错（注意如果error handler有console.log, 测试就过不了）
it("returns a 400 with an invalid email", async () => {
    return request(app)
        .post("/api/users/signup")
        .send({
            email: 'skdjfkdjsf',
            password: 'password'
        })
        .expect(400)
})

// 测试错误密码
it("returns a 400 with an invalid password", async () => {
    return request(app)
        .post("/api/users/signup")
        .send({
            email: 'test@test.com',
            password: 'p'
        })
        .expect(400)
})

// 测试没有用户名和密码的注册,一个函数分别做两个测试
it("returns a 400 with missing email or password", async () => {
    await request(app)
    .post("/api/users/signup")
    .send({
        password: "password"
    })
    .expect(400)

    return request(app)
        .post("/api/users/signup")
        .send({
            email: "test@test.com"
        })
        .expect(400)
})

// 测试用户用已经存在的邮箱注册
it("disallows duplicate emails", async () => {
    await request(app)
    .post("/api/users/signup")
    .send({
        email: "test@test.com",
        password: "password"
    })
    .expect(201)

    return request(app)
        .post("/api/users/signup")
        .send({
            email: "test@test.com",
            password: "password2"
        })
        .expect(400)
})


// 这里，如果 cookeSession的secure为true，因为不是HTTP连接，无法产生cookie。
// 需要改变 cookeSession的secure 的值根据环境而变化。process.env.NODE_ENV。 
it('sets a cookie after successful signup', async () => {
    const response = await request(app)
    .post("/api/users/signup")
    .send({
        email: "test@test.com",
        password: "password"
    })
    .expect(201);

    expect(response.get("Set-Cookie")).toBeDefined();
})

