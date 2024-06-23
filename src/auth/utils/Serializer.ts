import { Inject, Injectable } from "@nestjs/common";
import { PassportSerializer } from "@nestjs/passport";
import { AuthService } from "../auth.service";
import { User } from "src/user/user.entity";


@Injectable()
export class SessionSerializer extends PassportSerializer{
    constructor(
        @Inject('AUTH_SERVICE') private readonly authService:AuthService,
    ){
        super();
    }

    serializeUser(user: User, done: Function) {
        done(null, user);
        console.log("Serialize User")

    }

    deserializeUser(payload: any, done: Function) {
        const user = this.authService.findUser(payload.id)

        console.log("payload id" + payload.id)
        console.log("Deserialized User");

        return user ? done(null, user) : done(null, null);
    }


}