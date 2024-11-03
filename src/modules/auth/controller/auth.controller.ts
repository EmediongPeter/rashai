import { Body, Controller, Post } from "@nestjs/common";
import { Public } from "../decorators/public.decorator";
import { AuthService } from "../service/auth.service";
import { GoogleSigninDto, SignInDto, SignUpDto } from "../dto";
import { IAuthUser } from "../interfaces/auth.interface";

@Public()
@Controller('')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  async signup(@Body() dto: SignUpDto): Promise<IAuthUser> {
    return this.authService.signup(dto);
  }

  
  @Post('signin')
  signin(@Body() dto: SignInDto) {
    return this.authService.signin(dto);
  }

  @Post('google')
  async googleAuth(@Body() dto: GoogleSigninDto) {
    return this.authService.googleSignin(dto);
  }

//   @Post('refresh')
//   refresh(@Body() dto: RefreshTokenDto) {
//     return this.authService.refreshToken(dto);
//   }

}