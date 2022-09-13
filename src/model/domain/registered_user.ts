import {Snowflake} from '/util/snowflake.ts';
import ValueSchema from 'value_schema';

declare const userIdNominality: unique symbol;
/**
 * ユーザーのID
 */
export type UserId = Snowflake & { [userIdNominality]: never };

/**
 * インスタンスにアカウントが存在している、人間もしくはbotがログインしてシステムを操作可能な概念.
 */
export class RegisteredUser {
  private _email: string;
  private _name: string;

  /**
   * ユーザーのインスタンスを作成するコンストラクタ.
   *
   * @param id ユーザーを一意に識別するためのID.
   * @param email ユーザーに登録されているメールアドレス.
   * @param name ユーザーの表示名.
   */
  constructor(
    public readonly id: UserId,
    email: string,
    name: string,
  ) {
    ValueSchema.email().applyTo(email);
    this._email = email;

    this.validateName(name);
    this._name = name;
  }

  /**
   * ユーザーに登録されているメールアドレスを取得する.
   */
  get email(): string {
    return this._email;
  }

  /**
   * ユーザーにメールアドレスを設定する.
   * メールアドレスはRFC 5322 & RFC 5321に準拠している必要がある.
   *
   * @param email 登録するメールアドレス.
   */
  set email(email: string) {
    ValueSchema.email().applyTo(email);
    this._email = email;
  }

  /**
   * ユーザーの表示名を取得する.
   */
  get name(): string {
    return this._name;
  }

  /**
   * ユーザーに表示名を設定する.
   *
   * @param name
   */
  set name(name: string) {
    this.validateName(name);
    this._name = name;
  }

  private validateName(name: string): void {
    ValueSchema.string({
      maxLength: {
        length: 32,
        trims: true,
      },
    }).applyTo(name);
  }
}
