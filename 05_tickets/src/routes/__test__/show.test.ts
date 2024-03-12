import request from "supertest"
import { app } from "../../app"


it("returns a 404 if the ticket is not found", async() => {
    await request(app)
        .get("/api/ticket/test")
        .send()
        .expect(404)
});

it("returns the ticket if the ticket is found", async() => {
    const title = "test";
    const price = 6;

    const response = await request(app)
        .post("/api/tickets")
        .set("Cookie", signin())
        .send({
            title,
            price
        })
        .expect(201)
        console.log("test 1 ===> ", response.body.id)
    const ticketResponse = await request(app)
        .get(`/api/tickets/${response.body.id}`)
        .send()
        .expect(200)
    expect(ticketResponse.body.title).toEqual(title)
    expect(ticketResponse.body.price).toEqual(price)
})
