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
    pub fn new(id: Id<RegisteredUser>, email: String) -> Self {
        let user = Self { id, email };
        user.validate().context("invalid format").unwrap();
        user
    }

    pub fn id(&self) -> &Id<RegisteredUser> {
        &self.id
    }

    pub fn email(&self) -> &str {
        &self.email
    }
}
