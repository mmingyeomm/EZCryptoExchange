import { Body, Controller, Get, HttpCode, HttpStatus, Param, Post, Req, Res, UseGuards} from "@nestjs/common";
import { GoogleAuthGuard, KakaoAuthGuard } from "./utils/Guards";
import { Request } from 'express';
import { AuthService } from "./auth.service";
import { ChargeAmountDTO } from "src/charge/charge.dto";


@Controller('api/auth')
export class authController {

    constructor(
                private readonly authService: AuthService )
    {}

    // @Get('google/login')
    // @UseGuards(GoogleAuthGuard)
    // handleLoginGoogle() {
    //     return { msg : 'Google Authentication'}
    // }
    

    // @Get('google/redirect')
    // @UseGuards(GoogleAuthGuard)
    // handleRedirectGoogle(@Req() req, @Res() res){
    //     res.redirect('http://52.78.206.45:3001/');
    // }

    @Post('kakao/redirect')
    @HttpCode(HttpStatus.OK)
    async socialLogin(@Body('code') code: string) {
        console.log("kakao redirect")
        console.log(code)
        return this.authService.socialLogin(code);
    }


   
    @Get('kakao/login')
    @UseGuards(KakaoAuthGuard)
    handleRedirectKakao(){
        return { msg: 'Kakao login'}
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