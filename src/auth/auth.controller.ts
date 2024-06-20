import { Controller, Get, UseGuards} from "@nestjs/common";
import { GoogleAuthGuard } from "./utils/Guards";





@Controller('api/auth')
export class authController {

    

    @Get('google/login')
    @UseGuards(GoogleAuthGuard)
    handleLogin() {
        return { msg : 'Google Authentication'}
    }
    

    @Get('google/redirect')
    @UseGuards(GoogleAuthGuard)
    handleRedirect(){
        return { msg: 'Google redirect'}
    }

}