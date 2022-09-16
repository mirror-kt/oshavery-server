use std::fmt::{Debug, Display, Formatter};
use std::marker::PhantomData;
use std::str::FromStr;

use anyhow::Context as _;
use chrono::{DateTime, TimeZone, Utc};
use thiserror::Error;
use uuid::{Timestamp, Uuid};

#[derive(Eq, PartialEq, Ord, PartialOrd)]
pub struct Id<T> {
    value: Uuid,
    _phantom: PhantomData<fn() -> T>,
}

impl<T> Id<T> {
    fn timestamp(&self) -> DateTime<Utc> {
        let timestamp = self
            .value
            .get_timestamp()
            .context("this uuid version does not support timestamps")
            .unwrap() // safety: UUID v7はtimestampを取得することができる
            .to_unix_nanos();
        Utc.timestamp_nanos(timestamp as i64)
    }

    fn generate() -> Self {
        let uuid = Uuid::new_v7(Timestamp::now());

        Self {
            value: uuid,
            _phantom: PhantomData,
        }
    }
}

impl<T> Debug for Id<T> {
    fn fmt(&self, f: &mut Formatter<'_>) -> std::fmt::Result {
        Debug::fmt(&self.value, f)
    }
}

impl<T> Display for Id<T> {
    fn fmt(&self, f: &mut Formatter<'_>) -> std::fmt::Result {
        Display::fmt(&self.value, f)
    }
}

#[derive(Debug, Error)]
pub enum Error {
    #[error("invalid id format")]
    InvalidFormat,
}

impl<T> FromStr for Id<T> {
    type Err = Error;

    fn from_str(str: &str) -> Result<Self, Self::Err> {
        let uuid = Uuid::parse_str(str).map_err(|_| Error::InvalidFormat)?;
        Ok(Self {
            value: uuid,
            _phantom: PhantomData,
        })
    }
}
