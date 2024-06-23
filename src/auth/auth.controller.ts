import { Controller, Get, Req, UseGuards} from "@nestjs/common";
import { GoogleAuthGuard, KakaoAuthGuard } from "./utils/Guards";
import { Request } from 'express';


@Controller('api/auth')
export class authController {

    

    @Get('google/login')
    @UseGuards(GoogleAuthGuard)
    handleLoginGoogle() {
        return { msg : 'Google Authentication'}
    }
    

    @Get('google/redirect')
    @UseGuards(GoogleAuthGuard)
    handleRedirectGoogle(){
        return { msg: 'Google redirect'}
    }

    @Get('kakao/login')
    @UseGuards(KakaoAuthGuard)
    handleLoginKakao() {
        return { msg : 'Kakao Authentication'}
    }
    

    @Get('kakao/redirect')
    @UseGuards(KakaoAuthGuard)
    handleRedirectKakao(){
        return { msg: 'Kakao redirect'}
    }



    @Get('status')
    user(@Req() request: Request){
        if(request.user){
            return {msg: 'Authenticated'}
        } else {
            return {msg: 'Not Authenticated'}
        }
        
    }

}