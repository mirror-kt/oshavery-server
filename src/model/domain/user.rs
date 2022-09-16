use anyhow::Context as _;
use validator::Validate;

use crate::id::Id;

#[derive(Validate)]
pub struct RegisteredUser {
    id: Id<RegisteredUser>,
    #[validate(email)]
    email: String,
}

impl RegisteredUser {
    fn new(id: Id<RegisteredUser>, email: String) -> Self {
        let user = Self { id, email };
        user.validate().context("invalid format").unwrap();
        user
    }
}
