use crate::id::Id;
use validator::Validate;

#[derive(Validate)]
pub struct RegisteredUser {
    id: Id<RegisteredUser>,
    #[validate(email)]
    email: String
}

impl RegisteredUser {
    fn new(id: Id<RegisteredUser>, email: String)-> Self {
        let user = Self {
            id,
            email
        };
        user.validate().unwrap();
        user
    }
}
