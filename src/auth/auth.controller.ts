import { Controller, Get, Req, Res, UseGuards} from "@nestjs/common";
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
    handleRedirectGoogle(@Req() req, @Res() res){
        res.redirect('http://52.78.206.45:3001/');
    }

    @Get('kakao/login')
    @UseGuards(KakaoAuthGuard)
    handleLoginKakao() {
        return { msg : 'Kakao Authentication'}
    }
    

    @Get('kakao/redirect')
    @UseGuards(KakaoAuthGuard)
    handleRedirectKakao(@Req() req, @Res() res){
        res.redirect('http://52.78.206.45:3001/');
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