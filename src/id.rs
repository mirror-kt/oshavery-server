use std::marker::PhantomData;
use chrono::{TimeZone, Utc};
use uuid::{Timestamp, Uuid};

#[derive(Eq, PartialEq, Debug, Ord, PartialOrd)]
pub struct Id<T> {
    value: Uuid,
    _phantom: PhantomData<fn() -> T>
}

impl<T> Id<T> {
    fn timestamp(&self) -> chrono::DateTime<Utc> {
        let timestamp = self.value.get_timestamp().unwrap().to_unix_nanos();
        Utc.timestamp_nanos(timestamp as i64)
    }

    fn new() -> Self {
        let uuid = Uuid::new_v7(Timestamp::now());

        Self {
            value: uuid,
            _phantom: PhantomData
        }
    }
}
