class UserDto {
    id;
    phone;
    isActivated;
    createdAt;

    constructor(user) {
        this.id = user._id;
        this.phone = user.phone;
        this.isActivated = user.activated;
        this.createdAt = user.createdAt;
    }
}

module.exports = UserDto;