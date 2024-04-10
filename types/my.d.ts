declare interface Stat {
    id: number;
    number: number;
    description: string;
}

declare interface Grid {
	name: string;
	title: string;
}

declare interface WeixinPhoneNumberEvent {
  detail: {
    encryptedData: string;
    iv: string;
  };
}