import { UserProfileService } from "../services/UserProfileService";

class UserProfileController {
  private userProfileService: UserProfileService;

  constructor(){
    this.userProfileService = new UserProfileService();
  }
}

export { UserProfileController };