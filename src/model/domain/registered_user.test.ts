import { Snowflake } from '/util/snowflake.ts';
import { RegisteredUser, UserId } from './registered_user.ts';
import { assertStrictEquals, assertThrows } from 'asserts';

Deno.test('constructor', async (t) => {
  await t.step('with valid id, email, name then, success to construct', () => {
    const userId = Snowflake.generate() as UserId;
    const email = 'sometestuser@example.com';
    const name = 'sometestuser';

    const registeredUser = new RegisteredUser(userId, email, name);

    assertStrictEquals(registeredUser.id, userId);
    assertStrictEquals(registeredUser.email, email);
    assertStrictEquals(registeredUser.name, name);
  });

  await t.step(
    'with valid id, email, invalid name then, should failure to construct',
    () => {
      const userId = Snowflake.generate() as UserId;
      const email = 'sometestuser@example.com';
      const name = 'a'.repeat(33);

      assertThrows(() => {
        new RegisteredUser(userId, email, name);
      });
    },
  );

  await t.step(
    'with valid id, name, invalid email then, should failure to construct',
    () => {
      const userId = Snowflake.generate() as UserId;
      const email = 'someinvalidemail';
      const name = 'sometestuser';

      assertThrows(() => {
        new RegisteredUser(userId, email, name);
      });
    },
  );
});

Deno.test('property email', async (t) => {
  await t.step(
    'when a valid email is set, its value should be returned by getter',
    () => {
      const userId = Snowflake.generate() as UserId;
      const email = 'sometestuser@example.com';
      const name = 'sometestuser';

      const registeredUser = new RegisteredUser(userId, email, name);

      const anotherEmail = 'anothertestuser@example.com';
      registeredUser.email = anotherEmail;

      assertStrictEquals(registeredUser.email, anotherEmail);
    },
  );

  await t.step(
    'when a invalid email is set, an error should be occurred',
    () => {
      const userId = Snowflake.generate() as UserId;
      const email = 'sometestuser@example.com';
      const name = 'sometestuser';

      const registeredUser = new RegisteredUser(userId, email, name);

      const anotherEmail = 'invalidemail';
      assertThrows(() => {
        registeredUser.email = anotherEmail;
      });
    },
  );
});

Deno.test('property name', async (t) => {
  await t.step(
    'when a valid property is set, its value is returned by getter',
    () => {
      const userId = Snowflake.generate() as UserId;
      const email = 'sometestuser@example.com';
      const name = 'sometestuser';

      const registeredUser = new RegisteredUser(userId, email, name);

      const anotherName = 'anothertestuser';
      registeredUser.name = anotherName;

      assertStrictEquals(registeredUser.name, anotherName);
    },
  );

  await t.step(
    'when a invalid name is set, an error should be occurred',
    () => {
      const userId = Snowflake.generate() as UserId;
      const email = 'sometestuser@example.com';
      const name = 'sometestuser';

      const registeredUser = new RegisteredUser(userId, email, name);

      const anotherName = 'a'.repeat(33);
      assertThrows(() => {
        registeredUser.name = anotherName;
      });
    },
  );
});
