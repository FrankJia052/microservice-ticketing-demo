import mongoose from "mongoose";
import { Password } from "../services/password";

// An interface that describes the properties that are required to create a new User
interface UserAttrs {
    email: string,
    password: string
}

// An interface that describes the properties that a User Model has
interface UserModel extends mongoose.Model<UserDoc> {
    build(attrs: UserAttrs): UserDoc
}

// An interface that describes the properties that a User Documents has
interface UserDoc extends mongoose.Document {
    email: string,
    password: string,
    // createdAt: Date,
    // updatedAt: Date
}

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        require: true
    },

    password: {
        type: String,
        require: true
    }
}, {
    // 转JSON的方法，通过重写来达到输出的JSON的改变
    toJSON: {
        transform(doc, ret) {
            ret.id = ret._id;
            delete ret._id;
            delete ret.password;
            delete ret.__v;
        }
    }
})

// 加一个中间件，每次save的时候，自动hash密码
// 这里不能用箭头函数，否则 this 的指向会到整个User文件，我们需要指向 user doc
userSchema.pre('save', async function (done) {
    if(this.isModified('password')) {
        const hashed = await Password.toHash(this.get('password') as string)
        this.set('password', hashed)
    }
    done()
})

userSchema.statics.build = (attrs: UserAttrs) => {
    return new User(attrs)
}

const User = mongoose.model<UserDoc, UserModel>('User', userSchema)

export { User }