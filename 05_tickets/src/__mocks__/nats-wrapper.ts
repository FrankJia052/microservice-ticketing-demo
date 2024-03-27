export const natsWrapper = {
    client:{
        // 创造 mock function
        // 后面的 mockImplementation 就是准备 mock 的函数
        publish: jest.fn().mockImplementation((subject:string, data:string, callback: ()=> void) => {
            callback()
        })
    }
}